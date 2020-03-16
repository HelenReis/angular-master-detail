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
}
