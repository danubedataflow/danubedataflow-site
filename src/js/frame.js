'use strict';

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

// also show the canvas size on the web page
function getCanvasDimension() {
    let headerHeight = 100 * pixelDensity();
    let dim = min(windowWidth, windowHeight - headerHeight);
    document.getElementById('canvasSize').innerText = `${dim} x ${dim}`;
    return [ dim, dim ];
}

function saveCanvasAsPNG() {
    let name = location.href.split('/').slice(-3, -1).join("--");
    saveCanvas(decodeURI(name) + '.png');
}
