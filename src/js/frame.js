'use strict';

/* copied from p5.js so we can use these constants in the global scope, i.e.,
 * outside setup() etc. Kludge.
 */
let P5C = {
    // blend mode constants
    BLEND: 'source-over',
    REMOVE: 'destination-out',
    ADD: 'lighter',
    DARKEST: 'darken',
    LIGHTEST: 'lighten',
    DIFFERENCE: 'difference',
    SUBTRACT: 'subtract',
    EXCLUSION: 'exclusion',
    MULTIPLY: 'multiply',
    SCREEN: 'screen',
    REPLACE: 'copy',
    OVERLAY: 'overlay',
    HARD_LIGHT: 'hard-light',
    SOFT_LIGHT: 'soft-light',
};

let canvas;
let controls = {};
let currentIteration = 0;

/* makeSlider() triggers controlsDidChange(), which eventually calls
 * initSketch(); this variable avoids running initSketch() before its time.
 */
let setupFinished = false;

/* Generate class accessors that can take a value or a function. When the
 * accessor is called as a getter and there is a function, it is evaluated.
 * This way you can animate shape properties.
 */
function createAccessors(theClass, props) {
    props.forEach((prop) => {
        let internalProp = "_" + prop;
        theClass.prototype[prop] = function(value) {
            if (value === undefined) {
                if (typeof this[internalProp] === "function") {
                    return this[internalProp](this);
                } else {
                    return this[internalProp];
                }
            } else {
                this[internalProp] = value;
                return this; // for chaining
            }
        };
    });
}

class Config {
    _maxIterations = -1;
}

createAccessors(Config, [
    "maxIterations"
]);

class SliderControl {

    constructor() {}

    // Only assign the new value if it has changed to avoid excessive
    // repainting.
    getValue() {
        let value = this.element().get();

        // support multiple handles
        if (Array.isArray(value)) {
            return value.map(numStr => parseFloat(numStr))
        } else {
            return parseFloat(this.element().get());
        }
    }

    setValue(value) {
        let v = parseFloat(value);
        if (isNaN(v)) {
            console.log(`${this.id()}: value "${value}" is not a number`);
        } else {
            let range = this.element().options.range;
            if (v < range.min || v > range.max) {
                console.log(`${this.id()}: value "${value}" is outside the range [${range.min}, ${range.max}]`);
            } else {
                this.element().set(value);
            }
        }
    }
}

createAccessors(SliderControl, [
    "element",
    "id",
]);

class CheckboxControl {

    constructor() {}

    getValue() {
        return this.element().checked;
    }

    setValue(value) {
        // convert string values that could come from URL query
        // parameters
        if (value === "true") value = true;
        if (value === "false") value = false;

        // validate
        if (typeof value === 'boolean') {
            this.element().checked = value;
        } else {
            console.log(`${this.id()}: value "${value}" is not boolean`);
        }
    }
}

createAccessors(CheckboxControl, [
    "element",
    "id",
]);

class SelectControl {

    constructor() {}

    getValue() {
        return this.element().value;
    }

    setValue(value) {
        // The spread syntax (`...`) turns the HTMLOptionsCollection into a
        // standard array.
        let optionValues = [...this.element().options].map(o => o.value)
        if (optionValues.includes(value)) {
            this.element().value = value;
        } else {
            console.log(`${this.id()}: value "${value}" is not a valid option`);
        }
    }
}

createAccessors(SelectControl, [
    "element",
    "id",
]);

function elementWithChildren(el, ...contents) {
    contents.forEach(child => el.appendChild(child));
    return el;
}

function makeForm(...contents) {
    elementWithChildren(document.getElementById('controls-form'), ...contents);
    initControls();
}

function makeLegend(legend) {
    let el = document.createElement('legend');
    el.appendChild(document.createTextNode(legend));
    return el;
}

function makeFieldset(legend, ...contents) {
    return elementWithChildren(
        document.createElement('fieldset'),
        makeLegend(legend),
        ...contents
    );
}

function makeDiv(config, ...contents) {
    let el = document.createElement('div');
    for (const [attr, value] of Object.entries(config)) {
        el.setAttribute(attr, value);
    }
    contents.forEach(child => el.appendChild(child));
    return el;
}

function makeLabel(config, ...contents) {
    let el = document.createElement('label');
    el.setAttribute('for', config.for);
    el.appendChild(document.createTextNode(config.label));
    contents.forEach(child => el.appendChild(child));
    return el;
}

function makeSlider(id, label, min, max, value, step = 1) {
    let containerDiv = document.createElement('div');

    // <label for="foo">The Foo: <span id="fooValue"></span></label>

    let valueSpan = document.createElement('span');
    containerDiv.appendChild(makeLabel({
        'for': id,
        'label': label + ': '
    }, valueSpan));

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
        // support multiple handles
        valueSpan.innerHTML = values.map(numStr => parseFloat(numStr)).join('-');
        controlsDidChange();
    });
    controls[id] = new SliderControl()
        .id(id)
        .element(slider);

    return containerDiv;
}

function makeCheckbox(id, label, defaultValue = true) {
    let containerDiv = document.createElement('div');

    containerDiv.appendChild(makeLabel({
        'for': id,
        'label': label
    }));

    let checkboxEl = document.createElement('input');
    checkboxEl.setAttribute('type', 'checkbox');
    checkboxEl.setAttribute('id', id);
    checkboxEl.oninput = controlsDidChange;
    containerDiv.appendChild(checkboxEl);

    controls[id] = new CheckboxControl()
        .id(id)
        .element(checkboxEl);
    controls[id].setValue(defaultValue);

    return containerDiv;
}

function makeOption(value, text = value) {
    let el = document.createElement('option');
    el.setAttribute('value', value);
    el.appendChild(document.createTextNode(text));
    return el;
}

function makeOptGroup(label, ...contents) {
    let el = document.createElement('optGroup');
    el.setAttribute('label', label);
    contents.forEach(child => el.appendChild(child));
    return el;
}

function makeSelect(id, label, ...contents) {
    let containerDiv = document.createElement('div');

    containerDiv.appendChild(makeLabel({
        'for': id,
        'label': label + ': '
    }));

    let selectEl = document.createElement('select');
    selectEl.setAttribute('id', id);
    contents.forEach(el => selectEl.appendChild(el));

    selectEl.onchange = controlsDidChange;
    containerDiv.appendChild(selectEl);

    controls[id] = new SelectControl()
        .id(id)
        .element(selectEl);

    return containerDiv;
}

function makeSelectColorMap(defaultValue = 'Viridis') {
    let containerDiv = makeSelect(
        'colorMap',
        'Color palette',
        makeOptGroup('Sequential',
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
        makeOptGroup('Diverging',
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
        makeOptGroup('Qualitative',
            makeOption('Set2'),
            makeOption('Accent'),
            makeOption('Set1'),
            makeOption('Set3'),
            makeOption('Dark2'),
            makeOption('Paired'),
            makeOption('Pastel2'),
            makeOption('Pastel1'),
        )
    );
    controls.colorMap.setValue(defaultValue);
    return containerDiv;
}

/* We only offer the values that make sense for sketches that are
 * being redrawn. The values are the corresponding p5.js constants.
 */
function makeSelectBlendMode(defaultValue = P5C.BLEND) {
    let containerDiv = makeSelect(
        'blendMode',
        'Blend mode',
        makeOption(P5C.BLEND, 'Blend'),
        makeOption(P5C.ADD, 'Lighter'),
        makeOption(P5C.DARKEST, 'Darkest'),
        makeOption(P5C.DIFFERENCE, 'Difference'),
        makeOption(P5C.MULTIPLY, 'Multiply'),
        makeOption(P5C.EXCLUSION, 'Exclusion'),
        makeOption(P5C.REPLACE, 'Replace'),
        makeOption(P5C.HARD_LIGHT, 'Hard light'),
    );
    controls.blendMode.setValue(defaultValue);
    return containerDiv;
}

function initControls() {

    // Grab the URLSearchParams early because the code below will
    // trigger controlsDidChange, which will also change the URL.

    let urlParams = new URLSearchParams(window.location.search);

    // init values from URL query parameters
    for (const [key, value] of urlParams) {
        // Only use query parameters that correspond to a control id
        if (controls.hasOwnProperty(key)) {
            controls[key].setValue(value);
        }
    }
    updateURL(); // because we potentially changed the controls
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

// update URL according to controls
function updateURL() {
    let urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(controls)) {
        urlParams.set(key, value.getValue());
    }

    /* Replace the URL in the browser's URL bar using the current control
     * values, without reloading the page.
     */
    let currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + urlParams.toString();
    window.history.replaceState(null, '', currentURL);
}

function controlsDidChange() {
    if (!setupFinished) return;
    readControls();
    updateURL();
    restart();
}

function getCanvasDimension() {
    let headerHeight = 100 * pixelDensity();
    let effectiveHeight = windowHeight - headerHeight;
    return min(windowWidth, effectiveHeight);
}

function showCanvasSize(dim) {
    document.getElementById('canvasSize').innerText = `${dim} x ${dim}`;
}

function createSquareCanvas() {
    let dim = getCanvasDimension();
    showCanvasSize(dim);
    return createCanvas(dim, dim).parent('sketch');
}

function resizeSquareCanvas() {
    let dim = getCanvasDimension();
    showCanvasSize(dim);
    resizeCanvas(dim, dim, true); // don't call redraw() immediately
}

function windowResized() {
    resizeSquareCanvas();
    restart();
}

function restart() {
    if (typeof initSketch == 'function') initSketch();
    currentIteration = 0;
    loop(); // also calls draw()
}

function toggleLooping() {
    if (didFinishDrawing()) return;
    (isLooping()) ? noLoop(): loop();
}

/**
 * Returns neatly formated timestamp e.g. "151025_172441_790".
 * From the book "Generative Design".
 *
 * @method timestamp
 * @return {String} formated timestamp
 */
function timestamp() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var millis = date.getMilliseconds();

    year = year.toString().substr(2);
    month = ("00" + month).substr(-2, 2);
    day = ("00" + day).substr(-2, 2);
    minute = ("00" + minute).substr(-2, 2);
    second = ("00" + second).substr(-2, 2);

    return [year, month, day, "_", hour, minute, second, "_", millis].join('');
};

function saveCanvasAsPNG() {
    saveCanvas(timestamp(), 'png');
}

function keyPressed() {
    if (key == 's') {
        let name = location.href.split('/').slice(-3, -1).join("--");
        saveCanvas(decodeURI(name) + '.png');
    }
    if (key == 'r') restart();
    if (key == 'l') toggleLooping();
}

function setup() {
    if (typeof setupSketch == 'function') setupSketch();
    canvas = createSquareCanvas();
    canvas.mouseClicked(toggleLooping);
    setupFinished = true;
    readControls();    // so initSketch() can use them
    if (typeof initSketch == 'function') initSketch();
}

function draw() {
    if (didFinishDrawing()) return;
    readControls();
    drawSketch(); // the user has to define this function
}

/* Code to control how many iterations (frames) we want to draw. The difference
 * to frameCount is that when the drawing is restarted, currentIterations is
 * reset but frameCount is not.
 *
 * `draw()` should first call `didFinishDrawing()` and if it is, return
 * immediately without drawing anything.
 *
 * The advantage is that after the drawing has finished, toggleLooping()
 * doesn't have any effect.
 *
 * In the sketch, don't use frameCount, use currentIteration. Also don't use
 * `noLoop()`.
 *
 * 'maxIterations', set in the config, can be 1 if draw() finishes in one call,
 * or some number if it needs that number of frames to finish the drawing, or
 * -1 - or any negative number - if it should continue indefinitely.
 *
 * The default for maxIterations is -1; you can set it in setup().
 */

function didFinishDrawing() {
    let max = config.maxIterations();
    if (max !== undefined && max >= 0 && currentIteration + 1 > max) {
        noLoop();
        return 1;
    } else {
        currentIteration++;
        return 0;
    }
}
