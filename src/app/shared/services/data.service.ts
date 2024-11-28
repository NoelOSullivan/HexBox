import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
export class DataService {
 
    constructor() {}

    private http = inject(HttpClient);

    getMenus() {
      return this.http.get('assets/menus.json');
    }

    getData(url:string) {
      return this.http.get('assets/' + url);
    }
}