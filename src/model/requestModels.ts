

export let requestHeaderModel = (id: String, group: String[][], type: String) => {
    return {
        "id": id, // Unique ID of request
        "start": Date.now(), // Start date of request
        "end": 0, // End date of request
        "from": null,
        "group": group, // Pushy Tokens of aggregation group
        "type": type // Type of aggregation [steps, walking, running, bicycle, vehicle, location, presence]
    }
}

export let requestStepsModel = (date: number) => {
    return {
        "date": date
    }
}

export let requestWalkTimepointModel = (raw: String, date: number) => {
    return {
        "raw": raw, // What type of raw data [time spent, distance done]
        "date": date
    }
}

export let requestWalkTimeframeModel = (raw: String, dateA: number, dateB: number) => {
    return {
        "raw": raw, // What type of raw data [time, distance]
        "dateA": dateA,
        "dateB": dateB
    }
}

export let requestLocationTimepointModel = (date: number, accuracy: number) => {
    return {
        "accuracy": accuracy, // Accuracy of spatial cloaking
        "date": date
    }
}

export let requestPresenceTimepointModel = (date: number, long: number, lat: number, radius: number) => {
    return {
        "location": {
            "long": long,
            "lat": lat
        },
        "radius": radius, // Radius from location
        "date": date
    }
}

export let requestPresenceTimeframeModel = (dateA: number, dateB: number, long: number, lat: number, radius: number) => {
    return {
        "location": {
            "long": long,
            "lat": lat
        },
        "radius": radius, // Radius from location
        "dateA": dateA,
        "dateB": dateB,
    }
}

export let dataModel = () => {
    return {
        "raw": [], // Array of raw data (anonymized)
        "n": 0
    }
}

export let messageModel = (to: String, requestHeader: any, requestOptions: any, data: any) => {
    return {
        "to": to, // Pushy Token
        "data": {
            "encryptionKey": null, // AES Encryption Key
            "iv": null, // AES Init Vector
            "requestHeader": requestHeader,
            "requestOptions": requestOptions,
            "data": data
        },
        "time_to_live": 120 // only try to send for t minutes
    }
}

export let confirmationMessageModel = () => {
    return {
        "to": String, // Pushy Token
        "data": {
            "confirmation": true
        }
    }
}

let incomingRequest = () => {
    return {
        "username": "",
        "password": "",
        "requestType": "",
        "raw": "",
        "timepoint": true,
        "date": 0,
    }
}