const Offer = (
    code,
    weightRange,
    distanceRange,
    discount,
    maxWeightInclusive,
    maxDistanceInclusive
) => ({
    code,
    weightRange,
    distanceRange,
    discount,
    maxWeightInclusive,
    maxDistanceInclusive,
});

const offers = [
    Offer(
        "OFR001",
        { min: 70, max: 200 },
        { min: 0, max: 200 },
        10,
        true,
        false
    ),
    Offer(
        "OFR002",
        { min: 100, max: 250 },
        { min: 50, max: 150 },
        7,
        true,
        true
    ),
    Offer(
        "OFR003",
        { min: 10, max: 150 },
        { min: 50, max: 250 },
        5,
        true,
        true
    ),
];

const validateRange = (value, range, rangeMaxInclusive) =>
    rangeMaxInclusive
        ? value >= range.min && value <= range.max
        : value >= range.min && value < range.max;

const getOffer = (offerCode, offers) =>
    offers.find((offer) => offer.code === offerCode);

const isValidOfferCode = (offerCode, offers) =>
    offers.some((offer) => offer.code === offerCode);

const satisfiesAllCriteria = (weight, distance, offer) => {
    const {
        weightRange,
        distanceRange,
        maxWeightInclusive,
        maxDistanceInclusive,
    } = offer;

    return (
        validateRange(weight, weightRange, maxWeightInclusive) &&
        validateRange(distance, distanceRange, maxDistanceInclusive)
    );
};

const getDiscountPercentage = (weight, distance, offer) =>
    satisfiesAllCriteria(weight, distance, offer) ? offer.discount / 100 : 0;

const offerService = {
    getOffer,
    isValidOfferCode,
    getDiscountPercentage,
};

module.exports = {
    Offer,
    offerService,
    offers,
};
