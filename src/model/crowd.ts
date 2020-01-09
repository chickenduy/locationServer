import { getDb } from "../dbconnector";
import crypto from "crypto";

const COLLECTION_CROWD = "crowd"

class Crowd {
    id: String
    publicKey: String
    password: String
    lastSeen: number
    constructor(id, publicKey, password, lastSeen) {
        this.id = id
        this.publicKey = publicKey
        this.password = password
        this.lastSeen = lastSeen
    }
}

class LimitedCrowd {
    id: String
    publicKey: String
    constructor(crowd: Crowd) {
        this.id = crowd.id
        this.publicKey = crowd.publicKey
    }
}


/**
 * Creates a user according to the user model or return null if the model is not satisfied.
 * @param crowd 
 */
let createCrowdPromise = (crowd: Crowd) => {
    return new Promise((resolve, reject) => {
        if (!crowd.id || !crowd.publicKey || !crowd.password || !crowd.lastSeen) {
            reject("Could not create user, missing required fields")
        }
        else {
            getDb()
                .then((db) => {
                    db.collection(COLLECTION_CROWD).findOne({ "id": crowd.id })
                        .then((foundCrowd) => {
                            if (!foundCrowd) {
                                db.collection(COLLECTION_CROWD).insertOne(crowd)
                                    .then((result) => {
                                        resolve("Created user")
                                    })
                                    .catch((err) => {
                                        reject(err)
                                    })
                            }
                            else {
                                reject(`User ${crowd.id} already present`)
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

/**
 * 
 * @param token 
 */
let getCrowdPromise = (token: String) => {
    return new Promise<Crowd>((resolve, reject) => {
        if (!token) {
            return reject("Missing required token/id")
        } else {
            getDb()
                .then((db) => {
                    db.collection(COLLECTION_CROWD).findOne({ "id": token })
                        .then((foundUser) => {
                            if (foundUser)
                                resolve(foundUser)
                            else
                                reject(`User ${token} is not registered`)
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

/**
 * 
 * @param tokens
 */
let getCrowdArrayPromise = (tokens: String[]) => {
    return new Promise<Crowd[]>((resolve, reject) => {
        if (!tokens) {
            return null
        } else {
            getDb()
                .then((db) => {
                    db.collection(COLLECTION_CROWD).find({
                        id: {
                            $in: tokens
                        }
                    }).toArray()
                        .then((crowds) => {
                            if (crowds) {
                                resolve(crowds)
                            }
                            else {
                                reject("Users not registered")
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

let getCrowdWithTokensPromise = (tokens: String[]) => {
    return new Promise<LimitedCrowd[]>((resolve, reject) => {
        getCrowdArrayPromise(tokens)
            .then((crowds) => {
                let limitedCrowds = []
                crowds.forEach((crowd) => {
                    limitedCrowds.push(new LimitedCrowd(crowd))
                })
                resolve(limitedCrowds)
            })
    })
}

/**
 * Get all online users with PushyAPI
 */
let getAllCrowdPromise = () => {
    return new Promise<Array<Crowd>>((resolve, reject) => {
        getDb()
            .then((db) => {
                db.collection(COLLECTION_CROWD).find().toArray()
                    .then((users) => {
                        if (users.length > 0) {
                            resolve(users)
                        }
                        else {
                            reject(`No users online`)
                        }
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 
 * @param token 
 */
let patchCrowdPromise = (token: String) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject("Missing required token/id")
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
                                        reject(err)
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

/**
 * Gets all users that where last seen in a certain timeframe
 */
let getAllRecentCrowdPromise = () => {
    return new Promise<Array<LimitedCrowd>>((resolve, reject) => {
        let activeTimeFrame = new Date(Date.now() - (5 * 60 * 1000)).getTime()
        getDb()
            .then((db) => {
                db.collection(COLLECTION_CROWD).find({ lastSeen: { $gt: activeTimeFrame } }).toArray()
                    .then((users) => {
                        if (users.length > 0) {
                            let essentialUsers = []
                            users.forEach((user) => {
                                essentialUsers.push({
                                    "id": user.id,
                                    "publicKey": user.publicKey
                                })
                            })
                            resolve(essentialUsers)
                        }
                        else {
                            reject(`No users online since ${activeTimeFrame}`)
                        }
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * Function to authenticate the user
 * @param id pushy token used as id
 * @param password password saved in database
 */
let authenticateCrowdPromise = (id: String, password: string) => {
    return new Promise<Crowd>((resolve, reject) => {
        getCrowdPromise(id)
            .then((user) => {
                let hash = crypto.createHash("sha256").update(password).digest().toString()
                if (user.password === hash) {
                    resolve()
                }
                else {
                    reject(`Password doesn't match for ${id}`)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export {
    createCrowdPromise,
    getCrowdPromise,
    getAllCrowdPromise,
    getAllRecentCrowdPromise,
    getCrowdWithTokensPromise,
    patchCrowdPromise,
    authenticateCrowdPromise

}