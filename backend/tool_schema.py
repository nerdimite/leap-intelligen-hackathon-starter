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

    query: str = Field(description="TODO")  # TODO: Add description


class GetCustomerProfileParams(BaseModel):
    """
    Get the customer's profile details. It returns a dictionary with the following keys:
    - customer_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
    - first_name: TEXT
    - last_name: TEXT
    - email: TEXT
    - phone_number: TEXT
    - date_of_birth: DATE
    - address: TEXT
    - created_at: DATE
    - updated_at: DATE
    """

    customer_id: int = Field(description="The ID of the customer")


class GetCustomerAccountDetailsParams(BaseModel):
    """
    Get the details of all of the customer's accounts.
    Returns a list of dictionaries with multiple account types:

    ## SavingsAccounts
    - account_id: INTEGER (PRIMARY KEY, FOREIGN KEY -> Accounts.account_id)
    - account_subtype: TEXT
    - joint_account_ids: TEXT
    - withdrawal_limit: REAL
    - tier: TEXT

    ## TradingAccounts
    - account_id: INTEGER (PRIMARY KEY, FOREIGN KEY -> Accounts.account_id)
    - margin_enabled: BOOLEAN
    - margin_balance: REAL
    - leverage_ratio: REAL
    - active_assets: TEXT

    ## CryptoAccounts
    - account_id: INTEGER (PRIMARY KEY, FOREIGN KEY -> Accounts.account_id)
    - crypto_type: TEXT
    - wallet_address: TEXT
    - staking_enabled: BOOLEAN
    - staking_rewards_balance: REAL
    """

    customer_id: int = Field(description="The ID of the customer")


# Add tool definitions for the remaining actions
class GetRiskToleranceParams(BaseModel):
    pass

class GetFinancialGoalsParams(BaseModel):
    pass


class UpdateFinancialGoalsParams(BaseModel):
    pass


class GetAccountTransactionsParams(BaseModel):
    pass


class GetInvestmentsParams(BaseModel):
    pass


class GetPortfolioParams(BaseModel):
    pass


class GetRecurringDepositsParams(BaseModel):
    pass


class TransferFundsParams(BaseModel):
    pass

class ExecuteSQLQueryParams(BaseModel):
    pass


tool_definitions = [
    openai.pydantic_function_tool(WikiSearchParams),
    openai.pydantic_function_tool(GetCustomerProfileParams),
    openai.pydantic_function_tool(GetCustomerAccountDetailsParams),
    # TODO: Add their schema here
]
