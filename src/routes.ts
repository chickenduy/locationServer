import * as RouteHandling from './routesHandling';

export default class Router {

    /*
        Register routes that require crowd authentication.
    */
    requireCrowdAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, RouteHandling.authenticateCrowd)
        })
    }

    /*
        Register routes that require user authentication.
    */
   requireUserAuthentication(app, routes) {
    routes.forEach(route => {
        app.use(route, RouteHandling.authenticateUser)
    })
}

    /*
        Defining the routes served by the server.
    */
    setRoutes(app) {
        app.get('/', RouteHandling.basicRequest)
        app.get('/result', RouteHandling.basicRequest)

        app.post('/crowd', RouteHandling.handleCreateCrowdRequest)
        app.post('/request', RouteHandling.handleAggregationRequest)
        app.post('/aggregation', RouteHandling.basicRequest)

        app.patch('/user', RouteHandling.handleUpdateCrowdRequest)
        app.patch('/user/ping', RouteHandling.handlePingedCrowdRequest)

        app.all('*', RouteHandling.basicRequest)
    }
}