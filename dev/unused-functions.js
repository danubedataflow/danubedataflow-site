// sort an array of objects by a key
Array.prototype.sortByKey = function(key) {
    return this.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
