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
const communication_1 = __importDefault(require("../communication"));
const helpers_1 = require("../helpers");
const uniqid_1 = __importDefault(require("uniqid"));
const crowd = __importStar(require("../model/crowd"));
const request_1 = require("../model/request");
const aggregationObject_1 = __importDefault(require("../model/aggregationObject"));
const GROUP_SIZE = 2;
const MIN_GROUP_SIZE = 2;
const MIN_ANON = 2;
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
                    onlineCrowd = helpers_1.shuffleFisherYates(onlineCrowd);
                    crowd.getCrowdWithTokensPromise(onlineCrowd)
                        .then((onlineCrowdDetailed) => {
                        let counter = 0;
                        let groups = [[]];
                        let newGroupSize = GROUP_SIZE;
                        while (onlineCrowdDetailed.length % newGroupSize < MIN_GROUP_SIZE && onlineCrowdDetailed.length % newGroupSize != 0) {
                            newGroupSize++;
                        }
                        while (onlineCrowdDetailed.length) {
                            groups[counter] = onlineCrowdDetailed.splice(0, newGroupSize);
                            counter++;
                        }
                        let uniqueId = uniqid_1.default();
                        this.aggregationObjects[uniqueId] = new aggregationObject_1.default();
                        this.aggregationObjects[uniqueId].numberOfGroups = groups.length;
                        if (req.body.request.anonymity > MIN_ANON) {
                            this.aggregationObjects[uniqueId].anonymity = req.body.request.anonymity;
                        }
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
            if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
                console.log(this.aggregationObjects[id]);
                console.log("received all data, clean now");
                let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0);
                let result = {
                    id: id,
                    start: req.body.requestHeader.start,
                    end: Date.now(),
                    average: sum / req.body.data.n,
                    raw: raw,
                    options: req.body.requestData
                };
                console.log(this.aggregationObjects[id]);
                console.log(result);
            }
            let response = {
                "status": "success"
            };
            res.status(200).json(response).send();
        };
        /**
         *
         * @param req
         * @param res
         */
        this.handlePostWalkResult = (req, res) => {
            console.log(req.body.data.raw);
            let raw = req.body.data.raw;
            let id = req.body.requestHeader.id;
            raw.forEach(element => {
                // somehow concat doesn't work
                this.aggregationObjects[id].raw.push(element);
            });
            this.aggregationObjects[id].collectedGroups++;
            if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
                console.log(this.aggregationObjects[id]);
                console.log("received all data, clean now");
                let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0);
                let result = {
                    id: id,
                    start: req.body.requestHeader.start,
                    end: Date.now(),
                    average: sum / req.body.data.n,
                    raw: raw,
                    options: req.body.requestData
                };
                console.log(result);
            }
            let response = {
                "status": "success"
            };
            res.status(200).json(response).send();
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
            console.log(this.aggregationObjects[id].collectedGroups);
            console.log(this.aggregationObjects[id].numberOfGroups);
            if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
                console.log(this.aggregationObjects[id].raw);
                console.log("received all data, clean now");
                this.aggregationObjects[id].raw = helpers_1.suppressLocations(this.aggregationObjects[id].anonymity, this.aggregationObjects[id].raw);
                console.log(this.aggregationObjects[id].raw);
                delete this.aggregationObjects[id];
            }
            let response = {
                "status": "success"
            };
            res.status(200).json(response).send();
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
            if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
                console.log(this.aggregationObjects[id]);
                console.log("received all data, clean now");
                let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0);
                let result = {
                    id: id,
                    start: req.body.requestHeader.start,
                    end: Date.now(),
                    visits: sum,
                    raw: raw,
                    options: req.body.requestData
                };
                console.log(result);
            }
            let response = {
                "status": "success"
            };
            res.status(200).json(response).send();
        };
        this.handleGetAggregationResult = (req, res) => {
        };
    }
}
exports.default = RouteAggregation;
class Location {
    constructor(lat, long) {
        this.lat = lat;
        this.long = long;
    }
}
//# sourceMappingURL=routeAggregation.js.map