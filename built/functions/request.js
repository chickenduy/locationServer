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
const requestModel = __importStar(require("../model/requestModels"));
let startAggregationPromise = (req, groups, uniqueId) => {
    return new Promise((resolve, reject) => {
        let com = new communication_1.default();
        let requestHeader = requestModel.requestHeaderModel(uniqueId, req.body.requestType);
        let index = 1;
        groups.forEach((group) => {
            let data = requestModel.dataModel();
            let requestOptions = requestModel.requestOptionsModel(index, groups.length, group);
            let requestData = null;
            let request = req.body.request;
            switch (req.body.requestType) {
                case "steps":
                    requestData = requestModel.requestStepsModel(request.date, request.lat, request.lon, request.radius);
                    break;
                case "activity":
                    requestData = requestModel.requestActivityModel(request.type, request.start, request.end, request.lat, request.lon, request.radius);
                    break;
                case "location":
                    requestData = requestModel.requestLocationModel(request.date, request.accuracy, request.anonymity, request.lat, request.lon, request.radius);
                    break;
                case "presence":
                    requestData = requestModel.requestPresenceModel(request.start, request.end, request.lat, request.lon, request.radius);
                    break;
            }
            let message = requestModel.messageModel(group[0].id, requestHeader, requestOptions, requestData, data);
            console.log(message);
            com.sendNotificationPromise(message)
                .then(() => {
                let debugParticipants = 0;
                groups.forEach((group) => {
                    debugParticipants += group.length;
                });
                let response = {
                    id: requestHeader.id,
                    type: requestHeader.type,
                    numberOfGroups: requestOptions.numberOfGroups,
                    options: requestData,
                    debugParticipants: debugParticipants
                };
                resolve(response);
            })
                .catch((err) => {
                reject(err);
            });
            index++;
        });
    });
};
exports.startAggregationPromise = startAggregationPromise;
//# sourceMappingURL=request.js.map