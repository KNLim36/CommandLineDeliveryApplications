const calculateDeliveryCost = (baseDeliveryCost, weight, distance) => {
    const calculatedDeliveryCost =
        baseDeliveryCost + weight * 10 + distance * 5;
    const roundedCost = calculatedDeliveryCost.toFixed(2);
    return parseFloat(roundedCost);
};

const calculateDiscountAmount = (cost, discountPercentage) => {
    cost = parseInt(cost);
    discountPercentage = parseFloat(discountPercentage);
    return Math.round(cost * discountPercentage);
};

const calculateTotalCost = (deliveryCost, discountAmount) => {
    return deliveryCost - discountAmount;
};
const costCalculator = {
    calculateDeliveryCost,
    calculateDiscountAmount,
    calculateTotalCost,
};

module.exports = {
    costCalculator,
};
