export default function smoothScroll() {
    const root = document.querySelector('.out');

    if (!root) return;

    root.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.getElementById(link.getAttribute('href').slice(1));

            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
