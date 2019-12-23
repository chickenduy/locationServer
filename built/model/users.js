"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnector_1 = require("../dbconnector");
const crypto_1 = __importDefault(require("crypto"));
const COLLECTION_CROWD = "crowd";
class User {
}
/**
 * Creates a user according to the user model or return null if the model is not satisfied.
 * @param user
 */
exports.createUserPromise = (user) => {
    return new Promise((resolve, reject) => {
        if (!user.id || !user.publicKey || !user.password || !user.lastSeen) {
            reject("Could not create user, missing required fields");
        }
        else {
            dbconnector_1.getDb()
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
                        reject(`User ${user.id} already present`);
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
        if (!token) {
            return reject("Could not find user, missing required fields");
        }
        else {
            dbconnector_1.getDb()
                .then((db) => {
                db.collection(COLLECTION_CROWD).findOne({ "id": token })
                    .then((foundUser) => {
                    if (foundUser)
                        resolve(foundUser);
                    else
                        reject("No user found");
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
exports.patchUserPromise = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject("Could not find user, missing required fields");
        }
        else {
            dbconnector_1.getDb()
                .then((db) => {
                db.collection(COLLECTION_CROWD).findOne({ "id": token })
                    .then((foundUser) => {
                    if (foundUser) {
                        db.collection(COLLECTION_CROWD).updateOne({ "id": token }, { $set: { "lastSeen": Date.now() } })
                            .then(() => {
                            resolve("Found user and updated timestamp");
                        })
                            .catch((err) => {
                            reject("Couldn't update timestamp");
                        });
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
exports.getAllRecentUsersPromise = () => {
    return new Promise((resolve, reject) => {
        let lastWeek = new Date(new Date().setDate(new Date().getSeconds() - 10)).getTime();
        dbconnector_1.getDb()
            .then((db) => {
            db.collection(COLLECTION_CROWD).find({ lastSeen: { $gt: lastWeek } }).toArray()
                .then((users) => {
                if (users.length != 0)
                    resolve(users);
                else
                    reject("Either no users online since last week or something went wrong.");
            })
                .catch((err) => {
                reject("Could not find users" + err);
            });
        })
            .catch((err) => {
            reject("Could not find DB" + err);
        });
    });
};
exports.authenticateUserPromise = (id, password) => {
    return new Promise((resolve, reject) => {
        exports.getUserPromise(id)
            .then((user) => {
            let hash = crypto_1.default.createHash("sha256").update(password).digest().toString();
            if (user.password === hash) {
                resolve(user);
            }
            else {
                reject();
            }
        })
            .catch((err) => {
            reject();
        });
    });
};
//# sourceMappingURL=users.js.map