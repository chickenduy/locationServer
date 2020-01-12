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
const crowd = __importStar(require("../model/crowd"));
class RouteCrowd {
    constructor() {
        /**
         * Handles incoming create crowd request
         * @param req
         * @param res
         */
        this.handleCreateCrowdRequest = (req, res) => {
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
        this.handleUpdateCrowdRequest = (req, res) => {
            console.log(req.body);
            let id = req.body.id;
            let password = req.body.password;
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
        };
        /**
         *
         * @param req
         * @param res
         */
        this.handlePingedCrowdRequest = (req, res) => {
            console.log(req.body);
            let id = req.body.id;
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
        };
    }
}
exports.default = RouteCrowd;
//# sourceMappingURL=routeCrowd.js.map