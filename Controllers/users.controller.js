const models = require("../Models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateCustomID } = require("../Helpers/generateID");

const generateToken = (payload) => {
  return jwt.sign({ id: payload }, 'w', { expiresIn: '8h' })   // *issue: setting secret to .env.JWT_SECRET == undefined
}

const createNewUser = async (values) => {
  const body = {
    _id: generateCustomID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    password: bcrypt.hashSync(values.password, 8),
    accountActive: true,
    profile: {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      cellNumber: values.cellNumber,
      role: values.role
    }
  };

  const user = await models.Users.create(body);

  return user;
}

exports.signup = async (req, res) => {
  const values = {
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    cellNumber: req.body.cellNumber,
    role: req.body.role,
  };
  const existingUser = await models.Users.find({ "profile.email": values.email });
  if (existingUser.length > 0) return res.status(401).json({ message: "Account already exists" });
  const user = await createNewUser(values)
  if (user) {
    let payload = {
      user_id: user._id,
      role: user.role
    }
    const token = generateToken(JSON.stringify(payload)); //jwt token
    return res.status(201).json({ _id: user._id, profile: user.profile, token });
  } else {
    return res.status(400).json({ message: "Internal Server Error" })
  }
}

exports.login = async (req, res) => {
  models.Users.findOne({
    "profile.email": req.body.email,
  }).then(response => {
    if (!response) {
      return res.status(401).send({ message: "User Not found." });
    } else {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        response.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      if (!response.accountActive) return res.status(401).send({ message: "Account is locked by admin, for further information, please reach out to admin@driveshare.com" });

      const payload = {
        user_id: response._id,
        role: response.role
      }
      const token = generateToken(JSON.stringify(payload)); //jwt token
      return res.status(201).json({
        _id: response._id, profile: response.profile, token
      });
    }
  }).catch(err => {
    console.log(err)
  });
};

exports.updateProfile = async (req, res) => {

  const userId = req.body.userId;
  const user = await models.Users.findOne({ _id: userId });
  if (!user) return res.status(404).json({ message: "user not found" });

  if (req.body.email !== user.profile.email) {
    const newEmailExist = await models.Users.find({ "profile.email": req.body.email });
    if (newEmailExist.length > 0) return res.status(401).json({ message: "Account already exists" });
  }
  const result = await models.Users.updateOne({ _id: userId }, {
    $set: {
      updatedAt: new Date(),
      profile: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        cellNumber: req.body.cellNumber,
        role: req.body.role || user.profile.role,
        idNumber: req.body.idNumber
      }
    }
  });

  const updatedUser = await models.Users.findOne({ _id: userId });

  return res.status(200).json({ message: "successfully updated profile", userId, profile: updatedUser.profile })
}

exports.fetchAllDrivers = async (req, res) => {

  const drivers = await models.License.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "driver",
      },
    },
    {
      $unwind: {
        path: "$driver",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        driverId: 1,
        licenseCode: 1,
        licenseType: 1,
        firstIssued: 1,
        expiryDate: 1,
        description: 1,
        countryIssued: 1,
        basedIn: 1,
        "driver.profile": 1,
      },
    },
  ])

  return res.status(200).json({ drivers });
}

exports.fetchAllHirers = async (req, res) => {

  const drivers = await models.Users.find({ "profile.role": "hirer" });

  return res.status(200).json({ drivers });
}
