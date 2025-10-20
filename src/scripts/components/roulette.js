export default function roulette() {
    const rouletteContainer = document.querySelector('.out-roulette')

    if (rouletteContainer) {
        const playButton = document.querySelector('.js-start-play');
        const roulette = document.querySelector('.roulette');
        playButton.addEventListener('click', (event) => {

            // определение угла поворота колеса
            let st = window.getComputedStyle(roulette, null);
            let tr = st.getPropertyValue('transform');

            let values = tr.split('(')[1].split(')')[0].split(',');
            let a = values[0];
            let b = values[1];

            let angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
            if (angle < 0) {
                angle = 360 + angle;
            }

            // настройка весов
            const weightedRandomArray = () => {
                const weightedArray = [];
                // [slice#1, slice#2, slice#3, slice#4, slice#5, slice#6,slice#7, slice#8]
                const weights = [40, 20, 15, 10, 6, 4, 3, 2]; // в процентах

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

            // устанавливаем начальное и конечное положение поворота колеса
            const root = document.documentElement;
            root.style.setProperty('--angleStart', angle + 'deg');
            root.style.setProperty('--angleEnd', (360 * 3 - (prizeNum - 1) * 45) + 'deg');

            rouletteContainer.classList.add('a-start-play');
            document.getElementById('slice' + prizeNum).classList.add('is-active');

            setTimeout(() => {
                rouletteContainer.classList.add('a-show-modal');
            }, 8000);
        });
    }
}
