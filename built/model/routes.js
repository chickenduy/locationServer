"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routesHandling_1 = __importDefault(require("../routesHandling/routesHandling"));
const routeAggregation_1 = __importDefault(require("../routesHandling/routeAggregation"));
const routeCrowd_1 = __importDefault(require("../routesHandling/routeCrowd"));
const routeAuthentication_1 = __importDefault(require("../routesHandling/routeAuthentication"));
class Router {
    constructor() {
        this.routesHandling = new routesHandling_1.default();
        this.aggregationHandler = new routeAggregation_1.default();
        this.crowdHandler = new routeCrowd_1.default();
        this.authenticationHandler = new routeAuthentication_1.default();
    }
    /**
     * Register routes that require crowd authentication.
     * @param app
     * @param routes
     */
    requireRequestAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, this.authenticationHandler.authenticateRequest);
        });
    }
    /**
     * Register routes that require crowd authentication.
     * @param app
     * @param routes
     */
    requireCrowdAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, this.authenticationHandler.authenticateCrowd);
        });
    }
    /**
     * Register routes that require user authentication.
     * @param app
     * @param routes
     */
    requireUserAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, this.authenticationHandler.authenticateUser);
        });
    }
    /**
     * Defining the routes served by the server.
     * @param app
     */
    setRoutes(app) {
        app.get('/aggregationResult', this.aggregationHandler.handleGetAggregationResult);
        app.post('/crowd', this.crowdHandler.handleCreateCrowdRequest);
        app.post('/crowd/ping', this.crowdHandler.handlePingedCrowdRequest);
        app.post('/aggregationsteps', this.aggregationHandler.handlePostStepsResult);
        app.post('/aggregationwalk', this.aggregationHandler.handlePostWalkResult);
        app.post('/aggregationlocation', this.aggregationHandler.handlePostLocationResult);
        app.post('/aggregationpresence', this.aggregationHandler.handlePostPresenceResult);
        app.post('/aggregationRequest', this.aggregationHandler.handleAggregationRequest);
        app.all('*', this.routesHandling.handleBasicRequest);
    }
}
exports.default = Router;
//# sourceMappingURL=routes.js.map