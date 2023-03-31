const assert = require("assert");
const { ProcessedPackage, packageService } = require("../../model/package");

describe("Package", () => {
    describe("generatePackages", () => {
        it("creates a package with two ineligible offer code", () => {
            const packageDetails = ["PKG1", "5", "5", "OFR001", "OFR002"];
            const expectedPackages = [
                {
                    id: "PKG1",
                    weight: 5,
                    distance: 5,
                    offerCode: "",
                    submittedOfferCodes: ["OFR001", "OFR002"],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
            ];
            const createdPackages = packageService.generatePackages(
                1,
                packageDetails
            );
            assert.deepStrictEqual(createdPackages, expectedPackages);
        });

        it("creates a package with no offer code", () => {
            const packageDetails = ["PKG1", "5", "5"];
            const expectedPackages = [
                {
                    id: "PKG1",
                    weight: 5,
                    distance: 5,
                    offerCode: "",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
            ];
            const createdPackages = packageService.generatePackages(
                1,
                packageDetails
            );
            assert.deepStrictEqual(createdPackages, expectedPackages);
        });

        it("creates multiple packages with no offer code", () => {
            const packageDetails = [
                "PKG1",
                "5",
                "5",
                "PKG2",
                "10",
                "100",
                "PKG3",
                "65.5",
                "56.7",
            ];
            const expectedPackages = [
                {
                    id: "PKG1",
                    weight: 5,
                    distance: 5,
                    offerCode: "",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: "PKG2",
                    weight: 10,
                    distance: 100,
                    offerCode: "",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: "PKG3",
                    weight: 65.5,
                    distance: 56.7,
                    offerCode: "",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
            ];
            const createdPackages = packageService.generatePackages(
                3,
                packageDetails
            );
            assert.deepStrictEqual(createdPackages, expectedPackages);
        });

        it("creates multiple packages with multiple offer codes", () => {
            const packageDetails = [
                "PKG1",
                "5",
                "5",
                "OFR01",
                "OFR01",
                "PKG2",
                "10",
                "100",
                "OFR0232",
                "OFR1234",
                "PKG3",
                "65.5",
                "56.7",
                "NA",
                "WHAT",
            ];
            const expectedPackages = [
                {
                    id: "PKG1",
                    weight: 5,
                    distance: 5,
                    offerCode: "",
                    submittedOfferCodes: ["OFR01", "OFR01"],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: "PKG2",
                    weight: 10,
                    distance: 100,
                    offerCode: "",
                    submittedOfferCodes: ["OFR0232", "OFR1234"],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: "PKG3",
                    weight: 65.5,
                    distance: 56.7,
                    offerCode: "",
                    submittedOfferCodes: ["NA", "WHAT"],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
            ];
            const createdPackages = packageService.generatePackages(
                3,
                packageDetails
            );
            assert.deepStrictEqual(createdPackages, expectedPackages);
        });

        it("generates the correct amount of packages", () => {
            const packageAmount = 3;
            const packageDetails = [
                "PKG1",
                "5",
                "5",
                "OFR001",
                "OFR002",
                "PKG2",
                "4",
                "4",
                "OFR002",
                "PKG3",
                "3",
                "3",
                "OFR003",
            ];
            const expectedPackages = [
                {
                    id: "PKG1",
                    weight: 5,
                    distance: 5,
                    offerCode: "",
                    submittedOfferCodes: ["OFR001", "OFR002"],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: "PKG2",
                    weight: 4,
                    distance: 4,
                    offerCode: "OFR002",
                    submittedOfferCodes: ["OFR002"],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: "PKG3",
                    weight: 3,
                    distance: 3,
                    offerCode: "OFR003",
                    submittedOfferCodes: ["OFR003"],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
            ];
            const actualPackages = packageService.generatePackages(
                packageAmount,
                packageDetails
            );
            assert.deepStrictEqual(actualPackages, expectedPackages);
        });
    });

    describe("calculatePackageTiming", () => {
        it("calculates package timing correctly", () => {
            const expectedTiming = {
                deliveryDuration: 1,
                departureTime: 0,
                arrivalTime: 1,
            };
            assert.deepStrictEqual(
                packageService.calculatePackageTiming(100, 100, 0),
                expectedTiming
            );
        });
    });

    describe("ProcessedPackage", () => {
        it("creates a processed package", () => {
            const expectedProcessedPackage = {
                id: "PKG1",
                weight: 5,
                distance: 5,
                offerCode: "OFR001",
                submittedOfferCodes: ["OFR001", "OFR002"],
                deliveryDuration: 1,
                departureTime: 0,
                arrivalTime: 1,
            };
            const actualProcessedPackage = ProcessedPackage(
                "PKG1",
                5,
                5,
                "OFR001",
                ["OFR001", "OFR002"],
                1,
                0,
                1
            );
            assert.deepStrictEqual(
                actualProcessedPackage,
                expectedProcessedPackage
            );
        });
    });
});
