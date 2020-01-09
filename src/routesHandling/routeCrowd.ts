import crypto from "crypto";
import Communication from "../communication";
import { shuffleFisherYates } from "../helpers";

import * as user from '../model/user';
import * as crowd from '../model/crowd';
import { startAggregationPromise } from '../model/request';
import AggreagationObject from "../model/aggregationObject";

export default class RouteCrowd {

    /**
     * Handles incoming create crowd request
     * @param req 
     * @param res 
     */
    handleCreateCrowdRequest = (req, res) => {
        console.log(req.body)
        let request = req.body.request

        let random = Math.random().toString(36)
        let password = crypto.createHash("sha256").update(random).digest().toString()

        let user = {
            "id": req.body.id,
            "publicKey": req.body.publicKey,
            "password": password,
            "lastSeen": Date.now()
        }
        crowd.createCrowdPromise(user)
            .then((result) => {
                let response = {
                    "status": "success",
                    "message": result,
                    "id": user.id,
                    "publicKey": user.publicKey,
                    "password": random,
                    "lastSeen": user.lastSeen
                }
                res.status(200).json(response).send()
            })
            .catch((err) => {
                let response = {
                    "status": "failure",
                    "source": "createUserPromise",
                    "reason": err
                }
                res.status(500).json(response).send()
            })
    }

    /**
     * Handle incoming ping to update timestamp of crowd
     * @param req 
     * @param res 
     */
    handleUpdateCrowdRequest = (req, res) => {
        console.log(req.body)
        let id = req.body.id
        let password = req.body.password

        crowd.authenticateCrowdPromise(id, password)
            .then((user) => {
                crowd.patchCrowdPromise(id)
                    .then((result) => {
                        let response = {
                            "status": "success",
                            "message": result
                        }
                        res.status(200).json(response).send()
                    })
                    .catch((err) => {
                        let response = {
                            "status": "failure",
                            "source": "patchUserPomise",
                            "reason": err
                        }
                        res.status(500).json(response).send()
                    })
            })
            .catch((err) => {
                let response = {
                    "status": "failure",
                    "source": "autheticateUserPromise",
                    "reason": err
                }
                res.status(500).json(response).send()
            })
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    handlePingedCrowdRequest = (req, res) => {
        console.log(req.body)
        let id = req.body.requestOptions.from
        let password = req.body.password

        crowd.authenticateCrowdPromise(id, password)
            .then(() => {
                crowd.patchCrowdPromise(id)
                    .then((result) => {
                        let response = {
                            "status": "success",
                            "message": result
                        }
                        res.status(200).json(response).send()
                    })
                    .catch((err) => {
                        let response = {
                            "status": "failure",
                            "source": "patchUserPromise",
                            "reason": err
                        }
                        res.status(500).json(response).send()
                    })
            })
            .catch((err) => {
                let response = {
                    "status": "failure",
                    "source": "authenticateUserPromise",
                    "reason": err
                }
                res.status(500).json(response).send()
            })
    }


}
