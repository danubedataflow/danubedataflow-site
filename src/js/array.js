import { MathUtils } from '/js/math.js';

export class ArrayUtils {
    // call a function with elements [0, 1], then [1, 2] etc.
    static pairwise(array, func) {
        for (let i = 0; i < array.length - 1; i++) {
            func(array[i], array[i + 1]);
        }
    }
    // https://gist.github.com/motoishmz/5239619
    // Fisher-Yates
    //
    // First copy the array so we don't modify the original array in-place.
    static shuffle(array) {
        const copy = array.slice(); // or [...array]
        let i = copy.length;
        while (i) {
            const j = Math.floor(MathUtils.random() * i);
            const t = copy[--i];
            copy[i] = copy[j];
            copy[j] = t;
        }
        return copy;
    };
    static randomElement(array) {
        return array[Math.floor(MathUtils.random() * array.length)];
    }
    static arrayFromIntRange(from, to) {
        let result = [];
        for (let i = from; i <= to; i++) {
            result.push(i);
        }
        return result;
    }
}
