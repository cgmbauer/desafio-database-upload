import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transactionToBeDeleted = await transactionRepository.findOne({
      where: { id },
    });

    if (!transactionToBeDeleted) {
      throw new AppError('Repository ID does not exist.');
    }

    await transactionRepository.delete(transactionToBeDeleted.id);
  }
}

export default DeleteTransactionService;
