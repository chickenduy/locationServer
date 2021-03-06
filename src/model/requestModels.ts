let requestHeaderModel = (id: String, type: String) => {
    return {
        id: id, // Unique ID of request
        start: Date.now(), // Start date of request
        end: 0, // End date of request
        type: type // Type of aggregation [steps, walking, running, bicycle, vehicle, location, presence]
    }
}

let requestOptionsModel = (groupNumber: number, numberOfGroups: number, group: String[][]) => {
    return {
        groupNumber: groupNumber,
        numberOfGroups: numberOfGroups,
        from: "",
        group: group, // Pushy Tokens of aggregation group
    }
}

let requestStepsModel = (date: number, lat: number, lon: number, radius: number) => {
    return {
        date: date,
        lat: lat,
        lon: lon,
        radius: radius,
    }
}

let requestActivityModel = (type: number, start: number, end: number, lat: number, lon: number, radius: number) => {
    return {
        type: type,
        start: start,
        end: end,
        lat: lat,
        lon: lon,
        radius: radius,
    }
}

let requestLocationModel = (date: number, accuracy: number, anonymity: number, lat: number, lon: number, radius: number) => {
    return {
        date: date,
        accuracy: accuracy, // Accuracy of spatial cloaking [1-5] [10km-1m]
        anonymity: anonymity,
        lat: lat,
        lon: lon,
        radius: radius,
    }
}

let requestPresenceModel = (start: number, end: number, lat: number, lon: number, radius: number) => {
    return {
        start: start,
        end: end,
        lat: lat,
        lon: lon,
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
    requestActivityModel,
    requestLocationModel,
    requestPresenceModel,
    dataModel,
    messageModel,
    confirmationMessageModel
}