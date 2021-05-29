"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function mongooseConfig() {
    //DB Connection
    mongoose_1.default.set("useCreateIndex", true);
    mongoose_1.default.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    // If DB successfully connected
    mongoose_1.default.connection.on("connected", () => {
        console.log("Established Mongoose Connection");
    });
    // If DB connection throws an error
    mongoose_1.default.connection.on("error", (err) => {
        console.error("Mongoose Default Connection Error : " + err);
    });
}
exports.default = mongooseConfig;
