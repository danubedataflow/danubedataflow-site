'use strict';

let controls = {},
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

// Move elements matching a selector function to the front of the array.
Array.prototype.putFirst = function(selector) {
    return [
        ...this.filter(selector),
        ...this.filter(el => !selector(el)),
    ];
}

// call a function with elements [0. 1], then [1, 2] etc.
Array.prototype.pairwise = function(func) {
    for (let i = 0; i < this.length - 1; i++) {
        func(this[i], this[i + 1]);
    }
}

// return a random array element
Array.prototype.randomElement = function() {
    return this[randomIntUpTo(this.length)];
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
 * Note that you have to generate a new seed every time you redraw the sketch.
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
        /* Use Math.random() so that when you have two identical sketches and
         * click "redraw with new seed" or "randomize controls" you don't get
         * the same result on both sketches.
         */
        value = value || Math.random().toString(36).slice(2, 10);
        this.element.value = value;
        randomSeed(value);
        // noiseSeed(value);
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

    /* Don't call redraw(). That's because draw() will be called anyway by
     * p5.js and we don't want to call it twice because draw() will call
     * random(), and you wouldn't be able to get the exact same image even with
     * the same seed.
     */
}

function makeFieldset(legend, ...contents) {
    let fieldsetEl = document.createElement('fieldset');
    let legendEl = document.createElement('legend');
    setIntlAttributes(legendEl, {
        key: 'fieldset-' + legend
    });
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

// 'id' is the value of the 'for' attribute. The <label>'s innerText
// will be set by the i18n code.
function makeLabel(id) {
    let el = document.createElement('label');
    el.setAttribute('for', id);
    return el;
}

function setIntlAttributes(element, config) {
    element.setAttribute('data-i18n-key', config.key);

    // Create the 'data-i18n-opt' attribute only if config.opt is given. For
    // example, slider labels have options (placeholders), checkbox labels do
    // not.

    if (typeof config.opt !== 'undefined') {
        // Handle scalar values. one-element arrays and two-element
        // arrays. The initial call to makeSlider can have a scalar
        // value. But the slider 'update' event will always return an
        // array, even for sliders with one handle.
        let opt = {};
        if (Array.isArray(config.opt)) {
            if (config.opt.length == 1) {
                opt.value = {
                    number: config.opt[0]
                };
            } else {
                opt.from = {
                    number: config.opt[0]
                };
                opt.to = {
                    number: config.opt[1]
                };
            }
        } else {
            opt.value = {
                number: config.opt
            };
        }
        element.setAttribute('data-i18n-opt', JSON.stringify(opt));
    }

    // By default we translate the innerText of the given element. If
    // config.target is given, we want to translate the attribute with that
    // name instead.

    if (typeof config.target !== 'undefined') {
        element.setAttribute('data-i18n-target', config.target);
        element.setAttribute(config.target, translateElement(element));
    } else {
        element.innerText = translateElement(element);
    }
}

function makeSlider(id, min, max, value, step = 1) {
    value = valueWithSearchParam(id, value);

    let containerDiv = document.createElement('div');

    let labelEl = makeLabel(id);
    setIntlAttributes(labelEl, {
        key: 'slider-' + id,
        opt: value
    });
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
    slider.on('update', function(values, handle) {
        setIntlAttributes(labelEl, {
            key: 'slider-' + id,
            opt: values
        });
    });
    slider.on('slide', function(values, handle) {
        redrawWithSameSeed();
    });
    controls[id] = new SliderControl(id, slider);
    return containerDiv;
}

function makeCheckbox(id, value = true) {
    let containerDiv = document.createElement('div');

    let labelEl = makeLabel(id);
    setIntlAttributes(labelEl, {
        key: 'checkbox-' + id
    });
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
    setIntlAttributes(labelEl, {
        key: 'display-' + id,
        opt: 0
    });
    containerDiv.appendChild(labelEl);

    let inputEl = document.createElement('input');
    inputEl.setAttribute('id', id);
    containerDiv.appendChild(inputEl);

    controls[id] = new SeedControl(id, inputEl);
    controls[id].setValue(valueWithSearchParam(id)); // no default value

    return containerDiv;
}

// The <option>'s innerText will be set by the i18n code.
function makeOption(value) {
    let el = document.createElement('option');
    el.setAttribute('value', value);
    setIntlAttributes(el, {
        key: 'option-' + value
    });
    return el;
}

function makeOptGroup(label, ...contents) {
    let el = document.createElement('optGroup');
    el.setAttribute('label', label);
    setIntlAttributes(el, {
        key: 'optgroup-' + label,
        target: 'label'
    });

    // We need to translate the 'label' attr, not any innerText.
    el.setAttribute('data-i18n-target', 'label');
    contents.forEach(child => el.appendChild(child));
    return el;
}

function makeSelect(id, contents, value) {
    let containerDiv = document.createElement('div');

    let labelEl = makeLabel(id);
    setIntlAttributes(labelEl, {
        key: 'select-' + id
    });
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
        'colorMap', [
            makeOptGroup('sequential',
                makeOption('OrRd'),
                makeOption('PuBu'),
                makeOption('BuPu'),
                makeOption('Oranges'),
                makeOption('BuGn'),
                makeOption('YlOrBr'),
                makeOption('YlGn'),
                makeOption('Reds'),
                makeOption('RdPu'),
                makeOption('Greens'),
                makeOption('YlGnBu'),
                makeOption('Purples'),
                makeOption('GnBu'),
                makeOption('Greys'),
                makeOption('YlOrRd'),
                makeOption('PuRd'),
                makeOption('Blues'),
                makeOption('PuBuGn'),
                makeOption('Viridis'),
            ),
            makeOptGroup('diverging',
                makeOption('Spectral'),
                makeOption('RdYlGn'),
                makeOption('RdBu'),
                makeOption('PiYG'),
                makeOption('PRGn'),
                makeOption('RdYlBu'),
                makeOption('BrBG'),
                makeOption('RdGy'),
                makeOption('PuOr'),
            ),
            makeOptGroup('qualitative',
                makeOption('Set2'),
                makeOption('Accent'),
                makeOption('Set1'),
                makeOption('Set3'),
                makeOption('Dark2'),
                makeOption('Paired'),
                makeOption('Pastel2'),
                makeOption('Pastel1'),
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
        'xor': 'Exclusive or',
    };

    if (options == null) {
        options = Object.keys(nameFor);
    }

    // Sort the options by their display name.
    options = options.sort((a, b) => {
        nameFor[a].localeCompare(nameFor[b])
    });

    // The default value is 'blend' if it is an option, or the first
    // sorted element if it isn't.

    let defaultValue = options.putFirst(el => el == 'source-over').at(0);
    return makeSelect(
        'blendMode',
        options.map(c => makeOption(c)),
        defaultValue
    );
}

/* Copy the current control values into the `ctrl` object. This way the
 * sketches don't have to call `controls.someControl.getValue()` but can
 * just use `ctrl.someControl`. Note that the former is a function call,
 * so it would be expensive to call this several times, leading to new
 * temporary variables. The latter is just a variable.
 */
let ctrl = {};

function readControls() {
    ctrl = {};
    for (const [key, value] of Object.entries(controls)) {
        ctrl[key] = value.getValue();
    }
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

/* Update the URL according to controls. But don't update it if it hasn't
 * changed. Because if you continuously resize the window, Safari produces a
 * "SecurityError: Attempt to use history.replaceState() more than 100 times
 * per 30 seconds".
 */
function updateURL() {
    let currentURL = getCurrentURL();
    if (currentURL != window.location.href) {
        window.history.replaceState(null, '', currentURL);
    }
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

function makeGrid(args) {
    const {
        numTilesX,
        numTilesY,
        gridWidth = width,
        gridHeight = height,
        depth = 0,
        tileCallback,
        numSubdivisions = function(depth) {
            return 0;
        }
    } = args;
    let tileWidth = gridWidth / numTilesX;
    let tileHeight = gridHeight / numTilesY;
    for (let y = 1; y <= numTilesY; y++) {
        for (let x = 1; x <= numTilesX; x++) {
            ctx.save();
            ctx.translate((x - 1) * tileWidth, (y - 1) * tileHeight);

            let subdivisions = numSubdivisions(depth);
            // make a sub-grid that is as big as the tile
            if (subdivisions > 0) {
                makeGrid({
                    numTilesX: subdivisions,
                    numTilesY: subdivisions,
                    gridWidth: tileWidth,
                    gridHeight: tileHeight,
                    depth: depth + 1,
                    numSubdivisions: numSubdivisions,
                    tileCallback: tileCallback
                });
            } else {
                ctx.save();

                // Move to the tile center so that rotation and scaling happen
                // around that center.
                ctx.translate(tileWidth / 2, tileHeight / 2);

                let tile = {
                    width: tileWidth,
                    height: tileHeight,

                    // corners
                    upperLeft: [-tileWidth / 2, -tileHeight / 2],
                    upperRight: [tileWidth / 2, -tileHeight / 2],
                    lowerLeft: [-tileWidth / 2, tileHeight / 2],
                    lowerRight: [tileWidth / 2, tileHeight / 2],

                    // midpoints of sides
                    upperMiddle: [0, -tileHeight / 2],
                    rightMiddle: [tileWidth / 2, 0],
                    lowerMiddle: [0, tileHeight / 2],
                    leftMiddle: [-tileWidth / 2, 0],
                    center: [0, 0],
                };

                tileCallback(tile);

                ctx.restore();
            }
            ctx.restore();
        }
    }
}

function padSketch(_scale = 0.97) {
    ctx.translate(width / 2, height / 2);
    ctx.scale(_scale, _scale);
    ctx.translate(-width / 2, -height / 2);
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
    new QRCode(document.getElementById('qrcode'), getCurrentURL({
        timestamp: 1
    }));

}

/* Sketch skeleton
 *
 * Individual sketches just need to set up the form and to implement
 * drawSketch().
 */
function setup() {
    pageType = window.location.pathname.endsWith('print.html') ? 'print' : 'screen';
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    setCanvasDimension();
    setupForm(); // sketches need to implement this

    if (pageType) {
        // add page type as class to all DOM elements so CSS can differentiate
        document.querySelectorAll('*').forEach(el => el.classList.add(pageType));
    }
    if (pageType == 'print') setupQRCode();
}

function draw() {
    readControls();
    updateURL();
    drawSketch();
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function circle(x, y, d) {
    ctx.beginPath();
    ctx.arc(x, y, d, 0, 2 * Math.PI);
    ctx.stroke();
}

// h is between 0 and 360, s and v are between 0 and 1. Returns a CSS hsl color
// that can be used for ctx.fillStyle.
function hsv_to_hsl_color(h, s, v) {
    // both hsv and hsl values are in [0, 1]
    var l = (2 - s) * v / 2;

    if (l != 0) {
        if (l == 1) {
            s = 0;
        } else if (l < 0.5) {
            s = s * v / (l * 2);
        } else {
            s = s * v / (2 - l * 2);
        }
    }

    return `hsl(${h} ${Math.floor(s * 100)}% ${Math.floor(l * 100)}%)`;
}

addEventListener('load', (e) => {
    setup();
    draw();
});

addEventListener('keypress', (e) => {
    /* only handle keypresses in the main sketch view. For example, in the
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
