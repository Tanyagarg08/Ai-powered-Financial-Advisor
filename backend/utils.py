def categorize_transaction(description, amount):
    desc = description.lower()
    if 'food' in desc or 'restaurant' in desc:
        return 'Food'
    elif 'uber' in desc or 'taxi' in desc:
        return 'Travel'
    elif 'book' in desc or 'course' in desc:
        return 'Education'
    else:
        return 'Other'

def get_budget_advice(transactions):
    total = sum(t['amount'] for t in transactions)
    advice = f"Your total spending is ${total}. Try to save 20% of income!"
    return {'advice': advice}

def get_investment_advice(transactions, risk):
    if risk == 'low':
        plan = {'FD': '50%', 'Mutual Funds': '30%', 'Stocks': '20%'}
    elif risk == 'high':
        plan = {'Stocks': '70%', 'Mutual Funds': '20%', 'FD': '10%'}
    else:
        plan = {'FD': '30%', 'Mutual Funds': '40%', 'Stocks': '30%'}
    return {'plan': plan}
