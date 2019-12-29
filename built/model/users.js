"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnector_1 = require("../dbconnector");
const COLLECTION_USER = "users";
class User {
}
/**
 * Creates a user according to the user model
 * @param user
 */
exports.createUserPromise = (user) => {
    return new Promise((resolve, reject) => {
        if (!user.username || !user.password) {
            reject("Could not create user, missing required fields");
        }
        else {
            dbconnector_1.getDb()
                .then((db) => {
                db.collection(COLLECTION_USER).findOne({ "username": user.username })
                    .then((foundUser) => {
                    if (!foundUser) {
                        //hash password
                        let insertUser = {
                            "username": user.username,
                            "password": user.password
                        };
                        db.collection(COLLECTION_USER).insertOne(insertUser)
                            .then(() => {
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
/**
 * Get a user with specific ID
 * @param username
 */
exports.getUserPromise = (username) => {
    return new Promise((resolve, reject) => {
        if (!username) {
            return reject("Missing required username");
        }
        else {
            dbconnector_1.getDb()
                .then((db) => {
                db.collection(COLLECTION_USER).findOne({ "username": username })
                    .then((foundUser) => {
                    if (foundUser)
                        resolve(foundUser);
                    else
                        reject(`User ${username} is not registered`);
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
/**
 * Function to authenticate the user
 * @param username
 * @param password
 */
exports.authenticateUserPromise = (username, password) => {
    return new Promise((resolve, reject) => {
        exports.getUserPromise(username)
            .then((user) => {
            //hash passwords and compare
            if (user.password === password) {
                resolve(user);
            }
            else {
                reject(`Password doesn't match for ${username}`);
            }
        })
            .catch((err) => {
            reject(err);
        });
    });
};
//# sourceMappingURL=users.js.map