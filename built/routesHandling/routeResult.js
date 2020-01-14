"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aggregationResult_1 = require("../model/aggregationResult");
class RouteResult {
    constructor() {
        this.handleGetAggregationResult = (req, res) => {
            let id = req.query.id;
            if (id != null) {
                aggregationResult_1.findAggregationResultPromise(id)
                    .then((result) => {
                    res.status(200).json(result).send();
                })
                    .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "startAggregation",
                        "message": err
                    };
                    res.status(500).json(response).send();
                });
            }
            else {
                let response = {
                    "status": "failure",
                    "source": "startAggregation",
                    "message": ""
                };
                res.status(500).json(response).send();
            }
        };
    }
}
exports.default = RouteResult;
//# sourceMappingURL=routeResult.js.map