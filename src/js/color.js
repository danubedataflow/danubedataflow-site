import {
    ArrayUtils
} from '/js/array.js';
export class ColorUtils {
    // generate color value for ctx.fillStyle and ctx.strokeStyle.
    static colorRGB(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    }
    static colorRGBA(r, g, b, alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    static colorHSL(h, s, l) {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }
    static colorHSLA(h, s, l, alpha) {
        return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
    }
    static colorHexToRGBA(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return this.colorRGBA(r, g, b, alpha);
    }

}

export class Palette {

    palette; // an array of hex color values

    constructor(colorMap, numColors) {
        this.colorMap = colorMap;
        this.numColors = numColors;
        this.palette = chroma.scale(this.colorMap).colors(this.numColors);
    }

    getColors() {
        return this.palette;
    }

    getRandomColor() {
        return ArrayUtils.randomElement(this.palette);
    }

    getRandomColorsDistinctNeighbors(numColors) {
        let colors = [];
        for (let k = 0; k < numColors; k++) {
            colors[k] = this.getRandomColor();

            // adjacent colors must be different
            while (k > 0 && colors[k] == colors[k - 1]) {
                colors[k] = this.getRandomColor();
            }
        }
        return colors;
    }
}
