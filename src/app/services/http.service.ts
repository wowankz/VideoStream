import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { IDevice } from '../interfaces/device.interface';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient, private log: LoggerService, private storage: StorageService) {
        this.log.name = 'HttpService';
    }
    getRenderers(): Observable<IDevice[]> {
        this.log.info('Get renderers from : %s', this.storage.get('umsWebUrl') + '/bump/renderers');
        return this.http.get(this.storage.get('umsWebUrl') + '/bump/renderers')

            .pipe(map(data => {
                const arr: [] = data['renderers'];
                // data = arr.values();
                const renderers: IDevice[] = [];
                for (const value of arr) {
                    renderers.push({ name: value[0], marked: value[1], uuid: value[2] });
                }
                return renderers;
            }),
                catchError(err => {
                    // this.log.warn(err, 'O');
                    return throwError(err);
                })
            );
    }

    setVolume(val: string): Observable<any> {
        this.log.info(this.storage.get('umsWebUrl') + '/bump/setvolume/' + this.storage.get('currentRenderer') + '?vol=' + val);
        return this.http.get(this.storage.get('umsWebUrl') + '/bump/setvolume/' + this.storage.get('currentRenderer') + '?vol=' + val)
            .pipe(map(data => {
                // const arr: [] = data['renderers'];
                // data = arr.values();
                // const renderers: IDevice[] = [];
                // for (const value of arr) {
                //     renderers.push({ name: value[0], marked: value[1], uuid: value[2] });
                // }
                return data;
            }),
                catchError(err => {
                    // this.log.warn(err, 'O');
                    return throwError(err);
                })
            );
    }

    getState(): Observable<any> {
        this.log.info('Get State url : %s', this.storage.get('umsWebUrl') + '/bump/status/' + this.storage.get('currentRenderer'));
        return this.http.get(this.storage.get('umsWebUrl') + '/bump/status/' + this.storage.get('currentRenderer'))
            .pipe(map(data => {
                return data;
            }),
                catchError(err => {
                    // this.log.warn(err, 'O');
                    return throwError(err);
                })
            );
    }

    mute(): Observable<any> {
        this.log.info('SET/UNSET Mute');
        return this.http.get(this.storage.get('umsWebUrl') + '/bump/mute/' + this.storage.get('currentRenderer'))
            .pipe(map(data => {
                return data;
            }),
                catchError(err => {
                    // this.log.warn(err, 'O');
                    return throwError(err);
                })
            );
    }

    stop(): Observable<any> {
        this.log.info('SET/UNSET Mute');
        return this.http.get(this.storage.get('umsWebUrl') + '/bump/stop/' + this.storage.get('currentRenderer'))
            .pipe(map(data => {
                return data;
            }),
                catchError(err => {
                    // this.log.warn(err, 'O');
                    return throwError(err);
                })
            );
    }

    backward(): Observable<any> {
        this.log.info('backward');
        return this.http.get(this.storage.get('umsWebUrl') + '/bump/rew/' + this.storage.get('currentRenderer'))
            .pipe(map(data => {
                return data;
            }),
                catchError(err => {
                    // this.log.warn(err, 'O');
                    return throwError(err);
                })
            );
    }

    forward(): Observable<any> {
        this.log.info('forward');
        return this.http.get(this.storage.get('umsWebUrl') + '/bump/fwd/' + this.storage.get('currentRenderer'))
            .pipe(map(data => {
                return data;
            }),
                catchError(err => {
                    // this.log.warn(err, 'O');
                    return throwError(err);
                })
            );
    }
}
