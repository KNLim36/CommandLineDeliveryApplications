const colorEnum = {
    green: "green",
    yellow: "yellow",
    red: "red",
    magenta: "magenta",
};

const colorCodeEnum = {
    green: "\x1b[32m%s\x1b[0m",
    yellow: "\x1b[33m%s\x1b[0m",
    red: "\x1b[31m%s\x1b[0m",
    magenta: "\x1b[35m%s\x1b[0m",
};

const outputColoredText = (text, color) => {
    const colorCode = colorCodeEnum[color] || colorCodeEnum.green; // default to green if color not provided
    console.log(colorCode, text);
};

const print = (errorMessage, color, devMode) => {
    if (!devMode) outputColoredText(errorMessage, color);
};

const consolePrinter = { outputColoredText, print };

module.exports = {
    consolePrinter,
    colorEnum,
};
