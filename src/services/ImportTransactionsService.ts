import csvParse from 'csv-parse';
import fs from 'fs';

import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Transactions {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
}
class ImportTransactionsService {
  async execute(filePath: string): Promise<Transactions[]> {
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: any[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const createCategory = new CreateCategoryService();

    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transactions = [];

    for (const line of lines) {
      const [title, type, value, category] = line;

      const newCategory = await createCategory.execute({
        categoryTitle: category,
      });

      const arrayToObject = {
        title,
        type,
        value,
        category_id: newCategory.id,
      };

      transactions.push(arrayToObject);

      const transaction = transactionRepository.create(arrayToObject);

      await transactionRepository.save(transaction);
    }

    await fs.promises.unlink(filePath);

    return transactions;
  }
}

export default ImportTransactionsService;
