import { Injectable, Injector } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { Entry } from "./entry.model";
import { catchError, map, flatMap } from "rxjs/operators";
import { CategoryService } from "../../categories/shared/category.service";
import { BaseResourceService } from "src/app/shared/services/base-resource.service";

@Injectable({
  providedIn: "root"
})
export class EntryService extends BaseResourceService<Entry> {
  constructor(
    protected injector: Injector,
    private _categoryService: CategoryService
  ) {
    super("api/entries", injector, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry> {
    return this._categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return super.create(entry);
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this._categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return super.update(entry);
      })
    );
  }
}
