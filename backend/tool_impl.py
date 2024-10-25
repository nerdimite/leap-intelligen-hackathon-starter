"""
This file contains the implementations of the tools and the mapping of the tools to the functions.
"""

from jinja2 import Template
from vector_db import VectorDB
from dao import (
    get_customer_profile,
    get_customer_account_details,
    # TODO: Import the remaining DAO functions here
)

vector_db = VectorDB("lancedb", "wiki")

search_results_template = Template(
    """Results for Query: {{ query }}
    
{% for result in results %}
{{ result['text'] }}
========================================
{% endfor %}
""",
    trim_blocks=True,
)


def search_wiki(query: str, top_k: int = 5) -> list[str]:
    """
    Search the wiki for the given query and return the top_k results.

    Args:
        query (str): The search query.
        top_k (int): The number of top results to return. Default is 5.

    Returns:
        list[str]: The search results.
    """
    # TODO: Update the search query with source based metadata filtering using the .where() method
    results = vector_db.search(query).limit(top_k).to_list()
    return search_results_template.render(query=query, results=results)


def enable_2fa(customer_id: int):
    """
    Enable 2FA for a given customer.
    """
    return "2FA enabled for customer " + str(customer_id)


# TODO Optional: Custom tool implementations here

tool_call_registry = {
    "WikiSearchParams": search_wiki,
    "GetCustomerProfileParams": get_customer_profile,
    "GetCustomerAccountDetailsParams": get_customer_account_details,
    # TODO: Map their schemas to the callable functions here
}
