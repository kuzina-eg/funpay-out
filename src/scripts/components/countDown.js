export default function countDown() {
    const countdown = document.querySelector('.js-countdown');

    if (countdown) {
        // Set the date we're counting down to
        const countDownDate = new Date("Nov 1, 2025 00:00:00").getTime();

        // Update the count down every 1 second
        const x = setInterval(function () {

            // Get today's date and time
            const now = new Date().getTime();

            // Find the distance between now and the count down date
            const distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (hours < 10) hours = '0' + hours;
            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;

            // Display the result in the elements
            countdown.querySelector('.ui-button__text').innerHTML = countdown.dataset.next + ': ' + hours + ':' + minutes + ':' + seconds;

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                countdown.removeAttribute('disabled');
                countdown.querySelector('.ui-button__text').innerHTML = countdown.dataset.new;            }
        }, 1000);
    }
}
