"use strict";
/** Dependency Injection */
const express = require("express"),
    session = require("express-session"), //
    cookieParser = require("cookie-parser"),
    { DB_URL, PORT, ENV } = require('./config/config'),
    cors = require("cors"),
    { connect, connection } = require('mongoose'),
    { createServer } = require("http"),
    { urlencoded, json } = require('express'),
    AdminRoutes = require('./routes/adminroutess');
/** /Dependency Injection */

/** Socket.IO */
const app = express(); // Initializing ExpressJS
const server = createServer(app);
// Allow Cross Domain Requests

try {
    /** MongoDB Connection */
    connect(DB_URL, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });
    connection.on("error", error => console.error("Error in MongoDb connection: " + error));
    connection.on("reconnected", () => console.log("Trying to reconnect!"));
    connection.on("disconnected", () => console.log("MongoDB disconnected!"));
    connection.on("connected", () => {
        /** Middleware Configuration */
        app.disable("x-powered-by");
        app.use(urlencoded({ limit: "100mb", extended: true })); // Parse application/x-www-form-urlencoded
        app.use(json({ limit: "100mb" })); // Initializing/Configuration
        app.use(cookieParser("karthikeyanSiteCookies")); // cookieParser - Initializing/Configuration cookie: {maxAge: 8000},
        app.use(session({ secret: "karthikeyanSiteCookies", resave: true, saveUninitialized: true })); // express-session - Initializing/Configuration
        app.set("view engine", "html");
        app.locals.pretty = true;
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "*");
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });
        app.use(cors({ origin: true, credentials: true }));
        /** /Middleware Configuration */

        /** Dependency Mapping */
        app.use('/admin', AdminRoutes());
        /** /Dependency Mapping*/

        /** HTTP Server Instance */
        server.listen(PORT, () => { console.log("Server turned on with", ENV, "mode on port", PORT); });
    });
} catch (ex) {
    console.log(ex);
}
/** /MongoDB Connection */