import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeService } from 'src/app/core/services/home.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map, filter, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  loading: boolean = false;
  dataTable: any = {};
  p: number = 1;
  item: any = {
    sort: true,
  };
  ascName: boolean = true;
  ascGender: boolean = true;
  ascBirthday: boolean = true;
  results$: Observable<any>;

  filterForm = new FormGroup({
    // search: new FormControl(""),
  });

  search = new FormControl("");

  constructor(
    public dialog: MatDialog,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.search.valueChanges.pipe(
      //eliminando os espacos
      map(value => value.trim()),
      //Colocando um mínimo de caracteres para ele pesquisar
      // filter(value => value.length > 1),
      //Aplicando um delay
      debounceTime(200),
      //Tirando pesquisas repetidas, ignorando os valores repetidos
      distinctUntilChanged(),
      tap(value => {
        let tratamentoSearch = this.dataTable.results;
        if(value !== ""){
          console.log(value)
          let campoSearch = value.toLowerCase();
          this.dataTable.results = tratamentoSearch.filter(e => (e.name.first.toLowerCase().includes(campoSearch) || e.location.country.toLowerCase().includes(campoSearch) ))
        }else{
          this.getData();
        }
      }),
    ).subscribe()
  }

  getData() {
    this.loading = true;

    try {
      //Puxando dados e populando a tabela - limitando para 50 resultados
      this.homeService.getDataTable(50).subscribe((response) => {
        this.dataTable = response;
        this.loading = false;

        //permitindo inserir apenas dados únicos (nao repetidos)
        const optionSelectCountry = [];

        const countries = []
        //Validacao tirando os nomes repetidos
        for (let i = 0; i < response.results.length; i++) {
          const element = response.results[i];
          countries.push(element.location.country)
        }

        for (let j = 0; j < countries.length; j++) {
          const elements = countries[j];

          const verificaCountry = optionSelectCountry.includes(elements);
          if (verificaCountry) {
            optionSelectCountry.push(elements);
          }
        }
        console.log(optionSelectCountry)


      })
    } catch (error) {
      console.log(error);
      this.loading = false;
    }
  }

  //Modal (Dialog Angular Material)
  openDialog(objectUser) {
    //Instanciando component modal e passando os dados para ele
    this.dialog.open(DialogDataExampleDialog, {
      data: objectUser
    });
  }

  //Lógica de ordenadores de tabela
  sortData(orderName: string) {
    this.item = { ...this.item, sort: !this.item.sort }

    if (orderName == 'name') {
      this.dataTable.results.sort(function (a, b) {
        var nameA = a.name.first.toUpperCase();
        var nameB = b.name.first.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });
      if (this.ascName) {
        this.dataTable.results.reverse();
      }
      this.ascName = !this.ascName;
    }


    if (orderName == 'gender') {
      this.dataTable.results.sort(function (a, b) {
        var genderA = a.gender.toUpperCase();
        var genderB = b.gender.toUpperCase();
        if (genderA < genderB) {
          return -1;
        }
        if (genderA > genderB) {
          return 1;
        }

        return 0;
      });
      if (this.ascGender) {
        this.dataTable.results.reverse();
      }
      this.ascGender = !this.ascGender;
    }


    if (orderName == 'birthday') {
      this.dataTable.results.sort(function (a, b) {
        var birthdayA = a.dob.date.toUpperCase();
        var birthdayB = b.dob.date.toUpperCase();
        if (birthdayA < birthdayB) {
          return -1;
        }
        if (birthdayA > birthdayB) {
          return 1;
        }

        return 0;
      });
      if (this.ascBirthday) {
        this.dataTable.results.reverse();
      }
      this.ascBirthday = !this.ascBirthday;
    }


  }

  onChange(select) {
    console.log(select)
    const datastabel = this.dataTable;

    if (select !== "") {
      this.dataTable.results = datastabel.results.filter(e => e.location.country.includes(select))
    } else {
      this.getData();
    }
  }

}

//Instanciando Angular Dialog
@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
  styleUrls: ['dialog-data-style.scss']
})
export class DialogDataExampleDialog {
  fullName: string;
  dateFormatted: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {

    //Lógica de converssão de data 
    let dateConverted = new Date(this.data.dob.date)
    let day = dateConverted.getDate();
    let month = dateConverted.getMonth() + 1;
    let year = dateConverted.getFullYear();
    this.dateFormatted = `${day}/${month}/${year}`;

    //Interpolando nomes
    this.fullName = `${this.data.name.title} ${this.data.name.first} ${this.data.name.last}`
  }
}