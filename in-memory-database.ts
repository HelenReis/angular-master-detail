import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from "src/app/pages/categories/shared/category.model";
import { Entry } from "src/app/pages/entries/shared/entry.model";

export class InMemoryDatabase implements InMemoryDbService {
  createDb(): {} {
    const categories: Category[] = [
      { id: 1, name: "Moradia", description: "Pagamentos de Contas da Casa" },
      { id: 2, name: "Saúde", description: "Plano de saúde e remédios" },
      { id: 3, name: "Lazer", description: "Cinema, parque, praia, etc." },
      { id: 3, name: "Compras", description: "Roupas, sapatos." }
    ];

    const entries: Entry[] = [
      {
        id: 1,
        name: "Gás de cozinha",
        categoryId: categories[0].id,
        category: categories[0],
        paid: true,
        date: "14/10/2019",
        amount: "70,80",
        type: "expense",
        description: "Utilidades domésticas."
      } as Entry
    ];

    return { categories, entries };
  }
}
