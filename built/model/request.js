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
const uniqid_1 = __importDefault(require("uniqid"));
const requestModel = __importStar(require("./requestModels"));
exports.startAggregationPromise = (req, groups) => {
    return new Promise((resolve, reject) => {
        let incomingRequest = {};
        sendAggregationActivityPromise(req, groups)
            .then(() => {
            resolve();
        })
            .catch(() => {
            reject();
        });
    });
};
let sendAggregationActivityPromise = (req, groups) => {
    return new Promise((resolve, reject) => {
        let com = new communication_1.default();
        let uniqueId = uniqid_1.default();
        groups.forEach((group) => {
            let data = requestModel.dataModel();
            let requestHeader = requestModel.requestHeaderModel(uniqueId, group, req.body.requestType);
            let requestOptions = null;
            switch (req.body.requestType) {
                case "steps":
                    requestOptions = requestModel.requestStepsModel(req.body.date);
                    break;
                case "walk":
                    if (req.body.date) {
                        requestOptions = requestModel.requestWalkTimepointModel(req.body.raw, req.body.date);
                    }
                    else {
                        requestOptions = requestModel.requestWalkTimeframeModel(req.body.raw, req.body.dateA, req.body.dateB);
                    }
                    break;
                case "location":
                    requestOptions = requestModel.requestLocationTimepointModel(req.body.date, req.body.accuracy);
                    break;
                case "presence":
                    if (req.body.date) {
                        requestOptions = requestModel.requestPresenceTimepointModel(req.body.date, req.body.long, req.body.lat, req.body.radius);
                    }
                    else {
                        requestOptions = requestModel.requestPresenceTimeframeModel(req.body.dateA, req.body.dateB, req.body.long, req.body.lat, req.body.radius);
                    }
                    break;
            }
            let message = requestModel.messageModel(group[0], requestHeader, requestOptions, data);
            console.log(message);
            com.sendNotificationPromise(message)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        });
    });
};
let aggregateResults = () => {
};
//# sourceMappingURL=request.js.map