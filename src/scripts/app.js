/* Import common scripts ****************** */
import setVariables from './setVariables';

/* Import main components ***************** */
import { modal } from './components/modal.js';
import setAccordion from './components/accordion';
import initFancybox from './components/fancybox';
import setTabs from './components/tabs';
import roulette from './components/roulette';
import countDown from './components/countDown';

/* Initialization common scripts ********** */
setVariables();

/* Initialization main components ************* */
modal.init();
setAccordion();
initFancybox();
setTabs();
roulette();
countDown();
