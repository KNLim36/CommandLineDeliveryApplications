const { Offer, offers } = require("../model/offer");
module.exports = [
    {
        name: "Valid input number for isNumber function",
        input: { arg1: 700 },
        expectedOutput: true,
        func: "isNumber",
    },
    {
        name: "Invalid input string for isNumber function",
        input: { arg1: "700" },
        expectedOutput: false,
        func: "isNumber",
    },
    {
        name: "Invalid package id input (double offer code submission)",
        input: { arg1: "OFR001", arg2: offers, arg3: true },
        expectedOutput:
            "The previous package has a leftover offer code 'OFR001'. Please submit only 1 offer code for a package.",
        func: "validatePackageId",
    },
    {
        name: "Valid base delivery cost input (number)",
        input: { arg1: "base delivery cost", arg2: 300, arg3: true },
        expectedOutput: 300,
        func: "validateInput",
    },
    {
        name: "Valid base delivery cost input (negative number)",
        input: { arg1: "base delivery cost", arg2: -1, arg3: true },
        expectedOutput: -1,
        func: "validateInput",
    },
    {
        name: "Valid base delivery cost input (zero)",
        input: { arg1: "base delivery cost", arg2: 0, arg3: true },
        expectedOutput: 0,
        func: "validateInput",
    },
    {
        name: "Valid base delivery cost input (number with string type)",
        input: { arg1: "base delivery cost", arg2: "100", arg3: true },
        expectedOutput: 100,
        func: "validateInput",
    },
    {
        name: "Valid base delivery cost input (string)",
        input: { arg1: "base delivery cost", arg2: "hello", arg3: true },
        expectedOutput:
            "The provided value for the base delivery cost is invalid. The received value is hello, which is not a valid number.",
        func: "validateInput",
    },
    {
        name: "Valid base delivery cost input (null)",
        input: { arg1: "base delivery cost", arg2: null, arg3: true },
        expectedOutput:
            "The provided value for the base delivery cost is invalid. The received value is null, which is not a valid number.",
        func: "validateInput",
    },
    {
        name: "Valid base delivery cost input (undefined)",
        input: { arg1: "base delivery cost", arg2: undefined, arg3: true },
        expectedOutput:
            "The provided value for the base delivery cost is invalid. The received value is undefined, which is not a valid number.",
        func: "validateInput",
    },
    {
        name: "Valid package weight input (number)",
        input: { arg1: "package weight", arg2: 700, arg3: true },
        expectedOutput: 700,
        func: "validateInput",
    },
    {
        name: "Valid package weight input (number with string type)",
        input: { arg1: "package weight", arg2: "700", arg3: true },
        expectedOutput: 700,
        func: "validateInput",
    },
    {
        name: "Valid package weight input (string)",
        input: { arg1: "package weight", arg2: "hi", arg3: true },
        expectedOutput:
            "The provided value for the package weight is invalid. The received value is hi, which is not a valid number.",
        func: "validateInput",
    },
    {
        name: "Valid delivery cost calculation Sample - 1",
        input: { arg1: 100, arg2: 50, arg3: 30 },
        expectedOutput: 750,
        func: "calculateDeliveryCost",
    },
    {
        name: "Valid delivery cost calculation Sample - 2",
        input: { arg1: 100, arg2: 75, arg3: 125 },
        expectedOutput: 1475,
        func: "calculateDeliveryCost",
    },
    {
        name: "Valid delivery cost calculation Sample - 3",
        input: { arg1: 100, arg2: 175, arg3: 100 },
        expectedOutput: 2350,
        func: "calculateDeliveryCost",
    },
    {
        name: "Valid delivery cost calculation Sample - 4",
        input: { arg1: 100, arg2: 110, arg3: 60 },
        expectedOutput: 1500,
        func: "calculateDeliveryCost",
    },
    {
        name: "Valid delivery cost calculation Sample - 5",
        input: { arg1: 100, arg2: 155, arg3: 95 },
        expectedOutput: 2125,
        func: "calculateDeliveryCost",
    },
    {
        name: "Valid total cost calculation input",
        input: { arg1: 700, arg2: 35 },
        expectedOutput: 665.0,
        func: "calculateTotalCost",
    },
    {
        name: "Validate Offer Code with Valid Inputs",
        input: { arg1: "OFR003", arg2: offers },
        expectedOutput: true,
        func: "validateOfferCode",
    },
    {
        name: "Process individual package with offer Sample - 1",
        input: {
            arg1: 100,
            arg2: {
                pkgId: "PKG1",
                pkgWeight: 5,
                pkgDistance: 5,
                offerCode: "OFR001",
            },
            arg3: [
                Offer(
                    "OFR001",
                    { min: 70, max: 200 },
                    { min: 0, max: 200 },
                    10,
                    true,
                    false
                ),
            ],
            arg4: true,
        },
        expectedOutput: "PKG1 0 175",
        func: "processIndividualPackage",
    },
    {
        name: "Process individual package with offer Sample - 2",
        input: {
            arg1: 100,
            arg2: {
                pkgId: "PKG2",
                pkgWeight: 15,
                pkgDistance: 5,
                offerCode: "OFR002",
            },
            arg3: [
                Offer(
                    "OFR002",
                    { min: 100, max: 250 },
                    { min: 50, max: 150 },
                    7,
                    true,
                    true
                ),
            ],
            arg4: true,
        },
        expectedOutput: "PKG2 0 275",
        func: "processIndividualPackage",
    },
    {
        name: "Process individual package with offer Sample - 3",
        input: {
            arg1: 100,
            arg2: {
                pkgId: "PKG3",
                pkgWeight: 10,
                pkgDistance: 100,
                offerCode: "OFR003",
            },
            arg3: [
                Offer(
                    "OFR003",
                    { min: 10, max: 150 },
                    { min: 50, max: 250 },
                    5,
                    true,
                    true
                ),
            ],
            arg4: true,
        },
        expectedOutput: "PKG3 35 665",
        func: "processIndividualPackage",
    },
    {
        name: "Process individual package with offer Sample - 3",
        input: {
            arg1: 100,
            arg2: {
                pkgId: "PKG4",
                pkgWeight: 110,
                pkgDistance: 60,
                offerCode: "OFR002",
            },
            arg3: [
                Offer(
                    "OFR002",
                    { min: 100, max: 250 },
                    { min: 50, max: 150 },
                    7,
                    true,
                    true
                ),
            ],
            arg4: true,
        },
        expectedOutput: "PKG4 105 1395",
        func: "processIndividualPackage",
    },
    {
        name: "Valid discount amount calculation Sample - 1",
        input: { arg1: 100, arg2: 0.35 },
        expectedOutput: 35,
        func: "calculateDiscountAmount",
    },
    {
        name: "Valid discount amount calculation Sample - 2",
        input: { arg1: 1500, arg2: 0.07 },
        expectedOutput: 105,
        func: "calculateDiscountAmount",
    },
    {
        name: "Valid discount amount calculation Sample - 3",
        input: { arg1: 100, arg2: 0.5 },
        expectedOutput: 50,
        func: "calculateDiscountAmount",
    },
    {
        name: "Valid discount amount calculation Sample - 4",
        input: { arg1: 100, arg2: 0.5 },
        expectedOutput: 50,
        func: "calculateDiscountAmount",
    },
    {
        name: "Valid discount amount calculation Sample - 5",
        input: { arg1: 1000, arg2: 0.025 },
        expectedOutput: 25,
        func: "calculateDiscountAmount",
    },
    {
        name: "Valid discount amount calculation Sample - 6",
        input: { arg1: 100, arg2: 0 },
        expectedOutput: 0,
        func: "calculateDiscountAmount",
    },
    {
        name: "Valid discount amount calculation Sample - 7",
        input: { arg1: 100, arg2: 1 },
        expectedOutput: 100,
        func: "calculateDiscountAmount",
    },
    {
        name: "Generate Shipment - Light then Heavy Packages",
        input: {
            arg1: [
                {
                    pkgId: "LightPackage",
                    pkgWeight: 20,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
                {
                    pkgId: "HeavyPackage",
                    pkgWeight: 200,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
            ],
            arg2: 220,
            arg3: 70,
        },
        expectedOutput: {
            deliveryDuration: 1.42,
            driverReturnDuration: 2.84,
            packages: [
                {
                    pkgId: "LightPackage",
                    pkgWeight: 20,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
                {
                    pkgId: "HeavyPackage",
                    pkgWeight: 200,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
            ],
            totalWeight: 220,
        },
        func: "createOptimalShipment",
    },
    {
        name: "Generate Shipment - Same Weight, Different Distance Packages",
        input: {
            arg1: [
                {
                    pkgId: "Closer package",
                    pkgWeight: 50,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
                {
                    pkgId: "Further package",
                    pkgWeight: 50.0,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
            ],
            arg2: 200,
            arg3: 70,
        },
        expectedOutput: {
            deliveryDuration: 1.42,
            driverReturnDuration: 2.84,
            packages: [
                {
                    pkgId: "Closer package",
                    pkgWeight: 50,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
                {
                    pkgId: "Further package",
                    pkgWeight: 50.0,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
            ],
            totalWeight: 100,
        },
        func: "createOptimalShipment",
    },
    {
        name: "Generate Shipment - 125kg max weight",
        input: {
            arg1: [
                {
                    pkgId: "Small far package",
                    pkgWeight: 10.0,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
                {
                    pkgId: "Small close package",
                    pkgWeight: 10,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
                {
                    pkgId: "Medium close package",
                    pkgWeight: 100,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
                {
                    pkgId: "Largest far package",
                    pkgWeight: 124,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
            ],
            arg2: 125,
            arg3: 70,
        },
        expectedOutput: {
            deliveryDuration: 1.42,
            driverReturnDuration: 2.84,
            packages: [
                {
                    pkgId: "Small far package",
                    pkgWeight: 10.0,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
                {
                    pkgId: "Small close package",
                    pkgWeight: 10,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
                {
                    pkgId: "Medium close package",
                    pkgWeight: 100,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
            ],
            totalWeight: 120,
        },
        func: "createOptimalShipment",
    },
    {
        name: "Generate Shipment - Choose 4 out of 6 packages",
        input: {
            arg1: [
                {
                    pkgId: "Small close",
                    pkgWeight: 10,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
                {
                    pkgId: "Small medium",
                    pkgWeight: 10,
                    pkgDistance: 50,
                    offerCode: "NA",
                },
                {
                    pkgId: "Small far",
                    pkgWeight: 10.0,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
                {
                    pkgId: "Small super far",
                    pkgWeight: 10.0,
                    pkgDistance: 300,
                    offerCode: "NA",
                },
                {
                    pkgId: "Medium close",
                    pkgWeight: 100,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
                {
                    pkgId: "Largest far",
                    pkgWeight: 124,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
            ],
            arg2: 125,
            arg3: 70,
        },
        expectedOutput: {
            deliveryDuration: 4.28,
            driverReturnDuration: 8.56,
            packages: [
                {
                    pkgId: "Small close",
                    pkgWeight: 10,
                    pkgDistance: 10,
                    offerCode: "NA",
                },
                {
                    pkgId: "Small medium",
                    pkgWeight: 10,
                    pkgDistance: 50,
                    offerCode: "NA",
                },
                {
                    pkgId: "Small far",
                    pkgWeight: 10.0,
                    pkgDistance: 100,
                    offerCode: "NA",
                },
                {
                    pkgId: "Small super far",
                    pkgWeight: 10.0,
                    pkgDistance: 300,
                    offerCode: "NA",
                },
            ],
            totalWeight: 40,
        },
        func: "createOptimalShipment",
    },
    {
        name: "Generate Shipment - Challenge provided example",
        input: {
            arg1: [
                {
                    pkgId: "PKG1",
                    pkgWeight: 50,
                    pkgDistance: 30,
                    offerCode: "OFR001",
                },
                {
                    pkgId: "PKG2",
                    pkgWeight: 75,
                    pkgDistance: 125,
                    offerCode: "OFR008",
                },
                {
                    pkgId: "PKG3",
                    pkgWeight: 175,
                    pkgDistance: 100,
                    offerCode: "OFR003",
                },
                {
                    pkgId: "PKG4",
                    pkgWeight: 110,
                    pkgDistance: 60,
                    offerCode: "OFR002",
                },
                {
                    pkgId: "PKG5",
                    pkgWeight: 155,
                    pkgDistance: 95,
                    offerCode: "NA",
                },
            ],
            arg2: 200,
            arg3: 70,
        },
        expectedOutput: {
            deliveryDuration: 1.78,
            driverReturnDuration: 3.56,
            packages: [
                {
                    pkgId: "PKG2",
                    pkgWeight: 75,
                    pkgDistance: 125,
                    offerCode: "OFR008",
                },
                {
                    pkgId: "PKG4",
                    pkgWeight: 110,
                    pkgDistance: 60,
                    offerCode: "OFR002",
                },
            ],
            totalWeight: 185,
        },
        func: "createOptimalShipment",
    },
];
