import {
    gallery
} from '/js/gallery.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
import {
    Point
} from '/js/point.js';
export class Work {
    controls = {};
    ctrl = {};
    canvas;
    width;
    height;
    ctx;
    setCanvasDimension() {
        let headerHeight = 100 * window.devicePixelRatio;
        this.width = this.height = Math.min(window.innerWidth, window.innerHeight - headerHeight);

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
        this.canvas.width = this.width * ratio;
        this.canvas.height = this.height * ratio;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.scale(ratio, ratio);

        // also show the canvas size on the web page
        document.getElementById('canvasSize').innerText = `${this.width} x ${this.height}`;
    }
    saveCanvas() {
        this.canvas.toBlob(blob => {
            var zip = new JSZip();
            let info = {
                work: {
                    title: this.title,
                    createdDate: this.createdDate,
                    description: this.description
                },
                parameters: this.ctrl,
                canvas: {
                    width: this.width * window.devicePixelRatio,
                    height: this.height * window.devicePixelRatio
                },
                timestamp: new Date().toISOString(),
                url: this.getCurrentURL({
                    timestamp: 1
                }),
            };
            let zipFileName = `${info.work.title} at ${info.timestamp}.zip`;
            zip.file('canvas.png', blob, {
                base64: true
            });
            zip.file('info.json', JSON.stringify(info, null, 2));
            zip.generateAsync({
                type: 'blob'
            }).then(function(content) {
                saveAs(content, zipFileName)
            });
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
    goToNewerWork() {
        let newerIndex = (gallery.findIndex(el => el == this.path) -
            1 + gallery.length) % gallery.length;
        window.location.href = `/${gallery[newerIndex]}/`;
    }
    goToOlderWork() {
        let olderIndex = (gallery.findIndex(el => el == this.path) +
            1) % gallery.length;
        window.location.href = `/${gallery[olderIndex]}/`;
    }
    // Control values can be overridden if they exists in the URL search params.
    valueWithSearchParam(key, defaultValue) {
        let value = new URLSearchParams(window.location.search).get(key);
        if (value == null) {
            return defaultValue;
        } else {
            // convert noUISlider ranges to arrays
            if (value.includes(',')) value = value.split(',');
            return value;
        }
    }
    makeForm(contents) {
        let form = document.getElementById('controls-form');
        contents.push(this.makeSeed()),
            contents.forEach(child => form.appendChild(child));
    }
    makeFieldset(legend, ...contents) {
        let fieldsetEl = document.createElement('fieldset');
        let legendEl = document.createElement('legend');
        legendEl.innerText = legend;
        fieldsetEl.appendChild(legendEl);
        contents.forEach(child => fieldsetEl.appendChild(child));
        return fieldsetEl;
    }
    makeDiv(config, ...contents) {
        let el = document.createElement('div');
        for (const [attr, value] of Object.entries(config)) {
            el.setAttribute(attr, value);
        }
        contents.forEach(child => el.appendChild(child));
        return el;
    }
    makeLabel(id) {
        let el = document.createElement('label');
        // 'id' is the value of the 'for' attribute.
        el.setAttribute('for', id);
        return el;
    }
    makeSlider(id, label, min, max, value, step = 1) {
        value = this.valueWithSearchParam(id, value);
        let containerDiv = document.createElement('div');
        let labelEl = this.makeLabel(id);
        labelEl.innerText = label.replace('{0}', parseFloat(value));
        containerDiv.appendChild(labelEl);
        // <div class="slider-wrapper"><div id="foo"></div></div>
        let sliderDiv = this.makeDiv({
            'id': id
        });
        containerDiv.appendChild(
            this.makeDiv({
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
        slider.on('slide', () => this.redrawWithSameSeed());
        this.controls[id] = new SliderControl(id, slider);
        return containerDiv;
    }
    makeCheckbox(id, label, value = true) {
        let containerDiv = document.createElement('div');
        let labelEl = this.makeLabel(id);
        labelEl.innerText = label;
        containerDiv.appendChild(labelEl);
        let checkboxEl = document.createElement('input');
        checkboxEl.setAttribute('type', 'checkbox');
        checkboxEl.setAttribute('id', id);
        checkboxEl.oninput = () => this.redrawWithSameSeed();
        containerDiv.appendChild(checkboxEl);
        this.controls[id] = new CheckboxControl(id, checkboxEl);
        value = this.valueWithSearchParam(id, value);
        if (value != null) this.controls[id].setValue(value);
        return containerDiv;
    }
    makeSeed() {
        let id = 'seed',
            containerDiv = document.createElement('div');
        let labelEl = this.makeLabel(id);
        labelEl.innerText = 'Random seed:';
        containerDiv.appendChild(labelEl);
        let inputEl = document.createElement('input');
        inputEl.setAttribute('id', id);
        containerDiv.appendChild(inputEl);
        this.controls[id] = new SeedControl(id, inputEl);
        this.controls[id].setValue(this.valueWithSearchParam(id)); // no default value
        return containerDiv;
    }
    makeOption(value, name) {
        if (name === undefined) {
            name = value;
        }
        let el = document.createElement('option');
        el.setAttribute('value', value);
        el.innerText = name;
        return el;
    }
    makeOptGroup(label, ...contents) {
        let el = document.createElement('optGroup');
        el.setAttribute('label', label);
        contents.forEach(child => el.appendChild(child));
        return el;
    }
    makeSelect(id, label, contents, value) {
        let containerDiv = document.createElement('div');
        let labelEl = this.makeLabel(id);
        labelEl.innerText = label;
        containerDiv.appendChild(labelEl);
        let selectEl = document.createElement('select');
        selectEl.setAttribute('id', id);
        contents.forEach(el => selectEl.appendChild(el));
        selectEl.onchange = () => this.redrawWithSameSeed();
        containerDiv.appendChild(selectEl);
        this.controls[id] = new SelectControl(id, selectEl);
        value = this.valueWithSearchParam(id, value);
        if (value != null) this.controls[id].setValue(value);
        return containerDiv;
    }
    makeSelectColorMap() {
        let containerDiv = this.makeSelect(
            'colorMap', 'Color map: ', [
                this.makeOptGroup('Sequential',
                    this.makeOption('OrRd', 'Orange-Red'),
                    this.makeOption('PuBu', 'Purple-Blue'),
                    this.makeOption('BuPu', 'Blue-Purple'),
                    this.makeOption('Oranges'),
                    this.makeOption('BuGn', 'Blue-Green'),
                    this.makeOption('YlOrBr', 'Yellow-Orange-Brown'),
                    this.makeOption('YlGn', 'Yellow-Green'),
                    this.makeOption('Reds'),
                    this.makeOption('RdPu', 'Red-Purple'),
                    this.makeOption('Greens'),
                    this.makeOption('YlGnBu', 'Yellow-Green-Blue'),
                    this.makeOption('Purples'),
                    this.makeOption('GnBu', 'Green-Blue'),
                    this.makeOption('Greys'),
                    this.makeOption('YlOrRd', 'Yellow-Orange-Red'),
                    this.makeOption('PuRd', 'Purple-Red'),
                    this.makeOption('Blues'),
                    this.makeOption('PuBuGn', 'Purple-Blue-Green'),
                    this.makeOption('Viridis'),
                ),
                this.makeOptGroup('Diverging',
                    this.makeOption('Spectral'),
                    this.makeOption('RdYlGn', 'Red-Yellow-Green'),
                    this.makeOption('RdBu', 'Red-Blue'),
                    this.makeOption('PiYG', 'Pink-Yellow-Green'),
                    this.makeOption('PRGn', 'Purple-Green'),
                    this.makeOption('RdYlBu', 'Red-Yellow-Blue'),
                    this.makeOption('BrBG', 'Brown-Blue-Green'),
                    this.makeOption('RdGy', 'Red-Gray'),
                    this.makeOption('PuOr', 'Purple-Orange'),
                ),
                this.makeOptGroup('Qualitative',
                    this.makeOption('Set2', 'Set 2'),
                    this.makeOption('Accent'),
                    this.makeOption('Set1', 'Set 1'),
                    this.makeOption('Set3', 'Set 3'),
                    this.makeOption('Dark2', 'Dark 2'),
                    this.makeOption('Paired'),
                    this.makeOption('Pastel2', 'Pastel 2'),
                    this.makeOption('Pastel1', 'Pastel 1'),
                )
            ],
            'Viridis'
        );
        return containerDiv;
    }
    makeSelectBlendMode(options) {
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
        return this.makeSelect(
            'blendMode', 'Blend mode: ',
            options.map(c => this.makeOption(c, nameFor[c])),
            options[0]
        );
    }
    getCurrentURL(config = {}) {
        let urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(this.controls)) {
            urlParams.set(key, value.getValue());
        }
        if (config.timestamp) urlParams.set('timestamp', Date.now());
        /* Replace the URL in the browser's URL bar using the current control
         * values, without reloading the page.
         */
        return window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + urlParams.toString();
    }
    setControlsRandomly() {
        Object.values(this.controls).forEach(c => {
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
                    return min + MathUtils.randomIntRange(0, maxStep) * options.step
                };
                if (Array.isArray(options.start)) {
                    c.setValue(options.start.map(genValue).sort((a, b) => a - b));
                } else {
                    c.setValue(genValue());
                }
            } else if (c instanceof SelectControl) {
                c.setValue(ArrayUtils.randomElement(c.getOptionValues()));
            } else if (c instanceof CheckboxControl) {
                c.setValue(ArrayUtils.randomElement([true, false]));
            }
            // No need to set the seed value (for SeedControl); that's done in
            // redrawWithNewSeed() anyway.
        });
        this.redrawWithNewSeed();
    }
    redrawWithSameSeed() {
        this.controls.seed.setSameSeedAgain();
        this.draw();
    }
    redrawWithNewSeed() {
        this.controls.seed.setValue(); // trigger new random seed
        this.draw();
    }
    copyLink() {
        if (window.isSecureContext) {
            navigator.clipboard.writeText(this.getCurrentURL({
                timestamp: 1
            }));
        } else {
            throw new Error("Need a secure connection to be able to write to the clipboard.");
        }
    }
    /* Work skeleton
     *
     * Individual works just need to set up the form and to implement
     * drawWork().
     */
    setup() {
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.setCanvasDimension();
        // Take the work title from the page title so a work desn't have to
        // set it twice. Also use the title to set the link to the GitHub source
        // code page.
        this.title = document.getElementsByTagName("title")[0].innerText;
        this.path = window.location.pathname.match(/work-\d+/)[0]; // 'work-0001' etc.
        document.getElementById('workTitle').innerText = this.title;
        document.getElementById('createdDate').innerText = this.createdDate;
        this.setupDescription();
        document.getElementById('sourceLink').setAttribute('href',
            `https://github.com/danubedataflow/danubedataflow-site/blob/master/src/${this.path}/work.js`);
        document.getElementById('goToNewerWork').addEventListener('click', (e) => this.goToNewerWork());
        document.getElementById('goToOlderWork').addEventListener('click', (e) => this.goToOlderWork());
        document.getElementById('redrawWithNewSeed').addEventListener('click', (e) => this.redrawWithNewSeed());
        document.getElementById('setControlsRandomly').addEventListener('click', (e) => this.setControlsRandomly());
        document.getElementById('saveCanvas').addEventListener('click', (e) => this.saveCanvas());
        document.getElementById('copyLink').addEventListener('click', (e) => this.copyLink());
        this.makeForm(this.getControls());
    }
    getControls() {
        throw new Error('Unimplemented method getControls()!');
    }
    setupDescription() {
        let summaryText = this.description.substring(0, 60) +
            '&hellip; [more]';
        // If the descriotion disclosure element is closed, show the summary
        // text. If it is opened, show 'Description' so there is no
        // duplicate text.
        let descriptionDetailsEl = document.getElementById('description');
        let descriptionSpan = document.createElement('descriptionSpan');
        descriptionSpan.innerHTML = this.description;
        descriptionDetailsEl.appendChild(descriptionSpan);
        let summaryEl = descriptionDetailsEl.querySelector('summary');
        summaryEl.innerHTML = summaryText; // default since it starts closed
        descriptionDetailsEl.addEventListener('toggle', (event) => {
            summaryEl.innerHTML = descriptionDetailsEl.open ?
                'Description' : summaryText;
        });
    }
    draw() {
        /* Copy the current control values into the `ctrl` object. This way the
         * works don't have to call `this.controls.someControl.getValue()` but can
         * just use `this.ctrl.someControl`. Note that the former is a function
         * call, so it would be expensive to call this several times, leading to
         * new temporary variables. The latter is just a variable.
         */
        this.ctrl = {};
        for (const [key, value] of Object.entries(this.controls)) {
            this.ctrl[key] = value.getValue();
        }
        /* Update the URL according to controls. But don't update it if it
         * hasn't changed. Because if you continuously resize the window,
         * Safari produces a "SecurityError: Attempt to use
         * history.replaceState() more than 100 times per 30 seconds".
         */
        let currentURL = this.getCurrentURL();
        if (currentURL != window.location.href) {
            window.history.replaceState(null, '', currentURL);
        }

        // Each call of drawWork() must be independent, i.e., not depend on the
        // previous image. So surround the call with ctx.save() and
        // crtx.restore(), so the drawWork() methods don't have to do it.
        this.ctx.save();
        this.drawWork();
        this.ctx.restore();
    }
    drawWork() {
        throw new Error('Unimplemented method drawWork()!');
    }
    clearCanvas(color = 'white') {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }

    // For works where you want some space between the canvas and the drawing,
    // or to ensure that a thicker border around the drawing is fully visible,
    // or if you draw slightly outside the canvas and want to scale it down to
    // see it all.
    scaleCanvas(scaleFactor) {
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.scale(scaleFactor, scaleFactor)
        this.ctx.translate(-this.width / 2, -this.height / 2);
    }

    tileIterator(callback, scanOrder = 'xy') {
        let tileDim = this.width / this.ctrl.numTiles;
        let handleTile = (x, y) => {
            this.ctx.save();
            // translate to tile center so any scale() or rotate() happen there
            this.ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);
            callback(new Tile(x, y, tileDim));
            this.ctx.restore();
        };
        if (scanOrder == 'xy') {
            // left-to-right, from the top row to the bottom row
            for (let y = 0; y < this.ctrl.numTiles; y++) {
                for (let x = 0; x < this.ctrl.numTiles; x++) {
                    handleTile(x, y);
                }
            }
        } else if (scanOrder == 'yx') {
            // top-to-bottom, from the first column to the last column
            for (let x = 0; x < this.ctrl.numTiles; x++) {
                for (let y = 0; y < this.ctrl.numTiles; y++) {
                    handleTile(x, y);
                }
            }
        } else if (scanOrder == 'serpentine') {
            // rows top-to-bottom, alternating between left-to-right and
            // right-to-left
            for (let y = 0; y < this.ctrl.numTiles; y++) {
                if (y % 2 == 0) {
                    // even rows: left-to-right
                    for (let x = 0; x < this.ctrl.numTiles; x++) {
                        handleTile(x, y);
                    }
                } else {
                    // odd rows: right-to-left
                    for (let x = this.ctrl.numTiles - 1; x >= 0; x--) {
                        handleTile(x, y);
                    }
                }
            }
        } else {
            throw new Error(`tileIterator(): invalid scan order '${scanOrder}'`);
        }
    }
    // Context-related convenience methods for Points
    lineToPoint(p) {
        this.ctx.lineTo(...p.asArray());
    }
    moveToPoint(p) {
        this.ctx.moveTo(...p.asArray());
    }
    fillRectForPoint(p, w, h) {
        this.ctx.fillRect(...p.asArray(), w, h);
    }
    strokeRectForPoint(p, w, h) {
        this.ctx.strokeRect(...p.asArray(), w, h);
    }
    translateToPoint(p) {
        this.ctx.translate(...p.asArray());
    }
    linePath(p1, p2) {
        this.ctx.beginPath();
        this.moveToPoint(p1);
        this.lineToPoint(p2);
        this.ctx.closePath();
    }

    trianglePath(p1, p2, p3) {
        this.ctx.beginPath();
        this.moveToPoint(p1);
        this.lineToPoint(p2);
        this.lineToPoint(p3);
        this.ctx.closePath();
    }

    run() {
        addEventListener('keypress', (e) => {
            if (e.code == 'KeyS') this.saveCanvas();
            if (e.code == 'KeyR') this.redrawWithNewSeed();
            if (e.code == 'KeyP') this.setControlsRandomly();
        });
        // Arrow keys trigger the 'keydown' event, not the 'keypress' event.
        addEventListener('keydown', (e) => {
            if (e.key == 'ArrowLeft') this.goToNewerWork();
            if (e.key == 'ArrowRight') this.goToOlderWork();
        });
        addEventListener('resize', (e) => {
            this.controls.seed.setSameSeedAgain();
            this.setCanvasDimension();
            this.draw();
        });
        this.setup();
        this.draw();
    }
}
// classes for UI control elements
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
        MathUtils.randomSeed(value);
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
class Tile {
    constructor(x, y, tileDim) {
        this.x = x;
        this.y = y;
        this.tileDim = tileDim;
    }

    // The following methods assume that the context has been translated so
    // that (0, 0) is at the center of the tile. handleTile() in tileIterator()
    // above does that.

    upperLeft() {
        return new Point(-this.tileDim / 2, -this.tileDim / 2);
    }

    upperMiddle() {
        return new Point(0, -this.tileDim / 2);
    }

    upperRight() {
        return new Point(this.tileDim / 2, -this.tileDim / 2);
    }

    middleLeft() {
        return new Point(-this.tileDim / 2, 0);
    }

    center() {
        return new Point(0, 0);
    }

    middleRight() {
        return new Point(this.tileDim / 2, 0);
    }

    lowerLeft() {
        return new Point(-this.tileDim / 2, this.tileDim / 2);
    }

    lowerMiddle() {
        return new Point(0, this.tileDim / 2);
    }

    lowerRight() {
        return new Point(this.tileDim / 2, this.tileDim / 2);
    }
}
