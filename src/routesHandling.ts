import crypto from "crypto";
import Communication from "./communication";
import { shuffleFisherYates } from "./helpers";

import * as user from './model/users';
import * as crowd from './model/crowd';
import { startAggregation } from './model/requests';

const GROUP_SIZE = 1

/**
 * This is a basic function that returns a JSON "Hello world!"
 * @param req 
 * @param res 
 */
export let basicRequest = (req, res) => {
	res.set({
		'Content-Type': 'application/json'
	})
	res.status(200)
		.send({
			"test": "Hello world!"
		})
}

/**
 * This handles an incoming aggregation request
 * @param req 
 * @param res 
 */
export let handleAggregationRequest = (req, res) => {
	let com = new Communication()
	if(!req.type) {
		let aggregationRequest = {
			"type" : req.type,
			"start" : Date.now(),
			"end" : 0,
			"group" : []
		}
	}
	else {
		let response = {
			"status": "failure",
			"source": "handleAggregationRequest",
			"message": "Request doesn't conform to format"
		}
		res.status(500).json(response).send()
		return
	}

	// let timeA = req.query.timeA
	// let timeB = req.query.timeB
	// /**
	//  * request: position, steps, location, activity
	//  */
	// let request = req.query.request
	// /**
	//  * activity: walk, run, bike, vehicle
	//  */
	// let activity = req.query.activity
	// let radius = req.query.activity

	crowd.getAllCrowdPromise()
		.then((users) => {
			let tokens = []
			users.forEach((user) => {
				tokens.push(user.id)
			})
			com.getPresence(tokens)
				.then((result) => {
					let onlineUsers = []
					let users = result.presence
					users.forEach(user => {
						if (user.online) {
							onlineUsers.push(user.id)
							//patchUserPromise(user.id)
						}
					})
					onlineUsers = shuffleFisherYates(onlineUsers)

					let counter = 0
					let groups = [[]]
					while (onlineUsers.length) {
						groups[counter] = onlineUsers.splice(0, 1)
						counter++
					}

					// TODO: Start Aggregation
					startAggregation(0, groups)


					//
					let response = {
						"onlineUsers": onlineUsers,
						"groups": groups
					}
					res.status(200).json(response).send(`You have ${onlineUsers.length} participants`)
				})
				.catch((err) => {
					let response = {
						"status": "failure",
						"source": "getPresence",
						"message": err
					}
					res.status(500).json(response).send()
				})
		})
		.catch((err) => {
			let response = {
				"status": "failure",
				"source": "getAllUsers",
				"message": err
			}
			res.status(500).json(response).send()
		})
}

/**
 * 
 * @param req 
 * @param res 
 */
export let handleGetAggregationResult = (req, res) => {

}

/**
 * Handles incoming create crowd request
 * @param req 
 * @param res 
 */
export let handleCreateCrowdRequest = (req, res) => {
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
	crowd.createCrowdPromise(user)
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
				"source": "createUserPromise",
				"reason": err
			}
			res.status(500).json(response).send()
		})
}

/**
 * Handle incoming ping to update timestamp of crowd
 * @param req 
 * @param res 
 */
export let handleUpdateCrowdRequest = (req, res) => {
	console.log(req.body)
	let id = req.body.id
	let password = req.body.password

	crowd.authenticateCrowdPromise(id, password)
		.then((user) => {
			crowd.patchCrowdPromise(id)
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
						"source": "patchUserPomise",
						"reason": err
					}
					res.status(500).json(response).send()
				})
		})
		.catch((err) => {
			let response = {
				"status": "failure",
				"source": "autheticateUserPromise",
				"reason": err
			}
			res.status(500).json(response).send()
		})
}

/**
 * 
 * @param req 
 * @param res 
 */
export let handlePingedCrowdRequest = (req, res) => {
	console.log(req.body)
	let id = req.body.id
	let password = req.body.password

	crowd.authenticateCrowdPromise(id, password)
		.then((user) => {
			crowd.patchCrowdPromise(id)
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
						"source": "patchUserPromise",
						"reason": err
					}
					res.status(500).json(response).send()
				})
		})
		.catch((err) => {
			let response = {
				"status": "failure",
				"source": "authenticateUserPromise",
				"reason": err
			}
			res.status(500).json(response).send()
		})
}

/**
 * Authenticate the crowd with stored Pushy token and password
 * @param req 
 * @param res 
 * @param next 
 */
export let authenticateCrowd = (req, res, next) => {
	let id
	let password

	/**
	 * Extract token and password from request
	 */
	if (req.method === "GET") {
		id = req.query.publicKey
		password = req.query.password
	} else {
		id = req.body.publicKey
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
			res.status(500).json(result).send()
		})
}

/**
 * Authenticate user with stored username and password
 * @param req 
 * @param res 
 * @param next 
 */
export let authenticateUser = (req, res, next) => {
	let username
	let password
	/**
	 * Extract token and password from request
	 */
	if (req.method === "GET") {
		username = req.query.username
		password = req.query.password
	} else {
		username = req.body.username
		password = req.body.password
	}
	if(!username || !password) {
		let result = {
			"status": "failure",
			"source": "authenticateUser",
			"message": "Missing username/password"
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