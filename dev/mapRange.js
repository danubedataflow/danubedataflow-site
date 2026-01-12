// linearly map a value from the range (a..b) to (0..1), then to (c..d).
function mapRange(value, a, b, c, d) {
    return ((value - a) / (b - a)) * (d - c);
}

// This is a generic function; it practice it can often be simplified, e.g.,
// when mapping from "0..b" to "0..100".
