import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { IPlayerData } from '../interfaces/player-data.interface';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { RuntimeService } from '../services/runtime.service';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css'],
    providers: [LoggerService]
})
export class PlayerComponent implements OnInit, OnDestroy {
    protected nameTrack: string;
    public quality: string;
    public labelQuality: string;
    public urlImg: string;
    public position: string;
    public duration: string;
    public mute: boolean;
    public levelVolume: number;
    protected intervalGetStatus: any;
    public progressTime: number;
    public playback: number;
    constructor(
        private log: LoggerService,
        public storage: StorageService,
        public changeDetect: ChangeDetectorRef,
        private httpService: HttpService,
        private router: Router,
        private runtime: RuntimeService) {

        this.log.name = 'PlayerComponent';
        this.nameTrack = 'Name of video track';
        this.quality = '';
        this.urlImg = '/assets/poster_default.png';
        this.position = '00:00:00';
        this.duration = '00:00:00';
        this.mute = false;
        this.levelVolume = 0;
        this.progressTime = 0;
        this.playback = 1;
        this.runtime.sendMessage({ action: 'checkVideoStream_server', params: '' }).then((isSetupe: boolean) => {
            if (!isSetupe) {
                this.storage.set('statusInstall', 'uncompleted');
                this.router.navigate(['setup']);
                return;
            }
            this.storage.set('statusInstall', 'installed');
        });
    }

    ngOnInit() {
        // this.storage.addListenerChanges('change', 'refresh', this.refresh.bind(this));
        this.storage.addListenerChanges('endInit', 'refresh', this.refresh.bind(this));
        this.refresh();
        this.getState();

    }

    ngOnDestroy(): void {
        this.storage.removeListenerChanges('refresh');
        clearInterval(this.intervalGetStatus);
    }

    public refresh(...arg: any) {
        this.log.info('Refresh player ');
        const img = new Image();
        img.src = this.storage.get<IPlayerData>('player').poster;
        let quality = this.storage.get<IPlayerData>('player').qualityTrack;
        quality = quality === null ? '---' : quality.trim();
        this.quality = (quality === '1080') ? '1080p' : (quality === 'MP4' ? '720p' : (quality === 'SD') ? '576p' : '');
        this.labelQuality = (quality === '1080') ? 'FHD' : (quality === 'MP4' ? 'HD' : (quality === 'SD') ? quality : '');
        this.nameTrack = this.storage.get<IPlayerData>('player').nameTrack;
        img.onload = () => { this.urlImg = this.storage.get<IPlayerData>('player').poster; };
        img.onerror = () => { this.urlImg = '/assets/poster_default.png'; };
        this.log.info('poster URL : ' + this.urlImg);
        this.changeDetect.detectChanges();
    }

    protected formatTime(time) {
        let tm = '';
        switch (time.length) {
            case 4:
                tm = '00:0' + time;
                break;
            case 5:
                tm = '00:' + time;
                break;
            case 7:
                tm = '0' + time;
                break;
            default:
                tm = time;
                break;
        }
        return tm;
    }

    protected getState() {
        this.intervalGetStatus = setInterval(() => {
            if (this.storage.get('umsWebUrl') === null || this.storage.get('currentRenderer') === null) { return; }
            this.httpService.getState().subscribe(
                data => {
                    if (!data) { return; }
                    this.log.info('Response state data : %o', data);
                    this.position = this.formatTime(data.state.position);
                    this.duration = this.formatTime(data.state.duration);
                    this.mute = data.state.mute === 'true' ? true : false;
                    this.levelVolume = data.state.volume;
                    this.playback = Number(data.state.playback);
                    if (this.playback === 1) { chrome.browserAction.setBadgeText({ text: 'Play' }); }
                    const procent = (1000 / Number(data.state.duration.replace(/:/g, '.'))
                        * Number(data.state.position.replace(/:/g, '.')));
                    this.progressTime = !procent ? 0 : procent;

                },
                error => {
                    this.log.error(error.message);
                }
            );
        }, 1000);
    }
}
