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
}
