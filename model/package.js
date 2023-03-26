const { inputValidator } = require("../utils/inputValidator");
const { offerService } = require("../model/offer");

const maxPackageIdsPerPackage = 1;

const createPackage = (
    id,
    weight,
    distance,
    offerCode,
    computeDeliverySchedule
) => ({
    id,
    weight,
    distance,
    offerCode,
    computeDeliverySchedule,
});

const truncateDecimalToTwoPlaces = (num) => {
    return Math.trunc(num * 100) / 100;
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
const Package = (id, weight, distance, offerCode) =>
    createPackage(id, weight, distance, offerCode, (maxSpeed, currentTime) => {
        return calculatePackageTiming(distance, maxSpeed, currentTime);
    });

// ProcessedPackage factory function that inherits from Package
const ProcessedPackage = (
    id,
    weight,
    distance,
    offerCode,
    deliveryDuration,
    departureTime,
    arrivalTime
) => ({
    id,
    weight,
    distance,
    offerCode,
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
    const offerCodes = getOfferCodes(
        packageDetails,
        currentPackageIndex,
        packageAmount
    );
    const eligibleOfferCode = offerService.getEligibleOfferCode(offerCodes);
    return Package(id, weight, distance, eligibleOfferCode);
};

const getId = (packageDetails) => {
    return packageDetails.shift();
};

const getWeight = (packageDetails) => {
    const weightInput = packageDetails.shift();
    return inputValidator.validateNumericInput("weight", weightInput);
};

const getDistance = (packageDetails) => {
    const distanceInput = packageDetails.shift();
    return inputValidator.validateNumericInput("distance", distanceInput);
};

const calculateStringInputAmount = (packageDetails) => {
    let stringInputAmount = 0;
    let foundNumberIndex = packageDetails.findIndex((detail) =>
        inputValidator.isNumber(parseFloat(detail))
    );

    if (foundNumberIndex === -1) {
        stringInputAmount = packageDetails.length;
    } else {
        stringInputAmount = foundNumberIndex;
    }

    return { stringInputAmount };
};

// Sort packages sequence so it follows the originalPackages
const sortPackages = (packages, originalPackages) => {
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
    sortPackages,
    filterOutPackages,
};

module.exports = {
    Package,
    ProcessedPackage,
    createPackage,
    truncateDecimalToTwoPlaces,
    packageService,
};