/*
	  --------
	|   TABS   |
	  --------

	* Basic Selectors:
		* .js-tabs - general wrapper for tabs
		* .js-tabs-menu - tab menu
		* .js-tabs-item - menu item
            ** [data-tabs-id] - attribute to set tab id
                *** The attribute value must be unique inside the .js-tabs wrapper
                *** Additionally, you can specify the data-value attribute with the value of the tab name
                    (required to change the text of the button that opens the menu list)
		* .js-tabs-pane - drop-down panel
            ** [data-tabs-pane]- attribute to set tab id
			    *** The value of the attribute must match the value of the data-tabs-id attribute in the .js-tabs-item selector

	* Additional attributes:
		* .js-tabs-list - list of menu items
		* .js-tabs-backdrop - dynamic bar for menu items
		* .js-tabs-prev - back tab navigation
		* .js-tabs-next - forward tab navigation
		* .js-tabs-button - button that opens the menu list (for adaptive)
		* .js-tabs-button-text - the text of the button that opens the menu list (for adaptive)
			** The attribute value is substituted from the active menu item from the data-value attribute

	* Functional attributes (can be specified on any HTML element):
*/

/**
    * @param  {Element} tabsContainer - HTML container element, default document
*/
export default function setTabs(tabsContainer) {
	let tabsElements;

	if (tabsContainer) {
		if (tabsContainer instanceof Node) {
			tabsElements = tabsContainer.querySelectorAll('.js-tabs');
		}
	} else {
		tabsElements = document.querySelectorAll('.js-tabs');
	}

    if (tabsElements.length) {
        /**
            * Change backdrop
            * @param  {Element} tabsCurrent - HTML element of tabs
            * @param  {Element} tabsBackdrop - HTML backdrop element
        */
        const changeBackdrop = (tabsCurrent, tabsBackdrop) => {
            setTimeout(() => {
                const tabActive = tabsCurrent.querySelector('.js-tabs-item.is-active');

                if (tabsBackdrop && tabActive) {
                    tabsBackdrop.style.width = `${tabActive.offsetWidth}px`;
                    tabsBackdrop.style.left = `${tabActive.offsetLeft}px`;
                }
            }, 10);
        };

        /**
            * Change tab
            * @param  {Element} tabs - HTML element of tabs
            * @param  {Element} tabCurrent - Tab panel HTML element
            * @param  {Element} tabsButton - Tab dropdown button HTML element
        */
        const moveTab = (tabs, tabCurrent, tabsButton, tabsMenu) => {
            if (!tabs || !tabCurrent) return;

            const tabActive = tabs.querySelector('.js-tabs-item.is-active');

            let panelActive;
            let panelCurrent = tabs.querySelector(`.js-tabs-pane[data-tabs-pane="${tabCurrent.getAttribute('data-tabs-id')}"]`);

            if (tabActive) {
                tabActive.classList.remove('is-active');
                panelActive = tabs.querySelector(`.js-tabs-pane[data-tabs-pane="${tabActive.getAttribute('data-tabs-id')}"]`);
            }

            if (panelActive) {
                panelActive.classList.remove('is-active');
            }

            tabCurrent.classList.add('is-active');

            if (panelCurrent) {
                panelCurrent.classList.add('is-active');
            }

            if (tabsButton) {
                const tabsButtonText = tabsButton.querySelector('.js-tabs-button-text');

                if (tabsButtonText) {
                    tabsButtonText.textContent = tabCurrent.getAttribute('data-value') || '';
                }
            }
        };

        /**
            * Close drop down menu of tabs
        */
        const closeTabsList =  () => {
            const tabsButtonActive = document.querySelector('.js-tabs-button.is-active');
            const tabsListActive = document.querySelector('.js-tabs-list.is-active');

            if (tabsButtonActive) {
                tabsButtonActive.classList.remove('is-active');
            }
            if (tabsListActive) {
                tabsListActive.classList.remove('is-active');
            }
        };

        /**
            * Tab navigation
            * @param  {Element} tabs - HTML element of tabs
            * @param  {Element} tabsBackdrop - menu item background HTML element
            * @param  {Element} direction - Tab navigation direction
        */
        const tabNavigation = (tabs, tabsBackdrop, direction) => {
            if (!tabs) return;

            let tabActive = tabs.querySelector('.js-tabs-item.is-active');
            let tabsButton = tabs.querySelector('.js-tabs-button');

            if (tabActive) {
                let tabCurrent = tabActive.nextElementSibling;

                if (direction == 'prev') {
                    tabCurrent = tabActive.previousElementSibling;
                }

                if (tabCurrent) {
                    moveTab(tabs, tabCurrent, tabsButton);

                    if (tabsBackdrop) {
                        changeBackdrop (tabs, tabsBackdrop);
                    }
                }
            }
        };

        /**
            * Checking and changing the disabled attribute of the tab navigation button
            * @param  {Element} tabs - HTML element of tabs
            * @param  {Element} tabNavPrev - Button to move tabs to the left
            * @param  {Element} tabNavNext - Button to move tabs to the right
        */
        const isDisabledTabNavigation = (tabs, tabNavPrev, tabNavNext) => {
            let tabActive = tabs.querySelector('.js-tabs-item.is-active');

            if (tabNavPrev) {
                if (tabActive.previousElementSibling) {
                    tabNavPrev.classList.remove('is-disabled');
                } else {
                    tabNavPrev.classList.add('is-disabled');
                }
            }

            if (tabNavNext) {
                if (tabActive.nextElementSibling) {
                    tabNavNext.classList.remove('is-disabled');
                } else {
                    tabNavNext.classList.add('is-disabled');
                }
            }
        };

        tabsElements.forEach((tabs) => {
            const tabsInit = () => {
                const tabsButton = tabs.querySelector('.js-tabs-button');
                const tabsMenu = tabs.querySelector('.js-tabs-menu');
                const tabsList = tabs.querySelector('.js-tabs-list');
                const tabsItems = tabsMenu ? tabs.querySelectorAll('.js-tabs-item') : '';
                const tabsBackdrop = tabs.querySelector('.js-tabs-backdrop');
                const tabsPrev = tabs.querySelector('.js-tabs-prev');
                const tabsNext = tabs.querySelector('.js-tabs-next');

                tabs.setAttribute('data-tabs-init', '');

                changeBackdrop(tabs, tabsBackdrop);
                isDisabledTabNavigation(tabs, tabsPrev, tabsNext);

                window.addEventListener('resize', () => {
                    changeBackdrop(tabs, tabsBackdrop);
                });

                if (tabsItems) {
                    tabsItems.forEach(tabItem => {
                        tabItem.addEventListener('click', (event) => {
                            const target = event.currentTarget;

                            moveTab(tabs, target, tabsButton, tabsMenu);
                            changeBackdrop(tabs, tabsBackdrop);
                            isDisabledTabNavigation(tabs, tabsPrev, tabsNext);
                        });
                    });
                }

                if (tabsPrev) {
                    tabsPrev.addEventListener('click', (e) => {
                        e.preventDefault();

                        tabNavigation(tabs, tabsBackdrop, 'prev');
                        isDisabledTabNavigation(tabs, tabsPrev, tabsNext);
                    });
                }

                if (tabsNext) {
                    tabsNext.addEventListener('click', (e) => {
                        e.preventDefault();

                        tabNavigation(tabs, tabsBackdrop, 'next');
                        isDisabledTabNavigation(tabs, tabsPrev, tabsNext);
                    });
                }

                if (tabsButton) {
                    tabsButton.addEventListener('click', (e) => {
                        e.preventDefault();

                        tabsButton.classList.toggle('is-active');

                        if (tabsList) {
                            tabsList.classList.toggle('is-active');
                        }
                    });
                }
            };

            if (!tabs.hasAttribute('data-tabs-init')) {
                tabsInit();
            }
        });
    }
}
