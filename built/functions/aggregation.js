"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnector_1 = require("../dbconnector");
const COLLECTION_RESULT = "aggregation";
let createAggregationResultPromise = (result) => {
    return new Promise((resolve, reject) => {
        if (result.raw.length == 0) {
            reject("There is no raw data to save");
        }
        dbconnector_1.getDb()
            .then((db) => {
            db.collection(COLLECTION_RESULT).insertOne(result)
                .then(() => {
                resolve("saved aggregation");
            })
                .catch((err) => {
                reject(err);
            });
        })
            .catch((err) => {
            reject(err);
        });
    });
};
exports.createAggregationResultPromise = createAggregationResultPromise;
let findAggregationResultPromise = (id) => {
    return new Promise((resolve, reject) => {
        dbconnector_1.getDb()
            .then((db) => {
            db.collection(COLLECTION_RESULT).findOne({ "id": id })
                .then((result) => {
                switch (result.type) {
                    case "steps":
                        result.start = new Date(result.start);
                        result.end = new Date(result.end);
                        result.options.date = new Date(result.date);
                        break;
                    case "activity":
                        result.start = new Date(result.start);
                        result.end = new Date(result.end);
                        result.options.start = new Date(result.options.start);
                        result.options.end = new Date(result.options.end);
                        break;
                    case "location":
                        result.start = new Date(result.start);
                        result.end = new Date(result.end);
                        result.options.date = new Date(result.options.date);
                        break;
                    case "presence":
                        result.start = new Date(result.start);
                        result.end = new Date(result.end);
                        result.options.start = new Date(result.options.start);
                        result.options.end = new Date(result.options.end);
                        break;
                }
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        })
            .catch((err) => {
            reject(err);
        });
    });
};
exports.findAggregationResultPromise = findAggregationResultPromise;
//# sourceMappingURL=aggregation.js.map