const controller = require("../Controllers/users.controller");

module.exports = (app) => {

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/login", controller.login);
  app.post("/signup", controller.signup);
  app.post("/update-profile", controller.updateProfile);
  app.get("/fetch-all-drivers", controller.fetchAllDrivers);
  app.get("/fetch-all-hirers", controller.fetchAllHirers);
}
