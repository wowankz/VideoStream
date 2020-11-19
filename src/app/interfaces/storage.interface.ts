import { IPlayerData } from './player-data.interface';

export interface IStorage {
    player: IPlayerData;
    currentRenderer: string;
    umsWebUrl: string;
    urlImage: string;
    downloadId: string;
    statusInstall: string;
    [key: string]: any;
}

export type ListenerChange = (changes: { [key: string]: chrome.storage.StorageChange; }, areaName: string) => void;
