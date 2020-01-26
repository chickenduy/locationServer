"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const communication_1 = __importDefault(require("../model/communication"));
const helpers_1 = require("../functions/helpers");
const uniqid_1 = __importDefault(require("uniqid"));
const crowd = __importStar(require("../model/crowd"));
const request_1 = require("../functions/request");
const aggregation_1 = require("../functions/aggregation");
const aggregationModel_1 = __importDefault(require("../model/aggregationModel"));
const MIN_GROUP_SIZE = 3;
const MIN_ANON = 1;
class RouteAggregation {
    constructor() {
        this.aggregationObjects = {};
        /**
        * This handles an incoming aggregation request
        * @param req
        * @param res
        */
        this.handleAggregationRequest = (req, res) => {
            let com = new communication_1.default();
            crowd.getAllCrowdPromise()
                .then((users) => {
                let tokens = [];
                users.forEach((user) => {
                    tokens.push(user.id);
                });
                com.getPresence(tokens)
                    .then((result) => {
                    let onlineCrowd = [];
                    let users = result.presence;
                    users.forEach(user => {
                        if (user.online) {
                            onlineCrowd.push(user.id);
                            crowd.patchCrowdPromise(user.id);
                        }
                    });
                    if (onlineCrowd.length == 0) {
                        let response = {
                            "status": "failure",
                            "source": "getPresence",
                            "message": "no devices online"
                        };
                        res.status(500).json(response).send();
                        return;
                    }
                    if (onlineCrowd.length < MIN_GROUP_SIZE) {
                        let response = {
                            "status": "failure",
                            "source": "startAggregation",
                            "message": "not enough participants"
                        };
                        res.status(500).json(response).send();
                        return;
                    }
                    onlineCrowd = helpers_1.shuffleFisherYates(onlineCrowd);
                    crowd.getCrowdWithTokensPromise(onlineCrowd)
                        .then((onlineCrowdDetailed) => {
                        let counter = 0;
                        let groups = [[]];
                        let newGroupSize = MIN_GROUP_SIZE;
                        let json = {
                            length: onlineCrowd.length,
                            lengthd: onlineCrowdDetailed.length
                        };
                        res.status(200).json(json).send();
                        while (onlineCrowdDetailed.length % newGroupSize < MIN_GROUP_SIZE && onlineCrowdDetailed.length % newGroupSize != 0) {
                            newGroupSize++;
                        }
                        while (onlineCrowdDetailed.length) {
                            groups[counter] = onlineCrowdDetailed.splice(0, newGroupSize);
                            counter++;
                        }
                        let uniqueId = uniqid_1.default();
                        this.aggregationObjects[uniqueId] = new aggregationModel_1.default();
                        this.aggregationObjects[uniqueId].numberOfGroups = groups.length;
                        if (req.body.request.anonymity > MIN_ANON) {
                            this.aggregationObjects[uniqueId].anonymity = req.body.request.anonymity;
                        }
                        console.log("start aggregation");
                        request_1.startAggregationPromise(req, groups, uniqueId)
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
                    })
                        .catch((err) => {
                        let response = {
                            "status": "failure",
                            "source": "getPresence",
                            "message": err
                        };
                        res.status(500).json(response).send();
                    });
                })
                    .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "startAggregation",
                        "message": err
                    };
                    res.status(500).json(response).send();
                });
            })
                .catch((err) => {
                let response = {
                    "status": "failure",
                    "source": "getAllUsers",
                    "message": err
                };
                res.status(500).json(response).send();
            });
        };
        /**
         *
         * @param req
         * @param res
         */
        this.handlePostStepsResult = (req, res) => {
            console.log(req.body.data.raw);
            let raw = req.body.data.raw;
            let id = req.body.requestHeader.id;
            raw.forEach(element => {
                // somehow concat doesn't work
                this.aggregationObjects[id].raw.push(element);
            });
            this.aggregationObjects[id].collectedGroups++;
            this.aggregationObjects[id].n += req.body.data.n;
            if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
                let response = {
                    "status": "success",
                    "source": "handlePostPresenceResult",
                    "message": "received all"
                };
                res.status(200).json(response).send();
                let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0);
                let result = {
                    id: id,
                    type: req.body.requestHeader.type,
                    start: req.body.requestHeader.start,
                    end: Date.now(),
                    average_steps: sum / req.body.data.n,
                    raw: this.aggregationObjects[id].raw,
                    n: this.aggregationObjects[id].n,
                    options: req.body.requestData
                };
                aggregation_1.createAggregationResultPromise(result)
                    .then((result) => {
                })
                    .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "createAggregationResultPromise",
                        "message": err
                    };
                    res.status(200).json(response).send();
                });
                delete this.aggregationObjects[id];
            }
            else {
                let response = {
                    "status": "success",
                    "source": "handlePostPresenceResult",
                    "message": `received results (${this.aggregationObjects[id].collectedGroups}/${this.aggregationObjects[id].numberOfGroups})`
                };
                res.status(200).json(response).send();
            }
        };
        /**
         *
         * @param req
         * @param res
         */
        this.handlePostActivityResult = (req, res) => {
            console.log(req.body.data.raw);
            let raw = req.body.data.raw;
            let id = req.body.requestHeader.id;
            raw.forEach(element => {
                // somehow concat doesn't work
                this.aggregationObjects[id].raw.push(element);
            });
            this.aggregationObjects[id].collectedGroups++;
            this.aggregationObjects[id].n += req.body.data.n;
            if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
                let response = {
                    "status": "success",
                    "source": "handlePostPresenceResult",
                    "message": "received all"
                };
                res.status(200).json(response).send();
                let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0);
                let result = {
                    id: id,
                    type: req.body.requestHeader.type,
                    start: req.body.requestHeader.start,
                    end: Date.now(),
                    average: sum / this.aggregationObjects[id].n,
                    raw: this.aggregationObjects[id].raw,
                    n: this.aggregationObjects[id].n,
                    options: req.body.requestData
                };
                aggregation_1.createAggregationResultPromise(result)
                    .then((result) => {
                })
                    .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "createAggregationResultPromise",
                        "message": err
                    };
                    res.status(200).json(response).send();
                });
                delete this.aggregationObjects[id];
            }
            else {
                let response = {
                    "status": "success",
                    "source": "handlePostPresenceResult",
                    "message": `received results (${this.aggregationObjects[id].collectedGroups}/${this.aggregationObjects[id].numberOfGroups})`
                };
                res.status(200).json(response).send();
            }
        };
        /**
         *
         * @param req
         * @param res
         */
        this.handlePostLocationResult = (req, res) => {
            let raw = req.body.data.raw;
            let id = req.body.requestHeader.id;
            raw.forEach(element => {
                // somehow concat doesn't work
                this.aggregationObjects[id].raw.push(element);
            });
            this.aggregationObjects[id].collectedGroups++;
            this.aggregationObjects[id].n += req.body.data.n;
            if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
                let response = {
                    "status": "success",
                    "source": "handlePostPresenceResult",
                    "message": "received all"
                };
                res.status(200).json(response).send();
                let supressed = helpers_1.suppressLocations(this.aggregationObjects[id].anonymity, this.aggregationObjects[id].raw);
                let result = {
                    id: id,
                    type: req.body.requestHeader.type,
                    start: req.body.requestHeader.start,
                    end: Date.now(),
                    raw: supressed,
                    n: this.aggregationObjects[id].n,
                    options: req.body.requestData
                };
                aggregation_1.createAggregationResultPromise(result)
                    .then((result) => {
                })
                    .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "createAggregationResultPromise",
                        "message": `${err} ${this.aggregationObjects[id].raw}`
                    };
                    res.status(200).json(response).send();
                });
                delete this.aggregationObjects[id];
            }
            else {
                let response = {
                    "status": "success",
                    "source": "handlePostPresenceResult",
                    "message": `received results (${this.aggregationObjects[id].collectedGroups}/${this.aggregationObjects[id].numberOfGroups})`
                };
                res.status(200).json(response).send();
            }
        };
        /**
         *
         * @param req
         * @param res
         */
        this.handlePostPresenceResult = (req, res) => {
            console.log(req.body.data.raw);
            let raw = req.body.data.raw;
            let id = req.body.requestHeader.id;
            raw.forEach(element => {
                // somehow concat doesn't work
                this.aggregationObjects[id].raw.push(element);
            });
            this.aggregationObjects[id].collectedGroups++;
            this.aggregationObjects[id].n += req.body.data.n;
            if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
                let response = {
                    "status": "success",
                    "source": "handlePostPresenceResult",
                    "message": "received all"
                };
                res.status(200).json(response).send();
                let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0);
                let result = {
                    id: id,
                    type: req.body.requestHeader.type,
                    start: req.body.requestHeader.start,
                    end: Date.now(),
                    visits: sum,
                    raw: this.aggregationObjects[id].raw,
                    n: this.aggregationObjects[id].n,
                    options: req.body.requestData
                };
                aggregation_1.createAggregationResultPromise(result)
                    .then((result) => {
                })
                    .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "createAggregationResultPromise",
                        "message": err
                    };
                    res.status(200).json(response).send();
                });
                delete this.aggregationObjects[id];
            }
            else {
                let response = {
                    "status": "success",
                    "source": "handlePostPresenceResult",
                    "message": `received results (${this.aggregationObjects[id].collectedGroups}/${this.aggregationObjects[id].numberOfGroups})`
                };
                res.status(200).json(response).send();
            }
        };
        this.handleGetAggregationResult = (req, res) => {
            let id = req.query.id;
            if (id != null) {
                aggregation_1.findAggregationResultPromise(id)
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
exports.default = RouteAggregation;
//# sourceMappingURL=routeAggregation.js.map