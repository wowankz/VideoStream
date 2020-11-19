import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

interface IMessage {
    action: string ;
    params: any ;
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  constructor(private log: LoggerService) {
      this.log.name = 'RuntimeService';
   }

   /**
     * Отправка сообшения и получение ответа
     */
    public sendMessage(message: IMessage): Promise<any> {
        this.log.info('Send message : ' + JSON.stringify(message));
        return new Promise((resolve, reject) => {
            // Send message and look at response.error
            chrome.runtime.sendMessage(message, response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else if (response && response.error) {
                    reject(response);
                } else {
                    resolve(response);
                }
            });
        });

    }
}
