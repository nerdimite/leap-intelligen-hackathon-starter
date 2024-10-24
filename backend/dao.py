import sqlite3
import hashlib


def execute_sql_query(query, params=None, commit=False):
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
    SELECT first_name, last_name, email, phone_number, date_of_birth, address
    FROM Customers
    WHERE customer_id = ?
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
    query = """
    SELECT 
        a.account_id, 
        a.account_type, 
        a.balance,
        CASE
            WHEN a.account_type = 'Savings' THEN s.account_subtype
            WHEN a.account_type = 'Trading' THEN 
                CASE WHEN t.margin_enabled THEN 'Margin' ELSE 'Cash' END
            WHEN a.account_type = 'Crypto' THEN c.crypto_type
            ELSE NULL
        END AS subtype,
        CASE
            WHEN a.account_type = 'Savings' THEN 'Tier: ' || COALESCE(s.tier, 'N/A')
            WHEN a.account_type = 'Trading' THEN 'Leverage Ratio: ' || COALESCE(t.leverage_ratio, 'N/A')
            WHEN a.account_type = 'Crypto' THEN 'Staking Enabled: ' || CASE WHEN c.staking_enabled THEN 'Yes' ELSE 'No' END
            ELSE 'N/A'
        END AS additional_info
    FROM Accounts a
    LEFT JOIN SavingsAccounts s ON a.account_id = s.account_id
    LEFT JOIN TradingAccounts t ON a.account_id = t.account_id
    LEFT JOIN CryptoAccounts c ON a.account_id = c.account_id
    WHERE a.customer_id = ?
    """
    return execute_sql_query(query, (customer_id,))


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
