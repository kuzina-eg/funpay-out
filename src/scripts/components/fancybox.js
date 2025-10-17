import { Fancybox } from "@fancyapps/ui";

/*
	Fancybox
	https://fancyapps.com/docs/ui/fancybox/
*/

// Fancybox.defaults.dragToClose = false;
// Fancybox.defaults.Thumbs = false;
// Fancybox.defaults.infinite = false;
Fancybox.defaults.template = {
    closeButton: '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg></button>',

};

export default function initFancybox() {
    Fancybox.bind('[data-fancybox]', {
        idle: false,
        compact: false,
        dragToClose: false,

        animated: false,
        showClass: 'f-fadeSlowIn',
        hideClass: false,

        Carousel: {
            infinite: false,
        },

        Images: {
            zoom: false,
            Panzoom: {
                maxScale: 1.5,
            },
        },

        Toolbar: {
            absolute: true,
            display: {
                left: [],
                middle: [],
                right: ['close'],
            },
        },

        Thumbs: {
            type: 'classic',
            Carousel: {
                axis: 'y',
                slidesPerPage: 1,
                Navigation: true,
                center: true,
                fill: true,
                dragFree: true,
            },
        },
    });
}
