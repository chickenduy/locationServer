import { createUserPromise, getUserPromise } from "./model/users"
import crypto from "crypto";
import Communication from "./communication";

/**
 * This is a basic function that returns a plaintext "Hello world!"
 * @param res Response of the function
 */
export let basicRequest = (req, res) => {
	res.set({
		'Content-Type': 'application/json'
	})
	res.status(200)
		.send({
			"test": "Successfully deployed"
		})
}

export let startAggregationRequest = (req, res) => {
	/**
	 * timepointA, timepointB: timeframe
	 */
	let timeA = req.query.timeA
	let timeB = req.query.timeB
	/**
	 * request: position, steps, location, activity
	 */
	let request = req.query.request
	/**
	 * activity: walk, run, bike, vehicle
	 */
	let activity = req.query.activity
	let radius = req.query.activity

	//TODO: call aggregation function

	res.set({
		'Content-Type': 'text/plain'
	})
	res.status(200)
		.send("start aggregation")
}

export let handleUserRequest = (req, res) => {
	console.log(req.body)
	let request = req.body.request
	switch (request) {
		case "create":
			let user = {
				"id": req.body.id,
				"publicKey": req.body.publicKey,
				"lastSeen": Date.now()
			}
			createUserPromise(user)
				.then((result) => {
					let response = {
						"status": "success"
					}
					res.status(200).json(response).send()
				})
				.catch((err) => {
					let response = {
						"status": "failure",
						"reason": err
					}
					res.status(500).json(response).send()
				})
			break
		case "find":
			let token = req.body.token
			getUserPromise(token)
				.then((result) => {
					let response = {
						"status": "success"
					}
					res.status(200).json(response).send()
				})
				.catch((err) => {
					let response = {
						"status": "failure",
						"reason": err
					}
					res.status(500).json(response).send()
				})
		default:
			let response = {
				"status": "undefined",
				"message": "no request has been sent"
			}
			res.status(200).json(response).send()
			return
	}

}

export let handleGetUserRequest = (req, res) => {
	console.log(req.body)
	let user = {
		"id": req.body.id,
	}
	getUserPromise(user)
		.then((result) => {
			let response = {
				"status": "success"
			}
			res.status(200).json(response).send()
		})
		.catch((err) => {
			let response = {
				"status": "failure",
				"reason": err
			}
			res.status(500).json(response).send()
		})
}

export let testRoutePost = (req, res) => {
	console.log(req.body)
	let com = new Communication()
	let data = {
		"to": "/topics/online",
		"data": {
			"test": false,
			"value": "Hello World"
		}
	}
	com.sendPushNotificationPromise(data)
		.then((result) => {
			console.log(result)
			let response = {
				"status": "success",
				"result": result
			}
			res.status(200).json(result).send()
		})
		.catch((err) => {
			res.status(500).send(err)
		})
}