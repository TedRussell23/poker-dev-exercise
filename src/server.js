const Path = require("path");
const hapi = require("hapi");
const inert = require("inert");
const vision = require("vision");
const Ejs = require("ejs");
const routes = require("./routes");

// Configure the server
const server = hapi.Server({
  host: "0.0.0.0",
  port: process.env.PORT || 3000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, "..", "public")
    },
    state: {
      parse: true,
      failAction: "ignore"
    }
  }
});

const plugins = async () => {
  const pluginsToRegister = [inert, vision];
  await server.register(pluginsToRegister);
};

const init = async () => {
  await plugins();
  server.state("player", {
    ttl: null,
    clearInvalid: true,
    isSecure: false
  });
  server.views({
    engines: { ejs: Ejs },
    path: `${__dirname}/views`,
    layout: "layout"
  });
  await server.route(routes);
  return server;
};

const start = async () => {
  try {
    await init();
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(
    `Server running at: ${server.info.uri}, ${process.env.HOSTNAME ||
      "localhost"}`
  );
  console.log(`Environment: ${process.env.NODE_ENV || "dev"}`);
};

module.exports = { init, start };
