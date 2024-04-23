const controller = require("../Controllers/license.controller");

module.exports = (app) => {

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/create-driver-profile", controller.createDriverProfile);
  app.post("/fetch-driver-profile", controller.getDriverProfile);
  app.post("/update-driver-profile", controller.updateDriverProfile);
}
