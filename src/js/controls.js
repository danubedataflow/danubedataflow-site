'use strict';

let ignoreControlChange = 0,
    controls = {};

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
        // convert string values that could come from URL query
        // parameters
        if (value === "true") value = true;
        if (value === "false") value = false;

        // validate
        if (typeof value === 'boolean') {
            this.element.checked = value;
        } else {
            console.log(`${this.id}: value "${value}" is not boolean`);
        }
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
        let optionValues = [...this.element.options].map(o => o.value)
        if (optionValues.includes(value)) {
            this.element.value = value;
        } else {
            console.log(`${this.id}: value "${value}" is not a valid option`);
        }
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

function elementWithChildren(el, ...contents) {
    contents.forEach(child => el.appendChild(child));
    return el;
}

function makeForm(...contents) {
    ignoreControlChange = 1;
    elementWithChildren(document.getElementById('controls-form'), ...contents);
    ignoreControlChange = 0;
    controlsDidChange();
    updateURL(); // because we potentially changed the controls
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
    value = valueWithSearchParam(id, value);

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
    controls[id] = new SliderControl(id, slider);
    return containerDiv;
}

function makeCheckbox(id, label, value = true) {
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

    controls[id] = new CheckboxControl(id, checkboxEl);
    value = valueWithSearchParam(id, value);
    if (value != null) controls[id].setValue(value);

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

function makeSelect(id, label, contents, value) {
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

    controls[id] = new SelectControl(id, selectEl);

    value = valueWithSearchParam(id, value);
    if (value != null) controls[id].setValue(value);

    return containerDiv;
}

function makeSelectColorMap() {
    let containerDiv = makeSelect(
        'colorMap',
        'Color palette', [
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
        ],
        'Viridis'
    );
    return containerDiv;
}

/* We only offer the values that make sense for sketches that are
 * being redrawn. The values are the corresponding p5.js constants.
 */
function makeSelectBlendMode(options) {
    let nameFor = {
        [ADD]: 'Lighter',
        [BLEND]: 'Blend',
        [BURN]: 'Burn',
        [DARKEST]: 'Darkest',
        [DIFFERENCE]: 'Difference',
        [DODGE]: 'Dodge',
        [EXCLUSION]: 'Exclusion',
        [HARD_LIGHT]: 'Hard light',
        [LIGHTEST]: 'Lighten',
        [MULTIPLY]: 'Multiply',
        [OVERLAY]: 'Overlay',
        [REMOVE]: 'Remove',
        [REPLACE]: 'Copy',
        [SCREEN]: 'Screen',
        [SOFT_LIGHT]: 'Soft light',
    };

    if (options == null) {
        options = Object.keys(nameFor);
    }

    // Sort the options by name. The default value is 'blend' if it is an
    // option, or the first sorted element if it isn't.

    options = options.sort();
    let defaultValue = options.putFirst(el => el == BLEND).at(0);
    return makeSelect(
        'blendMode',
        'Blend mode',
        options.map(c => makeOption(c, nameFor[c])),
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
    if (ignoreControlChange) return;
    readControls();
    updateURL();
    redraw();
}

function setControlsRandomly() {
    ignoreControlChange = 1;
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
            let optionValues = [...c.element.options].map(o => o.value)
            c.setValue(random(optionValues));

        } else if (c instanceof CheckboxControl) {
            c.setValue(random([true, false]));
        }
    });
    ignoreControlChange = 0;
    controlsDidChange();
}
