import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { HttpService } from '../services/http.service';
import { RuntimeService } from '../services/runtime.service';


@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.css'],
    providers: [LoggerService]
})
export class ControlPanelComponent implements OnInit {
    @Input() playback: number;
    constructor(private log: LoggerService, private httpService: HttpService, private runtime: RuntimeService) { }

    ngOnInit() {
        // this.playback = 0;
    }

    protected stop() {
        this.httpService.stop().subscribe(
            data => {
                this.log.info('Stop video %o', data);
                chrome.browserAction.setBadgeText({ text: 'Stop' });
            },
            error => {
                this.log.error(error.message);
            }
        );
    }

    protected async play() {
        const port = await this.runtime.sendMessage({
            action: 'play',
            params: ''
        });
        chrome.browserAction.getBadgeText({}, (text) => {
            this.log.info(text);
            if (text === 'Play') {
                chrome.browserAction.setBadgeText({ text: 'Pause' });
                return;
            }
            if (text === 'Pause') {
                chrome.browserAction.setBadgeText({ text: 'Play' });
                return;
            }
        });

    }

    protected backward() {
        this.httpService.backward().subscribe(
            data => {
                this.log.info('rewind video %o', data);
            },
            error => {
                this.log.error(error.message);
            }
        );
    }

    protected forward() {
        this.httpService.forward().subscribe(
            data => {
                this.log.info('forward video %o', data);
            },
            error => {
                this.log.error(error.message);
            }
        );
    }
}
