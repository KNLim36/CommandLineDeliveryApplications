const costCalculator = {
    calculateDeliveryCost(baseDeliveryCost, weight, distance) {
        baseDeliveryCost = parseInt(baseDeliveryCost);
        weight = parseInt(weight);
        distance = parseInt(distance);
        return baseDeliveryCost + weight * 10 + distance * 5;
    },
    calculateDiscountAmount(cost, discountPercentage) {
        cost = parseInt(cost);
        discountPercentage = parseFloat(discountPercentage);
        return cost * discountPercentage;
    },
    calculateTotalCost(deliveryCost, discountAmount) {
        return deliveryCost - discountAmount;
    },
};

module.exports = {
    costCalculator,
};
