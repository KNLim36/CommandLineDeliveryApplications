const assert = require("assert");
const { deliveryService } = require("../../model/delivery");
const { Package } = require("../../model/package");

describe("Delivery", () => {
    describe("constructPackageMessage", () => {
        it(`should have no discount: PKG 5 5 OFR001 => PKG1 0 175`, () => {
            assert.equal(
                deliveryService.constructPackageMessage(
                    {
                        id: "PKG1",
                        weight: 5,
                        distance: 5,
                        offerCode: "OFR001",
                    },
                    100,
                    true
                ),
                "PKG1 0 175"
            );
        });

        it(`should have no discount: PKG2 15 5 OFR002 => PKG2 0 275`, () => {
            assert.equal(
                deliveryService.constructPackageMessage(
                    {
                        id: "PKG2",
                        weight: 15,
                        distance: 5,
                        offerCode: "OFR002",
                    },
                    100,
                    true
                ),
                "PKG2 0 275"
            );
        });

        it(`should have discount: PKG3 10 100 OFR003 => PKG3 35 665`, () => {
            assert.equal(
                deliveryService.constructPackageMessage(
                    {
                        id: "PKG3",
                        weight: 10,
                        distance: 100,
                        offerCode: "OFR003",
                    },
                    100,
                    true
                ),
                "PKG3 35 665"
            );
        });

        it(`should have discount: PKG4 100 60 OFR002 => PKG4 105 1395`, () => {
            assert.equal(
                deliveryService.constructPackageMessage(
                    {
                        id: "PKG4",
                        weight: 110,
                        distance: 60,
                        offerCode: "OFR002",
                    },
                    100,
                    true
                ),
                "PKG4 105 1395"
            );
        });
    });

    describe("outputPackage", () => {
        it("should output correct messages for delivered packages", () => {
            const delivery = deliveryService.createDelivery();
            const packages = [
                Package("PKG1", 5, 55, "", ["OFR001"]),
                Package("PKG2", 15, 105.5, "", ["OFR002"]),
                Package("PKG3", 10, 100.07, "OFR003", ["OFR003"]),
            ];
            const outputResult = [
                "PKG1 0 445 0.78",
                "PKG2 0 797.5 1.5",
                "PKG3 36 684.35 1.42",
            ];

            delivery.setPackages(packages);
            delivery.setBaseDeliveryCost(120);
            delivery.setVehicleAmount(1);
            delivery.setVehicleMaxSpeed(70);
            delivery.setVehicleMaxCarryWeight(200);
            delivery.computeDeliveredPackages();
            assert.deepStrictEqual(delivery.outputPackage(true), outputResult);
        });

        it("should output correct messages for delivered packages (example from feedback)", () => {
            const delivery = deliveryService.createDelivery();
            const packages = [
                Package("PKG1", 50, 100, "", ["OFR002"]),
                Package("PKG2", 50, 100, "", ["OFR001"]),
                Package("PKG3", 150, 100, "OFR003", ["OFR003"]),
                Package("PKG4", 99, 100, "OFR001", ["OFR001"]),
                Package("PKG5", 100, 100, "OFR001", ["OFR001"]),
            ];
            const outputResult = [
                "PKG1 0 1100 1.42",
                "PKG2 0 1100 1.42",
                "PKG3 105 1995 4.26",
                "PKG4 159 1431 7.1",
                "PKG5 160 1440 1.42",
            ];

            delivery.setPackages(packages);
            delivery.setBaseDeliveryCost(100);
            delivery.setVehicleAmount(1);
            delivery.setVehicleMaxSpeed(70);
            delivery.setVehicleMaxCarryWeight(200);
            delivery.computeDeliveredPackages();
            assert.deepStrictEqual(delivery.outputPackage(true), outputResult);
        });

        it("should output correct messages for undelivered packages", () => {
            const delivery = deliveryService.createDelivery();
            const packages = [
                Package("PKG1", 5, 55, "", ["OFR001"]),
                Package("PKG2", 15, 105.5, "", ["OFR002"]),
                Package("PKG3", 10, 100.07, "OFR003", ["OFR003"]),
            ];
            const outputResult = [
                "PKG1 0 445",
                "PKG2 0 797.5",
                "PKG3 36 684.35",
            ];

            delivery.setPackages(packages);
            delivery.setBaseDeliveryCost(120);
            assert.deepStrictEqual(delivery.outputPackage(true), outputResult);
        });

        it("should output correct messages for undelivered packages (example provided in requirement)", () => {
            const delivery = deliveryService.createDelivery();
            const packages = [
                Package("PKG1", 5, 5, "", ["OFR001"]),
                Package("PKG2", 15, 5, "", ["OFR002"]),
                Package("PKG3", 10, 100, "OFR003", ["OFR003"]),
            ];
            const outputResult = ["PKG1 0 175", "PKG2 0 275", "PKG3 35 665"];

            delivery.setPackages(packages);
            delivery.setBaseDeliveryCost(100);
            assert.deepStrictEqual(delivery.outputPackage(true), outputResult);
        });
    });

    describe("getDeliveredPackages", () => {
        it("should compute correct delivered packages", () => {
            const delivery = deliveryService.createDelivery();
            const packages = [
                Package("PKG1", 5, 10, "", ["OFR001"]),
                Package("PKG2", 8, 20, "", ["OFR001"]),
            ];
            const deliveredPackages = [
                {
                    arrivalTime: 1,
                    deliveryDuration: 0.2,
                    departureTime: 0.8,
                    distance: 10,
                    id: "PKG1",
                    offerCode: "",
                    submittedOfferCodes: ["OFR001"],
                    weight: 5,
                },
                {
                    arrivalTime: 0.4,
                    deliveryDuration: 0.4,
                    departureTime: 0,
                    distance: 20,
                    id: "PKG2",
                    offerCode: "",
                    submittedOfferCodes: ["OFR001"],
                    weight: 8,
                },
            ];

            delivery.setPackages(packages);
            delivery.setBaseDeliveryCost(100);
            delivery.setVehicleAmount(1);
            delivery.setVehicleMaxSpeed(50);
            delivery.setVehicleMaxCarryWeight(10);
            delivery.computeDeliveredPackages();
            assert.deepStrictEqual(delivery.getPackages(), packages);
            assert.deepStrictEqual(
                delivery.getDeliveredPackages(),
                deliveredPackages
            );
        });
    });

    describe("getter and setter", () => {
        it("should set and get the base delivery cost", () => {
            const delivery = deliveryService.createDelivery();
            delivery.setBaseDeliveryCost(100);
            assert.equal(delivery.getBaseDeliveryCost(), 100);
        });

        it("should set and get the package amount", () => {
            const delivery = deliveryService.createDelivery();
            delivery.setPackageAmount(5);
            assert.equal(delivery.getPackageAmount(), 5);
        });

        it("should set and get the package details", () => {
            const delivery = deliveryService.createDelivery();
            const details = { id: "PKG1", weight: 5, distance: 10 };
            delivery.setPackageDetails(details);
            assert.deepStrictEqual(delivery.getPackageDetails(), details);
        });

        it("should set and get the vehicle amount", () => {
            const delivery = deliveryService.createDelivery();
            delivery.setVehicleAmount(2);
            assert.equal(delivery.getVehicleAmount(), 2);
        });

        it("should set and get the vehicle max speed", () => {
            const delivery = deliveryService.createDelivery();
            delivery.setVehicleMaxSpeed(50);
            assert.equal(delivery.getVehicleMaxSpeed(), 50);
        });

        it("should set and get the vehicle max carry weight", () => {
            const delivery = deliveryService.createDelivery();
            delivery.setVehicleMaxCarryWeight(20);
            assert.equal(delivery.getVehicleMaxCarryWeight(), 20);
        });

        it("should set and get the packages", () => {
            const delivery = deliveryService.createDelivery();
            const packages = [
                { id: "PKG1", weight: 5, distance: 10 },
                { id: "PKG2", weight: 8, distance: 20 },
            ];
            delivery.setPackages(packages);
            assert.deepStrictEqual(delivery.getPackages(), packages);
        });
    });
});
