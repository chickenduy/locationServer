import mongo from 'mongodb';

const mongoClient = mongo.MongoClient

const uri = "mongodb+srv://chickenduy:LeAnh2000!@locationstorage-mlqqq.mongodb.net/test?retryWrites=true&w=majority";
const DB = "data"

let conn = null
let db = null

export async function openDb () {
	if (!conn) {
		conn = mongoClient.connect(uri, {"useNewUrlParser":true,  "useUnifiedTopology": true,})
	}
	if (!db) {
		return conn.then(conn => {
			db = conn.db(DB)
			return db
		})
	}
	return Promise.resolve(db)
}