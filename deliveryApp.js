const assert = require("assert");
const Tests = require("./tests/testCases");
const { Offer, offerService, offers } = require("./model/offer");
const { costCalculator } = require("./utils/costCalculator");

const runTestCases = () => {
    // Import test cases from another script to optimize the script size
    // const Tests = [
    //     {
    //         name: "Base delivery cost input (number)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("base delivery cost", 300, true),
    //                 300
    //             ),
    //     },
    //     {
    //         name: "Base delivery cost input (negative number)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("base delivery cost", -1, true),
    //                 -1
    //             ),
    //     },
    //     {
    //         name: "Base delivery cost input (zero)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("base delivery cost", 0, true),
    //                 0
    //             ),
    //     },
    //     {
    //         name: "Base delivery cost input (number with string type)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("base delivery cost", "100", true),
    //                 100
    //             ),
    //     },
    //     {
    //         name: "Base delivery cost input (string)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("base delivery cost", "hello", true),
    //                 "The provided value for the base delivery cost is invalid. The received value is hello, which is not a valid number."
    //             ),
    //     },
    //     {
    //         name: "Base delivery cost input (null)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("base delivery cost", null, true),
    //                 "The provided value for the base delivery cost is invalid. The received value is null, which is not a valid number."
    //             ),
    //     },
    //     {
    //         name: "Base delivery cost input (undefined)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("base delivery cost", undefined, true),
    //                 "The provided value for the base delivery cost is invalid. The received value is undefined, which is not a valid number."
    //             ),
    //     },
    //     {
    //         name: "Is Number (number)",
    //         test: () => assert.strictEqual(isNumber(700), true),
    //     },
    //     {
    //         name: "Is Number (string)",
    //         test: () => assert.strictEqual(isNumber("700"), false),
    //     },
    //     {
    //         name: "Validate package weight (number)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("package weight", 700, true),
    //                 700
    //             ),
    //     },
    //     {
    //         name: "Validate package weight (number with string type)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("package weight", "700", true),
    //                 700
    //             ),
    //     },
    //     {
    //         name: "Validate package weight (string)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validateInput("package weight", "hi", true),
    //                 "The provided value for the package weight is invalid. The received value is hi, which is not a valid number."
    //             ),
    //     },
    //     {
    //         name: "Validate package id (double offer code submission)",
    //         test: () =>
    //             assert.strictEqual(
    //                 validatePackageId("OFR001", offers),
    //                 "The previous package has a leftover offer code 'OFR001'. Please submit only 1 offer code for a package."
    //             ),
    //     },
    //     {
    //         name: "Delivery cost calculation 1",
    //         test: () =>
    //             assert.strictEqual(calculateDeliveryCost(100, 50, 30), 750),
    //     },
    //     {
    //         name: "Delivery cost calculation 2",
    //         test: () =>
    //             assert.strictEqual(calculateDeliveryCost(100, 75, 125), 1475),
    //     },
    //     {
    //         name: "Delivery cost calculation 3",
    //         test: () =>
    //             assert.strictEqual(calculateDeliveryCost(100, 175, 100), 2350),
    //     },
    //     {
    //         name: "Delivery cost calculation 4",
    //         test: () =>
    //             assert.strictEqual(calculateDeliveryCost(100, 110, 60), 1500),
    //     },
    //     {
    //         name: "Delivery cost calculation 5",
    //         test: () =>
    //             assert.strictEqual(calculateDeliveryCost(100, 155, 95), 2125),
    //     },
    //     {
    //         name: "Total cost calculation",
    //         test: () => assert.strictEqual(calculateTotalCost(700, 35), 665.0),
    //     },
    //     {
    //         name: "Discount amount calculation",
    //         test: () =>
    //             assert.strictEqual(calculateDiscountAmount(100, 0.35), 35),
    //     },
    //     {
    //         name: "Process individual sample PKG1",
    //         test: () =>
    //             assert.strictEqual(
    //                 processIndividualPackage(
    //                     100,
    //                     {
    //                         pkgId: "PKG1",
    //                         pkgWeight: 5,
    //                         pkgDistance: 5,
    //                         offerCode: "OFR001",
    //                     },
    //                     [
    //                         Offer(
    //                             "OFR001",
    //                             { min: 70, max: 200 },
    //                             { min: 0, max: 200 },
    //                             10,
    //                             true,
    //                             false
    //                         ),
    //                     ],
    //                     true
    //                 ),
    //                 "PKG1 0 175"
    //             ),
    //     },
    //     {
    //         name: "Process individual sample PKG2",
    //         test: () =>
    //             assert.strictEqual(
    //                 processIndividualPackage(
    //                     100,
    //                     {
    //                         pkgId: "PKG2",
    //                         pkgWeight: 15,
    //                         pkgDistance: 5,
    //                         offerCode: "OFR002",
    //                     },
    //                     [
    //                         Offer(
    //                             "OFR002",
    //                             { min: 100, max: 250 },
    //                             { min: 50, max: 150 },
    //                             7,
    //                             true,
    //                             true
    //                         ),
    //                     ],
    //                     true
    //                 ),
    //                 "PKG2 0 275"
    //             ),
    //     },
    //     {
    //         name: "Process individual sample PKG3",
    //         test: () =>
    //             assert.strictEqual(
    //                 processIndividualPackage(
    //                     100,
    //                     {
    //                         pkgId: "PKG3",
    //                         pkgWeight: 10,
    //                         pkgDistance: 100,
    //                         offerCode: "OFR003",
    //                     },
    //                     [
    //                         Offer(
    //                             "OFR003",
    //                             { min: 10, max: 150 },
    //                             { min: 50, max: 250 },
    //                             5,
    //                             true,
    //                             true
    //                         ),
    //                     ],
    //                     true
    //                 ),
    //                 "PKG3 35 665"
    //             ),
    //     },
    //     {
    //         name: "Discount amount calculation 4",
    //         test: () =>
    //             assert.strictEqual(calculateDiscountAmount(1500, 0.07), 105),
    //     },
    //     {
    //         name: "Process individual sample PKG3",
    //         test: () =>
    //             assert.strictEqual(
    //                 processIndividualPackage(
    //                     100,
    //                     {
    //                         pkgId: "PKG4",
    //                         pkgWeight: 110,
    //                         pkgDistance: 60,
    //                         offerCode: "OFR002",
    //                     },
    //                     [
    //                         Offer(
    //                             "OFR002",
    //                             { min: 100, max: 250 },
    //                             { min: 50, max: 150 },
    //                             7,
    //                             true,
    //                             true
    //                         ),
    //                     ],
    //                     true
    //                 ),
    //                 "PKG4 105 1395"
    //             ),
    //     },
    //     {
    //         name: "Validate offer validity",
    //         test: () =>
    //             assert.strictEqual(
    //                 offerService.isValidOfferCode("OFR003", offers),
    //                 true
    //             ),
    //     },
    //     {
    //         name: "Discount amount calculation 1",
    //         test: () =>
    //             assert.strictEqual(calculateDiscountAmount(100, 0.5), 50),
    //     },
    //     {
    //         name: "Discount amount calculation 2",
    //         test: () =>
    //             assert.strictEqual(calculateDiscountAmount(1000, 0.025), 25),
    //     },
    //     {
    //         name: "Discount amount calculation 3",
    //         test: () => assert.strictEqual(calculateDiscountAmount(100, 0), 0),
    //     },
    //     {
    //         name: "Discount amount calculation 4",
    //         test: () =>
    //             assert.strictEqual(calculateDiscountAmount(100, 1), 100),
    //     },
    // ];
    const testAmount = Tests.length;
    let testResults = [];

    // Loop through the tests array and execute each test
    for (const [
        index,
        { name, input, expectedOutput, func },
    ] of Tests.entries()) {
        try {
            assert.strictEqual(
                global[func](...Object.values(input)),
                expectedOutput
            );
            testResults.push({ result: "passed", name });
        } catch (error) {
            testResults.push({
                result: "failed",
                name,
                message: error.message,
            });
        }
    }

    // Based on the rest results, output to the terminal
    const resultsSummary = testResults.reduce(
        (summary, { result }) => {
            summary[result] += 1;
            return summary;
        },
        { passed: 0, failed: 0 }
    );

    testResults.forEach(({ result, name, message }, index) => {
        const text = `Test ${index}: ${name} ${result}!${
            message ? `: ${message}` : ""
        }`;
        outputColoredText(text, result === "passed" ? "green" : "yellow");
    });

    if (resultsSummary.passed === testAmount) {
        outputColoredText(
            `All ${testAmount} tests have passed successfully! 👍`,
            "magenta"
        );
    } else {
        outputColoredText(
            `Out of ${testAmount} tests, only ${resultsSummary.passed} passed! 🤔`,
            "red"
        );
    }
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
    console.log({ inputName, inputValue, devMode });
    const parsedValue = parseFloat(inputValue);
    if (!isNumber(parsedValue)) {
        const errorMessage = `The provided value for the ${inputName} is invalid. The received value is ${inputValue}, which is not a valid number.`;
        if (!devMode) outputColoredText(errorMessage, "red");
        return errorMessage;
    }
    return parsedValue;
};

const startProcessing = (args) => {
    const baseDeliveryCostInput = args.shift();
    const baseDeliveryCost = validateInput(
        "base delivery cost",
        baseDeliveryCostInput
    );
    if (typeof baseDeliveryCost === "string") return baseDeliveryCost;

    const packageAmountInput = args.shift();
    const packageAmount = validateInput("package amount", packageAmountInput);
    if (typeof packageAmount === "string") return packageAmount;

    const packages = [];

    // Loop through the remaining arguments to get package details
    for (let i = 0; i < packageAmount; i++) {
        const pkgId = args.shift();
        validatePackageId(pkgId, offers);
        const pkgWeight = args.shift();
        const pkgDistance = args.shift();
        const offerCode = args.shift();
        packages.push({ pkgId, pkgWeight, pkgDistance, offerCode });
    }

    const vehicleAmount = args.shift();
    const maxSpeed = args.shift();
    const maxCarryWeight = args.shift();

    // Now that we get the packages, separate them into shipments based on carry weight and weight
    // Max packages first, then weight second
    // planShipments(packages, weight) returns shipments
    // Shipment (deliveryTime, returnTime)
    planShipments(packages, maxCarryWeight);

    // With shipments, we arrange for vehicle based on vehicleAmount
    // With time, we know when a shipment is deliver, when will driver be back

    packages.forEach((pkg) =>
        // Get Discount Amount, Get Cost
        processIndividualPackage(baseDeliveryCost, pkg, offers)
    );
};

const sortPackagesByWeightDescending = (packages) => {
    return packages.sort((a, b) => b.pkgWeight - a.pkgWeight);
};

const planShipments = (packages, maxCarryWeight) => {
    const packagesCopy = packages.slice();
    const shipments = [];
    const weightSortedPackages = sortPackagesByWeightDescending(packagesCopy);

    // console.log({});
    // For each of the packages, get its pkgWeight and
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

global.isNumber = isNumber;
global.validateInput = validateInput;
global.validatePackageId = validatePackageId;
global.calculateDeliveryCost = calculateDeliveryCost;
global.calculateDiscountPercentage = calculateDiscountPercentage;
global.calculateDiscountAmount = calculateDiscountAmount;
global.calculateTotalCost = calculateTotalCost;
global.processIndividualPackage = processIndividualPackage;
global.validateOfferCode = validateOfferCode;

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
