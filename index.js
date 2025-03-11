addListeners();
let stop;
let resetMoveAndHide = {stop: function(){}};

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(3000).play(block);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide = animaster().moveAndHide(block, 3000);
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            resetMoveAndHide.reset();
            
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
    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addChangeBorder(500, '10em')
        .buildHandler();

    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
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
        _steps: [],
        _element: null,
        _initialState: null,

        resetFadeIn: function (element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut: function (element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetMoveAndScale: function (element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },

        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        addMove: function(duration, translation) {
            this._steps.push({
                type: 'move',
                duration: duration,
                translation: translation
            });
            return this;
        },

        addFadeIn: function(duration) {
            this._steps.push({
                type: 'fadeIn',
                duration: duration,
            });
            return this;
        },

        addFadeOut: function(duration) {
            this._steps.push({
                type: 'fadeOut',
                duration: duration,
            });
            return this;
        },

        addScale: function(duration, ratio) {
            this._steps.push({
                type: 'scale',
                duration: duration,
                ratio: ratio
            });
            return this;
        },
        addChangeBorder: function(duration, ratio) {
            this._steps.push({
                type: 'changeBorder',
                duration: duration,
                ratio: ratio
            });
            return this;
        },

        addDelay: function(duration) {
            this._steps.push({
                type: 'delay',
                duration: duration,
            });
            return this;
        },

        play: function(element, cycled = false) {
            this._element = element;
            this._initialState = {
                transform: element.style.transform,
                opacity: element.style.opacity,
                classList: [...element.classList],
            };

            const playStep = (step, delay) => {
                setTimeout(() => {
                    switch (step.type) {
                        case 'move':
                            this.move(element, step.duration, step.translation);
                            break;
                        case 'scale':
                            this.scale(element, step.duration, step.ratio);
                            break;
                        case 'fadeIn':
                            this.fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            this.fadeOut(element, step.duration);
                            break;
                        case 'changeBorder':
                            this.changeBorder(element, step.duration, step.ratio);
                            break;
                        case 'delay':
                            break;
                    }
                }, delay);
            };

            const playAllSteps = () => {
                let delay = 0;
                this._steps.forEach(step => {
                    playStep(step, delay);
                    delay += step.duration;
                });

                if (cycled) {
                    setTimeout(playAllSteps, delay);
                }
            };

            playAllSteps();

            return {
                stop: () => {
                    this._steps = [];
                },
                reset: () => {
                    this._steps = [];
                    element.style.transform = this._initialState.transform;
                    element.style.opacity = this._initialState.opacity;
                    element.classList = this._initialState.classList;
                }
            };
        },
        buildHandler: function () {
            const _this = animaster();
            _this._steps = this._steps.slice();
            return function (){
                _this.play(this);
            }
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

        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide: function (element, duration) {
            return this
                .addMove(duration * 0.4, {x: 100, y: 20})
                .addFadeOut(duration * 0.6)
                .play(element);
        },

        heartBeat: function (element, duration) {
            return this
                .addScale(duration / 2, 1.4)
                .addScale(duration / 2, 1)
                .play(element, true);
        },

        showAndHide: function (element, duration) {
            return this
                .addFadeIn(duration / 3)
                .addDelay(duration * 2 / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },
        changeBorder: function (element, duration, ratio) {
            element.style.animationDuration = `${duration}ms`;
            element.style.borderRadius = ratio;
        }
    }
}