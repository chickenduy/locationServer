"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./model/users");
const communication_1 = __importDefault(require("./communication"));
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
    //TODO: call aggregation function
    users_1.getAllRecentUsersPromise()
        .then((users) => {
        let response = {
            "status": "success",
            "message": users.toString()
        };
        res.status(200).json(response).send();
    })
        .catch((err) => {
        let response = {
            "status": "failure",
            "message": err
        };
        res.status(200).json(response).send();
    });
};
exports.handleUserRequest = (req, res) => {
    console.log(req.body);
    let request = req.body.request;
    switch (request) {
        case "create":
            let user = {
                "id": req.body.id,
                "publicKey": req.body.publicKey,
                "lastSeen": Date.now()
            };
            users_1.createUserPromise(user)
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
                res.status(200).json(response).send();
            });
            break;
        case "find":
            let token = req.body.id;
            users_1.getUserPromise(token)
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
                res.status(200).json(response).send();
            });
            break;
        default:
            let response = {
                "status": "undefined",
                "message": "no request has been sent"
            };
            res.status(200).json(response).send();
            return;
    }
};
exports.handleGetUserRequest = (req, res) => {
    console.log(req.body);
    let token = req.body.id;
    users_1.getUserPromise(token)
        .then((result) => {
        let response = {
            "status": "success"
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
//# sourceMappingURL=routesHandling.js.map