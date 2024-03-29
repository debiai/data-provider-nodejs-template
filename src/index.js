// Server
const express = require("express");
const cors = require("cors");
const path = require("path");
const Server = require("http").Server;
const OpenApiValidator = require("express-openapi-validator");

// Config
const config = require("./config.js").default;

// Create server
const app = express();
const server = new Server(app);

// Increase request size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Set up CORS
const corsConfig = { origin: true, credentials: true };
app.use(cors(corsConfig));

// Use JSON decoder for "application/json" body
app.use(express.json());

// Use OpenAPI validator
const DEBIAI_API_PATH = "./data-provider-API.yaml";
app.use(
  OpenApiValidator.middleware({
    apiSpec: DEBIAI_API_PATH,
    validateRequests: true,
    validateResponses: true,
    operationHandlers: path.join(__dirname),
  })
);

server.listen(config.service.port, async () => {
  console.log(
    `DebiAI data-provider service listening on port ${config.service.port}`
  );
  app.emit("ready");
});

exports.config = config;
exports.app = app;
exports.server = server;
