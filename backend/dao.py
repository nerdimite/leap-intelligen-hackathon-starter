import sqlite3
import hashlib


def execute_sql_query(query, params=None, commit=True):
    """
    Execute an SQL query and return the results as a list of dictionaries.

    Args:
        query (str): The SQL query to execute.
        params (tuple, optional): Parameters for the SQL query.
        commit (bool): Whether to commit the transaction.

    Returns:
        list: A list of dictionaries representing the query results, or the number of affected rows for non-SELECT queries.
    """
    conn = sqlite3.connect("greenbase.db")
    cursor = conn.cursor()
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        if commit:
            conn.commit()
        if query.strip().upper().startswith("SELECT"):
            columns = [column[0] for column in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        return cursor.rowcount
    finally:
        conn.close()


def verify_customer(customer_id, question_id, provided_answer):
    """
    Verify a customer's answer to a security question.

    Args:
        customer_id (int): The ID of the customer.
        question_id (int): The ID of the security question.
        provided_answer (str): The answer provided by the customer.

    Returns:
        bool: True if the answer is correct, False otherwise.
    """
    query = """
    SELECT answer_hash FROM SecurityQuestions WHERE customer_id = ? AND question_id = ?
    """
    result = execute_sql_query(query, (customer_id, question_id))

    if not result:
        return False

    correct_hash = result[0]["answer_hash"]
    provided_hash = hashlib.sha256(provided_answer.lower().encode()).hexdigest()

    return provided_hash == correct_hash


def get_customer_profile(customer_id):
    """
    Retrieve the customer's profile details.

    Args:
        customer_id (int): The ID of the customer.

    Returns:
        dict: A dictionary containing the customer's profile details.
    """
    query = """
    SELECT *
    FROM Customers
    WHERE customer_id = ?
    """
    return execute_sql_query(query, (customer_id,))


def get_risk_tolerance(customer_id):
    """
    Retrieve the customer's risk tolerance.
    """
    query = """
    SELECT * FROM RiskTolerance WHERE customer_id = ?
    """
    return execute_sql_query(query, (customer_id,))


def get_customer_account_details(customer_id):
    """
    Retrieve detailed account information for a given customer.

    Args:
        customer_id (int): The ID of the customer.

    Returns:
        list: A list of dictionaries containing account details for the customer.
    """
    get_account_ids_query = """
    SELECT account_id, account_type FROM Accounts
    WHERE customer_id = ?
    """
    accounts = execute_sql_query(get_account_ids_query, (customer_id,))

    for account in accounts:
        if account["account_type"] == "Savings":
            query = """
            SELECT * FROM SavingsAccounts
            WHERE account_id = ?
            """
            account["savings_account"] = execute_sql_query(
                query, (account["account_id"],)
            )
        elif account["account_type"] == "Trading":
            query = """
            SELECT * FROM TradingAccounts
            WHERE account_id = ?
            """
            account["trading_account"] = execute_sql_query(
                query, (account["account_id"],)
            )
        elif account["account_type"] == "Crypto":
            query = """
            SELECT * FROM CryptoAccounts
            WHERE account_id = ?
            """
            account["crypto_account"] = execute_sql_query(
                query, (account["account_id"],)
            )
    return accounts


def get_customer_financial_goals(customer_id):
    """
    Retrieve all financial goals for a given customer.

    Args:
        customer_id (int): The ID of the customer.

    Returns:
        list: A list of dictionaries containing financial goal details for the customer.
    """
    query = """
    SELECT 
        goal_id,
        goal_name,
        goal_amount,
        current_savings,
        target_date,
        progress_percentage
    FROM FinancialGoals
    WHERE customer_id = ?
    ORDER BY target_date ASC
    """
    return execute_sql_query(query, (customer_id,))

def create_financial_goal(customer_id, goal_name, goal_amount, current_savings, target_date):
    """
    Create a financial goal for a given customer.
    """
    query = """
    INSERT INTO FinancialGoals (
        customer_id, goal_name, goal_amount, current_savings, target_date, progress_percentage
    ) VALUES (
        ?, ?, ?, ?, ?, ?
    )
    """
    progress_percentage = (current_savings / goal_amount) * 100 if goal_amount > 0 else 0
    return execute_sql_query(query, (customer_id, goal_name, goal_amount, current_savings, target_date, progress_percentage))

def update_financial_goal(
    goal_id,
    new_goal_amount=None,
    add_to_current_savings=None,
    set_current_savings=None,
    new_target_date=None,
    commit=False,
):
    """
    Update a financial goal for a given customer.

    Args:
        goal_id (int): The ID of the goal to update.
        new_goal_amount (float, optional): The new goal amount.
        add_to_current_savings (float, optional): The amount to add to the current savings.
        set_current_savings (float, optional): The new current savings amount.
        new_target_date (date, optional): The new target date.
        commit (bool): Whether to commit the transaction.

    Returns:
        tuple: A tuple containing a boolean indicating success and a dictionary containing the change log and updated goal.
    """
    # Fetch current goal data
    current_goal = execute_sql_query(
        "SELECT goal_amount, current_savings FROM FinancialGoals WHERE goal_id = ?",
        (goal_id,),
        commit=False,
    )
    if not current_goal:
        return False, "Goal not found"

    updated_goal = current_goal[0].copy()

    # Prepare update fields
    updates = []
    params = []
    if new_goal_amount is not None:
        updates.append("goal_amount = ?")
        params.append(new_goal_amount)
        updated_goal["goal_amount"] = new_goal_amount
    if add_to_current_savings is not None:
        updates.append("current_savings = current_savings + ?")
        params.append(add_to_current_savings)
        updated_goal["current_savings"] += add_to_current_savings
    if set_current_savings is not None:
        updates.append("current_savings = ?")
        params.append(set_current_savings)
        updated_goal["current_savings"] = set_current_savings
    if new_target_date is not None:
        updates.append("target_date = ?")
        params.append(new_target_date)

    # Calculate new progress percentage
    new_progress = (updated_goal["current_savings"] / updated_goal["goal_amount"]) * 100
    updates.append("progress_percentage = ?")
    params.append(new_progress)

    # Construct and execute update query
    query = f"UPDATE FinancialGoals SET {', '.join(updates)} WHERE goal_id = ?"
    params.append(goal_id)

    rows_affected = execute_sql_query(query, params, commit=commit)

    if rows_affected > 0:
        change_log = (
            ("Unc" if not commit else "C")
            + "ommitted Changes Made: "
            + ", ".join(
                [
                    f"{update.split(' = ')[0]}={params[i]}"
                    for i, update in enumerate(updates)
                    if "=" in update
                ]
            )
        )

        return True, {"change_log": change_log, "updated_goal": updated_goal}
    else:
        return False, {"change_log": "No changes were made"}


def get_account_transactions(account_id):
    """
    Retrieve all transactions for a given account.
    """
    query = """
    SELECT * FROM Transactions
    WHERE account_id = ?
    """
    return execute_sql_query(query, (account_id,))


def get_investments(customer_id):
    """
    Retrieve all investments for a given customer.
    """
    query = """
    SELECT * FROM Investments
    WHERE customer_id = ?
    """
    return execute_sql_query(query, (customer_id,))

def get_portfolio(customer_id):
    """
    Retrieve the portfolio for a given customer.
    """
    query = """
    SELECT * FROM Portfolio
    WHERE customer_id = ?
    """
    return execute_sql_query(query, (customer_id,))

def get_recurring_deposits(customer_id):
    """
    Retrieve recurring deposit instructions for a given customer.
    """
    query = """
    SELECT * FROM RecurringDeposits
    WHERE customer_id = ?
    """
    return execute_sql_query(query, (customer_id,))

def transfer_funds(from_account_id, to_account_id, amount):
    """
    Transfer funds from one account to another.

    Args:
        from_account_id (int): The ID of the account to transfer from.
        to_account_id (int): The ID of the account to transfer to.
        amount (float): The amount to transfer.

    Returns:
        tuple: (bool, str) A tuple containing a boolean indicating success and a status message.
    """
    # Check if the from_account has sufficient funds
    check_balance_query = "SELECT balance FROM Accounts WHERE account_id = ?"
    result = execute_sql_query(check_balance_query, (from_account_id,))
    if not result or result[0]['balance'] < amount:
        return False, "Insufficient funds for transfer"

    # Perform the transfer
    update_from_query = "UPDATE Accounts SET balance = balance - ? WHERE account_id = ?"
    update_to_query = "UPDATE Accounts SET balance = balance + ? WHERE account_id = ?"
    
    if (execute_sql_query(update_from_query, (amount, from_account_id)) and
        execute_sql_query(update_to_query, (amount, to_account_id))):
        
        # Record the transaction
        transaction_query = """
        INSERT INTO Transactions (account_id, transaction_type, amount, recipient_account_id, transaction_date)
        VALUES (?, 'transfer', ?, ?, datetime('now'))
        """
        if execute_sql_query(transaction_query, (from_account_id, amount, to_account_id)):
            return True, "Transfer completed successfully"

    return False, "Transfer failed"


