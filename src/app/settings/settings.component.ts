import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { RuntimeService } from '../services/runtime.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [LoggerService]
})
export class SettingsComponent implements OnInit, OnDestroy {
    protected resetIcon: boolean;
    constructor(
        private log: LoggerService,
        public changeDetect: ChangeDetectorRef,
        private storage: StorageService,
        private runtime: RuntimeService,
        private router: Router) {
        this.log.name = 'SettingsComponent';
        this.resetIcon = false;
    }

    ngOnInit() {
        this.runtime.sendMessage({ action: 'checkVideoStream_server', params: '' }).then((isSetupe: boolean) => {
            if (!isSetupe) {
                this.router.navigate(['setup']);
            }
        });

        this.storage.addListenerChanges('change', 'endReset', this.endReset.bind(this));
    }

    protected async reset() {
        if (this.resetIcon) { return; }
        this.log.info('Start reset');
        const start = await this.runtime.sendMessage({ action: 'restartUms', params: '' });
        this.resetIcon = start;

    }

    protected endReset(...arg: any) {
        this.log.info('End reset arg : %o', arg);
        this.log.info(arg[0] === 'umsWebUrl');
        if (arg[0] === 'umsWebUrl') {
            this.log.info('server was run');
            this.resetIcon = false;
            this.changeDetect.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.storage.removeListenerChanges('endReset');

    }
}
