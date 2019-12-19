"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnector_1 = require("../dbconnector");
const COLLECTION_USERS = "users";
function User(publicKey, lastSeen, password) {
    this.publicKey = publicKey;
    this.lastSeen = lastSeen;
    this.password = password;
}
/**
 * Creates a user according to the user model or return null if the model is not satisfied.
 * @param user
 */
function createUser(user) {
    if (!user.publicKey || !user.lastSeen || !user.password) {
        return null;
    }
    else {
        return new User(user.publicKey, user.lastSeen, user.password);
    }
}
exports.createUser = createUser;
function createUserWithParam(publicKey, lastSeen, password) {
    return createUser({
        "publicKey": publicKey,
        "lastSeen": lastSeen,
        "password": password
    });
}
exports.createUserWithParam = createUserWithParam;
function insertUser(user) {
    let userToInsert = createUser(user);
    let tempDB;
    if (!userToInsert) {
        return Promise.reject("Could not create user, missing required fields");
    }
    else {
        return dbconnector_1.openDb().then(db => {
            tempDB = db;
            return tempDB.collection(COLLECTION_USERS).findOne({ "publicKey": userToInsert.publicKey });
        }).then(foundUser => {
            if (!foundUser) {
                return tempDB.collection(COLLECTION_USERS).insertOne(userToInsert);
            }
            else {
                return Promise.reject("`User ${user.publicKey} already present`");
            }
        }).then(user => {
            return Promise.resolve(user.ops[0]);
        });
    }
}
exports.insertUser = insertUser;
//# sourceMappingURL=users.js.map