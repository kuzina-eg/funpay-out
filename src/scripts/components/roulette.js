async function fetchRoulettePrize() {
    // === DEV MOCK: убрать при подключении реального API ===
    // TODO: подставить реальный эндпоинт:
    //   const res = await fetch('/api/roulette/spin', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    //   if (!res.ok) throw new Error(`HTTP ${res.status}`);
    //   return (await res.json()).prizeNum;
    const weights = [40, 20, 15, 10, 6, 4, 3, 2];
    const pool = weights.flatMap((w, i) => Array(w).fill(i + 1));
    const prizeNum = pool[Math.floor(Math.random() * pool.length)];
    console.log('Отправляю запрос на бэк');
    await new Promise(r => setTimeout(r, 3000));
    // DEV: ?fail в URL — имитируем ошибку ответа бэка для теста
    if (new URLSearchParams(location.search).has('fail')) {
        throw new Error('Имитация ошибки бэка (?fail)');
    }
    console.log('Получен ответ, номер приза:', prizeNum);
    return prizeNum;
}

// определяем текущий угол поворота колеса 0..360
function getCurrentAngle(el) {
    const tr = window.getComputedStyle(el, null).getPropertyValue('transform');
    if (!tr || tr === 'none') return 0;
    const [a, b] = tr.split('(')[1].split(')')[0].split(',');
    let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    if (angle < 0) angle += 360;
    return angle;
}

export default function roulette() {
    const rouletteContainer = document.querySelector('.out-roulette')

    if (rouletteContainer) {
        const playButton = document.querySelector('.js-start-play');
        const roulette = document.querySelector('.roulette');
        const closeButton = document.querySelector('.js-close-roulette-modal');
        let isPressPlay = false;
        let isShowModal = false;
        playButton.addEventListener('click', async () => {
            // блочим кнопку
            playButton.setAttribute('disabled', 'disabled');
            const root = document.documentElement;
            // приводим колесо в быстрое вращение, пока ждём сервер (продолжаем вращение с текущего положения колеса в момент нажатия кнопки)
            root.style.setProperty('--angleStart', getCurrentAngle(roulette) + 'deg');
            rouletteContainer.classList.add('a-fast-spin');

            // спрашиваем у сервера, какой приз выдать
            let prizeNum;
            try {
                prizeNum = await fetchRoulettePrize();
            } catch (err) {
                console.error('Ошибка ответа бэка', err);
                rouletteContainer.classList.remove('a-fast-spin');
                playButton.removeAttribute('disabled');
                alert('Не удалось получить приз. Попробуйте ещё раз.');
                return;
            }

            isPressPlay = true;
            setTimeout(() => {
                isShowModal = true;
            }, 7500);

            // заполняем данные модального окна
            const activeImage = document.getElementById('slice' + prizeNum).dataset.size;
            const activeValue = document.getElementById('slice' + prizeNum).dataset.value;
            const activeDiscount = document.getElementById('slice' + prizeNum).dataset.discount;
            document.querySelector('.result-discount').innerHTML = activeDiscount;
            document.querySelector('.result-value').innerHTML = activeValue;
            const imageInModal = document.querySelector('.out-roulette__modal-photo img');
            const sourceInModal = document.querySelector('.out-roulette__modal-photo source');
            imageInModal.src = imageInModal.src.replace('sm', activeImage);
            imageInModal.srcset = imageInModal.srcset.replace('sm', activeImage);
            sourceInModal.srcset = sourceInModal.srcset.replaceAll('sm', activeImage);
            document.querySelector('.out-roulette__modal-photo').classList.add('image' + prizeNum);

            // включаем таймер
            const date = new Date();
            const nextDay = date.setDate(date.getDate() + 1);
            const x = setInterval(function () {

                const now = new Date().getTime();
                const distance = nextDay - now;

                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (hours < 10) hours = '0' + hours;
                if (minutes < 10) minutes = '0' + minutes;
                if (seconds < 10) seconds = '0' + seconds;

                if (isPressPlay && isShowModal) {
                    playButton.querySelector('.ui-button__text').innerHTML = playButton.dataset.next + ': ' + hours + ':' + minutes + ':' + seconds;
                }

                // включаем назад кнопку, если время вышло
                if (distance < 0) {
                    clearInterval(x);
                    isPressPlay = false;
                    isShowModal = false;
                    playButton.removeAttribute('disabled');
                    playButton.querySelector('.ui-button__text').innerHTML = playButton.dataset.new;
                }
            }, 1000);

            // обновляем начальное положение по текущему углу быстрого вращения и задаём конечное
            root.style.setProperty('--angleStart', getCurrentAngle(roulette) + 'deg');
            root.style.setProperty('--angleEnd', (360 * 3 - (prizeNum - 1) * 45) + 'deg');

            // переключаемся с быстрого вращения на анимацию перехода к призу
            rouletteContainer.classList.remove('a-fast-spin');
            rouletteContainer.classList.add('a-start-play');
            document.getElementById('slice' + prizeNum).classList.add('is-active');

            // включаем анимацию lottie (если не будет использоваться, можно удалить)
            const animationContainer = document.getElementById('lottie-animation');
            if (animationContainer) {
                const animation = lottie.loadAnimation({
                    container: animationContainer, // контейнер для анимации
                    renderer: 'svg', // тип рендерера (может быть 'svg', 'canvas' или 'html')
                    loop: true, // зацикливание анимации
                    autoplay: true, // автоматический запуск анимации
                    path: 'img/out/roulette/speed2.json' // путь к JSON-файлу с анимацией
                });
            }

            // показываем модальное окно
            setTimeout(() => {
                console.log('Показываю выпавший приз');
                rouletteContainer.classList.add('a-show-modal');
            }, 8000);
        });

        closeButton.addEventListener('click', (event) => {
            rouletteContainer.classList.remove('a-show-modal', 'a-start-play');
            document.querySelector('.out-roulette__show-prizes .amount').style.display = "flex";
        });
    }
}
