import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Category } from "./category.model";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CategoryService {
  private apiPath = "api/categories";

  constructor(private _http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this._http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategories));
  }

  create(category: Category): Observable<Category> {
    return this._http
      .post(this.apiPath, category)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  update(category: Category): Observable<Category> {
    return this._http
      .put(`${this.apiPath}/${category.id}/edit`, category)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  getById(id: number): Observable<Category> {
    return this._http
      .get(`${this.apiPath}/${id}`)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  private handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
