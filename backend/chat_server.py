import os, shutil
from fastapi import FastAPI, HTTPException
from vector_db import VectorDB
from rag_qa import AISearch
from agent import GreenbaseAgent
from dao import execute_sql_query
from type_models import (
    LoginRequest,
    LoginResponse,
    SearchRequest,
    SearchResponse,
    ChatRequest,
    ChatResponse,
    ChatIdResponse,
    MessagesResponse,
)

app = FastAPI()
vector_db = VectorDB("lancedb", "wiki")
ai_search = AISearch(vector_db)


def recreate_database():
    if os.path.exists("greenbase.db"):
        os.remove("greenbase.db")
    shutil.copy("greenbase_template.db", "greenbase.db")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/user/login", response_model=LoginResponse)
async def user_login(request: LoginRequest) -> LoginResponse:
    """
    Login a user and return their basic information.
    """
    query = """
    SELECT customer_id, first_name, last_name, email
    FROM Customers
    WHERE customer_id = ?
    """
    result = execute_sql_query(query, (request.customer_id,))

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    user_info = result[0]
    return LoginResponse(**user_info)


@app.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest) -> SearchResponse:
    """
    Search the Greenbase knowledge base.
    """
    return ai_search.ask(request.query)


@app.get("/chat/generate_id", response_model=ChatIdResponse)
async def generate_id():
    """
    Generate a new chat ID.
    """
    return ChatIdResponse(chat_id=GreenbaseAgent().generate_chat_id())


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Start a new chat or continue an existing one.
    """
    agent = GreenbaseAgent()

    agent.load_chat(request.chat_id)

    response = agent.chat(request.message)

    agent.save_chat(request.chat_id)

    return ChatResponse(chat_id=request.chat_id, response=response)


@app.post("/eval/single-turn", response_model=MessagesResponse)
async def chat_single_turn(request: ChatRequest) -> MessagesResponse:
    """
    Allows the evaluation of a single-turn chat without chat history.
    Returns the full message history including tool calls and responses.
    """
    recreate_database()
    agent = GreenbaseAgent()

    response = agent.chat(request.message)
    messages = agent.get_serialized_messages()

    return MessagesResponse(messages=messages)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
