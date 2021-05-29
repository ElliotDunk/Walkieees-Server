"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_config_1 = __importDefault(require("./config/mongoose.config"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_config_1 = __importDefault(require("./config/passport.config"));
const walk_route_1 = __importDefault(require("./routes/walk.route"));
const authentication_route_1 = __importDefault(require("./routes/authentication.route"));
const subscription_route_1 = __importDefault(require("./routes/subscription.route"));
const account_route_1 = __importDefault(require("./routes/account.route"));
const contact_route_1 = __importDefault(require("./routes/contact.route"));
const mapping_route_1 = __importDefault(require("./routes/mapping.route"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const app = express_1.default();
const MongoStore = require("connect-mongo")(express_session_1.default);
//Congifure dotenv for enviroment variables
dotenv_1.default.config();
app.use(body_parser_1.default.json());
//TODO: Session may need to be set to strict in prod (doesnt work for twtitter in dev)
app.use(express_session_1.default({
    name: "Session",
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE),
        signed: true,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    },
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose_1.default.connection }),
}));
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors_1.default({ credentials: true, origin: "https://localhost:3000" }));
//Below routes require preflight cors access
app.options("/api/authenticate/login", cors_1.default());
app.options("/api/authenticate/logout", cors_1.default());
app.options("/api/authenticate/register", cors_1.default());
app.options("/api/authenticate/facebook", cors_1.default());
//Mongoose Config
mongoose_config_1.default();
//Passport Config
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_config_1.default();
//Routes
app.use("/api/walks", walk_route_1.default);
app.use("/api/authenticate", authentication_route_1.default);
app.use("/api/subscribe", subscription_route_1.default);
app.use("/api/account", account_route_1.default);
app.use("/api/contact", contact_route_1.default);
app.use("/api/map", mapping_route_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../client")));
app.get("/*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "../client", "index.html"));
});
//Start Server
const privateKey = fs_1.default.readFileSync("sslcert/server.key", "utf8");
const certificate = fs_1.default.readFileSync("sslcert/server.cert", "utf8");
const credentials = { key: privateKey, cert: certificate };
// const httpServer = http.createServer(app);
const httpsServer = https_1.default.createServer(credentials, app);
// httpServer.listen(process.env.PORT || 8080);
httpsServer.listen(process.env.PORT || 8443);
