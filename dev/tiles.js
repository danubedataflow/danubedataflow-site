tileIterator(callback) {
    let tileDim = Math.floor(this.width / ctrl.numTiles);
    for (let x = 0; x < this.ctrl.numTiles; x++) {
        for (let y = 0; y < this.ctrl.numTiles; y++) {
            ctx.save();

            // translate to tile center so any scale() or rotate() happen there
            ctx.translate((x + 0.5) * tileDim, (y + 0.5) * tileDim);

            let tileConfig = {
                    x: x,
                    y: y,
                    tileDim: tileDim,
                    upperLeft: new Point(-tileDim / 2, -tileDim / 2),
                    upperRight: new Point(tileDim / 2, -tileDim / 2),
                    lowerLeft: new Point(-tileDim / 2, tileDim / 2),
                    lowerRight: new Point(tileDim / 2, tileDim / 2),
                },

                callback(tileConfig);

            ctx.restore();
        }
    }
}
