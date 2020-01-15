import Communication from "../model/communication";
import { shuffleFisherYates, suppressSingles, suppressLocations } from "../functions/helpers";
import uniqid from 'uniqid';

import * as crowd from '../model/crowd';
import { startAggregationPromise } from '../functions/request';
import { createAggregationResultPromise, findAggregationResultPromise } from '../functions/aggregation'
import AggreagationModel from "../model/aggregationModel";

const GROUP_SIZE = 1
const MIN_GROUP_SIZE = 1
const MIN_ANON = 1

export default class RouteAggregation {
    aggregationObjects: { [id: string]: AggreagationModel; } = {};

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
                                if (onlineCrowdDetailed.length < MIN_GROUP_SIZE) {
                                    let response = {
                                        "status": "failure",
                                        "source": "startAggregation",
                                        "message": "not enough participants"
                                    }
                                    res.status(500).json(response).send()
                                    return
                                }
                                let counter = 0
                                let groups = [[]]
                                let newGroupSize = GROUP_SIZE
                                while (onlineCrowdDetailed.length % newGroupSize < MIN_GROUP_SIZE && onlineCrowdDetailed.length % newGroupSize != 0) {
                                    newGroupSize++
                                }
                                while (onlineCrowdDetailed.length) {
                                    groups[counter] = onlineCrowdDetailed.splice(0, newGroupSize)
                                    counter++
                                }
                                let uniqueId = uniqid()
                                this.aggregationObjects[uniqueId] = new AggreagationModel()
                                this.aggregationObjects[uniqueId].numberOfGroups = groups.length
                                if (req.body.request.anonymity > MIN_ANON) {
                                    this.aggregationObjects[uniqueId].anonymity = req.body.request.anonymity
                                }
                                console.log("start aggregation")
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
            let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0)
            let result = {
                id: id,
                type: req.body.requestHeader.type,
                start: req.body.requestHeader.start,
                end: Date.now(),
                average_steps: sum / req.body.data.n,
                raw: this.aggregationObjects[id].raw,
                options: req.body.requestData
            }
            createAggregationResultPromise(result)
                .then(() => {
                    console.log("Success")
                })
                .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "createAggregationResultPromise",
                        "message": err
                    }
                    res.status(200).json(response).send()
                })
            delete this.aggregationObjects[id]
        }
        else {
            let response = {
                "status": "success",
                "source": "handlePostPresenceResult",
                "message": `received results (${this.aggregationObjects[id].collectedGroups}/${this.aggregationObjects[id].numberOfGroups})`
            }
            res.status(200).json(response).send()
        }
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
            let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0)
            let result = {
                id: id,
                type: req.body.requestHeader.type,
                start: req.body.requestHeader.type,
                end: Date.now(),
                average: sum / req.body.data.n,
                raw: this.aggregationObjects[id].raw,
                options: req.body.requestData
            }
            createAggregationResultPromise(result)
                .then(() => {
                    console.log("Success")
                })
                .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "createAggregationResultPromise",
                        "message": err
                    }
                    res.status(200).json(response).send()
                })
            delete this.aggregationObjects[id]
        }
        else {
            let response = {
                "status": "success",
                "source": "handlePostPresenceResult",
                "message": `received results (${this.aggregationObjects[id].collectedGroups}/${this.aggregationObjects[id].numberOfGroups})`
            }
            res.status(200).json(response).send()
        }
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
            let supressed  = suppressLocations(this.aggregationObjects[id].anonymity, this.aggregationObjects[id].raw)
            let result = {
                id: id,
                type: req.body.requestHeader.type,
                start: req.body.requestHeader.start,
                end: Date.now(),
                raw: supressed,
                options: req.body.requestData
            }
            createAggregationResultPromise(result)
                .then(() => {
                    let response = {
                        "status": "success"
                    }
                    res.status(200).json(response).send()
                })
                .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "createAggregationResultPromise",
                        "message": err + ` ${this.aggregationObjects[id].raw}`
                    }
                    res.status(200).json(response).send()
                })
            delete this.aggregationObjects[id]
        }
        else {
            let response = {
                "status": "success",
                "source": "handlePostPresenceResult",
                "message": `received results (${this.aggregationObjects[id].collectedGroups}/${this.aggregationObjects[id].numberOfGroups})`
            }
            res.status(200).json(response).send()
        }
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
            let sum = this.aggregationObjects[id].raw.reduce((a, b) => a + b, 0)
            let result = {
                id: id,
                type: req.body.requestHeader.type,
                start: req.body.requestHeader.start,
                end: Date.now(),
                visits: sum,
                raw: this.aggregationObjects[id].raw,
                options: req.body.requestData
            }
            createAggregationResultPromise(result)
                .then(() => {
                    console.log("Success")
                })
                .catch((err) => {
                    let response = {
                        "status": "failure",
                        "source": "createAggregationResultPromise",
                        "message": err
                    }
                    res.status(200).json(response).send()
                })
            delete this.aggregationObjects[id]
        }
        else {
            let response = {
                "status": "success",
                "source": "handlePostPresenceResult",
                "message": `received results (${this.aggregationObjects[id].collectedGroups}/${this.aggregationObjects[id].numberOfGroups})`
            }
            res.status(200).json(response).send()
        }
    }

    handleGetAggregationResult = (req, res) => {
        let id = req.query.id
        if (id != null) {
            findAggregationResultPromise(id)
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
        }
        else {
            let response = {
                "status": "failure",
                "source": "startAggregation",
                "message": ""
            }
            res.status(500).json(response).send()
        }
    }
}