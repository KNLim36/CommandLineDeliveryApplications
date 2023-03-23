const assert = require("assert");
const { Offer, offerService, offers } = require("./model/offer");
const { costCalculator } = require("./utils/costCalculator");

const runTestCases = () => {
    // Define all tests as an array of objects
    const tests = [
        {
            name: "Base delivery cost input (number)",
            test: () => assert.strictEqual(validateBaseDeliveryCost(300), 300),
        },
        {
            name: "Base delivery cost input (negative number)",
            test: () => assert.strictEqual(validateBaseDeliveryCost(-1), -1),
        },
        {
            name: "Base delivery cost input (zero)",
            test: () => assert.strictEqual(validateBaseDeliveryCost(0), 0),
        },
        {
            name: "Base delivery cost input (number with string type)",
            test: () =>
                assert.strictEqual(validateBaseDeliveryCost("100"), 100),
        },
        {
            name: "Base delivery cost input (string)",
            test: () =>
                assert.strictEqual(
                    validateBaseDeliveryCost("hello"),
                    "The provided value for the base delivery cost is invalid. The received value is hello, which is not a valid number."
                ),
        },
        {
            name: "Base delivery cost input (null)",
            test: () =>
                assert.strictEqual(
                    validateBaseDeliveryCost(null),
                    "The provided value for the base delivery cost is invalid. The received value is null, which is not a valid number."
                ),
        },
        {
            name: "Base delivery cost input (undefined)",
            test: () =>
                assert.strictEqual(
                    validateBaseDeliveryCost(),
                    "The provided value for the base delivery cost is invalid. The received value is undefined, which is not a valid number."
                ),
        },
        {
            name: "Is Number (number)",
            test: () => assert.strictEqual(isNumber(700), true),
        },
        {
            name: "Is Number (string)",
            test: () => assert.strictEqual(isNumber("700"), false),
        },
        {
            name: "Validate package weight (number)",
            test: () => assert.strictEqual(validatePackageWeight(700), 700),
        },
        {
            name: "Validate package weight (number with string type)",
            test: () => assert.strictEqual(validatePackageWeight("700"), 700),
        },
        {
            name: "Validate package weight (string)",
            test: () =>
                assert.strictEqual(
                    validatePackageWeight("hi"),
                    "The provided value for the package weight is invalid. The received value is hi, which is not a valid number."
                ),
        },
        {
            name: "Total cost calculation",
            test: () => assert.strictEqual(calculateTotalCost(700, 35), 665.0),
        },
        {
            name: "Discount amount calculation",
            test: () =>
                assert.strictEqual(calculateDiscountAmount(100, 0.35), 35),
        },
        {
            name: "Process individual sample PKG1",
            test: () =>
                assert.strictEqual(
                    processIndividualPackage(
                        100,
                        {
                            pkgId: "PKG1",
                            pkgWeight: 5,
                            pkgDistance: 5,
                            offerCode: "OFR001",
                        },
                        [
                            Offer(
                                "OFR001",
                                { min: 70, max: 200 },
                                { min: 0, max: 200 },
                                10,
                                true,
                                false
                            ),
                        ]
                    ),
                    "PKG1 0 175"
                ),
        },
        {
            name: "Process individual sample PKG2",
            test: () =>
                assert.strictEqual(
                    processIndividualPackage(
                        100,
                        {
                            pkgId: "PKG2",
                            pkgWeight: 15,
                            pkgDistance: 5,
                            offerCode: "OFR002",
                        },
                        [
                            Offer(
                                "OFR002",
                                { min: 100, max: 250 },
                                { min: 50, max: 150 },
                                7,
                                true,
                                true
                            ),
                        ]
                    ),
                    "PKG2 0 275"
                ),
        },
        {
            name: "Process individual sample PKG3",
            test: () =>
                assert.strictEqual(
                    processIndividualPackage(
                        100,
                        {
                            pkgId: "PKG3",
                            pkgWeight: 10,
                            pkgDistance: 100,
                            offerCode: "OFR003",
                        },
                        [
                            Offer(
                                "OFR003",
                                { min: 10, max: 150 },
                                { min: 50, max: 250 },
                                5,
                                true,
                                true
                            ),
                        ]
                    ),
                    "PKG3 35 665"
                ),
        },
        {
            name: "Validate offer validity",
            test: () =>
                assert.strictEqual(
                    offerService.isValidOfferCode("OFR003", offers),
                    true
                ),
        },
        {
            name: "Discount amount calculation 1",
            test: () =>
                assert.strictEqual(calculateDiscountAmount(100, 0.5), 50),
        },
        {
            name: "Discount amount calculation 2",
            test: () =>
                assert.strictEqual(calculateDiscountAmount(1000, 0.025), 25),
        },
        {
            name: "Discount amount calculation 3",
            test: () => assert.strictEqual(calculateDiscountAmount(100, 0), 0),
        },
        {
            name: "Discount amount calculation 4",
            test: () =>
                assert.strictEqual(calculateDiscountAmount(100, 1), 100),
        },
    ];

    const testAmount = tests.length;
    let testResults = [];

    // Loop through the tests array and execute each test
    for (const [index, { name, test }] of tests.entries()) {
        try {
            test();
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

const validateBaseDeliveryCost = (baseDeliveryCostInput) => {
    const baseDeliveryCost = parseFloat(baseDeliveryCostInput);
    if (!isNumber(baseDeliveryCost)) {
        const errorMessage = `The provided value for the base delivery cost is invalid. The received value is ${baseDeliveryCostInput}, which is not a valid number.`;
        outputColoredText(errorMessage, "red");
        return errorMessage;
    }
    return baseDeliveryCost;
};

const validatePackageId = (packageId, offers) => {
    // Check if the package ID is a valid offer code
    if (offerService.isValidOfferCode(packageId, offers)) {
        const errorMessage = `The previous package has a leftover offer code '${packageId}'. Please submit only 1 offer code for a package.`;
        outputColoredText(errorMessage, "red");
        return errorMessage;
    }
};

const startProcessing = () => {
    const baseDeliveryCostInput = process.argv[3];
    const baseDeliveryCost = validateBaseDeliveryCost(baseDeliveryCostInput);
    if (typeof baseDeliveryCost === "string") return baseDeliveryCost;

    const noOfPackages = process.argv[4];
    const packages = [];

    // Loop through the remaining arguments to get package details
    for (let i = 5; i < process.argv.length; i += 4) {
        const pkgId = process.argv[i];
        validatePackageId(pkgId, offers);
        const pkgWeight = process.argv[i + 1];
        const pkgDistance = process.argv[i + 2];
        const offerCode = process.argv[i + 3];

        packages.push({ pkgId, pkgWeight, pkgDistance, offerCode });
    }

    packages.forEach((pkg) =>
        processIndividualPackage(baseDeliveryCost, pkg, offers)
    );
};

const isNumber = (value) => {
    return typeof value === "number" && !isNaN(value);
};

const validatePackageWeight = (pkgWeight) => {
    const weight = parseFloat(pkgWeight);
    if (!isNumber(weight)) {
        const errorMessage = `The provided value for the package weight is invalid. The received value is ${pkgWeight}, which is not a valid number.`;
        outputColoredText(errorMessage, "red");
        return errorMessage;
    }
    return weight;
};

const validatePackageDistance = (pkgDistance) => {
    const distance = parseFloat(pkgDistance);
    if (!isNumber(distance)) {
        const errorMessage = `The provided value for the package distance is invalid. The received value is ${pkgDistance}, which is not a valid number.`;
        outputColoredText(errorMessage, "red");
        return errorMessage;
    }
    return distance;
};

const calculateDiscountPercentage = (weight, distance, offerCode, offers) => {
    if (offerService.isValidOfferCode(offerCode, offers)) {
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

const processIndividualPackage = (
    baseDeliveryCost,
    { pkgId, pkgWeight, pkgDistance, offerCode },
    offers
) => {
    const weight = validatePackageWeight(pkgWeight);
    if (typeof weight === "string") return weight;

    const distance = validatePackageDistance(pkgDistance);
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
    outputColoredText(processedMessage, "green");
    return processedMessage;
};

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("No arguments supplied");
} else if (args[0] === "test") {
    runTestCases();
} else if (args[0] === "start") {
    startProcessing();
} else {
    // console.log({ val: args[0] });
    console.log("Invalid arguments supplied");
}
