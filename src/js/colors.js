// generate color value for ctx.fillStyle and ctx.strokeStyle.
export function colorRGB(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}

export function colorRGBA(r, g, b, alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function colorHSL(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function colorHSLA(h, s, l, alpha) {
    return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
}
