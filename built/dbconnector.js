"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return __awaiter(this, void 0, void 0, function* () {
        if (!conn) {
            conn = mongoClient.connect(uri, { "useNewUrlParser": true, "useUnifiedTopology": true, });
        }
        if (!db) {
            return conn.then(conn => {
                db = conn.db(DB);
                return db;
            });
        }
        return Promise.resolve(db);
    });
}
exports.openDb = openDb;
//# sourceMappingURL=dbconnector.js.map