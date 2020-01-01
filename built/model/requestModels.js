"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestHeaderModel = (id, group, type) => {
    return {
        "id": id,
        "start": Date.now(),
        "end": 0,
        "from": null,
        "group": group,
        "type": type // Type of aggregation [steps, walking, running, bicycle, vehicle, location, presence]
    };
};
exports.requestStepsModel = (date) => {
    return {
        "date": date
    };
};
exports.requestWalkTimepointModel = (raw, date) => {
    return {
        "raw": raw,
        "date": date
    };
};
exports.requestWalkTimeframeModel = (raw, dateA, dateB) => {
    return {
        "raw": raw,
        "dateA": dateA,
        "dateB": dateB
    };
};
exports.requestLocationTimepointModel = (date, accuracy) => {
    return {
        "accuracy": accuracy,
        "date": date
    };
};
exports.requestPresenceTimepointModel = (date, long, lat, radius) => {
    return {
        "location": {
            "long": long,
            "lat": lat
        },
        "radius": radius,
        "date": date
    };
};
exports.requestPresenceTimeframeModel = (dateA, dateB, long, lat, radius) => {
    return {
        "location": {
            "long": long,
            "lat": lat
        },
        "radius": radius,
        "dateA": dateA,
        "dateB": dateB,
    };
};
exports.dataModel = () => {
    return {
        "raw": [],
        "n": 0
    };
};
exports.messageModel = (to, requestHeader, requestOptions, data) => {
    return {
        "to": to,
        "data": {
            "encryptionKey": null,
            "iv": null,
            "requestHeader": requestHeader,
            "requestOptions": requestOptions,
            "data": data
        },
        "time_to_live": 120 // only try to send for t minutes
    };
};
exports.confirmationMessageModel = () => {
    return {
        "to": String,
        "data": {
            "confirmation": true
        }
    };
};
let incomingRequest = () => {
    return {
        "username": "",
        "password": "",
        "requestType": "",
        "raw": "",
        "timepoint": true,
        "date": 0,
    };
};
//# sourceMappingURL=requestModels.js.map