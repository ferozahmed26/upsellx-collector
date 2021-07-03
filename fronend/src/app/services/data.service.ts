import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {environment} from '../../environments/environment';
const CLIENT_LIST_API = `${environment.apiUrl}/clients`;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getClientList() {
    return this.http.get(CLIENT_LIST_API);
  }
}
