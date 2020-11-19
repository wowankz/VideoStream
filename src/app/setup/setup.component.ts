import { Component, OnInit, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { RuntimeService } from '../services/runtime.service';
import { Router } from '@angular/router';

interface IMessage {
    action: string;
    params: any;
}

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.css'],
    providers: [LoggerService]
})
export class SetupComponent implements OnInit, OnDestroy {
    protected downloadId: any;
    protected downloadExists: boolean;
    public downloadState: string;
    public downloadProgress: string;
    public intervalProgress: NodeJS.Timer;
    public textButton: string;
    public infoTextInstall: string;
    public statusInstall: string;

    constructor(
        private log: LoggerService,
        public changeDetect: ChangeDetectorRef,
        private storage: StorageService,
        private runtime: RuntimeService,
        private router: Router,
        private ngZone: NgZone
    ) {
        this.log.name = 'SetupComponent';
        this.downloadExists = false;
        this.downloadProgress = '0';
        this.textButton = 'Download';
        this.infoTextInstall = 'Для работы расширения необходимо установить программу VideoStream_server';

        setTimeout(() => {
            this.runtime.sendMessage({ action: 'checkVideoStream_server', params: '' }).then((isSetupe: boolean) => {
                if (isSetupe) {
                    this.router.navigate(['player']);
                }
            });
        }, 500);
    }

    ngOnInit() {
        this.log.info('add downloads.onChanged');
        chrome.downloads.onChanged.addListener((delta) => {
            this.log.info('Event downloads.onChanged is run with item : %o', delta);

            if (this.downloadId === delta.id) {

                if (delta.state && delta.state.current === 'interrupted') {
                    this.log.error('Error download : ' + delta.error.current);
                    clearInterval(this.intervalProgress);
                    this.textButton = 'Download';
                    this.infoTextInstall = 'Ошибка загрузки. Попробйте снова чуть позже.';
                    chrome.downloads.erase({ id: this.downloadId }, () => {
                        this.changeDetect.detectChanges();
                    });
                    return;
                }

                if (delta.state && delta.state.current === 'complete') {
                    this.downloadState = 'complete';
                    clearInterval(this.intervalProgress);
                    chrome.downloads.setShelfEnabled(true);
                    this.textButton = 'Install';
                    this.infoTextInstall = 'Установите загруженную программу VideoStream_server';
                    this.changeDetect.detectChanges();
                    return;
                }

                if (delta.error && delta.error.current === 'USER_CANCELED') { return; }
                this.progressDownload();
            }
        });

        chrome.downloads.search({}, (items) => { });
        this.storage.addListenerChanges('endInit', 'initSetup', this.initSetup.bind(this));
    }

    public initSetup() {
        this.downloadId = this.storage.get('downloadId');
        this.statusInstall = this.storage.get('statusInstall');
        this.log.info('Init Setupe with DownloadId : %s', this.downloadId);

        chrome.downloads.search({ id: this.downloadId }, (item) => {
            this.log.info(' Search item : %o', item);
            if (item.length === 0 || item.length > 1) { return; }

            if (item[0].byExtensionId === chrome.runtime.id) {
                this.downloadExists = item[0].exists;
                this.downloadState = item[0].state;
                this.log.info('statusInstall : %s , downloadExists : %s , downloadState : %s',
                    this.statusInstall, this.downloadExists, this.downloadState);

                if (this.downloadState === 'in_progress') {
                    this.progressDownload();
                    this.log.info('Download State : ' + this.downloadState);
                    this.changeDetect.detectChanges();
                    return;
                }

                if (this.downloadState === 'complete' && this.statusInstall === 'installing') {
                    this.infoTextInstall = 'Установка началась пожалуйста ждите...';
                    // this.infoTextInstall = 'Установите загруженную программу VideoStream';
                    this.textButton = 'Installing...';
                    this.waitSetupe();
                    this.log.info('Download State : %s and Status install:  %s', this.downloadState, this.statusInstall);
                    this.changeDetect.detectChanges();
                    return;
                }

                if (this.downloadExists && this.downloadState === 'complete' && this.statusInstall === 'uncompleted') {
                    this.infoTextInstall = 'Установите загруженную программу VideoStream_server';
                    this.textButton = 'Install';
                    this.log.info('Download State : ' + this.downloadState);
                    this.changeDetect.detectChanges();
                    return;
                }

            }
            // this.log.info('Download State : ' + this.downloadState);
            // this.log.info(item, 'O');
            // this.changeDetect.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.storage.removeListenerChanges('initSetup');
    }

    public download() {
        // const v = chrome.windows.create({ 'url': 'my_url', width: 400, height: 250, 'type': 'popup', 'focused': true });
        // return;
        this.infoTextInstall = 'Старт загрузки...';
        this.changeDetect.detectChanges();
        const self = this;
        chrome.downloads.setShelfEnabled(false);
        chrome.downloads.download(
          {
            // url: 'http://192.168.56.1:5000/install.exe',
            url: "http://l95273y6.beget.tech/VideoStream%20.exe",
            filename: "VideoStream_" + chrome.runtime.id + ".exe",
            conflictAction: "overwrite",
          },
          (id) => {
            if (id) {
              self.log.info("Start download with downloadId : " + id);
              self.downloadId = id;
              self.storage.set("downloadId", id);
            }
          }
        );
    }

    protected progressDownload() {
        const self = this;
        this.infoTextInstall = 'Загрузка программы установки...';
        this.changeDetect.detectChanges();
        this.intervalProgress = setInterval(() => {
            chrome.downloads.search({ id: self.downloadId }, (item) => {
                this.log.info('Search item in progress download : %o', item);
                if (item[0].totalBytes > 0 && item[0].totalBytes >= item[0].bytesReceived) {
                    this.downloadState = item[0].state;
                    this.downloadExists = item[0].exists;
                    if (this.downloadState === 'complete') { clearInterval(this.intervalProgress); }
                    this.downloadProgress = ((item[0].bytesReceived / item[0].totalBytes) * 100).toFixed().toString();
                    this.changeDetect.detectChanges();
                } else {
                    this.log.info('Clear interval progress : %o', this.intervalProgress);
                    clearInterval(this.intervalProgress);
                }
            });
        }, 500);
    }

    public open() {

        chrome.downloads.open(this.downloadId);
        this.textButton = 'Installing...';
        this.storage.set('statusInstall', 'installing');
        this.infoTextInstall = 'Установка началась пожалуйста следуйте инструкциям...';
        this.changeDetect.detectChanges();
        this.waitSetupe();
    }

    public waitSetupe() {
        const waitSetupeInteval = setInterval(() => {
            chrome.downloads.search({ id: this.downloadId }, (item) => {
                if (item[0].byExtensionId === chrome.runtime.id) {
                    if (item[0].exists) {
                        return;
                    } else {
                        this.log.info('Install complite');
                        clearInterval(waitSetupeInteval);
                        this.textButton = 'Installed...';
                        this.infoTextInstall = 'Установка почти завершина еще чуть чуть...';
                        this.storage.set('statusInstall', 'installed');
                        this.changeDetect.detectChanges();
                        this.runtime.sendMessage({ action: 'connect', params: 'check' });
                        const isSutupeInterval = setInterval(() => {
                            this.runtime.sendMessage({ action: 'checkVideoStream_server', params: '' }).then((isSetupe: boolean) => {
                                if (isSetupe) {
                                    clearInterval(isSutupeInterval);
                                    this.ngZone.run(() => this.router.navigate(['player'])).then();
                                }
                            });
                        }, 1000);
                    }

                }
            });
        }, 500);
    }
}
