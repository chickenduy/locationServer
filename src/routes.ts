import * as RouteHandling from './routesHandling';

export default class Router {

    /*
        Register routes that require user authentication.
    */
    public requireUserAuthentication(app, routes) {
        routes.forEach(route => {
            app.use(route, RouteHandling.authenticateUser)
        })
    }

    /*
        Defining the routes served by the server.
    */
    public setRoutes(app) {
        app.get('/', RouteHandling.basicRequest)

        app.post('/user', RouteHandling.handleCreateUserRequest)
        app.post('/request', RouteHandling.handleAggregationRequest)

        app.patch('/user', RouteHandling.handleUpdateUserRequest)

        app.all('*', RouteHandling.basicRequest)
    }
}