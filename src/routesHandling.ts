import crypto from "crypto";
import { getAllUsersPromise, createUserPromise, patchUserPromise, getAllRecentUsersPromise, getUserPromise, authenticateUserPromise } from "./model/users"
import Communication from "./communication";
import { shuffleFisherYates } from "./helpers";

const GROUP_SIZE = 1

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


	getAllUsersPromise()
		.then((users) => {
			let tokens = []
			users.forEach((user) => {
				tokens.push(user.id)
			})
			com.getPresence(tokens)
				.then((result) => {
					let onlineUsers = []
					let users = result["presence"]
					users.forEach(user => {
						if (user.online) {
							onlineUsers.push(user.id)
							//patchUserPromise(user.id)
						}
					})
					onlineUsers = shuffleFisherYates(onlineUsers)

					// // TODO: Start aggregation
					// let numberOfGroups = Math.ceil(onlineUsers.length / GROUP_SIZE)
					// let groups = []
					// let start = 0
					// let end = GROUP_SIZE
					// for (let i = 0; i < numberOfGroups; i++) {
					// 	groups[i].push(onlineUsers.slice(start, end))
					// 	start = start + GROUP_SIZE
					// 	end = end + GROUP_SIZE
					// 	if (end > onlineUsers.length) {
					// 		end = onlineUsers.length
					// 	}
					// }
					let response = {
						"onlineUsers": result,
						//"groups": groups
					}
					res.status(200).json(response).send(`You have ${onlineUsers.length} participants`)
				})
				.catch((err) => {
					let response = {
						"status": "failure",
						"source" : "getPresence",
						"message": err
					}
					res.status(500).json(response).send()
				})
		})
		.catch((err) => {
			let response = {
				"status": "failure",
				"source" : "getAllUsers",
				"message": err
			}
			res.status(500).json(response).send()
		})
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
				"source" : "createUserPromise",
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
						"source" : "patchUserPomise",
						"reason": err
					}
					res.status(500).json(response).send()
				})
		})
		.catch((err) => {
			let response = {
				"status": "failure",
				"source" : "autheticateUserPromise",
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
						"source" : "patchUserPromise",
						"reason": err
					}
					res.status(500).json(response).send()
				})
		})
		.catch((err) => {
			let response = {
				"status": "failure",
				"source" : "authenticateUserPromise",
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
	com.sendNotificationPromise(data)
		.then((result) => {
			console.log(result)
			let response = {
				"status": "success",
				"result": result
			}
			res.status(200).json(result).send()
		})
		.catch((err) => {
			let response = {
				"status" : "failure",
				"source" : "getPresence",
				"message" : err
			}
			res.status(500).json(response).send(err)
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
				"status": "failure",
				"source" : "authenticateUserPromise",
				"message": err
			}
			res.status(500).json(result).send()
		})
}