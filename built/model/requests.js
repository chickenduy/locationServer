"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const communication_1 = __importDefault(require("../communication"));
exports.startAggregationPromise = (req, res, groups) => {
    return new Promise((resolve, reject) => {
        switch (req.body.type) {
            case "test":
                sendAggregationTestPromise(groups)
                    .then((result) => {
                    resolve(result);
                })
                    .catch((err) => {
                    reject(err);
                });
                break;
            default:
                reject("no type");
                break;
        }
    });
};
let sendAggregationTestPromise = (groups) => {
    return new Promise((resolve, reject) => {
        let com = new communication_1.default();
        groups.forEach((group) => {
            console.log(group[0]);
            let data = {
                "to": group[0],
                "data": {
                    "encryptionKey": "1234",
                    "request": {
                        "id": "1234",
                        "type": "activity",
                        "raw": "steps",
                        "start": "",
                        "end": "",
                        "group": group
                    },
                    "data": {
                        "average": 0,
                        "raw": [],
                        "n": 0
                    }
                },
                "time_to_live": 120
            };
            com.sendNotificationPromise(data)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        });
    });
};
//# sourceMappingURL=requests.js.map