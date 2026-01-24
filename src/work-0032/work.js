import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ArrayUtils,
    ColorUtils
} from '/js/utils.js';
export class Work0032 extends Work {
    shapes = [
        [
            '.....',
            '.....',
            'XXXXX',
            '.....',
            '.....'
        ],
        [
            'X....',
            'X....',
            'XXXXX',
            'X....',
            'X....'
        ],
        [
            'X...X',
            'X...X',
            'XXXXX',
            'X...X',
            'X...X'
        ],
        [
            'XXXXX',
            'X...X',
            'X...X',
            'X...X',
            'X...X'
        ],
        [
            'X...X',
            'X...X',
            'XXXXX',
            'X...X',
            'XXXXX'
        ],
        [
            'XXXXX',
            'X...X',
            'X...X',
            'X...X',
            'XXXXX'
        ],
        [
            'X....',
            'XXXXX',
            'X....',
            'XXXXX',
            'X....'
        ],
        [
            'XXXXX',
            '.....',
            '.....',
            '.....',
            'XXXXX'
        ],
        [
            'XXXXX',
            'X....',
            'XXXXX',
            'X....',
            'XXXXX'
        ],
        [
            'XXXXX',
            '....X',
            'XXXXX',
            'X....',
            'XXXXX'
        ],
        [
            'XXXXX',
            '.....',
            'XXXXX',
            '.....',
            'XXXXX'
        ],
        [
            'XXXXX',
            '.X.X.',
            '.X.X.',
            '.X.X.',
            'XXXXX'
        ],
        [
            'XXXXX',
            '....X',
            '....X',
            '....X',
            '....X'
        ]
    ];
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 10, 5),
            this.makeFieldset('Colors',
                this.makeCheckbox('useColors', 'Colors: '),
                this.makeSelectColorMap(),
                this.makeSlider('numColors', 'Number of colors: {0}', 1, 8, 2),
                this.makeSlider('ratioColoredTiles', 'Ratio of colored tiles: {0}', 8, 32, 16),
            ),
            this.makeFieldset('Layers',
                this.makeCheckbox('useLayers', 'Layers: '),
                this.makeSlider('numLayers', 'Number of layers: {0}', 2, 8, 4),
                this.makeSlider('alphaRange', 'Transparency range (alpha): {0} to {1}', 10, 100, [50, 60]),
            ),
        ];
    }
    drawWork() {
        this.clearCanvas();
        this.palette = chroma.scale(this.ctrl.colorMap).colors(this.ctrl.numColors);
        if (this.ctrl.useLayers) {
            for (let layer = 1; layer <= this.ctrl.numLayers; layer++) {
                this.drawLayer();
            }
        } else {
            this.drawLayer();
        }
    }
    drawLayer() {
        // see Work 0024
        let numColored = Math.max(1, Math.round(this.ctrl.numTiles * this.ctrl.numTiles / this.ctrl.ratioColoredTiles));
        let shouldColorArray = ArrayUtils.shuffle(Array(this.ctrl.numTiles * this.ctrl.numTiles).fill(false)
            .map((el, index) => index < numColored));
        this.tileIterator((tile) => {
            this.ctx.scale(0.9, 0.9);
            this.drawTile(tile, shouldColorArray);
        });
    }
    drawTile(tile, shouldColorArray) {
        // each tile consists of 5 x 5 "pixels"
        let pixelDim = tile.tileDim / 5;
        // random rotation by a multiple of 90 degrees
        this.ctx.rotate(MathUtils.randomIntUpTo(4) * Math.PI / 2);
        // Use calls to random() in any case so the shapes, chosen by another
        // randomElement() below, stay the same when you // change the color
        // chance.
        let alpha = MathUtils.randomIntRange(...this.ctrl.alphaRange) / 100;
        // alpha is only used if we use layers
        if (!this.ctrl.useLayers) alpha = 1;
        if (this.ctrl.useColors) {
            if (shouldColorArray.shift()) {
                this.ctx.fillStyle = ColorUtils.colorRGBA(...chroma(ArrayUtils.randomElement(this.palette)).rgb(), alpha);
            } else {
                this.ctx.fillStyle = ColorUtils.colorRGBA(0, 0, 0, alpha);
            }
        } else {
            this.ctx.fillStyle = ColorUtils.colorRGBA(0, 0, 0, alpha);
        }
        // draw a random shape's pixels
        let shape = ArrayUtils.randomElement(this.shapes);
        for (let px = 0; px < 5; px++) {
            for (let py = 0; py < 5; py++) {
                // if the shape array has an 'X' at (px,py), draw a rectangle there
                if (shape[px].charAt(py) == 'X') {
                    // Assuming that the context has been moved to the
                    // tile's center, calculate the upper left corner of
                    // pixel (px, py).
                    let ulX = (px - 2.5) * pixelDim;
                    let ulY = (py - 2.5) * pixelDim;
                    this.ctx.fillRect(ulX, ulY, pixelDim, pixelDim);
                }
            }
        }
    }
    description = `Each square tile has one or more layers of shapes. The shapes can optionally be colored. If there is more than one layer`;
    createdDate = '2025-01-20';
}