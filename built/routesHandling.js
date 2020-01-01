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
const crypto_1 = __importDefault(require("crypto"));
const communication_1 = __importDefault(require("./communication"));
const helpers_1 = require("./helpers");
const user = __importStar(require("./model/user"));
const crowd = __importStar(require("./model/crowd"));
const request_1 = require("./model/request");
const GROUP_SIZE = 1;
/**
 * This is a basic function that returns a JSON "Hello world!"
 * @param req
 * @param res
 */
exports.basicRequest = (req, res) => {
    res.set({
        'Content-Type': 'application/json'
    });
    res.status(200)
        .send({
        "test": "Hello world!"
    });
};
/**
 * This handles an incoming aggregation request
 * @param req
 * @param res
 */
exports.handleAggregationRequest = (req, res) => {
    let com = new communication_1.default();
    crowd.getAllCrowdPromise()
        .then((users) => {
        let tokens = [];
        users.forEach((user) => {
            tokens.push(user.id);
        });
        com.getPresence(tokens)
            .then((result) => {
            let onlineUsers = [];
            let users = result.presence;
            users.forEach(user => {
                if (user.online) {
                    onlineUsers.push(user.id);
                    //patchUserPromise(user.id)
                }
            });
            if (onlineUsers.length == 0) {
                let response = {
                    "status": "failure",
                    "source": "getPresence",
                    "message": "no devices online"
                };
                res.status(500).json(response).send();
                return;
            }
            onlineUsers = helpers_1.shuffleFisherYates(onlineUsers);
            let counter = 0;
            let groups = [[]];
            while (onlineUsers.length) {
                groups[counter] = onlineUsers.splice(0, 1);
                counter++;
            }
            // TODO: Start Aggregation
            request_1.startAggregationPromise(req, groups)
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
            // let response = {
            // 	"onlineUsers": onlineUsers,
            // 	"groups": groups
            // }
            // res.status(200).json(response).send(`You have ${onlineUsers.length} participants`)
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
exports.handleGetAggregationResult = (req, res) => {
};
/**
 * Handles incoming create crowd request
 * @param req
 * @param res
 */
exports.handleCreateCrowdRequest = (req, res) => {
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
    crowd.createCrowdPromise(user)
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
            "source": "createUserPromise",
            "reason": err
        };
        res.status(500).json(response).send();
    });
};
/**
 * Handle incoming ping to update timestamp of crowd
 * @param req
 * @param res
 */
exports.handleUpdateCrowdRequest = (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let password = req.body.password;
    crowd.authenticateCrowdPromise(id, password)
        .then((user) => {
        crowd.patchCrowdPromise(id)
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
                "source": "patchUserPomise",
                "reason": err
            };
            res.status(500).json(response).send();
        });
    })
        .catch((err) => {
        let response = {
            "status": "failure",
            "source": "autheticateUserPromise",
            "reason": err
        };
        res.status(500).json(response).send();
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.handlePingedCrowdRequest = (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let password = req.body.password;
    crowd.authenticateCrowdPromise(id, password)
        .then((user) => {
        crowd.patchCrowdPromise(id)
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
                "source": "patchUserPromise",
                "reason": err
            };
            res.status(500).json(response).send();
        });
    })
        .catch((err) => {
        let response = {
            "status": "failure",
            "source": "authenticateUserPromise",
            "reason": err
        };
        res.status(500).json(response).send();
    });
};
/**
 * Authenticate the crowd with stored Pushy token and password
 * @param req
 * @param res
 * @param next
 */
exports.authenticateCrowd = (req, res, next) => {
    let id;
    let password;
    /**
     * Extract token and password from request
     */
    if (req.method === "GET") {
        id = req.query.publicKey;
        password = req.query.password;
    }
    else {
        id = req.body.publicKey;
        password = req.body.password;
    }
    crowd.authenticateCrowdPromise(id, password)
        .then(() => {
        next();
    })
        .catch((err) => {
        let result = {
            "status": "failure",
            "source": "authenticateCrowdPromise",
            "message": err
        };
        res.status(500).json(result).send();
    });
};
/**
 * Authenticate user with stored username and password
 * @param req
 * @param res
 * @param next
 */
exports.authenticateUser = (req, res, next) => {
    let username = "";
    let password = "";
    /**
     * Extract token and password from request
     */
    if (req.method === "GET") {
        username = req.query.username;
        password = req.query.password;
    }
    else {
        username = req.body.username;
        password = req.body.password;
    }
    if (!username || !password) {
        let result = {
            "status": "failure",
            "source": "authenticateUser",
            "message": `Missing username: ${username}, password: ${password}`
        };
        res.status(500).json(result).send();
        return;
    }
    user.authenticateUserPromise(username, password)
        .then(() => {
        next();
    })
        .catch((err) => {
        let result = {
            "status": "failure",
            "source": "authenticateUserPromise",
            "message": err
        };
        res.status(500).json(result).send();
    });
};
//# sourceMappingURL=routesHandling.js.map