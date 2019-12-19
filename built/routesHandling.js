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
const users_1 = require("./model/users");
const crypto_1 = __importDefault(require("crypto"));
const helpers = __importStar(require("./helpers"));
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
exports.startAggregationRequest = (req, res) => {
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
    res.set({
        'Content-Type': 'text/plain'
    });
    res.status(200)
        .send("start aggregation");
};
function createUser(publicKey) {
    let random = crypto_1.default.randomBytes(36);
    let password = crypto_1.default.createHash("sha256").update(random).digest().toString();
    console.log(password);
    let lastSeen = (new Date()).getTime();
    let user = users_1.createUserWithParam(publicKey, lastSeen, password);
    return users_1.insertUser(user).then(insertedUser => {
        insertedUser.password = random;
        return Promise.resolve(insertedUser);
    }).catch(() => {
        err => {
            console.log("ERROR handling inserting User");
            console.log(err);
        };
    });
}
exports.handleNewUserRequest = (req, res) => {
    console.log(req.body);
    let user = {
        "id": req.body.id,
        "publicKey": req.body.publicKey,
        "lastSeen": Date.now()
    };
    helpers.createUser(user)
        .then(() => {
        let response = {
            "status": "success"
        };
        res.status(200).json(response).send();
    })
        .catch((err) => {
        let response = {
            "status": "failure"
        };
        res.status(500).json(response).send(err);
    });
    // createUser(req.body.publicKey).then(user => {
    // 	res.status(200).json({
    // 		"publicKey": user.publicKey,
    // 		"password": user.password
    // 	})
    // }).catch(err => {
    // 	console.log("ERROR handling newUserRequest")
    // 	console.log(err)
    // 	res.status(400).end();
    // })
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
        res.status(200).send(err);
    });
};
//# sourceMappingURL=routesHandling.js.map