import { getDb } from '../dbconnector'

const COLLECTION_RESULT = "aggregation"

let createAggregationResultPromise = (result) => {
    return new Promise((resolve, reject) => {
        if (result.raw.length == 0) {
            return reject("There is no raw data to save")
        }
        getDb()
            .then((db) => {
                db.collection(COLLECTION_RESULT).insertOne(result)
                    .then(() => {
                        resolve()
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
                                result.start = new Date(result.start)
                                result.end = new Date(result.end)
                                result.options.date = new Date(result.date)
                                break
                            case "walk":
                                result.start = new Date(result.start)
                                result.end = new Date(result.end)
                                result.options.start = new Date(result.options.start)
                                result.options.end = new Date(result.options.end)
                                break
                            case "location":

                                result.start = new Date(result.start)
                                result.end = new Date(result.end)
                                result.options.date = new Date(result.options.date)
                                break
                            case "presence":
                                result.start = new Date(result.start)
                                result.end = new Date(result.end)
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