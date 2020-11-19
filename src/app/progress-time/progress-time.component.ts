import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from '../services/logger.service';

@Component({
    selector: 'app-progress-time',
    templateUrl: './progress-time.component.html',
    styleUrls: ['./progress-time.component.css'],
    providers: [LoggerService]
})
export class ProgressTimeComponent implements OnInit {
    @Input() progressTime: number;
    constructor(private log: LoggerService) {
        this.log.name = 'ProgressTimeComponent';
     }

    ngOnInit() {
    }
    protected change(e) {
        // this.log.info(e.target.value);
    }

    protected input(e) {
        const val = e.target.value;
        e.target.style.background = '-webkit-linear-gradient(left ,rgb(152, 171, 203) 0%,rgb(152, 171, 203) '
            + val + '%,rgb(91, 107, 137) ' + val + '%, rgb(91, 107, 137) 100%)';
    }

}
