"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const communication_1 = __importDefault(require("./communication"));
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const dbconnector_1 = require("./dbconnector");
const com = new communication_1.default();
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const port = process.env.PORT || 3000;
//Parse json body into req.body
app.use(express_1.default.json({ "type": "application/json" }));
//Set routes that require user authentication.
const routes = new routes_1.default();
// routes.requireUserAuthentication(app,
// 	[
// 		'/request',
// 	]
// )
routes.setRoutes(app);
app.set('port', process.env.PORT || port);
dbconnector_1.getDb()
    .then(() => {
    app.listen(app.get('port'), function () {
        console.log("Server listening on port " + port);
    });
});
//# sourceMappingURL=app.js.map