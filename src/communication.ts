import request from 'request-promise'

export default class Communication {
    api_key = "?api_key=cfd5f664afd97266ed8ec89ac697b9dcded0afced39635320fc5bfb7a950c705"
    address = "https://api.pushy.me/"

    /**
     * This is a function to send data to a specific mobile phone over the Pushy Server
     * and resolves or rejects the depending on the REST request.
     * @param data in JSON 
     * {
     *  to: <Pushy Token>
     *  data: {
     *      <specific data>
     *  }
     * } 
     */
    sendNotificationPromise(data) {
        return new Promise((resolve, reject) => {
            let options =
            {
                url: `${this.address}push${this.api_key}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            request.post(options)
                .then((body) => {
                    resolve(JSON.parse(body))
                })
                .catch((err) => {
                    reject(err)
                })
        });
    }

    getPresence(data) {
        return new Promise((resolve, reject) => {
            let options =
            {
                url: `${this.address}devices/presence${this.api_key}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            request.post(options)
                .then((body) => {
                    resolve(JSON.parse(body))
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}