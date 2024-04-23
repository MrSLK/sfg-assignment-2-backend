const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json({ limit: '50mb' }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.get('/', (req, res) => {
  res.send("Welcome to the backend for the SFG assignment (DriveShare)");
});

require("./Routes/users")(app);
require("./Routes/jobs")(app);
require("./Routes/job.invite")(app);
require("./Routes/license")(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}.`);
});
