const assert = require("assert");
const { offerService, Offer } = require("../../model/offer");

describe("Offer", () => {
    describe("isValidOfferCode", () => {
        it("should return true when given a valid offer code", () => {
            const validOfferCode = "OFR001";
            const offers = [{ code: validOfferCode }];
            const result = offerService.isValidOfferCode(
                validOfferCode,
                offers
            );
            assert.equal(result, true);
        });

        it("should return false when given an invalid offer code", () => {
            const invalidOfferCode = "INVALID";
            const offers = [{ code: "OFR001" }];
            const result = offerService.isValidOfferCode(
                invalidOfferCode,
                offers
            );
            assert.equal(result, false);
        });
    });

    describe("getDiscountPercentage", () => {
        it("should return 0 when given an invalid offer code", () => {
            const weight = 5;
            const distance = 5;
            const invalidOfferCode = "INVALID";
            const offers = [{ code: "OFR001" }];
            const result = offerService.getDiscountPercentage(
                weight,
                distance,
                invalidOfferCode,
                offers
            );
            assert.equal(result, 0);
        });

        it("should return the correct discount percentage when given a valid offer code", () => {
            const weight = 5;
            const distance = 5;
            const validOfferCode = "OFR001";
            const offers = [
                Offer({
                    code: validOfferCode,
                    discount: 50,
                    weightRange: { min: 0, max: 10 },
                    distanceRange: { min: 0, max: 10 },
                    maxWeightInclusive: true,
                    maxDistanceInclusive: true,
                }),
            ];
            const result = offerService.getDiscountPercentage(
                weight,
                distance,
                validOfferCode,
                offers
            );
            assert.equal(result, 0.5);
        });
    });

    describe("getEligibleOfferCode", () => {
        it("should return the only offer code in the array when there is only one", () => {
            const offerCodes = ["OFR001"];
            const result = offerService.getEligibleOfferCode(offerCodes);
            assert.equal(result, "OFR001");
        });

        it("should return an empty string when there are no offer codes in the array", () => {
            const offerCodes = [];
            const result = offerService.getEligibleOfferCode(offerCodes);
            assert.equal(result, "");
        });

        it("should return an empty string when there are more than one offer codes in the array", () => {
            const offerCodes = ["OFR001", "OFR002"];
            const result = offerService.getEligibleOfferCode(offerCodes);
            assert.equal(result, "");
        });
    });
});
