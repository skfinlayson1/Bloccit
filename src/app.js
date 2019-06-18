const express = require("express");
const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config");

const app = express();

appConfig.init();
routeConfig.init(app);

module.exports = app;