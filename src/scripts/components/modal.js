/*
	  --------
	|   MODAL  |
	  --------

	* Basic Classes and attributes:
		* data-modal-open - attribute for opening a modal window, the value specifies the modal window selector
		* .js-modal - modal window
		* .js-modal-window - visible part of the modal window
		* .js-modal-close - attribute to close the modal window

	* Modal window initialization
		modal.init()

	* Callback functions when opening and closing a modal window
		modal.beforeOpen(callback) - Callback function before opening modal window
		modal.afterOpen(callback) - Callback function after opening modal window
		modal.beforeClose(callback) - Callback function before modal closes
		modal.afterClose(callback) - Callback function after closing the modal window
*/

const html = document.documentElement;
const body = document.querySelector('body');
const timeout = 300;
let modalSelectorOpen = null;
let modal = {};
let unlock = true;
let isOpen = false;

const focusElements = [
	'a[href]',
	'area[href]',
	'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
	'select:not([disabled]):not([aria-hidden])',
	'textarea:not([disabled]):not([aria-hidden])',
	'button:not([disabled]):not([aria-hidden])',
	'iframe',
	'object',
	'embed',
	'[contenteditable]',
	'[tabindex]:not([tabindex^="-"])'
];

const bodyLock = () => {
	const scrollbarCompensate = `${window.innerWidth - document.body.offsetWidth}px`;
	html.style.setProperty('--modal-scrollbar-compensate', scrollbarCompensate);
	body.classList.add('is-active-modal');

	unlock = false;
	setTimeout(() => {
		unlock = true;
	}, timeout);
};

const bodyUnlock = () => {
	unlock = false;

	setTimeout(() => {
		html.style.removeProperty('--modal-scrollbar-compensate');
		body.classList.remove('is-active-modal');

		unlock = true;
	}, timeout);
};

const openModal = (currentModal, isDoubleModal = false) => {
	if (currentModal && !isOpen && unlock || isDoubleModal) {
		const modalWindow = currentModal.querySelector('.js-modal-window');

		if (!isDoubleModal) {
			modal.beforeOpen();
		}

		currentModal.setAttribute('aria-hidden', false);
		currentModal.classList.add('is-visible');

		setTimeout(() => {
			currentModal.classList.add('is-active');
		}, 10);

		isOpen = true;

		if (!isDoubleModal) {
			bodyLock();

			setTimeout(() => {
				modal.afterOpen();

			}, timeout);
		}
	}
};

const closeModal = (activeModal, isDoubleModal = false) => {
	if (isOpen && unlock && activeModal) {
		modal.beforeClose();

		activeModal.setAttribute('aria-hidden', true);
		activeModal.classList.remove('is-active');

		if (!isDoubleModal) {
			bodyUnlock();
		}

		setTimeout(() => {
			activeModal.scrollTop = 0;
			activeModal.querySelector('.js-modal-window').scrollTop = 0;
			activeModal.classList.remove('is-visible');

			if (!isDoubleModal) {
				isOpen = false;

				if (modalSelectorOpen) {
					modalSelectorOpen.focus();
				}

				modal.afterClose();
			}
		}, timeout);
	}
};

const callback = (callbackCurrent) => {
	if (callbackCurrent && typeof callbackCurrent === 'function') {
		callbackCurrent();
	}
};

const focusCatcher = (e, modal) => {
    // Находим все элементы на которые можно сфокусироваться
    const nodes = modal.querySelectorAll(focusElements);

    //преобразуем в массив
    const nodesArray = Array.prototype.slice.call(nodes);

    //если фокуса нет в окне, то вставляем фокус на первый элемент
    if (!modal.contains(document.activeElement)) {
        nodesArray[0].focus();
        e.preventDefault();
    } else {
        const focusedItemIndex = nodesArray.indexOf(document.activeElement);

        if (e.shiftKey && focusedItemIndex === 0) {
            //перенос фокуса на последний элемент
            nodesArray[nodesArray.length - 1].focus();
            e.preventDefault();
        }

        if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
            //перенос фокуса на первый элемент
            nodesArray[0].focus();
            e.preventDefault();
        }
    }
};

modal.beforeOpen = (callbackCurrent) => {
	callback(callbackCurrent);
};
modal.beforeClose = (callbackCurrent) => {
	callback(callbackCurrent);
};
modal.afterOpen = (callbackCurrent) => {
	callback(callbackCurrent);
};
modal.afterClose = (callbackCurrent) => {
	callback(callbackCurrent);
};

modal.init = () => {
	document.addEventListener('click', (e) => {
		const target = e.target;

		if (target.closest('[data-modal-open]') || target.hasAttribute('data-modal-open')) {
			const modalSelector = target.getAttribute('data-modal-open') || target.closest('[data-modal-open]').getAttribute('data-modal-open');
			const currentModal = modalSelector ? document.querySelector(modalSelector) : '';
			e.preventDefault();

			if (isOpen) {
				const activeModal = document.querySelector('.js-modal.is-active');

				if (activeModal !== currentModal) {
					closeModal(activeModal, true);
					openModal(currentModal, true);
				}
			} else {
				modalSelectorOpen = target.hasAttribute('data-modal-open') ? target :
				target.closest('[data-modal-open]');

				openModal(currentModal);
			}
		} else if (isOpen && (target.closest('.js-modal-close')
        || target.classList.contains('js-modal-close')
        || !target.closest('.js-modal-window')
        && !target.classList.contains('js-modal-window'))
		) {
			const currentModal = target.classList.contains('js-modal') ? target : target.closest('.js-modal') || '';
			e.preventDefault();

			closeModal(currentModal);
		}
	});

	document.addEventListener('keydown', (e) => {
		const modalActive = document.querySelector('.js-modal.is-active');

		if ((e.code === 'Escape' || e.key === 'Escape') && isOpen) {
			closeModal(modalActive);
			return;
		}

		if ((e.code === 'Tab' || e.key === 'Tab') && isOpen && modalActive) {
			focusCatcher(e, modalActive);
			return;
		}
	});
};

document.documentElement.openModal = modal.open = (selector, callbackCurrent) => {
	const currentModal = selector && typeof selector === 'string' ? document.querySelector(selector) : '';

    modalSelectorOpen = null;

	callback(callbackCurrent);

    if (isOpen) {
        const activeModal = document.querySelector('.js-modal.is-active');
        console.log(activeModal !== currentModal)

        if (activeModal) {
            closeModal(activeModal, true);

			if (activeModal !== currentModal) {
				openModal(currentModal, true);
			}
        }
    } else {
        openModal(currentModal);
    }
};

document.documentElement.closeModal = modal.close = (selector) => {
    const currentModal = selector && typeof selector === 'string' ? document.querySelector(selector) : '';

    if (currentModal) {
        closeModal(currentModal);
    }
};

export {modal};
