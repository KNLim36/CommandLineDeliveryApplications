const { consolePrinter, colorCodeEnum } = require("../utils/consolePrinter");
const { costCalculator } = require("../utils/costCalculator");
const { offerService, offers } = require("./offer");
const { packageService } = require("./package");
const { shipmentService } = require("./shipment");

// Has a different way of declaration because the information is unknown in the beginning
const createDelivery = () => {
    const delivery = {};

    let baseDeliveryCost = null;
    let packageAmount = null;
    let packageDetails = null;
    let vehicleAmount = null;
    let vehicleMaxSpeed = null;
    let vehicleMaxCarryWeight = null;
    let packages = [];
    let deliveredPackages = [];

    delivery.getBaseDeliveryCost = () => {
        return baseDeliveryCost;
    };

    delivery.setBaseDeliveryCost = (newCost) => {
        baseDeliveryCost = newCost;
    };

    delivery.getPackageAmount = () => {
        return packageAmount;
    };

    delivery.setPackageAmount = (newAmount) => {
        packageAmount = newAmount;
    };

    delivery.getPackageDetails = () => {
        return packageDetails;
    };

    delivery.setPackageDetails = (newDetails) => {
        packageDetails = newDetails;
    };

    delivery.getVehicleAmount = () => {
        return vehicleAmount;
    };

    delivery.setVehicleAmount = (newAmount) => {
        vehicleAmount = newAmount;
    };

    delivery.getVehicleMaxSpeed = () => {
        return vehicleMaxSpeed;
    };

    delivery.setVehicleMaxSpeed = (newSpeed) => {
        vehicleMaxSpeed = newSpeed;
    };

    delivery.getVehicleMaxCarryWeight = () => {
        return vehicleMaxCarryWeight;
    };

    delivery.setVehicleMaxCarryWeight = (newWeight) => {
        vehicleMaxCarryWeight = newWeight;
    };

    delivery.getPackages = () => {
        return packages;
    };

    delivery.setPackages = (newPackages) => {
        packages = newPackages;
    };

    delivery.getDeliveredPackages = () => {
        return deliveredPackages;
    };

    delivery.computeDeliveredPackages = () => {
        let undeliveredPackages =
            packageService.sortPackagesByWeightThenDistance([...packages]);
        let progressingShipments = [];
        let currentTime = 0;

        while (undeliveredPackages.length || progressingShipments.length) {
            if (undeliveredPackages.length && vehicleAmount) {
                const shipment = shipmentService.createOptimalShipment(
                    undeliveredPackages,
                    vehicleMaxCarryWeight,
                    vehicleMaxSpeed,
                    currentTime
                );
                undeliveredPackages = packageService.filterOutPackages(
                    undeliveredPackages,
                    shipment.packages
                );
                progressingShipments.push(shipment);
                vehicleAmount--;
            } else {
                const minReturnTime =
                    shipmentService.calculateMinReturnTime(
                        progressingShipments
                    );
                const quickestShipments = shipmentService.getQuickestShipments(
                    progressingShipments,
                    minReturnTime
                );
                for (const shipment of quickestShipments) {
                    deliveredPackages.push(...shipment.packages);
                }
                vehicleAmount +=
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

        deliveredPackages = packageService.reorderBasedOnId(
            packages,
            deliveredPackages
        );
    };

    delivery.outputPackage = (devMode = false) => {
        const packageToOutput = deliveredPackages.length
            ? deliveredPackages
            : packages;
        const outputMessages = [];
        packageToOutput.forEach((package) => {
            const processedMessage = constructPackageMessage(
                package,
                baseDeliveryCost,
                true
            );
            outputMessages.push(processedMessage);
            if (!devMode) {
                consolePrinter.outputColoredText(
                    processedMessage,
                    colorCodeEnum.brightMagenta
                );
            }
        });
        return outputMessages;
    };

    return delivery;
};

const constructPackageMessage = (
    { id, weight, distance, offerCode, arrivalTime },
    baseDeliveryCost,
    devMode = false
) => {
    const deliveryCost = costCalculator.calculateDeliveryCost(
        baseDeliveryCost,
        weight,
        distance
    );
    const discountPercentage = offerService.getDiscountPercentage(
        weight,
        distance,
        offerCode,
        offers
    );
    const discountAmount = costCalculator.calculateDiscountAmount(
        deliveryCost,
        discountPercentage
    );
    const totalCost = costCalculator.calculateTotalCost(
        deliveryCost,
        discountAmount
    );
    if (!devMode) {
        consolePrinter.print(
            `${id} has delivery cost ${deliveryCost}, discount percentage ${discountPercentage}, discount amount ${discountAmount}, total cost: ${totalCost}`
        );
    }
    return consolePrinter.constructProcessedMessage(
        { id, arrivalTime },
        discountAmount,
        totalCost
    );
};

const deliveryService = {
    constructPackageMessage,
    createDelivery,
};

module.exports = {
    deliveryService,
};
