import * as RouteHandling from './routesHandling';

export default class Router {

    /*
        Register routes that require user authentication.
    */
    public requireUserAuthentication(app, routes) {
        routes.forEach(route => {
            //app.use(route, Helper.authenticateUser)
        })
    }

    /*
        Defining the routes served by the server.
    */
    public setRoutes(app) {
        app.get('/', RouteHandling.basicRequest)
        app.get('/aggregations', RouteHandling.startAggregationRequest)
        app.get('/request', RouteHandling.basicRequest)
        app.get('/test', RouteHandling.testRoutePost)
        app.get('/user', RouteHandling.testRoutePost)
        
        app.post('/user', RouteHandling.handleNewUserRequest)
        app.post('/test', RouteHandling.testRoutePost)
        app.post('/admin/sampleRequest', RouteHandling.basicRequest)

        app.all('*', RouteHandling.basicRequest)
    }
}