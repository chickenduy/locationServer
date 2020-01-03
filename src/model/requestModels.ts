import { start } from "repl"
import { endianness } from "os"


let requestHeaderModel = (id: String, type: String) => {
    return {
        "id": id, // Unique ID of request
        "start": Date.now(), // Start date of request
        "end": 0, // End date of request
        "type": type // Type of aggregation [steps, walking, running, bicycle, vehicle, location, presence]
    }
}

let requestOptionsModel = (group: String[][]) => {
    return {
        "from": null,
        "group": group, // Pushy Tokens of aggregation group
    }
}

let requestStepsModel = (date: number) => {
    return {
        "date": date
    }
}

let requestWalkModel = (start: number, end: number, type: String) => {
    return {
        start: start,
        end: end,
        type: type // What type of raw data [time/distance]
    }
}

let requestLocationModel = (start: number, end: number, accuracy: number) => {
    return {
        start: start, // Accuracy of spatial cloaking
        end: end,
        accuracy: accuracy
    }
}

let requestPresenceModel = (start: number, end: number, long: number, lat: number, radius: number) => {
    return {
        start: start,
        end: end,
        long: long,
        lat: lat,
        radius: radius, // Radius from location
    }
}

let dataModel = () => {
    return {
        raw: [], // Array of raw data (anonymized)
        n: 0 // Number of participants
    }
}

let messageModel = (to: String, requestHeader: any, requestOptions: any, requestData: any, data: any) => {
    return {
        to: to, // Pushy Token
        data: {
            encryptionKey: null, // AES Encryption Key
            iv: null, // AES Init Vector
            requestHeader: requestHeader,
            requestOptions: requestOptions,
            requestData: requestData,
            data: data
        },
        time_to_live: 120 // only try to send for t minutes
    }
}

let confirmationMessageModel = () => {
    return {
        to: String, // Pushy Token
        data: {
            confirmation: true
        },
        time_to_live: 120 // only try to send for t minutes
    }
}

export {
    requestHeaderModel,
    requestOptionsModel,
    requestStepsModel,
    requestWalkModel,
    requestLocationModel,
    requestPresenceModel,
    dataModel,
    messageModel,
    confirmationMessageModel
}