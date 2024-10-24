"""
This file contains the agent that the user can chat with.
"""

import os
import datetime
import json
from openai import OpenAI
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
)  # for exponential backoff
from tool_schema import tool_definitions
from tool_impl import tool_call_registry

# TODO: Update the system prompt
system_prompt = """As a customer support assistant for Greenbase, provide accurate and informative responses to customer 
inquiries about the company's products and services using the available resources.
"""


class GreenbaseAgent:
    """
    A chat agent for Greenbase that uses OpenAI's GPT model and a vector database.

    Methods:
        __init__(vector_db: VectorDB): Initializes the agent with the OpenAI client and the vector database.
        chat(question: str) -> str: Chats with the user and returns the response.
    """

    def __init__(self, model="gpt-4o-mini", chat_dir: str = "chats"):
        """
        Initializes the GreenbaseAgent.

        Args:
            model (str): The OpenAI model to use.
            chat_dir (str): The directory to save the chats to.
        """
        self.client = OpenAI()
        self.model = model
        self.messages = [
            {"role": "system", "content": system_prompt},
        ]
        self.chat_dir = chat_dir
        os.makedirs(self.chat_dir, exist_ok=True)

    def reset_messages(self):
        """
        Reset the messages to the initial system prompt.
        """
        self.messages = [{"role": "system", "content": system_prompt}]

    @retry(
        wait=wait_random_exponential(min=1, max=60),
        stop=stop_after_attempt(6),
    )
    def chat_completion(self, message=None, **kwargs):
        """
        Helper method to call the chat completion API with the OpenAI client while handling the chat history.
        """
        if message:
            self.messages.append(message)

        response = self.client.chat.completions.create(
            model=self.model, messages=self.messages, **kwargs
        )
        
        message = response.choices[0].message
        self.messages.append(message)
        return message

    def handle_function_calling(self, tool_calls):
        """
        Handle the function calling response from the LLM.

        Args:
            tool_calls (list): The tool calls from the LLM.

        Returns:
            str: The response from the LLM after the tool call.
        """
        for tool_call in tool_calls:
            tool_name = tool_call.function.name
            tool_args = json.loads(tool_call.function.arguments)
            print(f"Calling Tool: {tool_name} with args: {tool_args}")
            tool_result = json.dumps(tool_call_registry[tool_name](**tool_args))
            # print(f"Tool Response: {tool_result}")
            self.messages.append(
                {
                    "role": "tool",
                    "content": tool_result,
                    "tool_call_id": tool_call.id,
                }
            )

        response = self.chat_completion(
            max_tokens=1024,
            temperature=0.1,
        )
        return response.content

    def chat(self, question: str) -> str:
        """
        Chat with the user and return the response.

        Args:
            question (str): The user's question.

        Returns:
            str: The response from the agent.
        """
        response = self.chat_completion(
            message={"role": "user", "content": question},
            tools=tool_definitions,
            tool_choice="auto",
            max_tokens=1024,
            temperature=0.1,
        )

        if response.tool_calls:
            output_message = self.handle_function_calling(response.tool_calls)
        else:
            output_message = response.content

        return output_message

    def get_serialized_messages(self):
        """
        Serialize the messages to a JSON-serializable list of dictionaries.
        """

        def serialize_item(item):
            if hasattr(item, "model_dump"):
                return item.model_dump(mode="json")
            return item

        serialized_messages = [serialize_item(msg) for msg in self.messages]
        return serialized_messages

    def generate_chat_id(self):
        """
        Generate a unique chat ID based on the current timestamp.
        """
        current_time = datetime.datetime.now()
        return current_time.strftime("%Y-%m-%d_%H-%M-%S")

    def save_chat(self, chat_id: str):
        """
        Save the chat to a file.
        """
        serialized_messages = self.get_serialized_messages()
        with open(
            os.path.join(self.chat_dir, f"{chat_id}.json"), "w", encoding="utf-8"
        ) as f:
            json.dump(serialized_messages, f, indent=2)

    def load_chat(self, chat_id: str):
        """
        Load the chat from a file if it exists, otherwise reset the messages and start a new chat.
        """
        if os.path.exists(os.path.join(self.chat_dir, f"{chat_id}.json")):
            with open(
                os.path.join(self.chat_dir, f"{chat_id}.json"), "r", encoding="utf-8"
            ) as f:
                self.messages = json.load(f)
        else:
            self.reset_messages()
