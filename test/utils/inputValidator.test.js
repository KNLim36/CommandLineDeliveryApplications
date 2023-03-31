const assert = require("assert");
const { inputValidator } = require("../../utils/inputValidator");

describe("validateRange", () => {
    it("should return true if value is within range", () => {
        const value = 5;
        const range = { min: 1, max: 10 };
        const rangeMaxInclusive = true;
        const result = inputValidator.validateRange(
            value,
            range,
            rangeMaxInclusive
        );
        assert.deepStrictEqual(result, true);
    });

    it("should return false if value is outside range", () => {
        const value = 15;
        const range = { min: 1, max: 10 };
        const rangeMaxInclusive = true;
        const result = inputValidator.validateRange(
            value,
            range,
            rangeMaxInclusive
        );
        assert.deepStrictEqual(result, false);
    });

    it("should return true if value is within range with max not inclusive", () => {
        const value = 5;
        const range = { min: 1, max: 10 };
        const rangeMaxInclusive = false;
        const result = inputValidator.validateRange(
            value,
            range,
            rangeMaxInclusive
        );
        assert.deepStrictEqual(result, true);
    });

    it("should return false if value is on the max and max not inclusive", () => {
        const value = 10;
        const range = { min: 1, max: 10 };
        const rangeMaxInclusive = false;
        const result = inputValidator.validateRange(
            value,
            range,
            rangeMaxInclusive
        );
        assert.deepStrictEqual(result, false);
    });
});

describe("isNumber", () => {
    it("should return true if value is a number", () => {
        const value = 5;
        const result = inputValidator.isNumber(value);
        assert.deepStrictEqual(result, true);
    });

    it("should return false if value is not a number", () => {
        const value = "abc";
        const result = inputValidator.isNumber(value);
        assert.deepStrictEqual(result, false);
    });
});

describe("validateFloatInput", () => {
    it("should return parsed float if input value is valid", () => {
        const inputName = "test";
        const inputValue = "10.5";
        const result = inputValidator.validateFloatInput(
            inputName,
            inputValue,
            true
        );
        assert.deepStrictEqual(result, 10.5);
    });

    it("should return error message if input value is not a float", () => {
        const inputName = "test";
        const inputValue = "abc";
        const expectedMessage = `The provided value for the ${inputName} is invalid. The received value is ${inputValue}, which is not a valid float.`;
        const result = inputValidator.validateFloatInput(
            inputName,
            inputValue,
            true
        );
        assert.deepStrictEqual(result, expectedMessage);
    });

    it("should return error message if parsed value is NaN", () => {
        const inputName = "test";
        const inputValue = "abc";
        const expectedMessage = `The provided value for the ${inputName} is invalid. The received value is ${inputValue}, which is not a valid float.`;
        const result = inputValidator.validateFloatInput(
            inputName,
            inputValue,
            true
        );
        assert.deepStrictEqual(result, expectedMessage);
    });
});
