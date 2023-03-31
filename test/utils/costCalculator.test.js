const assert = require("assert");
const { costCalculator } = require("../../utils/costCalculator");

describe("costCalculator", () => {
    describe("calculateDeliveryCost", () => {
        it("should correctly calculate delivery cost when given base delivery cost, weight and distance", () => {
            const baseDeliveryCost = 10;
            const weight = 2;
            const distance = 5;
            const expectedDeliveryCost = 10 + 2 * 10 + 5 * 5;

            const result = costCalculator.calculateDeliveryCost(
                baseDeliveryCost,
                weight,
                distance
            );

            assert.deepStrictEqual(result, expectedDeliveryCost);
        });

        it("should round the delivery cost to two decimal places", () => {
            const baseDeliveryCost = 10;
            const weight = 3.5;
            const distance = 7.5;
            const expectedDeliveryCost = 10 + 3.5 * 10 + 7.5 * 5;

            const result = costCalculator.calculateDeliveryCost(
                baseDeliveryCost,
                weight,
                distance
            );

            assert.deepStrictEqual(result, expectedDeliveryCost);
        });
    });

    describe("calculateDiscountAmount", () => {
        it("should correctly calculate discount amount when given cost and discount percentage", () => {
            const cost = 100;
            const discountPercentage = 0.2;
            const expectedDiscountAmount = 20;

            const result = costCalculator.calculateDiscountAmount(
                cost,
                discountPercentage
            );

            assert.deepStrictEqual(result, expectedDiscountAmount);
        });

        it("should round the discount amount to the nearest integer", () => {
            const cost = 200;
            const discountPercentage = 0.25;
            const expectedDiscountAmount = 50;

            const result = costCalculator.calculateDiscountAmount(
                cost,
                discountPercentage
            );

            assert.deepStrictEqual(result, expectedDiscountAmount);
        });
    });

    describe("calculateTotalCost", () => {
        it("should correctly calculate total cost when given delivery cost and discount amount", () => {
            const deliveryCost = 50;
            const discountAmount = 10;
            const expectedTotalCost = 40;

            const result = costCalculator.calculateTotalCost(
                deliveryCost,
                discountAmount
            );

            assert.deepStrictEqual(result, expectedTotalCost);
        });

        it("should handle zero discount amount correctly", () => {
            const deliveryCost = 50;
            const discountAmount = 0;
            const expectedTotalCost = 50;

            const result = costCalculator.calculateTotalCost(
                deliveryCost,
                discountAmount
            );

            assert.deepStrictEqual(result, expectedTotalCost);
        });
    });
});
