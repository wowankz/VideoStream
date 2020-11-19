import { Runtime } from './runtime';
import { IPlayerData } from '../../src/app/interfaces/player-data.interface';
import { Storage } from '../../src/app/share/storage';
import { Logger } from '../../src/app/share/logger';

export class RetreOrg {
    constructor(public runtime: Runtime, public storage: Storage, private log: Logger) {
        this.addElementLink('https://use.fontawesome.com/releases/v5.3.1/css/all.css');
        this.addElementLink('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
        this.addIconPlay();
        this.addModal();
    }

    protected addElementLink(href: string, rel: string = 'stylesheet', element: HTMLElement = document.body) {
        const link = document.createElement('link');
        link.href = href;
        link.rel = rel;
        element.appendChild(link);
    }

    protected addModal() {
        const modal = document.createElement('div');
        modal.setAttribute('id', 'reModal');
        modal.setAttribute('class', 'modal fade bd-example-modal-sm');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'mySmallModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-sm"><div class="modal-content "></div></div>`;
        document.body.appendChild(modal);
    }

    protected addIconPlay() {
        const els = document.getElementsByClassName('inner-box--item');
        for (const i in els) {
            if (+i >= 0) {
                const br = document.createElement('br');
                const btnIcon = document.createElement('span');
                btnIcon.setAttribute('class', 'btn btn-outline-danger pt-0 pb-0');
                btnIcon.setAttribute('tooltip', 'Play to TV ');
                btnIcon.setAttribute('tooltip-position', 'right');
                btnIcon.innerHTML = '<i class="fas fa-play" ></i>';
                btnIcon.onclick = async () => {
                    await this.storage.set('player', {
                        'urlTrack': els[i].querySelector('a').href,
                        'nameTrack': els[i].querySelector('a').text,
                        'descTrack': els[i].querySelector('[class~=inner-box--desc]').innerHTML,
                        'qualityTrack': els[i].querySelector('[class~=inner-box--label]').textContent,
                        'poster': this.storage.get('urlImage')
                    });

                    const umsIsRun = await this.runtime.sendMessage({
                        action: 'runUms',
                        params: ''
                    });

                    if (umsIsRun) {
                        if (this.storage.get('umsWebUrl') !== '') {
                            const self = this;
                            $('#reModal').on('show.bs.modal', function (event) {
                                const modal = $(this);
                                self.searchDevices(modal, 'umsWebUrl');

                            });
                            $('#reModal').modal('show');
                        } else {
                            const self = this;
                            await this.restartUms();
                            $('#reModal').on('show.bs.modal', function (event) {
                                const modal = $(this);
                                self.storage.addListenerChanges('change', 'searchDevices', self.searchDevices.bind(self, modal));
                                modal.find('.modal-content').html(`<div class="progress-bar bg-my-gray
                                                                    progress-bar-striped progress-bar-animated"
                                                                    role="progressbar" aria-valuenow="100"
                                                                    aria-valuemin="0" aria-valuemax="100"
                                                                    style="width: 100%; height: 3rem"> Restart Server</div>` );

                            });
                            $('#reModal').modal('show');
                        }

                    } else {
                        const self = this;
                        $('#reModal').on('show.bs.modal', function (event) {
                            const modal = $(this);
                            self.storage.addListenerChanges('change', 'searchDevices', self.searchDevices.bind(self, modal));
                            modal.find('.modal-content').html(`
                            <div class="progress-bar bg-my-gray
                                progress-bar-striped progress-bar-animated"
                                role="progressbar" aria-valuenow="100"
                                aria-valuemin="0" aria-valuemax="100"
                                style="width: 100%; height: 4.2rem">
                                <figure  class="figure m-0">
                                    <i class="fas fa-spinner fa-pulse"></i>
                                    <figcaption style="font-size:1.2rem"
                                      class="figure-caption text-light text-shadow font-weight-bold">Run Server</figcaption>
                                </figure>
                            </div>` );
                            // modal.find('.modal-content').html(`
                            // <figure  class="figure m-0">
                            //     <img height="90rem" src="${chrome.extension.getURL('/assets/Run_server.png')}">
                            //     <figcaption style="font-size:0.9rem"  class="figure-caption text-shadow">Run Server</figcaption>
                            // </figure></div>` );
                        });
                        $('#reModal').modal('show');
                    }
                };
                const label = els[i].querySelector('div');
                label.appendChild(br);
                label.appendChild(btnIcon);
                label.setAttribute('style', 'text-align:center;width:3rem');
            }
        }
    }

    protected async restartUms() {
        const port = await this.runtime.sendMessage({
            action: 'restartUms',
            params: ''
        });
        return port;
    }

    protected checkDevice(event: any) {
        this.log.info(event, 'O');
        event.currentTarget.className = 'text-success icon-check';
        event.target.className = 'far fa-check-circle';
        this.storage.set('currentRenderer', event.currentTarget.id);
        setTimeout(async () => {

            const port = await this.runtime.sendMessage({
                action: 'play',
                params: ''
            });

            if (port) {
                $('#reModal').find('.modal-content').html(`<div class="progress-bar bg-my-gray
                            progress-bar-striped progress-bar-animated"
                            role="progressbar" aria-valuenow="100"
                            aria-valuemin="0" aria-valuemax="100" style="width: 100%; height: 3rem"> Play video </div>`);

                setTimeout(() => {
                    window.close();
                }, 1500);

            }
        }, 1000);

    }

    protected searchDevices(modal: JQuery<HTMLElement>, key: string) {
        this.log.info('key arg : %o', key);
        if (key === 'umsWebUrl') {
            modal.find('.modal-content').html(`
        <div class="card text-center " style="width: 50vw">
                <h5 class="card-header bg-my-gray  border-0 pb-2 pt-2"><strong class="text-shadow">Search devices</strong></h5>
                <div class="card-body">
                    <div class="d-flex flex-column w-100 " >
                        <figure  class="figure m-0">
                            <img height="90rem" src="${chrome.extension.getURL('/assets/search.gif')}">
                            <figcaption style="font-size:0.9rem"  class="figure-caption text-shadow">Search devices</figcaption>
                        </figure></div>
                    </div>
                </div>
            </div>
        ` );
            // modal.find('.modal-content').html(`<div class="progress-bar bg-info
            //             progress-bar-striped progress-bar-animated"
            //             role="progressbar" aria-valuenow="100"
            //             aria-valuemin="0" aria-valuemax="100" style="width: 100%; height: 3rem"> Search devices </div>` );
            const interval = setInterval(async () => {
                this.log.info('Fetch url : ' + this.storage.get('umsWebUrl') + '/bump/renderers');
                const res = await fetch(this.storage.get('umsWebUrl') + '/bump/renderers');
                const resObj = await res.json();
                const arr = resObj['renderers'];

                if (!arr) { return; }

                let devicesList = '';
                const currentRenderer = this.storage.get<string>('currentRenderer');
                for (const val of arr) {
                    const tr = (val[2] !== currentRenderer);
                    devicesList += `<div class="border rounded w-100 bg-light d-flex flex-row mb-1 " style="cursor: pointer" >
                                    <div class="p-2 bd-highlight">
                                        <img src="${chrome.extension.getURL('/assets/Samsung-HU9000@2x.png')}" height="60rem">
                                    </div>
                                    <div class="p-2 flex-grow-1 bd-highlight align-self-center  ">
                                        <p class="m-0 " style="word-break: break-all;font-size:1rem" >${val[0]}</p>
                                    </div>
                                    <div class="p-2 ml-auto bd-highlight align-self-center ">
                                        <div style="font-size: 2rem;"
                                        class="${tr ? 'text-muted' : 'text-success'} icon-check" id="${val[2]}" >
                                            <i class="${tr ? 'far fa-circle' : 'far fa-check-circle'}"></i>
                                        </div>
                                    </div>
                                </div>`;
                    modal.find('.modal-content').html(`
                    <div class="card text-center " style="width: 50vw">
                        <h5 class="card-header bg-my-gray  border-0 pb-2 pt-2"><strong class="text-shadow">Choose device</strong></h5>
                        <div class="card-body">
                            <div class="d-flex flex-column w-100 " >
                                ${devicesList}
                            </div>
                        </div>
                    </div>` );
                    if (!tr) {
                        this.log.info('start play video on renderer : ' + val[2]);
                        clearInterval(interval);

                        const port = await this.runtime.sendMessage({
                            action: 'play',
                            params: ''
                        });

                        if (port) {
                            setTimeout(() => {
                                modal.find('.modal-content').html(`<div class="progress-bar bg-my-gray
                            progress-bar-striped progress-bar-animated"
                            role="progressbar" aria-valuenow="100"
                            aria-valuemin="0" aria-valuemax="100" style="width: 100%; height: 3rem"> Play video </div>`);
                                setTimeout(() => {
                                    window.close();
                                }, 1500);
                            }, 1500);

                        }
                        return;
                    }

                }
                clearInterval(interval);

                modal.find('.icon-check').on('click', this.checkDevice.bind(this));

            }, 1500);
        }
    }
}
