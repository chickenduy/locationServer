import { getDb } from "../dbconnector";

const COLLECTION_CROWD = "crowd"

/**
 * Creates a user according to the user model or return null if the model is not satisfied.
 * @param user 
 */
export let createUserPromise = (user) => {
    return new Promise((resolve, reject) => {
        if (!user.id || !user.publicKey || !user.lastSeen) {
            reject("Could not create user, missing required fields")
        } else {
            getDb()
                .then((db) => {
                    db.collection(COLLECTION_CROWD).findOne({ "id": user.id })
                        .then((foundUser) => {
                            if (!foundUser) {
                                db.collection(COLLECTION_CROWD).insertOne(user)
                                    .then((result) => {
                                        resolve("Created user")
                                    })
                                    .catch((err) => {
                                        reject(err)
                                    })
                            }
                            else {
                                reject(`User ${user.publicKey} already present`)
                            }
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}

export let getUserPromise = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject("Could not find user, missing required fields")
        } else {
            getDb()
                .then((db) => {
                    db.collection(COLLECTION_CROWD).findOne({ "id": token })
                        .then((foundUser) => {
                            if (foundUser) {
                                db.collection(COLLECTION_CROWD).updateOne(
                                    { "id": token },
                                    { $set: { "lastSeen": Date.now() } })
                                    .then(() => {
                                        resolve("Found user and updated timestamp")
                                    })
                                    .catch((err) => {
                                        reject("Couldn't update timestamp")
                                    })
                            }
                            else {
                                reject(`User ${token} is not registered`)
                            }
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}

export let getAllRecentUsersPromise = () => {
    return new Promise((resolve, reject) => {
        let lastWeek = new Date(new Date().setDate(new Date().getDate() - 7)).getTime()
        getDb()
            .then((db) => {
                db.collection(COLLECTION_CROWD).find({ lastSeen: { $gt: lastWeek } }).toArray()
                    .then((users) => {
                        if (users.length != 0)
                            resolve(users)
                        else
                            reject("Either no users online since last week or something went wrong.")
                    })
                    .catch((err) => {
                        reject("Something went wrong")
                    })
            })
            .catch((err) => {
                reject(err)
            })
    })
}