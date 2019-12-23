"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const mongoClient = mongodb_1.default.MongoClient;
const uri = "mongodb+srv://chickenduy:LeAnh2000!@locationstorage-mlqqq.mongodb.net/test?retryWrites=true&w=majority";
const DB = "data";
let conn = null;
let db = null;
function openDb() {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (db) {
                resolve(db);
            }
            else {
                db = conn.db(DB);
                resolve(db);
            }
        }
        else {
            mongoClient.connect(uri, { "useNewUrlParser": true })
                .then((con) => {
                conn = con;
                db = con.db(DB);
                resolve(db);
            })
                .catch((err) => {
                reject(err);
            });
        }
    });
}
function getDb() {
    return new Promise((resolve, reject) => {
        if (!db) {
            openDb()
                .then((db) => {
                resolve(db);
            })
                .catch((err) => {
                reject(err);
            });
        }
        resolve(db);
    });
}
exports.getDb = getDb;
//# sourceMappingURL=dbconnector.js.map