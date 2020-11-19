import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { IDevice } from '../interfaces/device.interface';
import { RuntimeService } from '../services/runtime.service';

interface IMessage {
    action: string;
    params: any;
}

@Component({
    selector: 'app-devices',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css'],
    providers: [LoggerService]
})
export class DevicesComponent implements OnInit, OnDestroy {
    protected search: boolean;
    protected titleCard: string;
    public devices: IDevice[];
    public current: string;
    public error: boolean;
    protected interval: any;
    constructor(
        private router: Router,
        private httpService: HttpService,
        private log: LoggerService,
        private storage: StorageService,
        private runtime: RuntimeService) {
        this.log.name = 'DevicesComponent';
    }

    ngOnInit() {
        this.log.info('');
        this.log.info('Init');
        this.error = false;
        this.search = true;
        this.titleCard = 'Search DLNA devices';
        this.current = '';
        this.runtime.sendMessage({ action: 'runUms', params: '' })
            .then(data => { })
            .catch(err => this.log.error('Run ums error : %o', err));
        this.searchDevice();

    }

    onSelect(device: IDevice) {
        this.log.info('Renderer selected uuid : ' + device.uuid);
        this.stop();
        this.current = device.uuid;
        this.storage.set('currentRenderer', device.uuid);
        setTimeout(() => this.router.navigate(['player']), 1000);

    }

    protected stop() {
        this.httpService.stop().subscribe(
            data => {
                this.log.info('Stop video : %o', data);
                chrome.browserAction.setBadgeText({ text: '' });
            },
            error => {
                this.log.info(error.message);
            }
        );
    }

    protected searchDevice() {
        this.interval = setInterval(() => {
            if (this.storage.get('umsWebUrl') === null) { return; }
            if (this.search) { chrome.browserAction.setBadgeText({ text: 'Search' }); }

            this.httpService.getRenderers().subscribe(
                data => {
                    this.log.info('List renderers : %o', data);
                    if (data.length !== 0) {
                        this.devices = data;
                        this.current = this.storage.get('currentRenderer');
                        this.search = false;
                        this.titleCard = 'Choose Device';
                        chrome.browserAction.setBadgeText({ text: '' });
                    }

                },
                error => {
                    this.log.info(error.message);
                    this.error = true;
                }
            );
        }, 2000);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }
}
