"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoutesHandling {
    constructor() {
        /**
         * This is a basic function that returns a JSON "Hello world!"
         * @param req
         * @param res
         */
        this.handleBasicRequest = (req, res) => {
            res.set({
                'Content-Type': 'application/json'
            });
            res.status(200)
                .send({
                "Hello": "world!"
            });
        };
    }
}
exports.default = RoutesHandling;
//# sourceMappingURL=routesHandling.js.map