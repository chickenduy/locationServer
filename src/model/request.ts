import Communication from '../communication';
import * as requestModel from './requestModels'

let startAggregationPromise = (req, groups: any[][], uniqueId: String) => {
    return new Promise((resolve, reject) => {
        let com = new Communication()
        let requestHeader = requestModel.requestHeaderModel(uniqueId, req.body.requestType)
        let index = 1
        groups.forEach((group) => {
            let data = requestModel.dataModel()
            let requestOptions = requestModel.requestOptionsModel(index, groups.length, group)
            let requestData = null
            let request = req.body.request
            switch (req.body.requestType) {
                case "steps":
                    requestData = requestModel.requestStepsModel(request.date)
                    break
                case "walk":
                    requestData = requestModel.requestWalkModel(request.start, request.end)
                    break
                case "location":
                    requestData = requestModel.requestLocationModel(request.date, request.accuracy, request.anonymity)
                    break
                case "presence":
                    requestData = requestModel.requestPresenceModel(request.start, request.end, request.long, request.lat, request.radius)
                    break
            }
            let message = requestModel.messageModel(group[0].id, requestHeader, requestOptions, requestData, data)
            console.log(message)
            com.sendNotificationPromise(message)
                .then(() => {
                    let response = {
                        id: requestHeader.id,
                        type: requestHeader.type,
                        numberOfGroups: requestOptions.numberOfGroups
                    }
                    resolve(response)
                })
                .catch((err) => {
                    reject(err)
                })
            index++
        })
    })
}

export {
    startAggregationPromise
}