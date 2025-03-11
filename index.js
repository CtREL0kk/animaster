addListeners();

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
        play: function(element) {
            let delay = 0;
            this._steps.forEach(step => {
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
                    }
                }, delay);
                delay += step.duration;
            });
            return this;
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
        }
    }
}