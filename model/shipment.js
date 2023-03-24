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

const groupPackages = (sortedPackages, maxWeight) => {
    let currentWeight = 0;
    let currentPackages = [];

    for (const pkg of sortedPackages) {
        if (currentWeight + pkg.pkgWeight <= maxWeight) {
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

const getPackageCombinations = (packages, maxWeight) => {
    const combinations = [];

    for (let i = 0; i < packages.length; i++) {
        const package = packages[i];
        if (package.pkgWeight > maxWeight) continue;

        for (let j = i + 1; j < packages.length; j++) {
            const sibling = packages[j];
            if (sibling.pkgWeight + package.pkgWeight <= maxWeight) {
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
        const combination = combinations[i];
        if (combination.length > optimalCombination.length) {
            optimalCombination = combination;
        } else if (combination.length === optimalCombination.length) {
            const combinationTotalWeight = getTotalWeight(combination);
            const optimalTotalWeight = getTotalWeight(optimalCombination);
            if (combinationTotalWeight > optimalTotalWeight) {
                optimalCombination = combination;
            }
        }
    }

    return optimalCombination;
};

const getTotalWeight = (packages) => {
    return packages.reduce((total, p) => total + p.pkgWeight, 0);
};

const getMax = (arr) => {
    return arr.reduce(getHighestAmount, arr[0]);
};

const getHighestAmount = (acc, cur) => {
    if (cur.amount > acc.amount) {
        return cur;
    } else if (cur.amount === acc.amount) {
        return getHighestWeight(acc, cur);
    } else {
        return acc;
    }
};

const getHighestWeight = (a, b) => {
    return a.totalWeight > b.totalWeight ? a : b;
};

const createOptimalShipment = (packages, maxWeight, maxSpeed) => {
    const packagesCopy = packages.slice();
    const combinationArray = [];

    for (let i = 0; i < packagesCopy.length; i++) {
        const package = packagesCopy[i];
        let currentWeight = 0;
        const combination = [];

        if (package.pkgWeight <= maxWeight) {
            combination.push(package);
            currentWeight += package.pkgWeight;
        }

        for (let j = 0; j < packagesCopy.length; j++) {
            if (j <= i) continue;
            const sibling = packagesCopy[j];
            if (sibling.pkgWeight + currentWeight <= maxWeight) {
                combination.push(sibling);
                currentWeight += sibling.pkgWeight;
            }
        }

        combinationArray.push({
            packages: combination,
            amount: combination.length,
            totalWeight: currentWeight,
        });
    }

    const max = getMax(combinationArray);

    const deliveryDuration = getDeliveryDuration(max, maxSpeed);
    const driverReturnDuration = getDriverReturnDuration(deliveryDuration);

    return {
        deliveryDuration,
        driverReturnDuration,
        packages: max.packages,
        totalWeight: max.totalWeight,
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
    sortPackagesByWeightDescending,
    createOptimalShipment,
};

module.exports = {
    Shipment,
    shipmentService,
};
