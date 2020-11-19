import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { LoggerService } from '../services/logger.service';
import { HttpService } from '../services/http.service';
// import { LoggerService } from '../../../services/logger.service';
// import { PlayerService } from '../../../services/player.service';

@Component({
    selector: 'app-volume-control',
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.css'],
    providers: [LoggerService]
})
export class VolumeControlComponent implements OnInit {
    @Input() muteState: boolean;
    @Input() levelVolume: number;
    protected volumeIcon: string[];
    constructor(private httpService: HttpService, private log: LoggerService, private storage: StorageService) {
    }

    ngOnInit() {
        this.log.name = 'VolumeControlComponent';
        this.log.info('Component started');
        this.volumeIcon = ['fas', 'volume-off'];
        this.levelVolume = 0;
    }
    protected change(e) {
        this.log.info('Set volume : ' + e.target.value);
        this.input(e);
        this.httpService.setVolume(e.target.value).subscribe(
            data => {
                this.log.info(data, 'O');
            },
            error => {
                this.log.info(error.message);
            }
        );

    }

    protected input(e) {
        const val = e.target.value;
        if (val > 30) { this.volumeIcon = ['fas', 'volume-down']; }
        if (val > 60) { this.volumeIcon = ['fas', 'volume-up']; }
        if (val < 30) { this.volumeIcon = ['fas', 'volume-off']; }
        e.target.style.background = '-webkit-linear-gradient(left ,rgb(134, 152, 183) 0%,rgb(134, 152, 183) '
            + val + '%,rgb(91, 107, 137) ' + val + '%, rgb(91, 107, 137) 100%)';

    }

    protected setMute() {
        this.muteState = !this.muteState;
        this.httpService.mute().subscribe(
            data => {
                this.log.info('Mute : ' + JSON.stringify(data));
            },
            error => {
                this.log.info(error.message);
            }
        );
    }
}
