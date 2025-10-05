const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./src/auth_config.json");

const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;
const storyEndpoint =
  process.env.STORY_API_ENDPOINT ||
  "https://dev-a6a5q6irm.agentuity.run/0869fb10adad5aa7841eb834eccfda58";

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "{yourApiIdentifier}"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));
app.use(express.json({ limit: "2mb" }));
app.use(express.text({ type: ["text/plain", "text/*"], limit: "2mb" }));

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});

app.post("/api/story", async (req, res) => {
  try {
    const isTextPayload = typeof req.body === "string";
    const forwardHeaders = {
      "Content-Type": isTextPayload ? "text/plain" : "application/json",
    };
    const forwardBody = isTextPayload ? req.body : JSON.stringify(req.body ?? {});

    let response = await fetch(storyEndpoint, {
      method: "POST",
      headers: forwardHeaders,
      body: forwardBody,
    });

    if (!response.ok && response.status === 404 && isTextPayload && req.body) {
      response = await fetch(storyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: req.body }),
      });
    }

    const contentType = response.headers.get("content-type") || "application/json";
    const responseBuffer = await response.arrayBuffer();
    res.status(response.status).set("content-type", contentType).send(Buffer.from(responseBuffer));
  } catch (error) {
    console.error("Story proxy error:", error);
    res.status(500).json({ error: "Story proxy request failed", details: error.message });
  }
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
