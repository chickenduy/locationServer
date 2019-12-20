import mongo, { MongoClient } from 'mongodb';

const mongoClient = mongo.MongoClient

const uri = "mongodb+srv://chickenduy:LeAnh2000!@locationstorage-mlqqq.mongodb.net/test?retryWrites=true&w=majority";
const DB = "data"

let conn = null
let db: mongo.Db = null

export function openDb () {
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
			mongoClient.connect(uri, {"useNewUrlParser":true})
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