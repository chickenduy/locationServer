"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAggregation = (req, res, groups) => {
    switch (req.body.type) {
        case "test":
            sendAggregation1();
            res.status(200).send("startAggregation");
            break;
        case "test2":
            sendAggregation1();
            break;
        default:
            break;
    }
};
let sendAggregation1 = () => {
};
//# sourceMappingURL=requests.js.map