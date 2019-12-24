"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const users_1 = require("./model/users");
const communication_1 = __importDefault(require("./communication"));
const helpers_1 = require("./helpers");
/**
 * This is a basic function that returns a plaintext "Hello world!"
 * @param res Response of the function
 */
exports.basicRequest = (req, res) => {
    res.set({
        'Content-Type': 'application/json'
    });
    res.status(200)
        .send({
        "test": "Successfully deployed"
    });
};
exports.handleAggregationRequest = (req, res) => {
    let com = new communication_1.default();
    let data = {
        "to": "/topics/online",
        "data": {
            "request": "ping",
        }
    };
    com.sendPushNotificationPromise(data)
        .then(() => {
        res.status(200).send();
    })
        .catch((err) => {
        res.status(500).send(err);
    });
    /**
     * Wait for a while after pinging devices to get active devices
     */
    setTimeout(() => {
        /**
         * timepointA, timepointB: timeframe
         */
        let timeA = req.query.timeA;
        let timeB = req.query.timeB;
        /**
         * request: position, steps, location, activity
         */
        let request = req.query.request;
        /**
         * activity: walk, run, bike, vehicle
         */
        let activity = req.query.activity;
        let radius = req.query.activity;
        /**
         * get all active devices
         */
        users_1.getAllRecentUsersPromise()
            .then((users) => {
            let response = {
                "status": "success",
                "message": `We have ${users.length} participants`
            };
            res.status(200).json(response).send();
            //TODO: call aggregation function
            /**
             * start actual aggregation request
             */
            users.forEach((user) => {
                let request = {
                    "to": user.id,
                    "data": {
                        "request": "request",
                        "users": helpers_1.shuffleFisherYates(users)
                    }
                };
                com.sendPushNotificationPromise(request)
                    .then(() => {
                    console.log(`Send request to ${user.id}`);
                })
                    .catch((err) => {
                    console.log(err);
                });
            });
        })
            .catch((err) => {
            let response = {
                "status": "failure",
                "message": err
            };
            res.status(500).json(response).send();
        });
    }, 1000 * 60);
};
exports.handleCreateUserRequest = (req, res) => {
    console.log(req.body);
    let request = req.body.request;
    let random = Math.random().toString(36);
    let password = crypto_1.default.createHash("sha256").update(random).digest().toString();
    let user = {
        "id": req.body.id,
        "publicKey": req.body.publicKey,
        "password": password,
        "lastSeen": Date.now()
    };
    users_1.createUserPromise(user)
        .then((result) => {
        let response = {
            "status": "success",
            "message": result,
            "id": user.id,
            "publicKey": user.publicKey,
            "password": random,
            "lastSeen": user.lastSeen
        };
        res.status(200).json(response).send();
    })
        .catch((err) => {
        let response = {
            "status": "failure",
            "reason": err
        };
        res.status(500).json(response).send();
    });
};
exports.handleUpdateUserRequest = (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let password = req.body.password;
    users_1.authenticateUserPromise(id, password)
        .then((user) => {
        users_1.patchUserPromise(id)
            .then((result) => {
            let response = {
                "status": "success",
                "message": result
            };
            res.status(200).json(response).send();
        })
            .catch((err) => {
            let response = {
                "status": "failure",
                "reason": err
            };
            res.status(500).json(response).send();
        });
    })
        .catch((err) => {
        let response = {
            "status": "failure",
            "reason": err
        };
        res.status(500).json(response).send();
    });
};
exports.handlePingedUserRequest = (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let password = req.body.password;
    users_1.authenticateUserPromise(id, password)
        .then((user) => {
        users_1.patchUserPromise(id)
            .then((result) => {
            let response = {
                "status": "success",
                "message": result
            };
            res.status(200).json(response).send();
        })
            .catch((err) => {
            let response = {
                "status": "failure",
                "reason": err
            };
            res.status(500).json(response).send();
        });
    })
        .catch((err) => {
        let response = {
            "status": "failure",
            "reason": err
        };
        res.status(500).json(response).send();
    });
};
exports.testRoutePost = (req, res) => {
    console.log(req.body);
    let com = new communication_1.default();
    let data = {
        "to": "/topics/online",
        "data": {
            "test": false,
            "value": "Hello World"
        }
    };
    com.sendPushNotificationPromise(data)
        .then((result) => {
        console.log(result);
        let response = {
            "status": "success",
            "result": result
        };
        res.status(200).json(result).send();
    })
        .catch((err) => {
        res.status(500).send(err);
    });
};
exports.authenticateUser = (req, res, next) => {
    let id;
    let password;
    if (req.method === "GET") {
        id = req.query.publicKey;
        password = req.query.password;
    }
    else {
        id = req.body.publicKey;
        password = req.body.password;
    }
    users_1.authenticateUserPromise(id, password)
        .then(() => {
        next();
    })
        .catch((err) => {
        let result = {
            "status": "failiure",
            "message": "couldn't authenticate"
        };
        res.status(500).json(result).send();
    });
};
//# sourceMappingURL=routesHandling.js.map