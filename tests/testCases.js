// const assert = require("assert");
const { Offer, offers } = require("../model/offer");

module.exports = [
    {
        name: "Base delivery cost input (number)",
        input: { arg1: "base delivery cost", arg2: 300, arg3: true },
        expectedOutput: 300,
        func: "validateInput",
    },
    {
        name: "Base delivery cost input (negative number)",
        input: { arg1: "base delivery cost", arg2: -1, arg3: true },
        expectedOutput: -1,
        func: "validateInput",
    },
    {
        name: "Base delivery cost input (zero)",
        input: { arg1: "base delivery cost", arg2: 0, arg3: true },
        expectedOutput: 0,
        func: "validateInput",
    },
    {
        name: "Base delivery cost input (number with string type)",
        input: { arg1: "base delivery cost", arg2: "100", arg3: true },
        expectedOutput: 100,
        func: "validateInput",
    },
    {
        name: "Base delivery cost input (string)",
        input: { arg1: "base delivery cost", arg2: "hello", arg3: true },
        expectedOutput:
            "The provided value for the base delivery cost is invalid. The received value is hello, which is not a valid number.",
        func: "validateInput",
    },
    {
        name: "Base delivery cost input (null)",
        input: { arg1: "base delivery cost", arg2: null, arg3: true },
        expectedOutput:
            "The provided value for the base delivery cost is invalid. The received value is null, which is not a valid number.",
        func: "validateInput",
    },
    {
        name: "Base delivery cost input (undefined)",
        input: { arg1: "base delivery cost", arg2: undefined, arg3: true },
        expectedOutput:
            "The provided value for the base delivery cost is invalid. The received value is undefined, which is not a valid number.",
        func: "validateInput",
    },
    {
        name: "Is Number (number)",
        input: { arg1: 700 },
        expectedOutput: true,
        func: "isNumber",
    },
    {
        name: "Is Number (string)",
        input: { arg1: "700" },
        expectedOutput: false,
        func: "isNumber",
    },
    {
        name: "Validate package weight (number)",
        input: { arg1: "package weight", arg2: 700, arg3: true },
        expectedOutput: 700,
        func: "validateInput",
    },
    {
        name: "Validate package weight (number with string type)",
        input: { arg1: "package weight", arg2: "700", arg3: true },
        expectedOutput: 700,
        func: "validateInput",
    },
    {
        name: "Validate package weight (string)",
        input: { arg1: "package weight", arg2: "hi", arg3: true },
        expectedOutput:
            "The provided value for the package weight is invalid. The received value is hi, which is not a valid number.",
        func: "validateInput",
    },
    {
        name: "Validate package id (double offer code submission)",
        input: { arg1: "OFR001", arg2: offers },
        expectedOutput:
            "The previous package has a leftover offer code 'OFR001'. Please submit only 1 offer code for a package.",
        func: "validatePackageId",
    },
    {
        name: "Delivery cost calculation 1",
        input: { arg1: 100, arg2: 50, arg3: 30 },
        expectedOutput: 750,
        func: "calculateDeliveryCost",
    },
    {
        name: "Delivery cost calculation 2",
        input: { arg1: 100, arg2: 75, arg3: 125 },
        expectedOutput: 1475,
        func: "calculateDeliveryCost",
    },
    {
        name: "Delivery cost calculation 3",
        input: { arg1: 100, arg2: 175, arg3: 100 },
        expectedOutput: 2350,
        func: "calculateDeliveryCost",
    },
    {
        name: "Delivery cost calculation 4",
        input: { arg1: 100, arg2: 110, arg3: 60 },
        expectedOutput: 1500,
        func: "calculateDeliveryCost",
    },
    {
        name: "Delivery cost calculation 5",
        input: { arg1: 100, arg2: 155, arg3: 95 },
        expectedOutput: 2125,
        func: "calculateDeliveryCost",
    },
    {
        name: "Total cost calculation",
        input: { arg1: 700, arg2: 35 },
        expectedOutput: 665.0,
        func: "calculateTotalCost",
    },
    {
        name: "Discount amount calculation",
        input: { arg1: 100, arg2: 0.35 },
        expectedOutput: 35,
        func: "calculateDiscountAmount",
    },
    {
        name: "Process individual sample PKG1",
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
        name: "Process individual sample PKG2",
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
        name: "Process individual sample PKG3",
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
        name: "Discount amount calculation 4",
        input: { arg1: 1500, arg2: 0.07 },
        expectedOutput: 105,
        func: "calculateDiscountAmount",
    },
    {
        name: "Process individual sample PKG3",
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
        name: "Validate offer validity",
        input: { arg1: "OFR003", arg2: offers },
        expectedOutput: true,
        func: "validateOfferCode",
    },
    {
        name: "Discount amount calculation 1",
        input: { arg1: 100, arg2: 0.5 },
        expectedOutput: 50,
        func: "calculateDiscountAmount",
    },
    {
        name: "Discount amount calculation 1",
        input: { arg1: 100, arg2: 0.5 },
        expectedOutput: 50,
        func: "calculateDiscountAmount",
    },
    {
        name: "Discount amount calculation 2",
        input: { arg1: 1000, arg2: 0.025 },
        expectedOutput: 25,
        func: "calculateDiscountAmount",
    },
    {
        name: "Discount amount calculation 3",
        input: { arg1: 100, arg2: 0 },
        expectedOutput: 0,
        func: "calculateDiscountAmount",
    },
    {
        name: "Discount amount calculation 4",
        input: { arg1: 100, arg2: 1 },
        expectedOutput: 100,
        func: "calculateDiscountAmount",
    },
];
