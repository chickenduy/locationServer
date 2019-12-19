import express from 'express';
import http from 'http';
import https from 'https';
import Communcation from './communication';
import Routes from './routes';
import bodyParser from 'body-parser';
import fs from 'fs';

const com = new Communcation()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000

//Parse json body into req.body
app.use(express.json({"type": "application/json"}))

//Set routes that require user authentication.
const routes = new Routes()
routes.setRoutes(app)


app.set('port', process.env.PORT || port);

app.listen(app.get('port'), function () {
	console.log("Server listening on port " + port)
})