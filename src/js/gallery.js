let MAX_WORK = 38;

// Define the order of works, for prev/next navigation. unshift() so the newest
// works come first.

let gallery = [];
for (let i = 1; i <= MAX_WORK; i++) {
    gallery.unshift('work-' + String(i).padStart(4, '0'));
}
export {
    gallery
};
