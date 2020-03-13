import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Entry } from "./entry.model";
import { catchError, map, flatMap } from "rxjs/operators";
import { CategoryService } from "../../categories/shared/category.service";

@Injectable({
  providedIn: "root"
})
export class EntryService {
  private apiPath = "api/entries";

  constructor(
    private _http: HttpClient,
    private _categoryService: CategoryService
  ) {}

  getAll(): Observable<Entry[]> {
    return this._http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntries));
  }

  create(entry: Entry): Observable<Entry> {
    return this._categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return this._http
          .post(this.apiPath, entry)
          .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
      })
    );
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this._categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return this._http.put(`${this.apiPath}/${entry.id}`, entry).pipe(
          catchError(this.handleError),
          map(() => entry)
        );
      })
    );
  }

  getById(id: number): Observable<Entry> {
    return this._http
      .get(`${this.apiPath}/${id}`)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    });
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
