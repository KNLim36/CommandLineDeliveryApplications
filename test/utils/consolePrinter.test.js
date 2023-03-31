const assert = require("assert");
const { consolePrinter } = require("../../utils/consolePrinter");

describe("consolePrinter", () => {
    describe("constructProcessedMessage", () => {
        it("should return a message with arrival time when arrival time is provided", () => {
            const id = "123";
            const arrivalTime = "12:00 PM";
            const discountAmount = "$5.00";
            const totalCost = "$20.00";
            const expectedMessage = `${id} ${discountAmount} ${totalCost} ${arrivalTime}`;

            const result = consolePrinter.constructProcessedMessage(
                { id, arrivalTime },
                discountAmount,
                totalCost
            );

            assert.deepStrictEqual(result, expectedMessage);
        });

        it("should return a message without arrival time when arrival time is not provided", () => {
            const id = "123";
            const discountAmount = "$5.00";
            const totalCost = "$20.00";
            const expectedMessage = `${id} ${discountAmount} ${totalCost}`;

            const result = consolePrinter.constructProcessedMessage(
                { id },
                discountAmount,
                totalCost
            );

            assert.deepStrictEqual(result, expectedMessage);
        });
    });
});
