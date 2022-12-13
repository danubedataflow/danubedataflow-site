'use strict';

// also show the canvas size on the web page
function getCanvasDimension() {
    let headerHeight = 100 * pixelDensity();
    let dim = min(windowWidth, windowHeight - headerHeight);
    document.getElementById('canvasSize').innerText = `${dim} x ${dim}`;
    return [dim, dim];
}

function saveCanvasAsPNG() {
    let name = location.href.split('/').slice(-3, -1).join("--");
    saveCanvas(decodeURI(name) + '.png');
}

// returns 1 if handled, 0 if not
function handleStandardKeys() {
    if (key == 's') {
        saveCanvasAsPNG();
        return 1;
    } else if (key == 'r') {
        redraw();
        return 1;
    } else if (key == 'p') {
        setControlsRandomly();
        return 1;
    }
    return 0;
}

function getPointsForPolygon(sides, diameter, rotation) {
    // the polygon center is (0, 0)
    let points = [];
    for (let i = 0; i < sides + 1; i++) {
        let angle = 2 * Math.PI / sides * i + 2 * Math.PI * rotation / 360;
        points.push([
            Math.sin(angle) * diameter / 2,
            Math.cos(angle) * diameter / 2
        ]);
    }
    return points;
}

function randomIntRange(lowerBound, upperBound) {
    return int(random(lowerBound, upperBound + 1));
}

// Move elements matching a selector function to the front of the array.
Array.prototype.putFirst = function(selector) {
    return [
        ...this.filter(selector),
        ...this.filter(el => !selector(el)),
    ];
}

// sort an array of objects by a key
Array.prototype.sortByKey = function(key) {
    return this.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// call a function with elements [0. 1], then [1, 2] etc.
Array.prototype.pairwise = function(func) {
    for (let i = 0; i < this.length - 1; i++) {
        func(this[i], this[i + 1]);
    }
}

/* Fisher-Yates shuffle. This is not strictly necessary as p5.js provides a
 * shuffle() function. See https://gist.github.com/motoishmz/5239619
 */
Array.prototype.shuffle = function() {
    var i = this.length;
    while (i) {
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
};

let wes_palettes = [{
        name: 'BottleRocket1',
        colors: [
            '#A42820',
            '#5F5647',
            '#9B110E',
            '#3F5151',
            '#4E2A1E',
            '#550307',
            '#0C1707',
        ],
    },
    {
        name: 'BottleRocket2',
        colors: ['#FAD510', '#CB2314', '#273046', '#354823', '#1E1E1E'],
    },
    {
        name: 'Rushmore1',
        colors: ['#E1BD6D', '#EABE94', '#0B775E', '#35274A', '#F2300F'],
    },
    {
        name: 'Rushmore',
        colors: ['#E1BD6D', '#EABE94', '#0B775E', '#35274A', '#F2300F'],
    },
    {
        name: 'Royal1',
        colors: ['#899DA4', '#C93312', '#FAEFD1', '#DC863B'],
    },
    {
        name: 'Royal2',
        colors: ['#9A8822', '#F5CDB4', '#F8AFA8', '#FDDDA0', '#74A089'],
    },
    {
        name: 'Zissou1',
        colors: ['#3B9AB2', '#78B7C5', '#EBCC2A', '#E1AF00', '#F21A00'],
    },
    {
        name: 'Darjeeling1',
        colors: ['#FF0000', '#00A08A', '#F2AD00', '#F98400', '#5BBCD6'],
    },
    {
        name: 'Darjeeling2',
        colors: ['#ECCBAE', '#046C9A', '#D69C4E', '#ABDDDE', '#000000'],
    },
    {
        name: 'Chevalier1',
        colors: ['#446455', '#FDD262', '#D3DDDC', '#C7B19C'],
    },
    {
        name: 'FantasticFox1',
        colors: ['#DD8D29', '#E2D200', '#46ACC8', '#E58601', '#B40F20'],
    },
    {
        name: 'Moonrise1',
        colors: ['#F3DF6C', '#CEAB07', '#D5D5D3', '#24281A'],
    },
    {
        name: 'Moonrise2',
        colors: ['#798E87', '#C27D38', '#CCC591', '#29211F'],
    },
    {
        name: 'Moonrise3',
        colors: ['#85D4E3', '#F4B5BD', '#9C964A', '#CDC08C', '#FAD77B'],
    },
    {
        name: 'Cavalcanti1',
        colors: ['#D8B70A', '#02401B', '#A2A475', '#81A88D', '#972D15'],
    },
    {
        name: 'GrandBudapest1',
        colors: ['#F1BB7B', '#FD6467', '#5B1A18', '#D67236'],
    },
    {
        name: 'GrandBudapest2',
        colors: ['#E6A0C4', '#C6CDF7', '#D8A499', '#7294D4'],
    },
    {
        name: 'IsleofDogs1',
        colors: ['#9986A5', '#79402E', '#CCBA72', '#0F0D0E', '#D9D0D3', '#8D8680'],
    },
    {
        name: 'IsleofDogs2',
        colors: ['#EAD3BF', '#AA9486', '#B6854D', '#39312F', '#1C1718'],
    },
    {
        name: 'FrenchDispatch',
        colors: ['#90D4CC', '#BD3027', '#B0AFA2', '#7FC0C6', '#9D9C85'],
    },
];
