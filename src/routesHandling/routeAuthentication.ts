import * as user from '../model/user';
import * as crowd from '../model/crowd';

export default class RouteAuthentication {

    /**
     * Authenticate the crowd with stored Pushy token and password
     * @param req 
     * @param res 
     * @param next 
     */
    authenticateRequest = (req, res, next) => {
        let id
        let password

        /**
         * Extract token and password from request
         */
        if (req.method === "GET") {
            id = req.query.id
            password = req.query.password
        } else {
            id = req.body.requestOptions.from
            password = req.body.password
        }

        crowd.authenticateCrowdPromise(id, password)
            .then(() => {
                next()
            })
            .catch((err) => {
                let result = {
                    "status": "failure",
                    "source": "authenticateCrowdPromise",
                    "message": err
                }
                console.log(result)
                res.status(500).json(result).send()
            })
    }

    /**
     * Authenticate the crowd with stored Pushy token and password
     * @param req 
     * @param res 
     * @param next 
     */
    authenticateCrowd = (req, res, next) => {
        let id
        let password

        /**
         * Extract token and password from request
         */
        if (req.method === "GET") {
            id = req.query.id
            password = req.query.password
        } else {
            id = req.body.id
            password = req.body.password
        }

        crowd.authenticateCrowdPromise(id, password)
            .then(() => {
                next()
            })
            .catch((err) => {
                let result = {
                    "status": "failure",
                    "source": "authenticateCrowdPromise",
                    "message": err
                }
                console.log(result)
                res.status(500).json(result).send()
            })
    }

    /**
     * Authenticate user with stored username and password
     * @param req 
     * @param res 
     * @param next 
     */
    authenticateUser = (req, res, next) => {
        let username = ""
        let password = ""
        /**
         * Extract token and password from request
         */
        if (req.method === "GET") {
            username = req.query.username
            password = req.query.password
        }
        else {
            username = req.body.username
            password = req.body.password
        }
        if (!username || !password) {
            let result = {
                "status": "failure",
                "source": "authenticateUser",
                "message": `Missing username: ${username}, password: ${password}`
            }
            res.status(500).json(result).send()
            return
        }

        user.authenticateUserPromise(username, password)
            .then(() => {
                next()
            })
            .catch((err) => {
                let result = {
                    "status": "failure",
                    "source": "authenticateUserPromise",
                    "message": err
                }
                res.status(500).json(result).send()
            })
    }
}
