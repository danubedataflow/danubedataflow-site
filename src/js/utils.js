'use strict';

let controls = {},
    canvas;

// also show the canvas size on the web page
function getCanvasDimension() {
    let headerHeight = 100 * pixelDensity();
    let dim = min(windowWidth, windowHeight - headerHeight);
    document.getElementById('canvasSize').innerText = `${dim} x ${dim}`;
    return [dim, dim];
}

function saveCanvasAsPNG() {
    let name = location.href.split('/').slice(-3, -1).join("--");
    saveCanvas(decodeURI(name) + '.png');
}

function handleStandardKeys() {
    let keyHandlers = {
        s: saveCanvasAsPNG,
        r: redrawWithNewSeed,
        p: setControlsRandomly,
    };
    let handler = keyHandlers[key];
    if (handler) handler();
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

function randomIntRange(lowerBound, upperBound) {
    return int(random(lowerBound, upperBound + 1));
}

// Move elements matching a selector function to the front of the array.
Array.prototype.putFirst = function(selector) {
    return [
        ...this.filter(selector),
        ...this.filter(el => !selector(el)),
    ];
}

// sort an array of objects by a key
Array.prototype.sortByKey = function(key) {
    return this.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// call a function with elements [0. 1], then [1, 2] etc.
Array.prototype.pairwise = function(func) {
    for (let i = 0; i < this.length - 1; i++) {
        func(this[i], this[i + 1]);
    }
}

/* Fisher-Yates shuffle. This is not strictly necessary as p5.js provides a
 * shuffle() function. See https://gist.github.com/motoishmz/5239619
 */
Array.prototype.shuffle = function() {
    var i = this.length;
    while (i) {
        var j = Math.floor(random(i));
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
};

let wes_palettes = [{
        name: 'BottleRocket1',
        colors: [
            '#A42820',
            '#5F5647',
            '#9B110E',
            '#3F5151',
            '#4E2A1E',
            '#550307',
            '#0C1707',
        ],
    },
    {
        name: 'BottleRocket2',
        colors: ['#FAD510', '#CB2314', '#273046', '#354823', '#1E1E1E'],
    },
    {
        name: 'Rushmore1',
        colors: ['#E1BD6D', '#EABE94', '#0B775E', '#35274A', '#F2300F'],
    },
    {
        name: 'Rushmore',
        colors: ['#E1BD6D', '#EABE94', '#0B775E', '#35274A', '#F2300F'],
    },
    {
        name: 'Royal1',
        colors: ['#899DA4', '#C93312', '#FAEFD1', '#DC863B'],
    },
    {
        name: 'Royal2',
        colors: ['#9A8822', '#F5CDB4', '#F8AFA8', '#FDDDA0', '#74A089'],
    },
    {
        name: 'Zissou1',
        colors: ['#3B9AB2', '#78B7C5', '#EBCC2A', '#E1AF00', '#F21A00'],
    },
    {
        name: 'Darjeeling1',
        colors: ['#FF0000', '#00A08A', '#F2AD00', '#F98400', '#5BBCD6'],
    },
    {
        name: 'Darjeeling2',
        colors: ['#ECCBAE', '#046C9A', '#D69C4E', '#ABDDDE', '#000000'],
    },
    {
        name: 'Chevalier1',
        colors: ['#446455', '#FDD262', '#D3DDDC', '#C7B19C'],
    },
    {
        name: 'FantasticFox1',
        colors: ['#DD8D29', '#E2D200', '#46ACC8', '#E58601', '#B40F20'],
    },
    {
        name: 'Moonrise1',
        colors: ['#F3DF6C', '#CEAB07', '#D5D5D3', '#24281A'],
    },
    {
        name: 'Moonrise2',
        colors: ['#798E87', '#C27D38', '#CCC591', '#29211F'],
    },
    {
        name: 'Moonrise3',
        colors: ['#85D4E3', '#F4B5BD', '#9C964A', '#CDC08C', '#FAD77B'],
    },
    {
        name: 'Cavalcanti1',
        colors: ['#D8B70A', '#02401B', '#A2A475', '#81A88D', '#972D15'],
    },
    {
        name: 'GrandBudapest1',
        colors: ['#F1BB7B', '#FD6467', '#5B1A18', '#D67236'],
    },
    {
        name: 'GrandBudapest2',
        colors: ['#E6A0C4', '#C6CDF7', '#D8A499', '#7294D4'],
    },
    {
        name: 'IsleofDogs1',
        colors: ['#9986A5', '#79402E', '#CCBA72', '#0F0D0E', '#D9D0D3', '#8D8680'],
    },
    {
        name: 'IsleofDogs2',
        colors: ['#EAD3BF', '#AA9486', '#B6854D', '#39312F', '#1C1718'],
    },
    {
        name: 'FrenchDispatch',
        colors: ['#90D4CC', '#BD3027', '#B0AFA2', '#7FC0C6', '#9D9C85'],
    },
];

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

/* Seed handling
 *
 * If a seed is given in URL's query string, that is used. If
 * not, a random seed is used.
 *
 * The seed that is used is shown below the form controls.
 *
 * Both the "redraw with new seed" button and the "randomize
 * parameters" button will generate a new seed. That is because
 * if the redraw button didn't generate a new seed, you couldn't
 * get the exact same image with the shown seed because every
 * time you redraw it calls random() again.
 *
 * To be able to regenerate the exact same image, copy the URL
 * including the seed. The "copy link" button does that as well.
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
        if (!/^\d{3,9}$/.test(value)) value = int(Math.random() * 1000000000);
        this.element.value = value;
        randomSeed(value);
        noiseSeed(value);
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

function makeForm(...contents) {
    let form = document.getElementById('controls-form');
    contents.push(makeSeed()),
        contents.forEach(child => form.appendChild(child));

    /* like controlsDidChange() but don't call redraw(). That's because
     * draw() will be called anyway by p5.js and we don't want to call it
     * twice because draw() will call random(), and you wouldn't be able
     * to get the exact same image even with the same seed.
     */

    // readControls();
    // updateURL();
}

function makeFieldset(legendText, ...contents) {
    let fieldset = document.createElement('fieldset');
    let legend = document.createElement('legend');
    legend.appendChild(document.createTextNode(legendText));
    fieldset.appendChild(legend);
    contents.forEach(child => fieldset.appendChild(child));
    return fieldset;
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
        valueSpan.innerHTML = values.map(numStr => parseFloat(numStr)).join(' bis ');
    });
    slider.on('change', function(values, handle) {
        redraw();
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
    checkboxEl.oninput = function() {
        redraw();
    };
    containerDiv.appendChild(checkboxEl);

    controls[id] = new CheckboxControl(id, checkboxEl);
    value = valueWithSearchParam(id, value);
    if (value != null) controls[id].setValue(value);

    return containerDiv;
}

function makeSeed() {
    let id = 'seed',
        containerDiv = document.createElement('div');

    containerDiv.appendChild(makeLabel({
        'for': id,
        'label': 'Seed: '
    }));

    let inputEl = document.createElement('input');
    inputEl.setAttribute('id', id);
    containerDiv.appendChild(inputEl);

    controls[id] = new SeedControl(id, inputEl);
    controls[id].setValue(valueWithSearchParam(id)); // no default value

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

    selectEl.onchange = function() {
        redraw();
    };
    containerDiv.appendChild(selectEl);

    controls[id] = new SelectControl(id, selectEl);

    value = valueWithSearchParam(id, value);
    if (value != null) controls[id].setValue(value);

    return containerDiv;
}

function makeSelectColorMap() {
    let containerDiv = makeSelect(
        'colorMap',
        'Farbpalette', [
            makeOptGroup('Sequetiell',
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
            makeOptGroup('Divergierend',
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
            makeOptGroup('Qualitativ',
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
    // use [] because these are const names
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

    // Sort the options by their display name.
    options = options.sort((a, b) => {
        nameFor[a].localeCompare(nameFor[b])
    });

    // The default value is 'blend' if it is an option, or the first
    // sorted element if it isn't.

    let defaultValue = options.putFirst(el => el == BLEND).at(0);
    return makeSelect(
        'blendMode',
        'Farbmischung',
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

function getCurrentURL() {
    let urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(controls)) {
        urlParams.set(key, value.getValue());
    }

    /* Replace the URL in the browser's URL bar using the current control
     * values, without reloading the page.
     */
    return window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + urlParams.toString();
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
            let optionValues = [...c.element.options].map(o => o.value)
            c.setValue(random(optionValues));

        } else if (c instanceof CheckboxControl) {
            c.setValue(random([true, false]));

        } else if (c instanceof SeedControl) {
            c.setValue(); // trigger new random seed
        }
    });
    redraw();
}

function redrawWithNewSeed() {
    controls.seed.setValue(); // trigger new random seed
    redraw();
}

function makeGrid(numTilesX, numTilesY, tileCallback) {
    let tileWidth = width / numTilesX;
    let tileHeight = height / numTilesY;
    for (let y = 1; y <= numTilesY; y++) {
        for (let x = 1; x <= numTilesX; x++) {
            push();

            // translate to the tile's center point
            translate((x - 1) * tileWidth + tileWidth / 2, (y - 1) * tileHeight + tileHeight / 2);

            let tile = {
                width: tileWidth,
                height: tileHeight,
                upperLeft: [-tileWidth / 2, -tileHeight / 2],
                upperRight: [tileWidth / 2, -tileHeight / 2],
                lowerLeft: [tileWidth / 2, -tileHeight / 2],
                lowerRight: [tileWidth / 2, tileHeight / 2],

                // upper mid, right mid, bottom mid, left mid
                upperMiddle: [0, -tileHeight / 2],
                rightMiddle: [tileWidth / 2, 0],
                lowerMiddle: [0, tileHeight / 2],
                leftMiddle: [-tileWidth / 2, 0],
                center: [0, 0],
            };

            tileCallback(tile);

            pop();
        }
    }
}

function copyLink() {
    if (window.isSecureContext) {
        navigator.clipboard.writeText(getCurrentURL());
    } else {
        alert("Eine sichere Verbindung ist nötig, um ins Clipboard schreiben zu können.");
    }
}

function setupButtons() {
    // print.html draws a sketch but doesn't have buttons, so check
    // whether each button exists.

    let clickHandlers = {
        source: function() {
            window.location = 'source.html';
        },
        redraw: redrawWithNewSeed,
        randomize: setControlsRandomly,
        save: saveCanvasAsPNG,
        copylink: copyLink,
        print: function() {
            window.open('print.html' + window.location.search, '_blank');
        },
    };
    for (const [name, handler] of Object.entries(clickHandlers)) {
        let button = document.getElementById("button-" + name);
        if (button) {
            button.addEventListener("click", handler);
        }
    }

}

function basename () {
    let path = window.location.pathname;
    if (path.endsWith('/')) {
        return 'index.html';
    } else {
        return path.split('/').reverse()[0];
    }
}

function setupQRCode() {
	new QRCode(document.getElementById("qrcode"), getCurrentURL());

}

/* Sketch skeleton
 *
 * setup(), draw(), windowResized() and keyPressed() are used by p5.js.
 * They are pretty much the same for every sketch. Invidual sketches just
 * need to set up the form and to implement drawSketch().
 */
function setup() {
    setupButtons();
    canvas = createCanvas(...getCanvasDimension()).parent('sketch');
    setupForm(); // sketches need to implement this
    if (basename() == 'print.html') setupQRCode();
    noLoop();
}

function draw() {
    readControls();
    updateURL();
    drawSketch();
}

function windowResized() {
    // After resizing the canvas, we want to draw with the same seed as before
    // resizing.
    controls.seed.setValue(controls.seed.getValue());
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    /* only handle keypresses in the main sketch view. For example, in the
     * print view, it doesn't make sense, and they even interfere with "Cmd-P"
     * for printing.
     */
    if (basename() == 'index.html') handleStandardKeys();
}
