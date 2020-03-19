import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseResourceModel } from "../models/base-resource-model";
import { HttpClient } from "@angular/common/http";
import { Injector } from "@angular/core";

export abstract class BaseResourceService<T extends BaseResourceModel> {
  protected http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.http
      .get(this.apiPath)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataToResources.bind(this))
      );
  }

  create(resource: T): Observable<T> {
    return this.http
      .post(this.apiPath, resource)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataToResource.bind(this))
      );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/${id}`).pipe(
      map(() => null),
      catchError(this.handleError)
    );
  }

  update(resource: T): Observable<T> {
    return this.http.put(`${this.apiPath}/${resource.id}`, resource).pipe(
      map(() => resource),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<T> {
    return this.http
      .get(`${this.apiPath}/${id}`)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataToResource.bind(this))
      );
  }

  //PROTECTED METHODS

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element =>
      resources.push(this.jsonDataToResourceFn(element))
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
