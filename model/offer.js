const { inputValidator } = require("../utils/inputValidator");

const maxOfferCodesPerPackage = 1;

// Factory function
const createOffer = ({
    code,
    weightRange,
    distanceRange,
    discount,
    maxWeightInclusive,
    maxDistanceInclusive,
    calculateDiscountPercentage,
}) => ({
    code,
    weightRange,
    distanceRange,
    discount,
    maxWeightInclusive,
    maxDistanceInclusive,
    calculateDiscountPercentage,
});

const Offer = (offer) =>
    createOffer({
        code: offer.code,
        weightRange: offer.weightRange,
        distanceRange: offer.distanceRange,
        discount: offer.discount,
        maxWeightInclusive: offer.maxWeightInclusive,
        maxDistanceInclusive: offer.maxDistanceInclusive,
        calculateDiscountPercentage: (
            {
                weightRange,
                maxWeightInclusive,
                distanceRange,
                maxDistanceInclusive,
            },
            weight,
            distance
        ) => {
            if (
                validateRange(weight, weightRange, maxWeightInclusive) &&
                validateRange(distance, distanceRange, maxDistanceInclusive)
            ) {
                return offer.discount / 100;
            } else {
                return 0;
            }
        },
    });

const validateRange = (value, range, maxRangeInclusive) =>
    inputValidator.validateRange(value, range, maxRangeInclusive);

// Import the offers array from config
const offerConfig = require("../config/offerConfig.json");
const offerData = offerConfig.offers;

// Transform each offer using the factory function
const offers = offerData.map(Offer);

const isValidOfferCode = (offerCode, offers) =>
    offers.some((offer) => offer.code === offerCode);

const getOfferSpecificDiscount = (offer, weight, distance) => {
    return offer.calculateDiscountPercentage(offer, weight, distance);
};

const getDiscountPercentage = (weight, distance, offerCode, offers) => {
    if (isValidOfferCode(offerCode, offers)) {
        let offer = offers.find((offer) => offer.code === offerCode);
        return getOfferSpecificDiscount(offer, weight, distance);
    }
    return 0;
};

const getEligibleOfferCode = (offerCodes) => {
    // If offer codes submitted are 0 or more than 1, reject
    if (offerCodes.length === maxOfferCodesPerPackage) {
        return offerCodes[0];
    } else {
        // Similar to not submitting an offer code at all
        return "";
    }
};

const offerService = {
    getDiscountPercentage,
    getEligibleOfferCode,
    isValidOfferCode,
};

module.exports = {
    offerService,
    offers,
    Offer,
};
