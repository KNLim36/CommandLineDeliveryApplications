const util = require("util");
const assert = require("assert");
const Tests = require("./tests/testCases");
const { offerService, offers } = require("./model/offer");
const { costCalculator } = require("./utils/costCalculator");
const { shipmentService } = require("./model/shipment");

//#region Functions
const runTestCases = () => {
    // Import test cases from another script to optimize the script size
    const testAmount = Tests.length;
    const testResults = [];

    // Loop through the tests array and execute each test
    for (const [
        index,
        { name, input, expectedOutput, func },
    ] of Tests.entries()) {
        try {
            const result = global[func](...Object.values(input));
            // If expected result is an array, use deepStrictEqual instead
            const assertionFunc =
                Array.isArray(expectedOutput) ||
                typeof expectedOutput === "object"
                    ? assert.deepStrictEqual
                    : assert.strictEqual;
            assertionFunc(result, expectedOutput);
            testResults.push({ result: "passed", name });
        } catch (error) {
            testResults.push({
                result: "failed",
                name,
                message: error.message,
            });
        }
    }

    const passedTests = testResults.filter((test) => test.result === "passed");

    for (const [index, { result, name, message }] of testResults.entries()) {
        const color = result === "passed" ? "green" : "yellow";
        const text = `Test ${index + 1}: ${name} ${result}!${
            message ? `: ${message}` : ""
        }`;
        outputColoredText(text, color);
    }

    const color = passedTests.length === testAmount ? "magenta" : "red";
    const summaryText =
        passedTests.length === testAmount
            ? `All ${testAmount} tests have passed successfully! 👍`
            : `Out of ${testAmount} tests, only ${passedTests.length} passed! 🤔`;
    outputColoredText(summaryText, color);
};

const outputColoredText = (text, color) => {
    const colors = {
        green: "\x1b[32m%s\x1b[0m",
        yellow: "\x1b[33m%s\x1b[0m",
        red: "\x1b[31m%s\x1b[0m",
        magenta: "\x1b[35m%s\x1b[0m",
    };
    const colorCode = colors[color] || colors.green; // default to green if color not provided
    console.log(colorCode, text);
};

const validatePackageId = (packageIdInput, offers, devMode = false) => {
    // Check if the package ID is a valid offer code
    if (validateOfferCode(packageIdInput, offers)) {
        const errorMessage = `The previous package has a leftover offer code '${packageIdInput}'. Please submit only 1 offer code for a package.`;
        if (!devMode) outputColoredText(errorMessage, "red");
        return errorMessage;
    }
};

const validateInput = (inputName, inputValue, devMode = false) => {
    const parsedValue = parseFloat(inputValue);
    if (!isNumber(parsedValue)) {
        const errorMessage = `The provided value for the ${inputName} is invalid. The received value is ${inputValue}, which is not a valid number.`;
        if (!devMode) outputColoredText(errorMessage, "red");
        return errorMessage;
    }
    return parsedValue;
};

const startProcessing = (args) => {
    const [baseDeliveryCostInput, packageAmountInput, ...packageDetails] = args;

    const baseDeliveryCost = validateInput(
        "base delivery cost",
        baseDeliveryCostInput
    );
    if (typeof baseDeliveryCost === "string") return baseDeliveryCost;

    const packageAmount = validateInput("package amount", packageAmountInput);
    if (typeof packageAmount === "string") return packageAmount;

    const packages = Array.from({ length: packageAmount }, () => {
        const pkgId = packageDetails.shift();
        validatePackageId(pkgId, offers);

        const pkgWeightInput = packageDetails.shift();
        const pkgWeight = validateInput("package weight", pkgWeightInput);
        if (typeof pkgWeight === "string") return pkgWeight;

        const pkgDistanceInput = packageDetails.shift();
        const pkgDistance = validateInput("package distance", pkgDistanceInput);
        if (typeof pkgDistance === "string") return pkgDistance;

        const offerCode = packageDetails.shift();
        return { pkgId, pkgWeight, pkgDistance, offerCode };
    });

    const [vehicleAmount, maxSpeed, maxCarryWeight] = packageDetails;
    let currentTime = 0;
    // let currentVehicleAmount = vehicleAmount;

    const plannedShipments = [];
    let packagesCopy = packages.slice(); // To not mutate the original packages

    for (let i = 0; i < vehicleAmount; i++) {
        // Plan a new shipment
        // const shipment = generateShipment(
        //     packagesCopy,
        //     maxCarryWeight,
        //     maxSpeed
        // );

        const shipment = createOptimalShipment(
            packages,
            maxCarryWeight,
            maxSpeed
        );

        // Add it into currently planned shipments
        plannedShipments.push(shipment);

        const shipmentPackages = shipment.packages;

        // Find the remaining packages
        packagesCopy = packagesCopy.filter((pkg) => {
            // Find the index of the current package in the shipment array
            const index = shipmentPackages.findIndex(
                (s) => s.pkgId === pkg.pkgId
            );

            // If the package is not in the shipment array, keep it
            return index === -1;
        });

        // console.log({ shipment, remainingPackages, maxCarryWeight });

        // outputColoredText("Deliver shipment", "red");
        // outputColoredText("Current Time: " + currentTime, "yellow");
        // outputColoredText("Current Time: " + currentTime, "yellow");
        // currentVehicleAmount--;
        // currentVehicleAmount
    }

    // console.log(
    //     util.inspect(plannedShipments, { showHidden: false, depth: null })
    // );

    const processedPackages = packages.map((pkg) =>
        processIndividualPackage(baseDeliveryCost, pkg, offers)
    );
};

const isNumber = (value) => {
    return typeof value === "number" && !isNaN(value);
};

const validateOfferCode = (offerCode, offers) => {
    return offerService.isValidOfferCode(offerCode, offers);
};

const calculateDiscountPercentage = (weight, distance, offerCode, offers) => {
    if (validateOfferCode(offerCode, offers)) {
        let offer = offerService.getOffer(offerCode, offers);
        return offerService.getDiscountPercentage(weight, distance, offer);
    }
    return 0;
};

const calculateDiscountAmount = (deliveryCost, discountPercentage) => {
    return costCalculator.calculateDiscountAmount(
        deliveryCost,
        discountPercentage
    );
};

const calculateDeliveryCost = (baseDeliveryCost, weight, distance) => {
    return costCalculator.calculateDeliveryCost(
        baseDeliveryCost,
        weight,
        distance
    );
};

const calculateTotalCost = (deliveryCost, discountAmount) => {
    return costCalculator.calculateTotalCost(deliveryCost, discountAmount);
};

const createOptimalShipment = (packages, maxWeight, maxSpeed) => {
    return shipmentService.createOptimalShipment(packages, maxWeight, maxSpeed);
};

// Process individual package and output ${packageId} ${discount} ${totalCost}
const processIndividualPackage = (
    baseDeliveryCost,
    { pkgId, pkgWeight, pkgDistance, offerCode },
    offers,
    devMode = false
) => {
    const weight = validateInput("package weight", pkgWeight);
    if (typeof weight === "string") return weight;

    const distance = validateInput("package distance", pkgDistance);
    if (typeof distance === "string") return distance;

    const discountPercentage = calculateDiscountPercentage(
        weight,
        distance,
        offerCode,
        offers
    );

    const deliveryCost = calculateDeliveryCost(
        baseDeliveryCost,
        weight,
        distance
    );

    const discountAmount = calculateDiscountAmount(
        deliveryCost,
        discountPercentage
    );

    const totalCost = calculateTotalCost(deliveryCost, discountAmount);

    const processedMessage = `${pkgId} ${discountAmount} ${totalCost}`;
    if (!devMode) outputColoredText(processedMessage, "green");
    return processedMessage;
};
//#endregion

//#region Main logic
global.isNumber = isNumber;
global.validateInput = validateInput;
global.validatePackageId = validatePackageId;
global.calculateDeliveryCost = calculateDeliveryCost;
global.calculateDiscountPercentage = calculateDiscountPercentage;
global.calculateDiscountAmount = calculateDiscountAmount;
global.calculateTotalCost = calculateTotalCost;
global.processIndividualPackage = processIndividualPackage;
global.validateOfferCode = validateOfferCode;
global.createOptimalShipment = createOptimalShipment;

try {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log("No arguments supplied");
    } else if (args[0] === "test") {
        runTestCases();
    } else if (args[0] === "start") {
        args.shift();
        startProcessing(args);
    } else {
        console.log("Invalid arguments supplied");
    }
} catch (error) {
    outputColoredText(error, "red");
}
//#endregion
