"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user = __importStar(require("../model/user"));
const crowd = __importStar(require("../model/crowd"));
class RouteAuthentication {
    constructor() {
        /**
         * Authenticate the crowd with stored Pushy token and password
         * @param req
         * @param res
         * @param next
         */
        this.authenticateCrowd = (req, res, next) => {
            console.log("authenticateCrowd");
            let id;
            let password;
            /**
             * Extract token and password from request
             */
            if (req.method === "GET") {
                id = req.query.id;
                password = req.query.password;
            }
            else {
                id = req.body.id;
                password = req.body.password;
            }
            if (!id || !password) {
                console.log("Missing parameters");
                let result = {
                    "status": "failure",
                    "source": "authenticateUser",
                    "message": `Missing username: ${id}, password: ${password}`
                };
                res.status(500).json(result).send();
                return;
            }
            crowd.authenticateCrowdPromise(id, password)
                .then(() => {
                next();
            })
                .catch((err) => {
                console.log(err);
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
        this.authenticateUser = (req, res, next) => {
            console.log("authenticateUser");
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
        /**
        * Authenticate the crowd with stored Pushy token and password
        * @param req
        * @param res
        * @param next
        */
        this.authenticateRequest = (req, res, next) => {
            console.log("authenticateRequest");
            let id;
            let password;
            /**
             * Extract token and password from request
             */
            id = req.body.requestOptions.from;
            password = req.body.password;
            if (!id || !password) {
                let result = {
                    "status": "failure",
                    "source": "authenticateUser",
                    "message": `Missing username: ${id}, password: ${password}`
                };
                res.status(500).json(result).send();
                return;
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
                console.log(result);
                res.status(500).json(result).send();
            });
        };
    }
}
exports.default = RouteAuthentication;
//# sourceMappingURL=routeAuthentication.js.map