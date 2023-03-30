const assert = require("assert");
const { deliveryService } = require("../../model/delivery");
const { offers } = require("../../model/offer");

describe('Package (weight: 5, distance: 5, offer code: "OFR001")', function () {
    it("has no discount: PKG1 0 175", function () {
        assert.equal(
            deliveryService.constructPackageMessage(
                {
                    id: "PKG1",
                    weight: 5,
                    distance: 5,
                    offerCode: "OFR001",
                },
                offers,
                100,
                true
            ),
            "PKG1 0 175"
        );
    });
});

describe('Package (weight: 15, distance: 5, offer code: "OFR002")', function () {
    it("has no discount: PKG2 0 275", function () {
        assert.equal(
            deliveryService.constructPackageMessage(
                {
                    id: "PKG2",
                    weight: 15,
                    distance: 5,
                    offerCode: "OFR002",
                },
                offers,
                100,
                true
            ),
            "PKG2 0 275"
        );
    });
});

describe('Package (weight: 10, distance: 100, offer code: "OFR003")', function () {
    it("has discount: PKG3 35 665", function () {
        assert.equal(
            deliveryService.constructPackageMessage(
                {
                    id: "PKG3",
                    weight: 10,
                    distance: 100,
                    offerCode: "OFR003",
                },
                offers,
                100,
                true
            ),
            "PKG3 35 665"
        );
    });
});

describe('Package (weight: 110, distance: 60, offer code: "OFR002")', function () {
    it("has discount: PKG4 105 1395", function () {
        assert.equal(
            deliveryService.constructPackageMessage(
                {
                    id: "PKG4",
                    weight: 110,
                    distance: 60,
                    offerCode: "OFR002",
                },
                offers,
                100,
                true
            ),
            "PKG4 105 1395"
        );
    });
});
