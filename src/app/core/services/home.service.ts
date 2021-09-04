import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environment/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getDataTable(results: number): Observable<any> {
      return this.http.get(`${environment.apiUrl}/?results=${results}`);
  }
  
}
