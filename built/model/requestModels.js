"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let requestHeaderModel = (id, type) => {
    return {
        "id": id,
        "start": Date.now(),
        "end": 0,
        "type": type // Type of aggregation [steps, walking, running, bicycle, vehicle, location, presence]
    };
};
exports.requestHeaderModel = requestHeaderModel;
let requestOptionsModel = (groupNumber, numberOfGroups, group) => {
    return {
        groupNumber: groupNumber,
        numberOfGroups: numberOfGroups,
        from: "",
        group: group,
    };
};
exports.requestOptionsModel = requestOptionsModel;
let requestStepsModel = (date) => {
    return {
        "date": date
    };
};
exports.requestStepsModel = requestStepsModel;
let requestWalkModel = (start, end) => {
    return {
        start: start,
        end: end,
    };
};
exports.requestWalkModel = requestWalkModel;
let requestLocationModel = (date, accuracy, anonymity) => {
    return {
        date: date,
        accuracy: accuracy,
        anonymity: anonymity
    };
};
exports.requestLocationModel = requestLocationModel;
let requestPresenceModel = (start, end, long, lat, radius) => {
    return {
        start: start,
        end: end,
        long: long,
        lat: lat,
        radius: radius,
    };
};
exports.requestPresenceModel = requestPresenceModel;
let dataModel = () => {
    return {
        raw: [],
        n: 0 // Number of participants
    };
};
exports.dataModel = dataModel;
let messageModel = (to, requestHeader, requestOptions, requestData, data) => {
    return {
        to: to,
        data: {
            encryptionKey: null,
            iv: null,
            requestHeader: requestHeader,
            requestOptions: requestOptions,
            requestData: requestData,
            data: data
        },
        time_to_live: 120 // only try to send for t minutes
    };
};
exports.messageModel = messageModel;
let confirmationMessageModel = () => {
    return {
        to: String,
        data: {
            confirmation: true
        },
        time_to_live: 120 // only try to send for t minutes
    };
};
exports.confirmationMessageModel = confirmationMessageModel;
//# sourceMappingURL=requestModels.js.map