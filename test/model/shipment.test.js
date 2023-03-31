const assert = require("assert");
const { packageService } = require("../../model/package");
const { shipmentService } = require("../../model/shipment");

describe("Shipment", () => {
    describe("findHeaviestShipment", () => {
        it("should return the shipment with the highest total weight", () => {
            const items = [
                { totalWeight: 100, packages: [] },
                { totalWeight: 200, packages: [] },
                { totalWeight: 150, packages: [] },
            ];

            const expected = { totalWeight: 200, packages: [] };
            const result = shipmentService.findHeaviestShipment(items);

            assert.deepStrictEqual(result, expected);
        });
    });

    describe("getHighestAmount", () => {
        it("should return the item with the highest amount if current amount is greater than highest amount", () => {
            const highest = { amount: 10 };
            const current = { amount: 20 };

            const expected = current;
            const result = shipmentService.getHighestAmount(highest, current);

            assert.deepStrictEqual(result, expected);
        });

        it("should return the item with the highest weight if current amount is equal to highest amount", () => {
            const highest = { amount: 10, totalWeight: 100 };
            const current = { amount: 10, totalWeight: 200 };

            const expected = current;
            const result = shipmentService.getHighestAmount(highest, current);

            assert.deepStrictEqual(result, expected);
        });

        it("should return the highest item if current amount is less than highest amount", () => {
            const highest = { amount: 20 };
            const current = { amount: 10 };

            const expected = highest;
            const result = shipmentService.getHighestAmount(highest, current);

            assert.deepStrictEqual(result, expected);
        });
    });

    describe("getHighestWeight", () => {
        it("should return the item with the highest weight", () => {
            const itemA = { totalWeight: 100 };
            const itemB = { totalWeight: 200 };

            const expected = itemB;
            const result = shipmentService.getHighestWeight(itemA, itemB);

            assert.deepStrictEqual(result, expected);
        });

        it("should return the first item if both items have the same weight", () => {
            const itemA = { totalWeight: 100 };
            const itemB = { totalWeight: 100 };

            const expected = itemA;
            const result = shipmentService.getHighestWeight(itemA, itemB);

            assert.deepStrictEqual(result, expected);
        });
    });

    describe("createOptimalShipment", () => {
        it("should create a shipment with the heaviest packages and return driverAvailableTime after driver return duration", () => {
            const packages = [
                {
                    id: 1,
                    weight: 50,
                    distance: 100,
                    offerCode: "off1",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: 2,
                    weight: 100,
                    distance: 200,
                    offerCode: "off2",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: 3,
                    weight: 150,
                    distance: 150,
                    offerCode: "off3",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
            ];
            const maxCarryWeight = 200;
            const maxSpeed = 50;
            const currentTime = 0;

            const expectedPackages = [
                {
                    id: 3,
                    weight: 150,
                    distance: 150,
                    offerCode: "off3",
                    submittedOfferCodes: [],
                    deliveryDuration: 3,
                    departureTime: 0,
                    arrivalTime: 3,
                },
                {
                    id: 1,
                    weight: 50,
                    distance: 100,
                    offerCode: "off1",
                    submittedOfferCodes: [],
                    deliveryDuration: 2,
                    departureTime: 0,
                    arrivalTime: 2,
                },
            ];

            const expected = {
                deliveryDuration: 3,
                driverReturnDuration: 6,
                driverAvailableTime: 6,
                packages: expectedPackages,
                totalWeight: 200,
            };

            const result = shipmentService.createOptimalShipment(
                packages,
                maxCarryWeight,
                maxSpeed,
                currentTime
            );

            assert.deepStrictEqual(result, expected);
        });

        it("should return an empty shipment if all packages are over the maxCarryWeight", () => {
            const packages = [
                {
                    id: 1,
                    weight: 250,
                    distance: 100,
                    offerCode: "off1",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: 2,
                    weight: 300,
                    distance: 200,
                    offerCode: "off2",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
                {
                    id: 3,
                    weight: 350,
                    distance: 150,
                    offerCode: "off3",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
            ];
            const maxCarryWeight = 200;
            const maxSpeed = 50;
            const currentTime = 0;

            const expected = {
                deliveryDuration: 0,
                driverReturnDuration: 0,
                driverAvailableTime: 0,
                packages: [],
                totalWeight: 0,
            };

            const result = shipmentService.createOptimalShipment(
                packages,
                maxCarryWeight,
                maxSpeed,
                currentTime
            );

            assert.deepStrictEqual(result, expected);
        });

        it("should return a shipment with only one package if it is under the maxCarryWeight", () => {
            const packages = [
                {
                    id: 1,
                    weight: 10,
                    distance: 50,
                    offerCode: "OFFER10",
                    submittedOfferCodes: [],
                    computeDeliverySchedule:
                        packageService.calculateDeliverySchedule,
                },
            ];
            const maxCarryWeight = 20;
            const maxSpeed = 30;
            const currentTime = 2.56;

            const expected = {
                deliveryDuration: 1.66,
                driverReturnDuration: 3.32,
                driverAvailableTime: 5.88,
                packages: [
                    {
                        id: 1,
                        weight: 10,
                        distance: 50,
                        offerCode: "OFFER10",
                        submittedOfferCodes: [],
                        deliveryDuration: 1.66,
                        departureTime: 2.56,
                        arrivalTime: 4.22,
                    },
                ],
                totalWeight: 10,
            };
            const result = shipmentService.createOptimalShipment(
                packages,
                maxCarryWeight,
                maxSpeed,
                currentTime
            );

            assert.deepStrictEqual(result, expected);
        });
    });
});
