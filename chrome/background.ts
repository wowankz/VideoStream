
import { Logger } from '../src/app/share/logger';
import { Storage } from '../src/app/share/storage';
import { IPlayerData } from '../src/app/interfaces/player-data.interface';

interface IMessage {
    action: string;
    params: any;
}
export class BackGround {
    public port: chrome.runtime.Port;
    protected userAgent: string;
    protected winId: number;
    private log: Logger;
    private storage: Storage;
    private umsIsRun: boolean;
    private isSetupeNativApp: boolean;

    constructor() {
        this.storage = new Storage(true);
        this.log = new Logger();
        this.log.name = 'BackGround';
        this.isSetupeNativApp = false;
        this.init();
    }

    /**
     * Init
     */
    public init() {
        this.log.debug('Init background ');
        this.connect('check');
        this.userAgent = window.navigator.userAgent;
        this.umsIsRun = false;
        chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
        chrome.browserAction.setBadgeText({ text: '' });
        chrome.browserAction.setBadgeBackgroundColor({ color: '#2871f1' });
        chrome.downloads.search({}, (items) => { });
        chrome.downloads.onErased.addListener((id) => {
            // this.log.info('downloadId was deleted from history ');
            if (id === this.storage.get('downloadId')) {
                this.log.info('downloadId : ' + id + ' was deleted ');
                this.storage.set('downloadId', null);
            }
        });
    }

    // Получение сообщений внутри приложения
    protected onMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: Function) {
        switch (message.action) {
            case 'connect':
                this.connect(message.params);
                sendResponse();
                break;

            case 'checkVideoStream_server':
                sendResponse(this.isSetupeNativApp);
                break;

            case 'runUms':
                if (!this.umsIsRun) {
                    sendResponse(false);
                    this.runUms();
                } else {
                    sendResponse(true);
                    chrome.browserAction.setBadgeText({ text: 'Search' });
                }
                break;

            case 'play':
                this.log.info('Play : %o', this.storage.get('player'));
                if (!this.port) {
                    sendResponse(false);
                    this.connect();
                } else {
                    sendResponse(true);
                    const mes = {
                        'action': 'play',
                        'params': {
                            url: this.storage.get<IPlayerData>('player').urlTrack,
                            renderer: this.storage.get('currentRenderer'),
                            resource: 'LostFilm'
                        }
                    };
                    this.port.postMessage(mes);
                    // chrome.browserAction.setBadgeText({ text: 'Load...' });
                }
                break;

            case 'restartUms':
                this.restartUms();
                sendResponse(true);
                break;

            default:
                this.log.info('Unknoun action : ' + message.action);
        }

    }

    protected runUms() {
        this.connect();
        const message = { 'action': 'runUms', 'params': this.userAgent };
        this.port.postMessage(message);
        chrome.browserAction.setBadgeText({ text: 'Run server' });
        this.umsIsRun = true;
    }

    protected restartUms() {
        const message = { 'action': 'restart', 'params': this.userAgent };
        this.port.postMessage(message);
        chrome.browserAction.setBadgeText({ text: 'Restart' });
    }

    // Подключение к Nativ приложению
    public connect(test?: string) {
        test === 'check' ? this.log.info('Check connect') : this.log.info('Start connect');

        const hostName = 'video.stream';
        this.port = chrome.runtime.connectNative(hostName);
        this.port.onMessage.addListener(this.onNativeMessage.bind(this));
        this.port.onDisconnect.addListener(this.onDisconnected.bind(this));

        test === 'check' ?
            setTimeout(() => {
                this.isSetupeNativApp ? this.disconnectPort() : this.empty();
            }, 4000) : this.empty();
    }

    // Получение сообщения от native приложения
    protected onNativeMessage(message: IMessage) {
        const params = this.convertHexToStr(message.params);
        switch (message.action) {
            case 'log':
                const paramsObj = JSON.parse(params);
                if (paramsObj.modul === 'ums') {
                    (console as any)[paramsObj.type](paramsObj.message.replace(/\"/g, '\''));
                    break;
                }
                if (paramsObj.modul === 'ChromeHost') {
                    const name = this.log.name;
                    this.log.name = paramsObj.modul;
                    switch (paramsObj.type) {
                        case 'info':
                            this.log.info(paramsObj.message.replace(/\"/g, '\''));
                            break;

                        case 'error':
                            this.log.error(paramsObj.message.replace(/\"/g, '\''));
                            break;

                        case 'warn':
                            this.log.warn(paramsObj.message.replace(/\"/g, '\''));
                            break;

                        default:

                            break;
                    }
                    // this.log.info(paramsObj.message.replace(/\"/g, '\''));
                    this.log.name = name;
                    break;
                }

                this.log.info(paramsObj.message.replace(/\"/g, '\''));
                break;

            case 'addWebAddress':
                this.log.info('umsWebUrl was finded and set storage');
                this.storage.set('umsWebUrl', null);
                this.storage.set('umsWebUrl', params);
                chrome.browserAction.setBadgeText({ text: 'Search' });
                break;

            case 'downloaded':
                const d = (100 / 5 * Number(params)).toFixed();
                if (+d >= 100) {
                    //  chrome.storage.local.set({ 'Downloaded': "1" });
                    chrome.browserAction.setBadgeText({ text: '100%' });
                    setTimeout(() => { chrome.browserAction.setBadgeText({ text: 'Play' }); }, 2000);
                } else {
                    chrome.browserAction.setBadgeText({ text: d + '%' });
                }
                break;

            case 'started':
                this.log.info('VideoStream is started');
                this.isSetupeNativApp = true;
                break;

            case 'umsIsRun':
                this.umsIsRun = params === 'true' ? true : false;
                this.log.info('Ums server run state : %s', params);
                break;

            default:
                this.log.warn('Unknoun action : ' + message.action);
                break;
        }
    }

    protected convertHexToStr(data: any): string {
        let hex = data;
        hex = hex.split(' ');
        const len = hex.length;
        if (len === 0) { return; }
        let txt = '';
        for (let i = 0; i < len; i++) {
            const h = hex[i];
            const code = parseInt(h, 16);
            const t = String.fromCharCode(code);
            txt += t;
        }
        return txt;
    }

    protected disconnectPort() {
        if (this.port) {
            const message = { 'action': 'exit', 'params': '' };
            this.port.postMessage(message);
            // this.port.disconnect();
            // this.port = null;
            this.umsIsRun = false;
            this.log.info('disconect VideoStream');
        }
    }

    // Разрыв соединения с приложением
    protected onDisconnected() {
        this.isSetupeNativApp = false;
        this.umsIsRun = false;
        this.port = null;
        switch (chrome.runtime.lastError.message) {
            case 'Native host has exited.':
                this.log.info('Native host has exited.');
                break;

            // case '':

            //     break;

            default:
                this.log.error('Failed to connect: %o', chrome.runtime.lastError);
                break;
        }


        // chrome.runtime.reload()

        // clearInterval(IntevalGetPosition);
        // chrome.storage.local.set({ 'Duration': "0" });
        // chrome.storage.local.set({ 'Position': "0" });
        // chrome.storage.local.set({ 'listDevice': Array() });
        // chrome.storage.local.set({ 'nameVideo': 'No Name Video' });
    }

    protected empty() { }

}
// tslint:disable-next-line:prefer-const
const Bg = new BackGround();
