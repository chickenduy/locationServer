import { getDb } from '../dbconnector'

const COLLECTION_RESULT = "aggregation"

let createAggregationResultPromise = (result) => {
    return new Promise((resolve, reject) => {
        if (result.raw.length == 0 || result.raw.n == 0) {
            getDb()
            .then((db) => {
                let message = {
                    id: result.id,
                    type: result.type,
                    start: result.start,
                    end: result.end,
                    message: "no results",
                    options: result.options
                }
                db.collection(COLLECTION_RESULT).insertOne(message)
                    .then(() => {
                        resolve("saved aggregation")
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
            .catch((err) => {
                reject(err)
            })
        }
        getDb()
            .then((db) => {
                db.collection(COLLECTION_RESULT).insertOne(result)
                    .then(() => {
                        resolve("saved aggregation")
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

let findAggregationResultPromise = (id: String) => {
    return new Promise((resolve, reject) => {
        getDb()
            .then((db) => {
                db.collection(COLLECTION_RESULT).findOne({ "id": id })
                    .then((result) => {
                        switch (result.type) {
                            case "steps":
                                result.start = result.start
                                result.end = result.end
                                result.options.date = new Date(result.date)
                                break
                            case "activity":
                                result.start = result.start
                                result.end = result.end
                                result.options.start = new Date(result.options.start)
                                result.options.end = new Date(result.options.end)
                                break
                            case "location":

                                result.start = result.start
                                result.end = result.end
                                result.options.date = new Date(result.options.date)
                                break
                            case "presence":
                                result.start = result.start
                                result.end = result.end
                                result.options.start = new Date(result.options.start)
                                result.options.end = new Date(result.options.end)
                                break
                        }

                        resolve(result)
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

export {
    createAggregationResultPromise,
    findAggregationResultPromise
}