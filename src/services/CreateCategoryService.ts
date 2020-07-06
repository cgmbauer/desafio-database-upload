import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface RequestDTO {
  categoryTitle: string;
}

class CreateCategoryService {
  public async execute({ categoryTitle }: RequestDTO): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });

    if (checkCategoryExists) {
      return checkCategoryExists;
    }

    const category = categoriesRepository.create({
      title: categoryTitle,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
