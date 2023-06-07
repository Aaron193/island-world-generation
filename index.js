const useRandomSeed = false;
function seedA() {
    return useRandomSeed ? Math.random() : 0.7289428334733732;
}
function seedA2() {
    return useRandomSeed ? Math.random() : 0.4134355511866319;
}

function seedB() {
    return useRandomSeed ? Math.random() : 0.24045613937572585;
}
function seedB2() {
    return useRandomSeed ? Math.random() : 0.5061377161818366;
}

function seedC() {
    return useRandomSeed ? Math.random() : 0.06912418408956489;
}
function seedC2() {
    return useRandomSeed ? Math.random() : 0.17021688997912854;
}

function random(n) {
    return Math.floor(Math.random() * n + 1);
}

function normalizeNoise(n) {
    return (n + 1) * 0.5;
}

function distanceFromCenter(x, y) {
    const distX = Math.abs(x - halfSize);
    const distY = Math.abs(y - halfSize);

    return distX * distX + distY * distY;
}

function scale(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

const canvas = document.createElement('canvas');
const size = 1000;
var halfSize = size * 0.5;

const islandRadius = size / 2;

canvas.width = size;
canvas.height = size;
document.body.appendChild(canvas);

const noise2D_A = createNoise2D(seedA),
    noise2D_B = createNoise2D(seedB),
    noise2D_C = createNoise2D(seedC),
    noise2D_A2 = createNoise2D(seedA2),
    noise2D_B2 = createNoise2D(seedB2),
    noise2D_C2 = createNoise2D(seedC2),
    ctx = canvas.getContext('2d'),
    imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height),
    width = imgdata.width,
    height = imgdata.height,
    data = imgdata.data;

function getNoiseA(x, y) {
    return normalizeNoise(noise2D_A(x / 64, y / 64)) * 255;
}
function getNoiseA2(x, y) {
    return normalizeNoise(noise2D_A2(x / 64, y / 64)) * 255;
}

function getNoiseB(x, y) {
    return normalizeNoise(noise2D_B(x / 100, y / 100)) * 255;
}
function getNoiseB2(x, y) {
    return normalizeNoise(noise2D_B2(x / 100, y / 100)) * 255;
}

function getNoiseC(x, y) {
    return normalizeNoise(noise2D_C(x / 216, y / 216)) * 255;
}
function getNoiseC2(x, y) {
    return normalizeNoise(noise2D_C2(x / 216, y / 216)) * 255;
}

// colors from https://github.com/timetocode/volcanic-island-generator
const colorMap = {
    1: {
        r: 61,
        g: 70,
        b: 41,
    },
    0.8: {
        r: 118,
        g: 133,
        b: 78,
    },
    0.69: {
        r: 153,
        g: 146,
        b: 78,
    },
    0.68: {
        r: 161,
        g: 164,
        b: 77,
    },
    0.545: {
        r: 197,
        g: 192,
        b: 111,
    },
    0.53: {
        r: 225,
        g: 209,
        b: 132,
    },
    0.51: {
        r: 248,
        g: 238,
        b: 202,
    },
    0.5: {
        r: 219,
        g: 187,
        b: 130,
    },
    0.49: {
        r: 10,
        g: 194,
        b: 182,
    },
    0.48: {
        r: 8,
        g: 139,
        b: 151,
    },
    0.46: {
        r: 0,
        g: 91,
        b: 130,
    },
    0.35: {
        r: 0,
        g: 39,
        b: 100,
    },
    0.25: {
        r: 7,
        g: 16,
        b: 59,
    },
    0.15: {
        r: 7,
        g: 16,
        b: 59,
    },
    0: {
        r: 11,
        g: 10,
        b: 42,
    },
};

// copilot
function getColorRGB(n) {
    const keys = Object.keys(colorMap);
    let closestKey = keys[0];
    for (let i = 0; i < keys.length; i++) {
        if (Math.abs(n - keys[i]) < Math.abs(n - closestKey)) {
            closestKey = keys[i];
        }
    }
    return colorMap[closestKey];
}

for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
        var index = (x + y * width) * 4;
        const noiseA = getNoiseA(x, y);
        const noiseB = getNoiseB(x, y);
        const noiseC = getNoiseC(x, y);

        const noiseA2 = getNoiseA2(x, y);
        const noiseB2 = getNoiseB2(x, y);
        const noiseC2 = getNoiseC2(x, y);
        let noiseAverage = (noiseA + noiseB + noiseC + noiseA2 + noiseB2 + noiseC2) / 6;

        const distSquared = distanceFromCenter(x, y);

        let sphereGrad = scale(distSquared, 0, islandRadius * islandRadius, 0, 255);
        sphereGrad = 255 - sphereGrad;

        noiseAverage = (noiseAverage + sphereGrad) / 2;

        const color = getColorRGB(noiseAverage / 255);
        // noiseAverage = sphereGrad;

        // const noiseAverage = noiseC;

        // invert white to black and black to white

        // noiseAverage = 255 - noiseAverage;

        data[index + 0] = color.r; // r
        data[index + 1] = color.g; // g
        data[index + 2] = color.b; // b

        // data[index + 0] = noiseAverage; // r
        // data[index + 1] = noiseAverage; // g
        // data[index + 2] = noiseAverage; // b

        data[index + 3] = 255; // a
    }
}
ctx.putImageData(imgdata, 0, 0);
