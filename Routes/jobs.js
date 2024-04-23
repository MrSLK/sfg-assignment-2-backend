const controller = require("../Controllers/jobs.controller");

module.exports = (app) => {

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/add-job", controller.createJob);
  app.post("/edit-job", controller.editJob);
  app.post("/remove-job", controller.deleteJob);
  app.post("/fetch-one-job", controller.fetchOneJob);
  app.get("/fetch-all-jobs", controller.fetchAllJob);
  app.post("/fetch-jobs-on-condition", controller.fectchHiredJobs);
  
}
