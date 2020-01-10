import express from 'express';
import Routes from './routes';
import bodyParser from 'body-parser';
import { getDb } from './dbconnector';

const port = process.env.PORT || 3000

const app = express()
app.set('port', port);
//Parse json body into req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ "type": "application/json" }))

const routes = new Routes()

//Set routes that require authentication.
routes.requireRequestAuthentication(app,
	[
		'/crowd/ping'
	]
)

routes.requireCrowdAuthentication(app,
	[
		'/aggregationsteps', 
		'/aggregationwalk',
		'/aggregationlocation',
		'/aggregationpresence',
	]
)

routes.requireUserAuthentication(app,
	[
		'/aggregationRequest',
		'/aggregationResult'
	]
)
routes.setRoutes(app)

// Establish database connection before starting the server
getDb()
	.then(() => {
		app.listen(app.get('port'), function () {
			console.log("Server listening on port " + port)
		})
	})
	.catch((err) => {
		console.log(err)
	})
