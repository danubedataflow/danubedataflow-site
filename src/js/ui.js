'use strict';

import {
    gallery
} from '/js/gallery.js';
import {
    random,
    randomSeed,
    randomIntRange
} from '/js/math.js';

let controls = {},
    ctrl = {},
    canvas, width, height, ctx, pageType, work;

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

/* Navigating between works:
 *
 * Each work has buttons to go to the next newer or older work. Works
 * are named and presented in the reverse order they were created. So
 * the oldest work is 'work-0001'.
 *
 * They wrap around, so the newest work's "previous" work is the oldest
 * work; the oldest work's "next" work is the newest work.
 *
 * Get the current work name ('work-1234') from the current URL. Then
 * look it up in the gallery and move left or right to get the desired
 * index. Then go to a URL based on that.
 */

function goToNewerWork() {
    let workName = window.location.pathname.match(/work-\d+/)[0];
    let newerIndex = (gallery.findIndex(el => el == workName) -
        1 + gallery.length) % gallery.length;
    window.location.href = `/${gallery[newerIndex]}/`;
}

function goToOlderWork() {
    let workName = window.location.pathname.match(/work-\d+/)[0];
    let olderIndex = (gallery.findIndex(el => el == workName) +
        1) % gallery.length;
    window.location.href = `/${gallery[olderIndex]}/`;
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

        // Support for perlin library, which may have been loaded.
        // perlin.js assigns noise as a property on the global object (window
        // in browsers).
        //
        // Any time we set a new seed value, we must tell perlin.js about it.
        //
        // perlin.js's noise.seed takes a float between 0 and 1
        if (window.noise && typeof window.noise.foo === "function") {
            noise.seed(random());
        }
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

/* Work skeleton
 *
 * Individual works just need to set up the form and to implement
 * drawWork().
 */
function setup() {
    pageType = window.location.pathname.endsWith('print.html') ? 'print' : 'screen';
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    setCanvasDimension();

    // Take the work title from the page title so a work desn't have to
    // set it twice. Also use the title to set the link to the GitHub source
    // code page.
    let title = document.getElementsByTagName("title")[0].innerText;
    document.getElementById('workTitle').innerText = title;
    document.getElementById('createdDate').innerText = work.createdDate;
    document.getElementById('goToNewerWork').addEventListener('click', goToNewerWork);
    document.getElementById('goToOlderWork').addEventListener('click', goToOlderWork);
    document.getElementById('redrawWithNewSeed').addEventListener('click', redrawWithNewSeed);
    document.getElementById('setControlsRandomly').addEventListener('click', setControlsRandomly);
    document.getElementById('saveCanvasAsPNG').addEventListener('click', saveCanvasAsPNG);
    document.getElementById('copyLink').addEventListener('click', copyLink);

    // <a id="sourceLink"> exists in index.html but not print.html
    let sourceLink = document.getElementById('sourceLink');
    if (sourceLink !== null) {
        sourceLink.setAttribute('href',
            `https://github.com/danubedataflow/danubedataflow-site/blob/master/src/${title}/work.js`);
    }

    work.setupControls(); // works need to implement this

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

    let args = {
        ctx,
        width,
        height,
        ctrl
    };
    work.drawWork(args);
}

function run(workSpec) {
    work = workSpec;

    /* Only handle keypresses in the main work view. For example, in the
     * print view, it doesn't make sense, and they even interfere with
     * "Cmd-P" for printing.
     */

    addEventListener('keypress', (e) => {
        if (pageType == 'screen') {
            if (e.code == 'KeyS') saveCanvasAsPNG();
            if (e.code == 'KeyR') redrawWithNewSeed();
            if (e.code == 'KeyP') setControlsRandomly();
        }
    });

    // Arrow keys trigger the 'keydown' event, not the 'keypress' event.

    addEventListener('keydown', (e) => {
        if (pageType == 'screen') {
            if (e.key == 'ArrowLeft') goToNewerWork();
            if (e.key == 'ArrowRight') goToOlderWork();
        }
    });

    addEventListener('resize', (e) => {
        controls.seed.setSameSeedAgain();
        setCanvasDimension();
        draw();
    });

    setup();
    draw();
}

export {
    run,
    makeForm,
    makeSlider,
    makeCheckbox,
    makeOption,
    makeSelect,
    makeFieldset,
    makeSelectColorMap,
    makeSelectBlendMode
};
