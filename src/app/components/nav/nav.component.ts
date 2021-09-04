import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  logoUrl =
    'https://raw.githubusercontent.com/wizsolucoes/angular-white-label-schematic/master/docs/logowiz.png';

  constructor() {}

  ngOnInit(): void {} 

  logOut(): void {
    console.log('quero sairr!')
  }
}
