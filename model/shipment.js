const util = require("util");
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

const sortPackagesByWeightDescending = (packages) => {
    return packages.sort((a, b) => b.pkgWeight - a.pkgWeight);
};

// Most heavy first, then furthest first
// const sortPackagesByWeightAndDistanceDescending = (packages) => {
//     const packagesCopy = packages.slice();
//     return packagesCopy.sort(
//         (a, b) =>
//             b.pkgWeight !== a.pkgWeight // If not same weight
//                 ? b.pkgWeight - a.pkgWeight // sort using weight
//                 : b.pkgDistance - a.pkgDistance // else sort using distance
//     );
// };

// Most light first, then furthest first
const sortPackagesByWeightAndDistanceAscending = (packages) => {
    const packagesCopy = packages.slice();
    return packagesCopy.sort(
        (a, b) =>
            a.pkgWeight !== b.pkgWeight // If not same weight
                ? a.pkgWeight - b.pkgWeight // sort using weight
                : b.pkgDistance - a.pkgDistance // else sort using distance
    );
};

const groupPackages = (sortedPackages, maxCarryWeight) => {
    let currentWeight = 0;
    let currentPackages = [];

    for (const pkg of sortedPackages) {
        if (currentWeight + pkg.pkgWeight <= maxCarryWeight) {
            currentWeight += pkg.pkgWeight;
            currentPackages.push(pkg);
        } else {
            break;
        }
    }

    if (currentPackages.length > 1) {
        currentPackages.sort((a, b) => {
            if (a.pkgWeight !== b.pkgWeight) {
                return a.pkgWeight - b.pkgWeight;
            } else {
                return b.pkgDistance - a.pkgDistance;
            }
        });
    }

    return { packages: currentPackages, totalWeight: currentWeight };
};

const calculateDeliveryDuration = (packages, maxSpeed) => {
    return packages.reduce((latestDuration, pkg) => {
        const deliveryDuration = truncateDecimalToTwoPlaces(
            pkg.pkgDistance / maxSpeed
        );
        return deliveryDuration > latestDuration
            ? deliveryDuration
            : latestDuration;
    }, 0);
};

const calculateDriverReturnDuration = (packages, maxSpeed) => {
    const deliveryDuration = calculateDeliveryDuration(packages, maxSpeed);
    return deliveryDuration * 2;
};

const getPackageCombinations = (packages, maxCarryWeight) => {
    const combinations = [];

    for (let i = 0; i < packages.length; i++) {
        const package = packages[i];
        if (package.pkgWeight > maxCarryWeight) continue;

        for (let j = i + 1; j < packages.length; j++) {
            const sibling = packages[j];
            if (sibling.pkgWeight + package.pkgWeight <= maxCarryWeight) {
                combinations.push([package, sibling]);
            }
        }

        combinations.push([package]);
    }

    console.log(util.inspect(combinations, { depth: null }));

    return combinations;
};

const getOptimalCombination = (combinations) => {
    let optimalCombination = [];

    for (let i = 0; i < combinations.length; i++) {
        const validPackages = combinations[i];
        if (validPackages.length > optimalCombination.length) {
            optimalCombination = validPackages;
        } else if (validPackages.length === optimalCombination.length) {
            const combinationTotalWeight = getTotalWeight(validPackages);
            const optimalTotalWeight = getTotalWeight(optimalCombination);
            if (combinationTotalWeight > optimalTotalWeight) {
                optimalCombination = validPackages;
            }
        }
    }

    return optimalCombination;
};

const getTotalWeight = (packages) => {
    return packages.reduce((total, p) => total + p.pkgWeight, 0);
};

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

const createOptimalShipment = (packages, maxCarryWeight, maxSpeed) => {
    const shipments = [];
    
    for (let i = 0; i < packages.length; i++) {
        const shipment = [];
        const package = packages[i];
        let totalWeight = 0;

        if (package.pkgWeight <= maxCarryWeight) {
            shipment.push(package);
            totalWeight += package.pkgWeight;
        }

        for (let j = i + 1; j < packages.length; j++) {
            const sibling = packages[j];
            if (sibling.pkgWeight + totalWeight <= maxCarryWeight) {
                shipment.push(sibling);
                totalWeight += sibling.pkgWeight;
            }
        }

        shipments.push({
            packages: shipment,
            amount: shipment.length,
            totalWeight,
        });
    }

    const optimalShipment = findHeaviestShipment(shipments);
    const deliveryDuration = getDeliveryDuration(optimalShipment, maxSpeed);
    const driverReturnDuration = getDriverReturnDuration(deliveryDuration);

    return {
        deliveryDuration,
        driverReturnDuration,
        packages: optimalShipment.packages,
        totalWeight: optimalShipment.totalWeight,
    };
};

const getDeliveryDuration = (shipment, maxSpeed) => {
    const packages = shipment.packages;
    let longestDeliveryDuration = 0;

    for (let i = 0; i < packages.length; i++) {
        const packageDeliveryDuration = truncateDecimalToTwoPlaces(
            packages[i].pkgDistance / maxSpeed
        );

        if (packageDeliveryDuration > longestDeliveryDuration) {
            longestDeliveryDuration = packageDeliveryDuration;
        }
    }
    return longestDeliveryDuration;
};

const getDriverReturnDuration = (deliveryDuration) => {
    return deliveryDuration * 2;
};

const truncateDecimalToTwoPlaces = (num) => {
    return Math.trunc(num * 100) / 100;
};

const shipmentService = {
    createOptimalShipment,
};

module.exports = {
    Shipment,
    shipmentService,
};
