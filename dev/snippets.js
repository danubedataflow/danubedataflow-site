getControls() {
    return [
            this.makeFieldset('Colors',
                this.makeSelectColorMap(),
                this.makeSelectBlendMode(['source-over', 'darken', 'difference', 'exclusion', 'hard-light', 'multiply']),
                this.makeSlider('numColors', 'Number of colors: {0}', 1, 32, 25),
            ),
    ]
}


drawWork() {
    this.clearCanvas(color);
    this.ctx.globalCompositeOperation = this.ctrl.blendMode;

    // ...
    let palette = new Palette(this.ctrl.colorMap, this.ctrl.numColors);
    this.ctx.fillStyle = palette.getRandomColor();
    this.fillRectForPoint(p, w, h);

    // ...
    let path = new Path2D();
    path.moveTo(x, y);
    path.lineTo(x, y);
    path.closePath();   // optional
    this.ctx.stroke(path);
    this.ctx.fill(path, "evenodd");
}

