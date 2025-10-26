/* Import common scripts ****************** */
import setVariables from './setVariables';

/* Import main components ***************** */
import preloader from './components/preloader';
import { modal } from './components/modal.js';
import setTabs from './components/tabs';
import roulette from './components/roulette';
import countDown from './components/countDown';

/* Initialization common scripts ********** */
setVariables();

/* Initialization main components ************* */
preloader();
modal.init();
setTabs();
roulette();
countDown();
