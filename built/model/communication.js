"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
class Communication {
    constructor() {
        // TODO: Insert Secret API Key
        this.api_key = "aebd6c142e4a6753634265eab8d76ed4d2928fd84969ebebc1092e6c7ccf9192";
        this.address = "https://api.pushy.me";
    }
    /**
     * This is a function to send data to a specific mobile phone over the Pushy Server
     * and resolves or rejects the depending on the REST request.
     * @param notification in JSON
     */
    sendNotificationPromise(data) {
        return new Promise((resolve, reject) => {
            let options = {
                url: `${this.address}/push?api_key=${this.api_key}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data,
                json: true
            };
            request_promise_1.default.post(options)
                .then((body) => {
                resolve(body);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    /**
     * Calls the Pushy API to see if the devices have been online in the past
     * @param tokens that are tested for online presence
     */
    getPresence(tokens) {
        return new Promise((resolve, reject) => {
            let options = {
                url: `${this.address}/devices/presence?api_key=${this.api_key}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "tokens": tokens
                },
                json: true
            };
            request_promise_1.default.post(options)
                .then((body) => {
                resolve(body);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
}
exports.default = Communication;
//# sourceMappingURL=communication.js.map