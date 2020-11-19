import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  providers: [LoggerService]
})
export class LeftMenuComponent implements OnInit {

  constructor(private log: LoggerService) { }

  ngOnInit() {
  }

}
