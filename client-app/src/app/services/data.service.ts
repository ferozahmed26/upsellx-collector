import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {environment} from '../../environments/environment';
const CLIENT_LIST_API = `${environment.apiUrl}/clients`;
const CLIENT_SPIDER_API = `${environment.spiderUrl}/spider`;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getClientList() {
    return this.http.get(CLIENT_LIST_API);
  }

  addClient(client) {
    const payload = {site: client};
    return this.http.post(CLIENT_SPIDER_API, payload);
  }
}
