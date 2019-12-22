"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnector_1 = require("../dbconnector");
const COLLECTION_CROWD = "crowd";
/**
 * Creates a user according to the user model or return null if the model is not satisfied.
 * @param user
 */
exports.createUserPromise = (user) => {
    return new Promise((resolve, reject) => {
        if (!user.id || !user.publicKey || !user.lastSeen) {
            return reject("Could not create user, missing required fields");
        }
        else {
            dbconnector_1.openDb()
                .then((db) => {
                db.collection(COLLECTION_CROWD).findOne({ "id": user.id })
                    .then((foundUser) => {
                    if (!foundUser) {
                        db.collection(COLLECTION_CROWD).insertOne(user)
                            .then((result) => {
                            resolve("Created user");
                        })
                            .catch((err) => {
                            reject(err);
                        });
                    }
                    else {
                        reject(`User ${user.publicKey} already present`);
                    }
                })
                    .catch((err) => {
                    reject(err);
                });
            })
                .catch((err) => {
                reject(err);
            });
        }
    });
};
exports.getUserPromise = (token) => {
    return new Promise((resolve, reject) => {
        if (token) {
            return reject("Could not find user, missing required fields");
        }
        else {
            dbconnector_1.openDb()
                .then((db) => {
                db.collection(COLLECTION_CROWD).findOne({ "id": token })
                    .then((foundUser) => {
                    if (foundUser) {
                        resolve("Found user");
                    }
                    else {
                        reject(`User ${token} is not registered`);
                    }
                })
                    .catch((err) => {
                    reject(err);
                });
            })
                .catch((err) => {
                reject(err);
            });
        }
    });
};
//# sourceMappingURL=users.js.map