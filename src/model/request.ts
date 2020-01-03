import Communication from '../communication';
import uniqid from 'uniqid';
import * as requestModel from './requestModels'

let startAggregationPromise = (req, groups: any[][]) => {
    return new Promise((resolve, reject) => {
        let com = new Communication()
        let uniqueId = uniqid()
        let requestHeader = requestModel.requestHeaderModel(uniqueId, req.body.requestType)
        groups.forEach((group) => {
            let data = requestModel.dataModel()
            let requestOptions = requestModel.requestOptionsModel(group)
            let requestData = null
            let request = req.body.request
            switch (req.body.requestType) {
                case "steps":
                    requestData = requestModel.requestStepsModel(request.date)
                    break
                case "walk":
                    requestData = requestModel.requestWalkModel(request.start, request.end, request.type)
                    break
                case "location":
                    requestData = requestModel.requestLocationModel(request.start, request.end, request.accuracy)
                    break
                case "presence":
                    requestData = requestModel.requestPresenceModel(request.start, request.end, request.long, request.lat, request.radius)
                    break
            }
            let message = requestModel.messageModel(group[0].id, requestHeader, requestOptions, requestData, data)

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

export {
    startAggregationPromise
}