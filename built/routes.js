"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const RouteHandling = __importStar(require("./routesHandling"));
class Router {
    /*
        Register routes that require user authentication.
    */
    requireUserAuthentication(app, routes) {
        routes.forEach(route => {
            //app.use(route, Helper.authenticateUser)
        });
    }
    /*
        Defining the routes served by the server.
    */
    setRoutes(app) {
        app.get('/', RouteHandling.basicRequest);
        app.get('/request', RouteHandling.handleAggregationRequest);
        app.get('/test', RouteHandling.testRoutePost);
        app.post('/user', RouteHandling.handleUserRequest);
        app.post('/test', RouteHandling.testRoutePost);
        app.post('/admin/sampleRequest', RouteHandling.basicRequest);
        app.all('*', RouteHandling.basicRequest);
    }
}
exports.default = Router;
//# sourceMappingURL=routes.js.map