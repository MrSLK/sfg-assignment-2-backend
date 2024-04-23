const controller = require("../Controllers/job.Invites.controller");

module.exports = (app) => {

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/invite-driver", controller.inviteDriver);
  app.post("/edit-invite", controller.updateInvite);
  app.post("/remove-invite", controller.retractInvite);
  app.post("/fetch-invite", controller.fetchInvite);
  app.post("/fetch-one-invite", controller.fetchOneInvite);
  app.post("/decide-on-job", controller.acceptInvite);
}
