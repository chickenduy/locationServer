import request from 'request-promise';
import Communication from '../communication';
import { resolve } from 'dns';
import uniqid from 'uniqid';
import * as requestModel from './requestModels'

export let startAggregationPromise = (req, groups: any[][]) => {
    return new Promise((resolve, reject) => {
        let incomingRequest = {
            
        }

        sendAggregationActivityPromise(req, groups)
            .then(() => {
                resolve()
            })
            .catch(() => {
                reject()
            })
    })
}

let sendAggregationActivityPromise = (req, groups: any[][]) => {
    return new Promise((resolve, reject) => {
        let com = new Communication()
        let uniqueId = uniqid()
        groups.forEach((group) => {
            let data = requestModel.dataModel()
            let requestHeader = requestModel.requestHeaderModel(uniqueId, group, req.body.requestType)
            let requestOptions = null
            switch (req.body.requestType) {
                case "steps":
                    requestOptions = requestModel.requestStepsModel(req.body.date)
                    break
                case "walk":
                    if (req.body.date) {
                        requestOptions = requestModel.requestWalkTimepointModel(req.body.raw, req.body.date)
                    }
                    else {
                        requestOptions = requestModel.requestWalkTimeframeModel(req.body.raw, req.body.dateA, req.body.dateB)
                    }
                    break
                case "location":
                    requestOptions = requestModel.requestLocationTimepointModel(req.body.date, req.body.accuracy)
                    break
                case "presence":
                    if (req.body.date) {
                        requestOptions = requestModel.requestPresenceTimepointModel(req.body.date, req.body.long, req.body.lat, req.body.radius)
                    }
                    else {
                        requestOptions = requestModel.requestPresenceTimeframeModel(req.body.dateA, req.body.dateB, req.body.long, req.body.lat, req.body.radius)
                    }
                    break
            }
            let message = requestModel.messageModel(group[0], requestHeader, requestOptions, data)

            console.log(message)
            com.sendNotificationPromise(message)
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    })
}

let aggregateResults = () => {

}