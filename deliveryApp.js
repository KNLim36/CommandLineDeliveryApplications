const assert = require("assert");
const { TestCases, resultEnum } = require("./tests/testCases");
const { offerService, offers } = require("./model/offer");
const { costCalculator } = require("./utils/costCalculator");
const { shipmentService } = require("./model/shipment");
const { packageService } = require("./model/package");
const { inputValidator } = require("./utils/inputValidator");
const { consolePrinter, colorEnum } = require("./utils/consolePrinter");

//#region Tests
const runTestCases = () => {
    const testCaseResults = executeTests();
    reportTestResults(testCaseResults);
};

const executeTests = () => {
    const testCaseResults = [];

    for (const [index, testCase] of TestCases.entries()) {
        const { name, input, expectedOutput, func } = testCase;
        try {
            const result = global[func](...Object.values(input));
            const assertionFunc =
                Array.isArray(expectedOutput) ||
                typeof expectedOutput === "object"
                    ? assert.deepStrictEqual
                    : assert.strictEqual;
            assertionFunc(result, expectedOutput);
            testCaseResults.push({ result: resultEnum.success, name });
        } catch (error) {
            testCaseResults.push({
                result: resultEnum.failure,
                name,
                message: error.message,
            });
        }
    }

    return testCaseResults;
};

const reportTestResults = (testCaseResults) => {
    const passedTests = testCaseResults.filter(
        (test) => test.result === resultEnum.success
    );

    for (const [
        index,
        { result, name, message },
    ] of testCaseResults.entries()) {
        const color =
            result === resultEnum.success ? colorEnum.green : colorEnum.yellow;
        const text = `Test ${index + 1}: ${name} ${result}!${
            message ? `: ${message}` : ""
        }`;
        consolePrinter.outputColoredText(text, color);
    }

    const color =
        passedTests.length === testCaseResults.length
            ? colorEnum.magenta
            : colorEnum.red;
    const summaryText =
        passedTests.length === testCaseResults.length
            ? `All ${testCaseResults.length} tests have passed successfully! 👍`
            : `Out of ${testCaseResults.length} tests, only ${passedTests.length} passed! 🤔`;
    consolePrinter.outputColoredText(summaryText, color);
};
//#endregion

const processDelivery = (arguments) => {
    const { packageAmount, packageDetails, baseDeliveryCost } =
        getDeliveryDetails(arguments);

    const packages = packageService.generatePackages(
        packageAmount,
        packageDetails
    );

    const { vehicleAmount, maxSpeed, maxCarryWeight } =
        getRemainingInput(packageDetails);

    // If user did not input vehicle amount, max speed and carry weight
    // We only calculate discount amount and cost
    const shouldDeliverPackage =
        typeof vehicleAmount !== "undefined" &&
        typeof maxSpeed !== "undefined" &&
        typeof maxCarryWeight !== "undefined";

    if (shouldDeliverPackage) {
        let currentVehicleAmount = vehicleAmount;

        let deliveredPackages = deliverPackages(
            packages,
            maxCarryWeight,
            maxSpeed,
            currentVehicleAmount
        );

        processDeliveredPackages(
            packages,
            deliveredPackages,
            offers,
            baseDeliveryCost
        );
    } else {
        processUndeliveredPackages(packages, offers, baseDeliveryCost);
    }
};

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

const processIndividualPackage = (
    { id, weight, distance, offerCode, arrivalTime },
    offers,
    baseDeliveryCost,
    skipTime = false
) => {
    const deliveryCost = getDeliveryCost(baseDeliveryCost, weight, distance);
    const discountPercentage = getDiscountPercentage(
        weight,
        distance,
        offerCode,
        offers
    );
    const discountAmount = getDiscountAmount(deliveryCost, discountPercentage);
    const totalCost = getTotalCost(deliveryCost, discountAmount);
    return constructProcessedMessage(
        { id, arrivalTime },
        discountAmount,
        totalCost,
        skipTime
    );
};

const deliverPackages = (
    packages,
    maxCarryWeight,
    maxSpeed,
    currentVehicleAmount
) => {
    let undeliveredPackages = [...packages];
    let deliveredPackages = [];
    let progressingShipments = [];
    let currentTime = 0;

    while (undeliveredPackages.length || progressingShipments.length) {
        if (undeliveredPackages.length && currentVehicleAmount) {
            const shipment = shipmentService.createOptimalShipment(
                undeliveredPackages,
                maxCarryWeight,
                maxSpeed,
                currentTime
            );
            undeliveredPackages = packageService.filterOutPackages(
                undeliveredPackages,
                shipment.packages
            );
            progressingShipments.push(shipment);
            currentVehicleAmount--;
        } else {
            const minReturnTime =
                shipmentService.calculateMinReturnTime(progressingShipments);
            const quickestShipments = shipmentService.getQuickestShipments(
                progressingShipments,
                minReturnTime
            );
            for (const shipment of quickestShipments) {
                deliveredPackages.push(...shipment.packages);
            }
            currentVehicleAmount +=
                shipmentService.calculateReturningVehicleAmount(
                    progressingShipments,
                    minReturnTime
                );
            currentTime = minReturnTime;
            progressingShipments = progressingShipments.filter(
                (shipment) => !quickestShipments.includes(shipment)
            );
        }
    }

    return deliveredPackages;
};

const processDeliveredPackages = (
    packages,
    deliveredPackages,
    offers,
    baseDeliveryCost,
    devMode = false
) => {
    const sortedDeliveredPackages = packageService.sortPackages(
        packages,
        deliveredPackages
    );

    sortedDeliveredPackages.forEach((package) => {
        const processedMessage = processIndividualPackage(
            package,
            offers,
            baseDeliveryCost
        );

        if (!devMode)
            consolePrinter.outputColoredText(processedMessage, colorEnum.green);
    });
};

const processUndeliveredPackages = (
    packages,
    offers,
    baseDeliveryCost,
    devMode = false
) => {
    packages.forEach((package) => {
        const processedMessage = processIndividualPackage(
            package,
            offers,
            baseDeliveryCost,
            true
        );
        if (!devMode)
            consolePrinter.outputColoredText(processedMessage, colorEnum.green);
    });
};

const constructProcessedMessage = (
    { id, arrivalTime },
    discountAmount,
    totalCost,
    skipTime
) => {
    if (skipTime) {
        return `${id} ${discountAmount} ${totalCost}`;
    } else {
        return `${id} ${discountAmount} ${totalCost} ${arrivalTime}`;
    }
};

const getDeliveryCost = (baseDeliveryCost, weight, distance) => {
    return costCalculator.calculateDeliveryCost(
        baseDeliveryCost,
        weight,
        distance
    );
};

const getDiscountPercentage = (weight, distance, offerCode, offers) => {
    return offerService.getDiscountPercentage(
        weight,
        distance,
        offerCode,
        offers
    );
};

const getDiscountAmount = (deliveryCost, discountPercentage) => {
    return costCalculator.calculateDiscountAmount(
        deliveryCost,
        discountPercentage
    );
};

const getTotalCost = (deliveryCost, discountAmount) => {
    return costCalculator.calculateTotalCost(deliveryCost, discountAmount);
};

global.isNumber = inputValidator.isNumber;
global.validateNumericInput = inputValidator.validateNumericInput;
global.calculateDeliveryCost = costCalculator.calculateDeliveryCost;
global.calculateTotalCost = costCalculator.calculateTotalCost;
global.isValidOfferCode = offerService.isValidOfferCode;
global.processIndividualPackage = processIndividualPackage;
global.calculateDiscountAmount = costCalculator.calculateDiscountAmount;
global.createOptimalShipment = shipmentService.createOptimalShipment;
try {
    // Since the first 2 arguments process.execPath and file path
    const arguments = process.argv.slice(2);
    if (arguments.length === 0) {
        console.log("No arguments supplied");
    } else if (arguments[0] === "test") {
        runTestCases();
    } else if (arguments[0] === "start") {
        // Remove the "start" argument since it's no longer needed
        arguments.shift();
        processDelivery(arguments);
    } else {
        console.log("Invalid arguments supplied");
    }
} catch (error) {
    consolePrinter.outputColoredText(error, colorEnum.red);
}
