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
    /**
     * Register routes that require crowd authentication.
     * @param app
     * @param routes
     */
    requireCrowdAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, RouteHandling.authenticateCrowd);
        });
    }
    /**
     * Register routes that require user authentication.
     * @param app
     * @param routes
     */
    requireUserAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, RouteHandling.authenticateUser);
        });
    }
    /**
     * Defining the routes served by the server.
     * @param app
     */
    setRoutes(app) {
        app.get('/', RouteHandling.basicRequest);
        app.get('/result', RouteHandling.basicRequest);
        app.post('/crowd', RouteHandling.handleCreateCrowdRequest);
        app.post('/aggregation', RouteHandling.basicRequest);
        app.post('/request', RouteHandling.handleAggregationRequest);
        app.patch('/crowd', RouteHandling.handleUpdateCrowdRequest);
        app.patch('/crowd/ping', RouteHandling.handlePingedCrowdRequest);
        app.all('*', RouteHandling.basicRequest);
    }
}
exports.default = Router;
//# sourceMappingURL=routes.js.map