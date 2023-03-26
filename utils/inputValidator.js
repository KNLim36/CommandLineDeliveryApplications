const { consolePrinter } = require("./consolePrinter");

const validateRange = (value, range, rangeMaxInclusive) =>
    rangeMaxInclusive
        ? value >= range.min && value <= range.max
        : value >= range.min && value < range.max;

const isNumber = (value) => typeof value === "number" && !isNaN(value);

const validateNumericInput = (inputName, inputValue, devMode = false) => {
    const parsedValue = parseFloat(inputValue);
    if (!isNumber(parsedValue)) {
        const errorMessage = `The provided value for the ${inputName} is invalid. The received value is ${inputValue}, which is not a valid number.`;
        consolePrinter.print(errorMessage, "red", devMode);
        throw new Error(errorMessage);
    }
    return parsedValue;
};

const validateArguments = (labels, inputs) =>
    inputs.map((input, index) => validateNumericInput(labels[index], input));

const inputValidator = {
    validateRange,
    isNumber,
    validateNumericInput,
    validateArguments,
};

module.exports = {
    inputValidator,
};
