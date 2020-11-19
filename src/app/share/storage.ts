import { IPlayerData } from '../interfaces/player-data.interface';
import { IStorage } from '../interfaces/storage.interface';
import { Logger } from '../share/logger';

const dataStorage: IStorage = {
    player: {
        nameTrack: 'Name of video track',
        urlTrack: null,
        descTrack: null,
        qualityTrack: null,
        poster: '/assets/poster_default.png'
    },
    currentRenderer: null,
    umsWebUrl: null,
    urlImage: null,
    downloadId: null,
    statusInstall: 'uncompleted'
};

export class Storage {
    private _storage: IStorage;
    protected log: Logger;
    protected events: Map<string, Map<string, Function>>;

    constructor(private firstRun: boolean = false) {
        this.log = new Logger();
        this.log.name = 'Storage';
        this._storage = dataStorage;
        this.events = new Map();
        this.init();
    }

    public init() {
        try {
            this.log.debug('Init storage');
            if (this.firstRun) {
                this.log.info('First run storage');
                this.set('umsWebUrl', '');
            }
            chrome.storage.onChanged.addListener(this.onChanged.bind(this));
            chrome.storage.local.get(null, async (result) => {
                for (const key in this._storage) {
                    if (!result[key]) {
                        await this.set(key, this._storage[key]);
                    } else {
                        this._storage[key] = result[key];
                        this.log.info('key : %s data : %o', key, result[key]);
                    }
                }
                this.endInit();
            });
        } catch (err) {
            this.log.error('error :%o', err);
        }
    }
    protected endInit() {
        this.log.info('End init storage');
        this.runListenersOfEvent('endInit');
    }

    public get<T>(name: string): T {
        return this._storage[name];
    }

    public set(name: string, data: any) {
        this.log.info('Storage was set >> %s : %o', name, data);
        try {
            return new Promise((resolve, reject) => {
                if (!(name in this._storage)) { this._storage[name] = data; }
                const v = <any>{};
                v[name] = data;
                chrome.storage.local.set(v, () => {
                    resolve();
                });
            });
        } catch (err) {
            this.log.error('Storage wasn\'t saved [%s : $o]  error : %s ', name, data, err.message);
        }
    }

    public clear() {
        this.log.debug('Clear storage');
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                this.log.info('Storage wasn\'t cleared  error : %o', chrome.runtime.lastError);
                return;
            }
            this.log.info('Storage was cleared');
            // this.init();
        });
    }

    public onChanged(changes: { [key: string]: chrome.storage.StorageChange; }, areaName: string) {
        for (const key in changes) {
            if (key in this._storage) {
                this._storage[key] = changes[key].newValue;
                this.log.info('Storage was updated : %s : %o', key, changes[key].newValue);
                this.runListenersOfEvent('change', key, changes[key].newValue);

            } else {
                this._storage[key] = changes[key].newValue;
                this.log.info('Storage was added : %s : %o', key, changes[key].newValue);
                this.runListenersOfEvent('change', key, changes[key].newValue);
            }

        }
    }

    protected runListenersOfEvent(event: string, ...arg: any) {
        const listeners = this.events.get(event);
        if (listeners) {
            this.log.info('Run listeners of event : %s', event);
            for (const [name, value] of listeners) {
                this.log.info(`Run listener name : ${name}`);
                value(...arg);
            }
        }
    }

    public removeListenerChanges(nameListener: string) {
        for (const value of this.events.values()) {
            if (value.has(nameListener)) {
                value.delete(nameListener);
            }
        }
        this.log.info('Listener ( ' + nameListener + ' ) was deleted');
    }

    public addListenerChanges(event: string, nameListener: string, listener: Function) {
        this.log.info('Add listener with name : %s on event : %s', nameListener, event);
        this.events.set(event, new Map().set(nameListener, listener));
        // this.listeners[change][nameListener] = listener;
    }
}
