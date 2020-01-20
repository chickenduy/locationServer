"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./model/routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const dbconnector_1 = require("./dbconnector");
const port = process.env.PORT || 3000;
const app = express_1.default();
app.set('port', port);
//Parse json body into req.body
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json({ "type": "application/json" }));
const routes = new routes_1.default();
//Set routes that require authentication.
routes.requireRequestAuthentication(app, [
    '/aggregationsteps',
    '/aggregationactivity',
    '/aggregationlocation',
    '/aggregationpresence',
]);
routes.requireCrowdAuthentication(app, [
    '/crowd/ping'
]);
routes.requireUserAuthentication(app, [
    '/aggregationRequest',
    '/aggregationResult'
]);
routes.setRoutes(app);
// Establish database connection before starting the server
dbconnector_1.getDb()
    .then(() => {
    app.listen(app.get('port'), function () {
        console.log("Server listening on port " + port);
    });
})
    .catch((err) => {
    console.log(err);
});
//# sourceMappingURL=app.js.map