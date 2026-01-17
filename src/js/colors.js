'use strict';
// generate color value for ctx.fillStyle and ctx.strokeStyle.
function colorRGB(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}

function colorRGBA(r, g, b, alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function colorHSL(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function colorHSLA(h, s, l, alpha) {
    return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
}
export {
    colorRGB,
    colorRGBA,
    colorHSL,
    colorHSLA
};