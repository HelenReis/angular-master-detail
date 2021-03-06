import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { Category } from "../../categories/shared/category.model";
import { CategoryService } from "../../categories/shared/category.service";

@Component({
  selector: "app-entry-form",
  templateUrl: "./entry-form.component.html",
  styleUrls: ["./entry-form.component.css"]
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Category[];

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: "",
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ","
  };

  ptBr = {
    firstDayOfWeek: 0,
    dayNames: [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado"
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro"
    ],
    monthNamesShort: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez"
    ],
    today: "Hoje",
    clear: "Limpar"
  };

  constructor(
    private entryService: EntryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if (this.currentAction == "edit") {
      this.route.paramMap
        .pipe(switchMap(params => this.entryService.getById(+params.get("id"))))
        .subscribe(
          entry => {
            this.entry = entry;
            this.entryForm.patchValue(entry);
          },
          error => alert("Erro! Tente novamente mais tarde.")
        );
    }
  }

  private setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = "Cadastro de nova lançamento";
    } else {
      const entryName = this.entry.name || "";
      this.pageTitle = "Editando lançamento: " + entryName;
    }
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === "new") {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  private createEntry() {
    const entry: Entry = Entry.fromJson(this.entryForm.value);

    this.entryService.create(entry).subscribe(
      entry => {
        this.actionsForSuccess(entry);
      },
      error => this.actionsForErrors(error)
    );
  }

  private updateEntry() {
    const entry: Entry = Entry.fromJson(this.entryForm.value);

    this.entryService.update(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForErrors(error)
    );
  }

  private actionsForSuccess(entry: Entry) {
    alert("Solicitação processada com sucesso");

    this.router
      .navigateByUrl("entries", { skipLocationChange: true })
      .then(() => {
        this.router.navigate(["entries", entry.id, "edit"]);
      });
  }

  private actionsForErrors(error) {
    alert("Ocorreu um erro ao processar sua solicitação");

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = [
        "Falha na comunicação com o servidor. Tente mais tarde."
      ];
    }
  }

  private loadCategories() {
    this.categoryService
      .getAll()
      .subscribe(categories => (this.categories = categories));
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(([value, text]) => {
      return {
        text: text,
        value: value
      };
    });
  }
}
