# GreenBase Database Schema

## Customers
- customer_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
- first_name: TEXT
- last_name: TEXT
- email: TEXT
- phone_number: TEXT
- date_of_birth: DATE
- address: TEXT
- created_at: DATE
- updated_at: DATE

## RiskTolerance
- customer_id: INTEGER (PRIMARY KEY, FOREIGN KEY -> Customers.customer_id)
- risk_tolerance: TEXT

## SecurityQuestions
- question_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
- customer_id: INTEGER (FOREIGN KEY -> Customers.customer_id)
- question: TEXT
- answer: TEXT
- answer_hash: TEXT
- created_at: DATE
- updated_at: DATE

## Accounts
- account_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
- customer_id: INTEGER (FOREIGN KEY -> Customers.customer_id)
- account_type: TEXT
- balance: REAL
- interest_rate: REAL
- created_at: DATE
- updated_at: DATE

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

## Transactions
- transaction_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
- account_id: INTEGER (FOREIGN KEY -> Accounts.account_id)
- transaction_type: TEXT
- amount: REAL
- currency: TEXT
- transaction_date: DATE
- recipient_account_id: INTEGER
- description: TEXT

## Investments
- investment_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
- customer_id: INTEGER (FOREIGN KEY -> Customers.customer_id)
- investment_type: TEXT
- amount_invested: REAL
- current_value: REAL
- units_owned: INTEGER
- date_purchased: DATE
- date_sold: DATE

## Portfolio
- portfolio_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
- customer_id: INTEGER (FOREIGN KEY -> Customers.customer_id)
- asset_class: TEXT
- asset_id: TEXT
- units_held: INTEGER
- current_value: REAL
- last_updated: DATE

## FinancialGoals
- goal_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
- customer_id: INTEGER (FOREIGN KEY -> Customers.customer_id)
- goal_name: TEXT
- goal_amount: REAL
- current_savings: REAL
- target_date: DATE
- progress_percentage: REAL

## RecurringDeposits
- instruction_id: INTEGER (PRIMARY KEY AUTOINCREMENT)
- customer_id: INTEGER (FOREIGN KEY -> Customers.customer_id)
- source_account_id: INTEGER (FOREIGN KEY -> Accounts.account_id)
- destination_account_id: INTEGER (FOREIGN KEY -> Accounts.account_id)
- amount: REAL
- frequency: TEXT
- start_date: DATE
- end_date: DATE
- status: TEXT