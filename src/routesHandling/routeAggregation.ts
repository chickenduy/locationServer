import Communication from "../communication";
import { shuffleFisherYates, suppressSingles, suppressLocations } from "../helpers";
import uniqid from 'uniqid';

import * as crowd from '../model/crowd';
import { startAggregationPromise } from '../model/request';
import AggreagationObject from "../model/aggregationObject";

const GROUP_SIZE = 2
const MIN_GROUP_SIZE = 2
const MIN_ANON = 2

export default class RouteAggregation {
    aggregationObjects: { [id: string] : AggreagationObject; } = {};
    
    /**
    * This handles an incoming aggregation request
    * @param req 
    * @param res 
    */
    handleAggregationRequest = (req, res) => {
        let com = new Communication()
        crowd.getAllCrowdPromise()
            .then((users) => {
                let tokens = []
                users.forEach((user) => {
                    tokens.push(user.id)
                })
                com.getPresence(tokens)
                    .then((result) => {
                        let onlineCrowd = []
                        let users = result.presence
                        users.forEach(user => {
                            if (user.online) {
                                onlineCrowd.push(user.id)
                                crowd.patchCrowdPromise(user.id)
                            }
                        })
                        if (onlineCrowd.length == 0) {
                            let response = {
                                "status": "failure",
                                "source": "getPresence",
                                "message": "no devices online"
                            }
                            res.status(500).json(response).send()
                            return
                        }
                        onlineCrowd = shuffleFisherYates(onlineCrowd)
                        crowd.getCrowdWithTokensPromise(onlineCrowd)
                            .then((onlineCrowdDetailed) => {
                                let counter = 0
                                let groups = [[]]
                                let newGroupSize = GROUP_SIZE
                                while(onlineCrowdDetailed.length%newGroupSize < MIN_GROUP_SIZE && onlineCrowdDetailed.length%newGroupSize != 0) {
                                    newGroupSize++
                                }
                                while (onlineCrowdDetailed.length) {
                                    groups[counter] = onlineCrowdDetailed.splice(0, newGroupSize)
                                    counter++
                                }
                                let uniqueId = uniqid()
                                this.aggregationObjects[uniqueId] = new AggreagationObject()
                                this.aggregationObjects[uniqueId].numberOfGroups = groups.length
                                if (req.body.request.anonymity > MIN_ANON) {
                                    this.aggregationObjects[uniqueId].anonymity = req.body.request.anonymity
                                }
                                startAggregationPromise(req, groups, uniqueId)
                                    .then((result) => {
                                        res.status(200).json(result).send()
                                    })
                                    .catch((err) => {
                                        let response = {
                                            "status": "failure",
                                            "source": "startAggregation",
                                            "message": err
                                        }
                                        res.status(500).json(response).send()
                                    })
                            })
                            .catch((err) => {
                                let response = {
                                    "status": "failure",
                                    "source": "getPresence",
                                    "message": err
                                }
                                res.status(500).json(response).send()
                            })
                    })
                    .catch((err) => {
                        let response = {
                            "status": "failure",
                            "source": "startAggregation",
                            "message": err
                        }
                        res.status(500).json(response).send()
                    })
            })
            .catch((err) => {
                let response = {
                    "status": "failure",
                    "source": "getAllUsers",
                    "message": err
                }
                res.status(500).json(response).send()
            })
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    handlePostStepsResult = (req, res) => {
        console.log(req.body.data.raw)
        let raw: any[] = req.body.data.raw
        let id = req.body.requestHeader.id

        raw.forEach(element => {
            // somehow concat doesn't work
            this.aggregationObjects[id].raw.push(element)
        });
        this.aggregationObjects[id].collectedGroups++
        if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
            console.log(this.aggregationObjects[id])
            console.log("received all data, clean now")
            let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0)
            let result = {
                id: id,
                start: req.body.requestHeader.start,
                end: Date.now(),
                average: sum/req.body.data.n,
                raw: raw,
                options: req.body.requestData
            }
            console.log(this.aggregationObjects[id])
            console.log(result)
        }
        let response = {
            "status": "success"
        }
        res.status(200).json(response).send()
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    handlePostWalkResult = (req, res) => {
        console.log(req.body.data.raw)
        let raw: any[] = req.body.data.raw
        let id = req.body.requestHeader.id

        raw.forEach(element => {
            // somehow concat doesn't work
            this.aggregationObjects[id].raw.push(element)
        });
        this.aggregationObjects[id].collectedGroups++
        if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
            console.log(this.aggregationObjects[id])
            console.log("received all data, clean now")
            let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0)
            let result = {
                id: id,
                start: req.body.requestHeader.start,
                end: Date.now(),
                average: sum/req.body.data.n,
                raw: raw,
                options: req.body.requestData
            }
            console.log(result)
        }
        let response = {
            "status": "success"
        }
        res.status(200).json(response).send()
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    handlePostLocationResult = (req, res) => {
        let raw: any[] = req.body.data.raw
        let id = req.body.requestHeader.id
        raw.forEach(element => {
            // somehow concat doesn't work
            this.aggregationObjects[id].raw.push(element)
        });
        this.aggregationObjects[id].collectedGroups++
        console.log(this.aggregationObjects[id].collectedGroups)
        console.log(this.aggregationObjects[id].numberOfGroups)
        if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
            console.log(this.aggregationObjects[id].raw)
            console.log("received all data, clean now")
            this.aggregationObjects[id].raw = suppressLocations(this.aggregationObjects[id].anonymity, this.aggregationObjects[id].raw)
            console.log(this.aggregationObjects[id].raw)
            delete this.aggregationObjects[id]
        }
        let response = {
            "status": "success"
        }
        res.status(200).json(response).send()
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    handlePostPresenceResult = (req, res) => {
        console.log(req.body.data.raw)
        let raw: any[] = req.body.data.raw
        let id = req.body.requestHeader.id

        raw.forEach(element => {
            // somehow concat doesn't work
            this.aggregationObjects[id].raw.push(element)
        });
        this.aggregationObjects[id].collectedGroups++
        if (this.aggregationObjects[id].collectedGroups == this.aggregationObjects[id].numberOfGroups) {
            console.log(this.aggregationObjects[id])
            console.log("received all data, clean now")
            let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0)
            let result = {
                id: id,
                start: req.body.requestHeader.start,
                end: Date.now(),
                visits: sum,
                raw: raw,
                options: req.body.requestData
            }
            console.log(result)
        }
        let response = {
            "status": "success"
        }
        res.status(200).json(response).send()
    }

    handleGetAggregationResult = (req, res) => {
    }
}

class Location {
    lat: number
    long: number
    constructor(lat: number, long: number) {
        this.lat = lat
        this.long = long
    }
}