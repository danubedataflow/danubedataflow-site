import {
    Work
} from '/js/basework.js';
import {
    MathUtils,
    ArrayUtils
} from '/js/utils.js';
export class Work0018 extends Work {
    palette;
    color1;
    color2;
    getControls() {
        return [
            this.makeSlider('numTiles', 'Number of tiles per axis: {0}', 4, 40, 20),
            this.makeSlider('diagonalOrientationChance', "Probability of the diagonal's orientation: {0}%", 0, 100, 50),
            this.makeSelect('colorStrategy', 'Color strategy: ', [
                this.makeOption('random', 'Random'),
                this.makeOption('adjacent', 'Adjacent'),
            ]),
        ];
    }
    drawWork() {
        this.palette = ['white', '#777777', 'black'];
        this.tileIterator((tile) => {
            this.chooseColors(this.ctrl.colorStrategy);

            // We'll draw a diagonal from the upper left to the lower right.
            // But randomly we'll use scale() to flip along vertical axis so
            // we'll draw a diagonal from the upper left to the lower right.
            if (MathUtils.randomIntUpTo(100) < this.ctrl.diagonalOrientationChance)
                this.ctx.scale(-1, 1);

            this.ctx.fillStyle = this.color1;
            this.trianglePath(tile.upperRight(), tile.lowerLeft(), tile.lowerRight());
            this.ctx.fill();
            this.ctx.fillStyle = this.color2;
            this.trianglePath(tile.upperRight(), tile.lowerLeft(), tile.upperLeft());
            this.ctx.fill();
            this.color1 = this.color2;
        });
    }
    chooseColors(colorStrategy) {
        if (colorStrategy === 'random') {
            // choose two different random colors
            this.color1 = ArrayUtils.randomElement(this.palette);
            do {
                this.color2 = ArrayUtils.randomElement(this.palette);
            } while (this.color1 == this.color2);
        } else if (colorStrategy === 'adjacent') {
            this.color1 = this.color2; // reuse previous color
            if (this.color1 === undefined) this.color1 = MathUtils.random(this.palette);
            do {
                this.color2 = ArrayUtils.randomElement(this.palette);
            } while (this.color1 == this.color2);
        } else {
            console.log('invalid color strategy ' + colorStrategy);
        }
    }
    description = `Each tile is divided by a diagonal, either from the upper left to lower right or from the upper right to the lower left. Each half is filled randomly white, grey or black. The "adjacent" color choice strategy uses a color from the previous tile.`;
    createdDate = '2022-12-07';
}
