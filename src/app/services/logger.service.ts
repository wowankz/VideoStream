import { Injectable } from '@angular/core';
import { Logger } from '../share/logger';

@Injectable({
    providedIn: 'root',
})
export class LoggerService extends Logger {

    constructor() {
        super();
    }

}
