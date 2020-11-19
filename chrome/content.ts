import { LostFilm } from './scripts/lost-film';
import { RetreOrg } from './scripts/retre-org';
import { Logger } from '../src/app/share/logger';
import { Runtime } from './scripts/runtime';
import { Storage } from '../src/app/share/storage';


if (location.host.indexOf('lostfilm.tv') !== -1) {
    // log.debug('LostFilm');
    const lostfilm = new LostFilm(new Logger('LostFilm'), new Storage());
    lostfilm.addListenerClick();
}
if (location.host.indexOf("insearch.site") !== -1) {
  const log = new Logger();
  log.name = "content script";
  log.debug("content script Start!");
  const window = new RetreOrg(
    new Runtime(),
    new Storage(),
    new Logger("insearch.site")
  );
}

