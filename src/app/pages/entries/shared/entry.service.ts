import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Entry } from "./entry.model";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EntryService {
  private apiPath = "api/entries";

  constructor(private _http: HttpClient) {}

  getAll(): Observable<Entry[]> {
    return this._http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntries));
  }

  create(entry: Entry): Observable<Entry> {
    return this._http
      .post(this.apiPath, entry)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  update(entry: Entry): void {
    debugger;
    this._http.put(`${this.apiPath}/${entry.id}/edit`, entry).subscribe(res => {
      debugger;
      console.log("teste");
    });
    //.pipe(catchError(this.handleError), map(this.jsonDataToEntry));
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
    debugger;
    const teste = Object.assign(new Entry(), jsonData);
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
