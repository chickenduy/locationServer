import request from 'request-promise';
import Communication from '../communication';
import { resolve } from 'dns';

export let startAggregationPromise = (req, res, groups: any[][]) => {
    return new Promise((resolve, reject) => {
        switch (req.body.type) {
            case "test":
                sendAggregationTestPromise(groups)
                    .then((result) => {
                        resolve(result)
                    })
                    .catch((err) => {
                        reject(err)
                    })
                break
            default:
                reject("no type")
                break
        }
    })
}

let sendAggregationTestPromise = (groups: any[][]) => {
    return new Promise((resolve, reject) => {
        let com = new Communication()
        groups.forEach((group) => {
            console.log(group[0])
            let data = {
                "to": group[0],
                "data": {
                    "request": {
                        "id": "",
                        "type": "",
                        "start": "",
                        "end": "",
                        "group": group
                    },
                    "data": {
                        "average": 0,
                        "raw": [],
                        "n": 0
                    }
                },
                "time_to_live": 120
            }
            com.sendNotificationPromise(data)
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    })

}