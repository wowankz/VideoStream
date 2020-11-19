import { Runtime } from './runtime';
import { Logger } from '../../src/app/share/logger';
import { Storage } from '../../src/app/share/storage';
const runtime = new Runtime();

export class LostFilm {
    constructor(private log: Logger, private storage: Storage) { }

    public addListenerClick() {
        document.addEventListener('click', async (event) => {
            const el: any = event.target;
            let onclickValue;
            if (el.attributes.onclick !== undefined) {
                onclickValue = el.attributes.onclick.value;
                if (onclickValue.indexOf('PlayEpisode') + 1) {
                    const episode = onclickValue.replace(/\D+/ig, '');
                    if (episode % 1000 === 999) { return; }
                   const series =  parseInt(episode.slice(0, 3), 10);
                    const season = parseInt(episode.slice(3, 6), 10) ;
                    this.log.info(`http://static.lostfilm.tv/Images/${series}/Posters/shmoster_s${season}.jpg`);
                    this.storage.set('urlImage', `http://static.lostfilm.tv/Images/${series}/Posters/shmoster_s${season}.jpg`);
                    // event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
                    // const res = await runtime.sendMessage({
                    //     action: 'winCreate',
                    //     params: {
                    //         url: window.location.protocol + '//' + window.location.hostname + '/v_search.php?a=' + episode,
                    //         bw: screen.width, bh: screen.height, ww: 850, wh: 600
                    //     }
                    // });
                    // console.log(res);
                }
            }
        }, true);
    }
}

