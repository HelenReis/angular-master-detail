import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Category } from "./category.model";
import { catchError, map } from "rxjs/operators";
import { BaseResourceService } from "src/app/shared/services/base-resource.service";

@Injectable({
  providedIn: "root"
})
export class CategoryService extends BaseResourceService<Category> {
  constructor(private _http: HttpClient, protected injector: Injector) {
    super("api/categories", injector);
  }
}
