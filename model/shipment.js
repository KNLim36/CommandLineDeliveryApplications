const { ProcessedPackage, truncateDecimalToTwoPlaces } = require("./package");
const Shipment = (
    deliveryDuration,
    driverReturnDuration,
    packages,
    totalWeight
) => ({
    deliveryDuration,
    driverReturnDuration,
    packages,
    totalWeight,
});

const util = require("util");

const findHeaviestShipment = (items) => {
    return items.reduce(getHighestAmount, items[0]);
};

const getHighestAmount = (highest, current) => {
    if (current.amount > highest.amount) {
        return current;
    } else if (current.amount === highest.amount) {
        return getHighestWeight(highest, current);
    } else {
        return highest;
    }
};

const getHighestWeight = (itemA, itemB) => {
    return itemA.totalWeight > itemB.totalWeight ? itemA : itemB;
};

// Based on all currently available packages, we plan out a
// distance and weight optimized shipment
const createOptimalShipment = (
    packages,
    maxCarryWeight,
    maxSpeed,
    currentTime
) => {
    const processedPackages = [];

    for (let i = 0; i < packages.length; i++) {
        const shipment = [];
        const package = packages[i];
        let totalWeight = 0;

        if (package.weight <= maxCarryWeight) {
            const { id, weight, distance, offerCode, submittedOfferCodes } =
                package;
            const { deliveryDuration, departureTime, arrivalTime } =
                package.computeDeliverySchedule(maxSpeed, currentTime);

            shipment.push(
                ProcessedPackage(
                    id,
                    weight,
                    distance,
                    offerCode,
                    submittedOfferCodes,
                    deliveryDuration,
                    departureTime,
                    arrivalTime
                )
            );
            totalWeight += package.weight;
        }

        for (let j = 0; j < packages.length; j++) {
            if (i === j) continue;
            const sibling = packages[j];
            const { id, weight, distance, offerCode, submittedOfferCodes } =
                sibling;

            if (sibling.weight + totalWeight <= maxCarryWeight) {
                const { deliveryDuration, departureTime, arrivalTime } =
                    sibling.computeDeliverySchedule(maxSpeed, currentTime);
                shipment.push(
                    ProcessedPackage(
                        id,
                        weight,
                        distance,
                        offerCode,
                        submittedOfferCodes,
                        deliveryDuration,
                        departureTime,
                        arrivalTime
                    )
                );
                totalWeight += sibling.weight;
            }
        }

        processedPackages.push({
            packages: shipment,
            amount: shipment.length,
            totalWeight,
        });
    }

    const optimalShipment = findHeaviestShipment(processedPackages);

    const shipmentDeliveryDuration =
        getLongestDeliveryDuration(optimalShipment);
    const driverReturnDuration = getDriverReturnDuration(
        shipmentDeliveryDuration
    );
    const driverAvailableTime = truncateDecimalToTwoPlaces(
        truncateDecimalToTwoPlaces(currentTime) +
            truncateDecimalToTwoPlaces(driverReturnDuration)
    );

    return {
        deliveryDuration: shipmentDeliveryDuration,
        driverReturnDuration,
        driverAvailableTime,
        packages: optimalShipment.packages,
        totalWeight: optimalShipment.totalWeight,
    };
};

const getLongestDeliveryDuration = (shipment) => {
    const packages = shipment.packages;
    let longestDeliveryDuration = 0;

    for (let i = 0; i < packages.length; i++) {
        const packageDeliveryDuration = packages[i].deliveryDuration;
        if (packageDeliveryDuration > longestDeliveryDuration) {
            longestDeliveryDuration = packageDeliveryDuration;
        }
    }
    return longestDeliveryDuration;
};

const getDriverReturnDuration = (deliveryDuration) => {
    return deliveryDuration * 2;
};

const calculateReturningVehicleAmount = (shipments, minReturnTime) =>
    shipments.filter(
        (shipment) => shipment.driverAvailableTime === minReturnTime
    ).length;

const getQuickestShipments = (progressingShipments, minReturnTime) =>
    progressingShipments.filter(
        (shipment) => shipment.driverAvailableTime === minReturnTime
    );

const calculateMinReturnTime = (shipments) =>
    Math.min(...shipments.map((shipment) => shipment.driverAvailableTime));

const shipmentService = {
    createOptimalShipment,
    getQuickestShipments,
    calculateReturningVehicleAmount,
    calculateMinReturnTime,
};

module.exports = {
    Shipment,
    shipmentService,
};
