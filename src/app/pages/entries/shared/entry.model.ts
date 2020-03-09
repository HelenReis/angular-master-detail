import { Category } from "../../categories/shared/category.model";

export class Entry {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public type?: string,
    public amount?: string,
    public date?: string,
    public paid?: boolean,
    public categoryId?: number,
    public category?: Category
  ) {}

  public static types = {
    expense: "Despesa",
    revenue: "Receita"
  };

  public get paidText(): string {
    return this.paid ? "Pago" : "Pendente";
  }
}
