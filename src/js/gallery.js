// Define the order of works, for prev/next navigation:
// [ 'work-0034', ..., 'work-0002', 'work-0001' ]
//
// unshift() so the newest works come first.
let gallery = [];
for (let i = 1; i <= 36; i++) {
    gallery.unshift('work-' + String(i).padStart(4, '0'));
}
export {
    gallery
};