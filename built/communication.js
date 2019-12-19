"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
class Communication {
    constructor() {
        this.address = "https://api.pushy.me/push?api_key=cfd5f664afd97266ed8ec89ac697b9dcded0afced39635320fc5bfb7a950c705";
    }
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
    sendPushNotificationPromise(data) {
        return new Promise((resolve, reject) => {
            let options = {
                url: this.address,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            request_1.default.post(options, (error, res, body) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                resolve(JSON.parse(body));
            });
        });
    }
    sendPushNotification(data) {
        let options = {
            url: this.address,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        request_1.default.post(options, (error, res, body) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
        });
    }
}
exports.default = Communication;
//# sourceMappingURL=communication.js.map