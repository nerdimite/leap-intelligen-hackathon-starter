from jinja2 import Template
from openai import OpenAI
from type_models import SearchResponse

system_prompt = """You are a question answering assistant specialized in answering questions from the wiki of a fintech company called Greenbase.
You are provided with a set of documents that contain information relevant to the question at hand.
Your goal is to answer the question using the information provided in the documents only.
If you cannot answer the question, please say so without providing any information.
You should also provide citations to the documents that you used to answer the question. Make sure the citations are from the metadata of the provided documents only.s
"""

input_prompt = Template(
    """
Supporting Documents:
{% for document in documents %}
{{ document['text'] }}
========================================
{% endfor %}

Question: {{ question }}
""",
    trim_blocks=True,
)


class AISearch:
    """
    A RAG based Question Answering System for Greenbase

    Methods:
        __init__(vector_db: VectorDB): Initializes the RAG QA System with the openai client and the loaded vector database.
        ask(question: str) -> str: Asks a question and returns the answer using RAG.
    """

    def __init__(self, vector_db):
        self.client = OpenAI()
        self.vector_db = vector_db

    def ask(self, question: str) -> str:
        """
        Asks a question and returns the answer using RAG.

        Args:
            question (str): The question to be asked.

        Returns:
            str: The answer to the question.
        """

        retrieved_documents = self.vector_db.search(question).limit(5).to_list()

        completion = self.client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": input_prompt.render(
                        question=question, documents=retrieved_documents
                    ),
                },
            ],
            max_tokens=2000,
            temperature=0.2,
            response_format=SearchResponse,
        )
        return completion.choices[0].message.parsed
