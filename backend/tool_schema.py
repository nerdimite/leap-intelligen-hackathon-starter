"""
This file contains the tools that the agent can use to answer the user's question.
"""

from typing import Union
from pydantic import BaseModel, Field
import openai


# TODO: Add descriptions for the tool and the parameters
class WikiSearchParams(BaseModel):
    """
    TODO: Add description
    """

    query: str = Field(
        description="TODO" # TODO: Add description
    )


class GetCustomerProfileParams(BaseModel):
    """
    Get the customer's profile details. It returns a dictionary with the following keys:
    - first_name
    - last_name
    - email
    - phone_number
    - date_of_birth
    - address
    """

    customer_id: int = Field(description="The ID of the customer")


class GetCustomerAccountDetailsParams(BaseModel):
    """
    Get the details of all of the customer's accounts.
    """

    customer_id: int = Field(description="The ID of the customer")


tool_definitions = [
    openai.pydantic_function_tool(WikiSearchParams),
    openai.pydantic_function_tool(GetCustomerProfileParams),
    openai.pydantic_function_tool(GetCustomerAccountDetailsParams),
]
