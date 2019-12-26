import crypto from "crypto";
import { createUserPromise, patchUserPromise, getAllRecentUsersPromise, getUserPromise, authenticateUserPromise } from "./model/users"
import Communication from "./communication";
import { shuffleFisherYates } from "./helpers";

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

export let handleAggregationRequest = (req, res) => {

	let com = new Communication()
	let data = {
		"to": "/topics/online",
		"data": {
			"request": "ping",
		},
		"time_to_live " : 120
	}
	com.sendPushNotificationPromise(data)
		.catch((err) => {
			res.status(500).send(err)
		})

	/**
	 * Wait for a while after pinging devices to get active devices
	 */
	setTimeout(() => {
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

		/**
		 * get all active devices
		 */
		getAllRecentUsersPromise()
			.then((users) => {
				let response = {
					"status": "success",
					"message": `We have ${users.length} participants`
				}
				res.status(200).json(response).send()



				//TODO: call aggregation function
				/**
				 * start actual aggregation request
				 */
				users.forEach((user) => {
					let request = {
						"to": user.id,
						"data": {
							"request": "request",
							"users": shuffleFisherYates(users)
						},
						"time_to_live " : 120
					}
					com.sendPushNotificationPromise(request)
						.then(() => {
							console.log(`Send request to ${user.id}`)
						})
						.catch((err) => {
							console.log(err)
						})
				})

			})
			.catch((err) => {
				let response = {
					"status": "failure",
					"message": err
				}
				res.status(500).json(response).send()
			})
	}, 1000 * 60)
}

export let handleCreateUserRequest = (req, res) => {
	console.log(req.body)
	let request = req.body.request

	let random = Math.random().toString(36)
	let password = crypto.createHash("sha256").update(random).digest().toString()

	let user = {
		"id": req.body.id,
		"publicKey": req.body.publicKey,
		"password": password,
		"lastSeen": Date.now()
	}
	createUserPromise(user)
		.then((result) => {
			let response = {
				"status": "success",
				"message": result,
				"id": user.id,
				"publicKey": user.publicKey,
				"password": random,
				"lastSeen": user.lastSeen
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

export let handleUpdateUserRequest = (req, res) => {
	console.log(req.body)
	let id = req.body.id
	let password = req.body.password

	authenticateUserPromise(id, password)
		.then((user) => {
			patchUserPromise(id)
				.then((result) => {
					let response = {
						"status": "success",
						"message": result
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
		})
		.catch((err) => {
			let response = {
				"status": "failure",
				"reason": err
			}
			res.status(500).json(response).send()
		})
}

export let handlePingedUserRequest = (req, res) => {
	console.log(req.body)
	let id = req.body.id
	let password = req.body.password

	authenticateUserPromise(id, password)
		.then((user) => {
			patchUserPromise(id)
				.then((result) => {
					let response = {
						"status": "success",
						"message": result
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

export let authenticateUser = (req, res, next) => {
	let id
	let password

	if (req.method === "GET") {
		id = req.query.publicKey
		password = req.query.password
	} else {
		id = req.body.publicKey
		password = req.body.password
	}

	authenticateUserPromise(id, password)
		.then(() => {
			next()
		})
		.catch((err) => {
			let result = {
				"status": "failiure",
				"message": "couldn't authenticate"
			}
			res.status(500).json(result).send()
		})
}