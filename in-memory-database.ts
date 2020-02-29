import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from 'src/app/pages/categories/shared/category.model';

export class InMemoryDatabase implements InMemoryDbService {
  createDb(): {} {
    const categories: Category[] = [
      { id: 1, name: 'Moradia', description: 'Pagamentos de Contas da Casa' },
      { id: 2, name: 'Saúde', description: 'Plano de saúde e remédios' },
      { id: 3, name: 'Lazer', description: 'Cinema, parque, praia, etc.' }
    ];

    return { categories };
  }
}
