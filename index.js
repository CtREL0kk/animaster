addListeners();
let stop;
let resetMoveAndHide = {stop: function(){}};

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 3000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide = animaster().moveAndHide(block, 3000);
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            resetMoveAndHide.stop();
            
        });
    document.getElementById('heartBeatPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatBlock');
            stop = animaster().heartBeat(block, 1000);
        });
    document.getElementById('heartBeatStop')
        .addEventListener('click', function () {
            stop.stop();
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    return {
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut: function(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide: function (element, duration){
            const _this = this;
            this.move(element, duration * .4, {x: 100, y:20});
            const id = setTimeout(() => {this.fadeOut(element, duration * .6);}, duration * .4);
            return {
                stop: function (){
                    clearTimeout(id);
                    _this.fadeIn(element, duration * .6);
                    _this.move(element, duration * .4, {x: -0, y: -0});
                    console.log('lalala');
                }
            };
        },
        heartBeat: function (element, duration){
            const beat = () => {
                this.scale(element, duration  / 2, 1.4);
                setTimeout(() => {this.scale(element, duration  / 2, 1)}, duration / 2);
            }
            const intervalId = setInterval(beat, duration);
            return {
                stop: function () {
                    clearInterval(intervalId);
                }
            }
        },
        showAndHide: function (element, duration){
            this.fadeIn(element, duration / 3);
            setTimeout(() => {this.fadeOut(element, duration / 3);}, duration * 2 / 3);
        },
    }
}