export default function preloader() {
    const preloader = document.querySelector('.js-preloader');

    if (preloader) {
        window.onload = function() {
            preloader.classList.add('is-visible');
        };
    }
}
