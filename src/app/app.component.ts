import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RuntimeService } from './services/runtime.service';


interface IMessage {
    action: string;
    params: any;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'VideoStream';
    constructor(private runtime: RuntimeService, private router: Router) {
    }

    ngOnInit() {
    }
}
