import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseResourceModel } from "../models/base-resource-model";
import { HttpClient } from "@angular/common/http";

export abstract class BaseResourceService<T extends BaseResourceModel> {
  protected _http: HttpClient;

  constructor(protected apiPath: string) {}

  getAll(): Observable<T[]> {
    return this._http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToResources));
  }

  create(resource: T): Observable<T> {
    return this._http
      .post(this.apiPath, resource)
      .pipe(catchError(this.handleError), map(this.jsonDataToResource));
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  update(resource: T): Observable<T> {
    return this._http.put(`${this.apiPath}/${resource.id}`, resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  getById(id: number): Observable<T> {
    return this._http
      .get(`${this.apiPath}/${id}`)
      .pipe(catchError(this.handleError), map(this.jsonDataToResource));
  }

  //PROTECTED METHODS

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(element as T));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
