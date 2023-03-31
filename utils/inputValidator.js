const { consolePrinter, colorCodeEnum } = require("./consolePrinter");

const validateRange = (value, range, rangeMaxInclusive) =>
    rangeMaxInclusive
        ? value >= range.min && value <= range.max
        : value >= range.min && value < range.max;

const isNumber = (value) => typeof value === "number" && !isNaN(value);

const validateFloatInput = (inputName, inputValue, devMode = false) => {
    const regex = /^[+-]?\d+(\.\d+)?$/;
    if (!regex.test(inputValue)) {
        const errorMessage = `The provided value for the ${inputName} is invalid. The received value is ${inputValue}, which is not a valid float.`;
        if (!devMode) consolePrinter.print(errorMessage, colorCodeEnum.red);
        return errorMessage;
    }
    const parsedValue = parseFloat(inputValue);
    if (isNaN(parsedValue)) {
        const errorMessage = `The provided value for the ${inputName} is invalid. The received value is ${inputValue}, which is not a valid float.`;
        if (!devMode) consolePrinter.print(errorMessage, colorCodeEnum.red);
        return errorMessage;
    }
    return parsedValue;
};

const validateArguments = (labels, inputs) =>
    inputs.map((input, index) => validateFloatInput(labels[index], input));

const getRemainingInput = (arguments) => {
    const [vehicleAmount, maxSpeed, maxCarryWeight] = arguments;
    if (vehicleAmount && maxSpeed && maxCarryWeight) {
        const [validVehicleAmount, validMaxSpeed, validMaxCarryWeight] =
            inputValidator.validateArguments(
                ["Vehicle amount", "Max speed", "Max carry weight"],
                [vehicleAmount, maxSpeed, maxCarryWeight]
            );
        return {
            vehicleAmount: validVehicleAmount,
            maxSpeed: validMaxSpeed,
            maxCarryWeight: validMaxCarryWeight,
        };
    }
    return {
        vehicleAmount: undefined,
        maxSpeed: undefined,
        maxCarryWeight: undefined,
    };
};

const separateInputArguments = (arguments) => {
    const [baseDeliveryCostInput, packageAmountInput, ...packageDetails] =
        arguments;
    return { baseDeliveryCostInput, packageAmountInput, packageDetails };
};

const validateDeliveryDetails = (validateLabels, inputs) => {
    return inputValidator.validateArguments(validateLabels, inputs);
};

const getDeliveryDetails = (arguments) => {
    const { baseDeliveryCostInput, packageAmountInput, packageDetails } =
        separateInputArguments(arguments);

    const [baseDeliveryCost, packageAmount] = validateDeliveryDetails(
        ["base delivery cost", "package amount"],
        [baseDeliveryCostInput, packageAmountInput]
    );

    return { packageAmount, baseDeliveryCost, packageDetails };
};

const inputValidator = {
    validateRange,
    isNumber,
    validateFloatInput,
    validateArguments,
    getRemainingInput,
    getDeliveryDetails,
};

module.exports = {
    inputValidator,
};
