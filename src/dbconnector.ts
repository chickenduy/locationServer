import mongo, { MongoClient } from 'mongodb';

const mongoClient = mongo.MongoClient

/**
 * TODO: Add MongoDB connector
 */
const uri = "";
const DB = "data"

let conn = null
let db: mongo.Db = null

let openDb = () => {
	return new Promise<mongo.Db>((resolve, reject) => {
		if (conn) {
			if (db) {
				resolve(db)
			}
			else {
				db = conn.db(DB)
				resolve(db)
			}
		}
		else {
			mongoClient.connect(uri, {
				"useNewUrlParser": true,
				useUnifiedTopology: true
			})
				.then((con) => {
					conn = con
					db = con.db(DB)
					resolve(db)
				})
				.catch((err) => {
					reject(err)
				})
		}
	})
}

let getDb = () => {
	return new Promise<mongo.Db>((resolve, reject) => {
		if (!db) {
			openDb()
				.then((db) => {
					resolve(db)
				})
				.catch((err) => {
					reject(err)
				})
		}
		resolve(db)
	})
}

export {
	getDb
}