'use strict';

let controls = {},
    ctrl = {},
    canvas, width, height, ctx, pageType;

function setCanvasDimension() {
    let headerHeight = 100 * window.devicePixelRatio;
    width = height = Math.min(window.innerWidth, window.innerHeight - headerHeight);

    /* Set up the canvas for high-resolution drawing.
     *
     * 1. Multiply the canvas's width and height by the devicePixelRatio
     *
     * 2. Force it to display at the original (logical) size with CSS or style
     * attributes.
     *
     * 3. Scale the context so you can draw on it without considering the
     * ratio.
     */

    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(ratio, ratio);

    // also show the canvas size on the web page
    document.getElementById('canvasSize').innerText = `${width} x ${height}`;
}

function saveCanvasAsPNG() {
    canvas.toBlob(blob => {
        var element = document.createElement('a');
        element.setAttribute('href', URL.createObjectURL(blob));
        let filename = decodeURI(location.href.split('/').slice(-3, -1).join('--')) + '.png';
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    });
}

function getPointsForPolygon(sides, diameter, rotation) {
    // the polygon center is (0, 0)
    let points = [];
    for (let i = 0; i < sides + 1; i++) {
        let angle = 2 * Math.PI / sides * i + 2 * Math.PI * rotation / 360;
        points.push([
            Math.sin(angle) * diameter / 2,
            Math.cos(angle) * diameter / 2
        ]);
    }
    return points;
}

// call a function with elements [0, 1], then [1, 2] etc.
Array.prototype.pairwise = function(func) {
    for (let i = 0; i < this.length - 1; i++) {
        func(this[i], this[i + 1]);
    }
}

// https://gist.github.com/motoishmz/5239619
// Fisher-Yates
//
// First copy the array so we don't modify the original array in-place.
Array.prototype.shuffle = function() {
    const copy = this.slice(); // or [...this]
    let i = copy.length;

    while (i) {
        const j = Math.floor(random() * i);
        const t = copy[--i];
        copy[i] = copy[j];
        copy[j] = t;
    }

    return copy;
};

Array.prototype.randomElement = function() {
    return this[Math.floor(random() * this.length)];
}

class SliderControl {

    constructor(_id, _element) {
        this.id = _id;
        this.element = _element;
    }

    // Only assign the new value if it has changed to avoid excessive
    // repainting.
    getValue() {
        let value = this.element.get();

        // support multiple handles
        if (Array.isArray(value)) {
            return value.map(numStr => parseFloat(numStr))
        } else {
            return parseFloat(this.element.get());
        }
    }

    // returns -1 on error, 0 if ok
    checkValue(value) {
        let v = parseFloat(value);
        if (isNaN(v)) {
            console.log(`${this.id}: value "${value}" is not a number`);
            return -1;
        } else {
            let range = this.element.options.range;
            if (v < range.min || v > range.max) {
                console.log(`${this.id}: value "${value}" is outside the range [${range.min}, ${range.max}]`);
                return -1;
            }
        }
        return 0;
    }

    setValue(value) {
        if (Array.isArray(value)) {
            for (const v of value) {
                if (this.checkValue(v) == -1) return;
            }
        } else {
            if (this.checkValue(value) == -1) return;
        }
        this.element.set(value);
    }
}

class CheckboxControl {

    constructor(_id, _element) {
        this.id = _id;
        this.element = _element;
    }

    getValue() {
        return this.element.checked;
    }

    setValue(value) {
        // convert string values from URL query parameters
        if (value === 'true') value = true;
        if (value === 'false') value = false;

        // validate
        if (typeof value === 'boolean') {
            this.element.checked = value;
        } else {
            console.log(`${this.id}: value "${value}" is not boolean`);
        }
    }
}

/* Seed handling
 *
 * If a seed is given in URL's query string, that is used. If not, a random
 * seed is used.
 *
 * The seed that is used is shown below the form controls.
 *
 * Both the "redraw with new seed" button and the "randomize parameters" button
 * will generate a new seed. That is because if the redraw button didn't
 * generate a new seed, you couldn't get the exact same image with the shown
 * seed because every time you redraw it calls random() again.
 *
 * Note that you have to generate a new seed every time you redraw the work.
 * If you just redraw without generating a new seed, you won't get the same
 * image even if you copy the URL including the seed because every time you
 * just redraw you get different random numbers.
 *
 * To be able to regenerate the exact same image, copy the URL including the
 * seed. The "copy link" button does that as well.
 */

class SeedControl {

    constructor(_id, _element) {
        this.id = _id;
        this.element = _element;
        this.element.disabled = true;
        this.element.setAttribute('size', 10);
    }

    getValue() {
        return this.element.value;
    }

    setValue(value) {
        /* Use Math.random() so that when you have two identical works and
         * click "redraw with new seed" or "randomize controls" you don't get
         * the same result on both works.
         */
        value = value || Math.random().toString(36).slice(2, 10);
        this.element.value = value;
        randomSeed(value);

        // perlin.js's noise.seed takes a float between 0 and 1
        noise.seed(random());
    }

    // After resizing the canvas or changing sliders, we want to draw
    // with the same seed as before.
    setSameSeedAgain() {
        this.setValue(this.getValue());
    }
}

class SelectControl {

    constructor(_id, _element) {
        this.id = _id;
        this.element = _element;
    }

    getValue() {
        return this.element.value;
    }

    setValue(value) {
        // The spread syntax (`...`) turns the HTMLOptionsCollection into a
        // standard array.
        if (this.getOptionValues().includes(value)) {
            this.element.value = value;
        } else {
            console.log(`${this.id}: value "${value}" is not a valid option`);
        }
    }

    getOptionValues() {
        return [...this.element.options].map(o => o.value);
    }
}

// Control values can be overridden if they exists in the URL search params.
function valueWithSearchParam(key, defaultValue) {
    let value = new URLSearchParams(window.location.search).get(key);
    if (value == null) {
        return defaultValue;
    } else {
        // convert noUISlider ranges to arrays
        if (value.includes(',')) value = value.split(',');
        return value;
    }
}

function makeForm(...contents) {
    let form = document.getElementById('controls-form');
    contents.push(makeSeed()),
        contents.forEach(child => form.appendChild(child));
}

function makeFieldset(legend, ...contents) {
    let fieldsetEl = document.createElement('fieldset');
    let legendEl = document.createElement('legend');
    legendEl.innerText = legend;
    fieldsetEl.appendChild(legendEl);
    contents.forEach(child => fieldsetEl.appendChild(child));
    return fieldsetEl;
}

function makeDiv(config, ...contents) {
    let el = document.createElement('div');
    for (const [attr, value] of Object.entries(config)) {
        el.setAttribute(attr, value);
    }
    contents.forEach(child => el.appendChild(child));
    return el;
}

// 'id' is the value of the 'for' attribute.
function makeLabel(id) {
    let el = document.createElement('label');
    el.setAttribute('for', id);
    return el;
}

function makeSlider(id, label, min, max, value, step = 1) {
    value = valueWithSearchParam(id, value);

    let containerDiv = document.createElement('div');

    let labelEl = makeLabel(id);
    labelEl.innerText = label.replace('{0}', parseFloat(value));
    containerDiv.appendChild(labelEl);

    // <div class="slider-wrapper"><div id="foo"></div></div>

    let sliderDiv = makeDiv({
        'id': id
    });
    containerDiv.appendChild(
        makeDiv({
            'class': 'slider-wrapper'
        }, sliderDiv)
    );

    let slider = noUiSlider.create(sliderDiv, {
        range: {
            min: [min],
            max: [max]
        },
        step: step,
        start: value,
        connect: Array.isArray(value) ? [false, true, false] : [true, false],

        // Move handle on tap, bars are draggable
        behaviour: 'tap-drag'
    });
    slider.on('update', function(values, _) {
        // This event will always return an array, even for sliders with one handle.
        labelEl.innerText = label.replace(/{(\d+)}/g, (_, num) => parseFloat(values[num]));
    });
    slider.on('slide', redrawWithSameSeed);
    controls[id] = new SliderControl(id, slider);
    return containerDiv;
}

function makeCheckbox(id, label, value = true) {
    let containerDiv = document.createElement('div');

    let labelEl = makeLabel(id);
    labelEl.innerText = label;
    containerDiv.appendChild(labelEl);

    let checkboxEl = document.createElement('input');
    checkboxEl.setAttribute('type', 'checkbox');
    checkboxEl.setAttribute('id', id);
    checkboxEl.oninput = redrawWithSameSeed;
    containerDiv.appendChild(checkboxEl);

    controls[id] = new CheckboxControl(id, checkboxEl);
    value = valueWithSearchParam(id, value);
    if (value != null) controls[id].setValue(value);

    return containerDiv;
}

function makeSeed() {
    let id = 'seed',
        containerDiv = document.createElement('div');

    let labelEl = makeLabel(id);
    labelEl.innerText = 'Random seed:';
    containerDiv.appendChild(labelEl);

    let inputEl = document.createElement('input');
    inputEl.setAttribute('id', id);
    containerDiv.appendChild(inputEl);

    controls[id] = new SeedControl(id, inputEl);
    controls[id].setValue(valueWithSearchParam(id)); // no default value

    return containerDiv;
}

function makeOption(value, name) {
    if (name === undefined) {
        name = value;
    }
    let el = document.createElement('option');
    el.setAttribute('value', value);
    el.innerText = name;
    return el;
}

function makeOptGroup(label, ...contents) {
    let el = document.createElement('optGroup');
    el.setAttribute('label', label);
    contents.forEach(child => el.appendChild(child));
    return el;
}

function makeSelect(id, label, contents, value) {
    let containerDiv = document.createElement('div');

    let labelEl = makeLabel(id);
    labelEl.innerText = label;
    containerDiv.appendChild(labelEl);

    let selectEl = document.createElement('select');
    selectEl.setAttribute('id', id);
    contents.forEach(el => selectEl.appendChild(el));

    selectEl.onchange = redrawWithSameSeed;
    containerDiv.appendChild(selectEl);

    controls[id] = new SelectControl(id, selectEl);

    value = valueWithSearchParam(id, value);
    if (value != null) controls[id].setValue(value);

    return containerDiv;
}

function makeSelectColorMap() {
    let containerDiv = makeSelect(
        'colorMap', 'Color map: ', [
            makeOptGroup('Sequential',
                makeOption('OrRd', 'Orange-Red'),
                makeOption('PuBu', 'Purple-Blue'),
                makeOption('BuPu', 'Blue-Purple'),
                makeOption('Oranges'),
                makeOption('BuGn', 'Blue-Green'),
                makeOption('YlOrBr', 'Yellow-Orange-Brown'),
                makeOption('YlGn', 'Yellow-Green'),
                makeOption('Reds'),
                makeOption('RdPu', 'Red-Purple'),
                makeOption('Greens'),
                makeOption('YlGnBu', 'Yellow-Green-Blue'),
                makeOption('Purples'),
                makeOption('GnBu', 'Green-Blue'),
                makeOption('Greys'),
                makeOption('YlOrRd', 'Yellow-Orange-Red'),
                makeOption('PuRd', 'Purple-Red'),
                makeOption('Blues'),
                makeOption('PuBuGn', 'Purple-Blue-Green'),
                makeOption('Viridis'),
            ),
            makeOptGroup('Diverging',
                makeOption('Spectral'),
                makeOption('RdYlGn', 'Red-Yellow-Green'),
                makeOption('RdBu', 'Red-Blue'),
                makeOption('PiYG', 'Pink-Yellow-Green'),
                makeOption('PRGn', 'Purple-Green'),
                makeOption('RdYlBu', 'Red-Yellow-Blue'),
                makeOption('BrBG', 'Brown-Blue-Green'),
                makeOption('RdGy', 'Red-Gray'),
                makeOption('PuOr', 'Purple-Orange'),
            ),
            makeOptGroup('Qualitative',
                makeOption('Set2', 'Set 2'),
                makeOption('Accent'),
                makeOption('Set1', 'Set 1'),
                makeOption('Set3', 'Set 3'),
                makeOption('Dark2', 'Dark 2'),
                makeOption('Paired'),
                makeOption('Pastel2', 'Pastel 2'),
                makeOption('Pastel1', 'Pastel 1'),
            )
        ],
        'Viridis'
    );
    return containerDiv;
}

function makeSelectBlendMode(options) {
    // see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    let nameFor = {
        'lighter': 'Lighter',
        'source-over': 'Blend',
        'color-burn': 'Burn',
        'darken': 'Darkest',
        'difference': 'Difference',
        'color-dodge': 'Dodge',
        'exclusion': 'Exclusion',
        'hard-light': 'Hard light',
        'lighten': 'Lighten',
        'multiply': 'Multiply',
        'overlay': 'Overlay',
        'destination-out': 'Remove',
        'copy': 'Copy',
        'screen': 'Screen',
        'soft-light': 'Soft light',
        'xor': 'Exclusive-Or',
    };

    if (options == null) {
        options = Object.keys(nameFor);
    }

    // Sort the options by their display name.
    options = options.sort((a, b) => {
        nameFor[a].localeCompare(nameFor[b])
    });

    return makeSelect(
        'blendMode', 'Blend mode: ',
        options.map(c => makeOption(c, nameFor[c])),
        options[0]
    );
}

function getCurrentURL(config = {}) {
    let urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(controls)) {
        urlParams.set(key, value.getValue());
    }

    if (config.timestamp) urlParams.set('timestamp', Date.now());

    /* Replace the URL in the browser's URL bar using the current control
     * values, without reloading the page.
     */
    return window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + urlParams.toString();
}

function setControlsRandomly() {
    Object.values(controls).forEach(c => {
        if (c instanceof SliderControl) {
            /* For the noUISlider, generate one or more values between `min`
             * and `max`, but only values that can be reached by `step`. The
             * number of values is determined by the `start` option: if it is a
             * scalar, we need one value; if it is an array, we need that many
             * values.
             */
            let options = c.element.options;
            let min = options.range.min[0];
            let max = options.range.max[0];

            // For example, if min = 0, max = 10 and step = 2, there are 6
            // steps (0, 2, 4, 6, 8, 10), so maxStep = 5.

            let maxStep = (max - min) / options.step;

            let genValue = () => {
                return min + randomIntRange(0, maxStep) * options.step
            };

            if (Array.isArray(options.start)) {
                c.setValue(options.start.map(genValue).sort((a, b) => a - b));
            } else {
                c.setValue(genValue());
            }

        } else if (c instanceof SelectControl) {
            c.setValue(c.getOptionValues().randomElement());

        } else if (c instanceof CheckboxControl) {
            c.setValue([true, false].randomElement());
        }

        // No need to set the seed value (for SeedControl); that's done in
        // redrawWithNewSeed() anyway.
    });
    redrawWithNewSeed();
}

function redrawWithSameSeed() {
    controls.seed.setSameSeedAgain();
    draw();
}

function redrawWithNewSeed() {
    controls.seed.setValue(); // trigger new random seed
    draw();
}

function copyLink() {
    if (window.isSecureContext) {
        navigator.clipboard.writeText(getCurrentURL({
            timestamp: 1
        }));
    } else {
        alert("Eine sichere Verbindung ist nötig, um ins Clipboard schreiben zu können.");
    }
}

function setupQRCode() {
    let code = getCurrentURL({
        timestamp: 1
    });

    // the QR code should lead to the interactive page, not the print view
    code = code.replace('print.html', '');

    // There is a bug in the QRCode library where it fails to
    // generate the QR code with a "code length overflow" error if
    // the input string is between 192 and 220 characters long.

    code = code.padEnd(221);
    new QRCode(document.getElementById('qrcode'), code);
}

/* Sketch skeleton
 *
 * Individual works just need to set up the form and to implement
 * drawSketch().
 */
function setup() {
    pageType = window.location.pathname.endsWith('print.html') ? 'print' : 'screen';
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    setCanvasDimension();
    setupControls(); // works need to implement this

    if (pageType) {
        // add page type as class to all DOM elements so CSS can differentiate
        document.querySelectorAll('*').forEach(el => el.classList.add(pageType));
    }
    if (pageType == 'print') setupQRCode();
}

function draw() {
    /* Copy the current control values into the `ctrl` object. This way
     * the works don't have to call `controls.someControl.getValue()`
     * but can just use `ctrl.someControl`. Note that the former is a
     * function call, so it would be expensive to call this several
     * times, leading to new temporary variables. The latter is just a
     * variable.
     */

    ctrl = {};
    for (const [key, value] of Object.entries(controls)) {
        ctrl[key] = value.getValue();
    }

    /* Update the URL according to controls. But don't update it if it
     * hasn't changed. Because if you continuously resize the window,
     * Safari produces a "SecurityError: Attempt to use
     * history.replaceState() more than 100 times per 30 seconds".
     */

    let currentURL = getCurrentURL();
    if (currentURL != window.location.href) {
        window.history.replaceState(null, '', currentURL);
    }

    drawSketch();
}

// generate color value for ctx.fillStyle and ctx.strokeStyle.
function colorRGB(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}

function colorRGBA(r, g, b, alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function colorHSL(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function colorHSLA(h, s, l, alpha) {
    return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
}

addEventListener('load', (e) => {
    setup();
    draw();
});

addEventListener('keypress', (e) => {
    /* only handle keypresses in the main work view. For example, in the
     * print view, it doesn't make sense, and they even interfere with "Cmd-P"
     * for printing.
     */
    if (pageType == 'screen') {
        if (e.code == 'KeyS') saveCanvasAsPNG();
        if (e.code == 'KeyR') redrawWithNewSeed();
        if (e.code == 'KeyP') setControlsRandomly();
    }
});

addEventListener('resize', (e) => {
    controls.seed.setSameSeedAgain();
    setCanvasDimension();
    draw();
});

/* MATH */

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

/*
 * Take care to initialize your PRNGs properly. To keep things simple, the
 * generators below have no built-in seed generating procedure, but accept one
 * or more 32-bit numbers as the initial seed state of the PRNG. Similar or
 * sparse seeds (e.g. a simple seed of 1 and 2) have low entropy, and can cause
 * correlations or other randomness quality issues, sometimes resulting in the
 * output having similar properties (such as randomly generated levels being
 * similar). To avoid this, it is best practice to initialize PRNGs with a
 * well-distributed, high entropy seed and/or advancing past the first 15 or so
 * numbers.
 *
 * There are many ways to do this, but here are two methods. Firstly, hash
 * functions are very good at generating seeds from short strings. A good hash
 * function will generate very different results even when two strings are
 * similar, so you don't have to put much thought into the string. Here's an
 * example hash function.
 *
 * Calling cyrb128 will produce a 128-bit hash value from a string which can be
 * used to seed a PRNG.
 */

function cyrb128(str) {
    let h1 = 1779033703,
        h2 = 3144134277,
        h3 = 1013904242,
        h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

/*
 * sfc32 is part of the PractRand random number testing suite (which it passes
 * of course). sfc32 has a 128-bit state and is very fast in JS.
 *
 * You may wonder what the | 0 and >>>= 0 are for. These are essentially 32-bit
 * integer casts, used for performance optimizations. Number in JS are
 * basically floats, but during bitwise operations, they switch into a 32-bit
 * integer mode. This mode is processed faster by JS interpreters, but any
 * multiplication or addition will cause it to switch back to a float,
 * resulting in a performance hit.
 */

function sfc32(a, b, c, d) {
    return function() {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        var t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

let random;

function randomSeed(seedStr) {

    // create cyrb128 state
    let seed = cyrb128(seedStr);

    // four 32-bit component hashes provide the seed for sfc32()
    random = sfc32(seed[0], seed[1], seed[2], seed[3]);

    // Now you can call random() to generate a random number betweem 0 and 1.
}

// init
let seedStr = Math.random().toString(36).slice(2, 10);
randomSeed(seedStr);

function randomIntUpTo(n) {
    return Math.floor(random() * n);
}

function randomIntRange(lowerBound, upperBound) {
    return lowerBound + randomIntUpTo(upperBound + 1 - lowerBound);
}

// generate a random integer in the range [-n, n].
function randomIntPlusMinus(n) {
    return Math.floor(random() * 2 * n - n);
}
