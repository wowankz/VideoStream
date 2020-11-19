interface IMessage {
    action: string ;
    params: any ;
}

export class Runtime {
    constructor() {

    }

    /**
     * Отправка сообшения и получение ответа
     */
    public sendMessage(message: IMessage): Promise<any> {
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
