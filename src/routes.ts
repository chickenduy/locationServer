import RouteHandling from './routesHandling/routesHandling';
import RouteAggregation from './routesHandling/routeAggregation';
import RouteCrowd from './routesHandling/routeCrowd';
import RouteAuthentication from './routesHandling/routeAuthentication';

export default class Router {
    routesHandling = new RouteHandling()
    aggregationHandler = new RouteAggregation()
    crowdHandler = new RouteCrowd()
    authenticationHandler = new RouteAuthentication()

    /**
     * Register routes that require crowd authentication.
     * @param app 
     * @param routes 
     */
    requireCrowdAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, this.authenticationHandler.authenticateCrowd)
        })
    }

    /**
     * Register routes that require user authentication.
     * @param app 
     * @param routes 
     */
    requireUserAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, this.authenticationHandler.authenticateUser)
        })
    }

    /**
     * Defining the routes served by the server.
     * @param app 
     */
    setRoutes(app) {
        app.get('/aggregationResult', this.aggregationHandler.handleGetAggregationResult)

        app.post('/crowd', this.crowdHandler.handleCreateCrowdRequest)
        app.post('/aggregationData', this.aggregationHandler.handlePostAggregationResult)
        app.post('/aggregationRequest', this.aggregationHandler.handleAggregationRequest)

        app.patch('/crowd', this.crowdHandler.handleUpdateCrowdRequest)
        app.patch('/crowd/ping', this.crowdHandler.handlePingedCrowdRequest)

        app.all('*', this.routesHandling.handleBasicRequest)
    }
}