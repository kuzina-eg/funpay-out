export default function roulette() {
    const rouletteContainer = document.querySelector('.out-roulette')

    if (rouletteContainer) {
        const playButton = document.querySelector('.js-start-play');
        const roulette = document.querySelector('.roulette');
        const closeButton = document.querySelector('.js-close-roulette-modal');
        playButton.addEventListener('click', (event) => {

            // определение угла поворота колеса
            let st = window.getComputedStyle(roulette, null);
            let tr = st.getPropertyValue('transform');

            let values = tr.split('(')[1].split(')')[0].split(',');
            let a = values[0];
            let b = values[1];

            let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            if (angle < 0) {
                angle = 360 + angle;
            }

            // настройка весов
            const weights = [40, 20, 15, 10, 6, 4, 3, 2]; // в процентах
            const weightedRandomArray = () => {
                const weightedArray = [];
                // [slice#1, slice#2, slice#3, slice#4, slice#5, slice#6,slice#7, slice#8]

                for (let i = 0; i < weights.length; i++) {
                    const count = weights[i];
                    for (let j = 0; j < count; j++) {
                        weightedArray.push(i + 1);
                    }
                }
                const randomIndex = Math.floor(Math.random() * weightedArray.length);
                console.log('Выпал приз №', weightedArray[randomIndex])
                return weightedArray[randomIndex];
            }

            let prizeNum = weightedRandomArray();

            // заполняем данные модального окна
            const activeImage = document.getElementById('slice' + prizeNum).dataset.size;
            const activeValue = document.getElementById('slice' + prizeNum).dataset.value;
            const activeDiscount = document.getElementById('slice' + prizeNum).dataset.discount;
            document.querySelector('.result-discount').innerHTML = activeDiscount;
            document.querySelector('.result-value').innerHTML = activeValue;
            document.querySelector('.result-probability').innerHTML = weights[prizeNum - 1];
            const imageInModal = document.querySelector('.out-roulette__modal-photo img');
            const sourceInModal = document.querySelector('.out-roulette__modal-photo source');
            imageInModal.src = imageInModal.src.replace('sm', activeImage);
            imageInModal.srcset = imageInModal.srcset.replace('sm', activeImage);
            sourceInModal.srcset = sourceInModal.srcset.replaceAll('sm', activeImage);
            document.querySelector('.out-roulette__modal-photo').classList.add('image' + prizeNum);

            // блочим кнопку
            playButton.setAttribute('disabled', 'disabled');

            // включаем таймер
            const countDownDate = new Date("Oct 25, 2025 0:00:00").getTime();

            // Update the count down every 1 second
            const x = setInterval(function () {

                // Get today's date and time
                const now = new Date().getTime();

                // Find the distance between now and the count down date
                const distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Display the result in the elements
                // console.log('!!!', days + ':' + hours + ':' + minutes + ':' + seconds)

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(x);
                    playButton.removeAttribute('disabled');
                    playButton.querySelector('.ui-button__text').innerHTML = playButton.dataset.new;
                }
            }, 1000);



            // устанавливаем начальное и конечное положение поворота колеса
            const root = document.documentElement;
            root.style.setProperty('--angleStart', angle + 'deg');
            root.style.setProperty('--angleEnd', (360 * 3 - (prizeNum - 1) * 45) + 'deg');

            // запускаем вращение
            rouletteContainer.classList.add('a-start-play');
            document.getElementById('slice' + prizeNum).classList.add('is-active');

            setTimeout(() => {
                rouletteContainer.classList.add('a-show-modal');
                playButton.querySelector('.ui-button__text').innerHTML = playButton.dataset.next + ': ';
                const animation = lottie.loadAnimation({
                    container: document.getElementById('lottie-animation'), // контейнер для анимации
                    renderer: 'svg', // тип рендерера (может быть 'svg', 'canvas' или 'html')
                    loop: true, // зацикливание анимации
                    autoplay: true, // автоматический запуск анимации
                    path: 'img/out/roulette/speed2.json' // путь к JSON-файлу с анимацией
                });
            }, 8000);
        });

        closeButton.addEventListener('click', (event) => {
            rouletteContainer.classList.remove('a-show-modal', 'a-start-play');
        });
    }
}
