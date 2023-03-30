const colorCodeEnum = {
    black: "\x1b[30m%s\x1b[0m",
    red: "\x1b[31m%s\x1b[0m",
    green: "\x1b[32m%s\x1b[0m",
    yellow: "\x1b[33m%s\x1b[0m",
    blue: "\x1b[34m%s\x1b[0m",
    magenta: "\x1b[35m%s\x1b[0m",
    cyan: "\x1b[36m%s\x1b[0m",
    white: "\x1b[37m%s\x1b[0m",
    brightBlack: "\x1b[90m%s\x1b[0m",
    brightRed: "\x1b[91m%s\x1b[0m",
    brightGreen: "\x1b[92m%s\x1b[0m",
    brightYellow: "\x1b[93m%s\x1b[0m",
    brightBlue: "\x1b[94m%s\x1b[0m",
    brightMagenta: "\x1b[95m%s\x1b[0m",
    brightCyan: "\x1b[96m%s\x1b[0m",
    brightWhite: "\x1b[97m%s\x1b[0m",
};

const constructProcessedMessage = (
    { id, arrivalTime },
    discountAmount,
    totalCost
) => {
    return arrivalTime
        ? `${id} ${discountAmount} ${totalCost} ${arrivalTime}`
        : `${id} ${discountAmount} ${totalCost}`;
};

const outputColoredText = (text, color = colorCodeEnum.green) => {
    console.log(color, text);
};

const print = (message, color, devMode = false) => {
    if (!devMode) outputColoredText(message, color);
};

const consolePrinter = { outputColoredText, print, constructProcessedMessage };

module.exports = {
    consolePrinter,
    colorCodeEnum,
};
