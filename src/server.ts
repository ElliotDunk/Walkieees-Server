import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import mongoose from "mongoose";
import mongooseConfig from "./config/mongoose.config";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import passportConfig from "./config/passport.config";
import walkRoutes from "./routes/walk.route";
import walkReviewRoutes from "./routes/walksReviews.route";
import authenticationRoutes from "./routes/authentication.route";
import subscriptionRoutes from "./routes/subscription.route";
import accountRoutes from "./routes/account.route";
import contactRoutes from "./routes/contact.route";
import mappingRoutes from "./routes/mapping.route";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

const app: Express = express();
const MongoStore = require("connect-mongo")(expressSession);
//Configure dotenv for environment variables
dotenv.config();
app.use(bodyParser.json());
//TODO: Session may need to be set to strict in prod (doesn't work for twitter in dev)
app.use(
  expressSession({
    name: "Session",
    secret: process.env.SESSION_SECRET as string,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE as string) as number,
      signed: true,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: "https://localhost:3000" }));
//Below routes require preflight cors access
app.options("/api/authenticate/login", cors());
app.options("/api/authenticate/logout", cors());
app.options("/api/authenticate/register", cors());
app.options("/api/authenticate/facebook", cors());

//Mongoose Config
mongooseConfig();

//Passport Config
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

//Routes
app.use("/api/walks", walkRoutes);
app.use("/api/walkreviews", walkReviewRoutes);
app.use("/api/authenticate", authenticationRoutes);
app.use("/api/subscribe", subscriptionRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/map", mappingRoutes);

app.use(express.static(path.join(__dirname, "../client")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

//Start Server
const privateKey = fs.readFileSync("sslcert/server.key", "utf8");
const certificate = fs.readFileSync("sslcert/server.cert", "utf8");
const credentials = { key: privateKey, cert: certificate };

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.PORT || 8080);
httpsServer.listen(process.env.PORT || 8443);
