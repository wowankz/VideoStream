import { Injectable } from '@angular/core';
import { Storage } from '../share/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService extends Storage {

  constructor() {
      super();
   }
}
