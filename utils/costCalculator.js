const calculateDeliveryCost = (baseDeliveryCost, weight, distance) => {
    return baseDeliveryCost + weight * 10 + distance * 5;
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
