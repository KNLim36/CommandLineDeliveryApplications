const { inputHandler } = require("../utils/inputHandler");
const { offerService } = require("../model/offer");

const maxPackageIdsPerPackage = 1;

const createPackage = (
    id,
    weight,
    distance,
    offerCode,
    submittedOfferCodes,
    computeDeliverySchedule
) => ({
    id,
    weight,
    distance,
    offerCode,
    submittedOfferCodes,
    computeDeliverySchedule,
});

const truncateDecimalToTwoPlaces = (numberToTruncate) => {
    return Math.trunc(numberToTruncate * 100) / 100;
};

const calculatePackageTiming = (distance, maxSpeed, currentTime) => {
    const baseTime = truncateDecimalToTwoPlaces(currentTime);
    const deliveryDuration = truncateDecimalToTwoPlaces(distance / maxSpeed);
    const arrivalTiming = Number((baseTime + deliveryDuration).toFixed(2));
    return {
        deliveryDuration,
        departureTime: baseTime,
        arrivalTime: arrivalTiming,
    };
};

// Package factory function
const Package = (id, weight, distance, offerCode, submittedOfferCodes) =>
    createPackage(
        id,
        weight,
        distance,
        offerCode,
        submittedOfferCodes,
        (maxSpeed, currentTime) => {
            return calculatePackageTiming(distance, maxSpeed, currentTime);
        }
    );

// ProcessedPackage factory function that inherits from Package
const ProcessedPackage = (
    id,
    weight,
    distance,
    offerCode,
    submittedOfferCodes,
    deliveryDuration,
    departureTime,
    arrivalTime
) => ({
    id,
    weight,
    distance,
    offerCode,
    submittedOfferCodes,
    deliveryDuration,
    departureTime,
    arrivalTime,
});

const generatePackages = (packageAmount, packageDetails) => {
    return Array.from({ length: packageAmount }, (_, i) => {
        return generateSinglePackage(packageAmount, packageDetails, i);
    });
};

const generateSinglePackage = (
    packageAmount,
    packageDetails,
    currentPackageIndex
) => {
    const id = getId(packageDetails);
    const weight = getWeight(packageDetails);
    const distance = getDistance(packageDetails);
    const submittedOfferCodes = getOfferCodes(
        packageDetails,
        currentPackageIndex,
        packageAmount
    );
    const eligibleOfferCode =
        offerService.getEligibleOfferCode(submittedOfferCodes);
    return Package(
        id,
        weight,
        distance,
        eligibleOfferCode,
        submittedOfferCodes
    );
};

const getId = (packageDetails) => {
    return packageDetails.shift();
};

const getWeight = (packageDetails) => {
    const weightInput = packageDetails.shift();
    return inputHandler.validateFloatInput("weight", weightInput);
};

const getDistance = (packageDetails) => {
    const distanceInput = packageDetails.shift();
    return inputHandler.validateFloatInput("distance", distanceInput);
};

const calculateStringInputAmount = (packageDetails) => {
    let stringInputAmount = 0;
    let foundNumberIndex = packageDetails.findIndex((detail) =>
        inputHandler.isNumber(parseFloat(detail))
    );

    stringInputAmount =
        foundNumberIndex === -1 ? packageDetails.length : foundNumberIndex;

    return { stringInputAmount };
};

const sortPackagesByWeightThenDistance = (packages) => {
    return packages.sort((a, b) => {
        // Compare weights
        if (a.weight < b.weight) {
            return -1;
        } else if (a.weight > b.weight) {
            return 1;
        }

        // If weights are equal, compare distances
        if (a.distance < b.distance) {
            return -1;
        } else if (a.distance > b.distance) {
            return 1;
        }

        // If both weights and distances are equal, keep the same order
        return 0;
    });
};

// Reorder so it follows the originalPackages' id
const reorderBasedOnId = (packages, originalPackages) => {
    return originalPackages.sort((a, b) => {
        const indexA = packages.findIndex((obj) => obj.id === a.id);
        const indexB = packages.findIndex((obj) => obj.id === b.id);
        return indexA - indexB;
    });
};

const filterOutPackages = (allPackages, packagesToRemove) =>
    allPackages.filter(
        (packageFromA) =>
            !packagesToRemove.some(
                (packageFromB) => packageFromA.id === packageFromB.id
            )
    );

// Users might submit 0, 1 or more than 1 offer codes
const getOfferCodes = (packageDetails, currentPackageIndex, packageAmount) => {
    const isLastPackageInList = currentPackageIndex === packageAmount - 1;
    const offerCodes = [];

    const { stringInputAmount } = calculateStringInputAmount(
        packageDetails,
        isLastPackageInList
    );

    if (isLastPackageInList) {
        for (let i = 0; i < stringInputAmount; i++) {
            offerCodes.push(packageDetails.shift());
        }
    } else if (stringInputAmount > 1) {
        for (let i = 0; i < stringInputAmount - maxPackageIdsPerPackage; i++) {
            offerCodes.push(packageDetails.shift());
        }
    }
    return offerCodes;
};

const packageService = {
    generateSinglePackage,
    generatePackages,
    reorderBasedOnId,
    filterOutPackages,
    sortPackagesByWeightThenDistance,
};

module.exports = {
    Package,
    ProcessedPackage,
    truncateDecimalToTwoPlaces,
    packageService,
};
