import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const objectTypeIncome = await this.find({
      where: { type: 'income' },
    });

    const income = objectTypeIncome
      .filter(transaction => transaction.type === 'income')
      .reduce((total, num) => Number(num.value) + Number(total), 0);

    const objectTypeOutcome = await this.find({
      where: { type: 'outcome' },
    });

    const outcome = objectTypeOutcome
      .filter(transaction => transaction.type === 'outcome')
      .reduce((total, num) => Number(num.value) + Number(total), 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
