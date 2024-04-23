const models = require("../Models");

const aggregate = [
  {
    $lookup:
    {
      from: "users",
      localField: "driverId",
      foreignField: "_id",
      as: "driver",
    },
  },
  {
    $unwind:
    {
      path: "$driver",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 1,
      addedAt: 1,
      updatedAt: 1,
      driverId: 1,
      licenseType: 1,
      licenseCode: 1,
      firstIssued: 1,
      expiryDate: 1,
      countryIssued: 1,
      description: 1,
      basedIn: 1,
      "driver.profile": 1
    },
  },
]

exports.createDriverProfile = async (req, res) => {

  const body = {
    _id: req.body.driverId,
    addedAt: new Date(),
    driverId: req.body.driverId,
    licenseType: req.body.licenseType,
    licenseCode: req.body.licenseCode,
    firstIssued: req.body.firstIssued,
    expiryDate: req.body.expiryDate,
    countryIssued: req.body.countryIssued,
    description: req.body.description,
    basedIn: req.body.basedIn,
  };

  const existingDriverProfile = await models.License.findOne({ driverId: req.body.driverId });

  if (existingDriverProfile) {
    delete body["addedAt"]
    body["updatedAt"] = new Date();

    await models.License.updateOne({ driverId: req.body.driverId }, {$set: body})
    return res.status(200).json({ message: "Driver profile updated successfully!" });
  } else {
    await models.License.create(body);
    return res.status(201).json({ message: "Driver profile created successfully!" });
  }
}

exports.getDriverProfile = async (req, res) => {

  const driverProfile = await models.License.aggregate([{
    $match: { driverId: req.body.driverId }
  }, ...aggregate])

  const profile = driverProfile[0];

  return res.status(200).json({ profile });
};

exports.updateDriverProfile = async (req, res) => {

  const {
    driverId,
    licenseType,
    licenseCode,
    firstIssued,
    expiryDate,
    countryIssued,
    description
  } = req.body;

  const driverProfile = await models.License.findOne({ _id: driverId });

  if (!driverProfile) return res.status(404).json({ message: 'Driver profile not found' });

  const body = {
    ...driverProfile,
    updatedAt: new Date(),
    driverId,
    licenseType,
    licenseCode,
    firstIssued,
    expiryDate,
    countryIssued,
    description,
  };

  if (driverId !== driverProfile.driverId) return res.status(400).json({ message: "Incorrect driver profile to be updated"});
  const response = await models.License.update({ _id: driverId }, { $set: body})

  if (response.modifiedCount > 0) return res.status(200).json({ mesaage: "successfully updated profile" })
  
  return res.status(400).json({ mesaage: "Failed to update driver profile" })
}
