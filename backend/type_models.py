from pydantic import BaseModel, Field
from typing import Any


class LoginRequest(BaseModel):
    customer_id: int


class LoginResponse(BaseModel):
    customer_id: int
    first_name: str
    last_name: str
    email: str


class SearchRequest(BaseModel):
    query: str


class Citation(BaseModel):
    source: str = Field(
        description="The name of the source markdown file in title case. Example if the source is greenbase/wiki/account_types/crypto_accounts.md then the source should be `Crypto Accounts`"
    )
    headers: str = Field(
        description="The header paths from the metadata of the document. Example headers are {'H1': 'Savings Accounts at Greenbase', 'H2': 'Types of Savings Accounts', 'H3': 'High-Interest Savings Account'} then the path should be `Savings Accounts at Greenbase > Types of Savings Accounts > High-Interest Savings Account`"
    )


class SearchResponse(BaseModel):
    answer: str
    citations: list[Citation]


class ChatIdResponse(BaseModel):
    chat_id: str


class ChatRequest(BaseModel):
    chat_id: str | None = None
    message: str


class ChatResponse(BaseModel):
    chat_id: str
    response: Any


class MessagesResponse(BaseModel):
    messages: list[dict]
