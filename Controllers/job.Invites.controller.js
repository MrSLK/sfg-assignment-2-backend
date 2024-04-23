const models = require("../Models");
const { generateCustomID } = require("../Helpers/generateID");

exports.inviteDriver = async (req, res) => {

  const body = {
    _id: generateCustomID(),
    invitedAt: new Date(),
    updatedAt: new Date(),
    driverId: req.body.driverId,
    hirerId: req.body.hirerId,
    description: req.body.description,
    jobTitle: req.body.jobTitle,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    employmentType: req.body.employmentType,
    location: req.body.location,
    inviteStatus: req.body.jobsStatus,
    pay: req.body.pay
  }

  const inviteId = await models.jobInvites.create(body);

  return res.status(201).json({ message: "Successfully invited driver" });
}

exports.updateInvite = async (req, res) => {

  const existingInvite = await models.jobInvites.findOne({ _id: req.body.inviteId })

  if (!existingInvite) return res.status(404).json({ message: "Invite not found" });

  const body = {
    updatedAt: new Date(),
    driverId: req.body.driverId,
    hirerId: req.body.hirerId,
    description: req.body.description,
    jobTitle: req.body.jobTitle,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    employmentType: req.body.employmentType,
    location: req.body.location,
    inviteStatus: req.body.jobsStatus,
    pay: req.body.pay
  }

  const inviteId = await models.jobInvites.updateOne({ _id: req.body.inviteId }, body);

  return res.status(201).json({ message: "Successfully invited driver" });
}

exports.fetchInvite = async (req, res) => {

  const invites = await models.jobInvites.aggregate([
    { $match: { $or: [{ driverId: req.body.userId }, { hirerId: req.body.userId }] } },
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
      $lookup:
      {
        from: "users",
        localField: "hirerId",
        foreignField: "_id",
        as: "hirer",
      },
    },
    {
      $unwind:
      {
        path: "$hirer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        invitedAt: 1,
        updatedAt: 1,
        driverId: 1,
        hirerId: 1,
        description: 1,
        jobTitle: 1,
        startDate: 1,
        endDate: 1,
        employmentType: 1,
        location: 1,
        inviteStatus: 1,
        pay: 1,
        "driver.profile": 1,
        "hirer.profile": 1
      },
    }
  ]);

  return res.status(200).json({ invites });
};

exports.fetchOneInvite = async (req, res) => {

  const invites = await models.jobInvites.aggregate([
    { $match: { _id: req.body.inviteId } },
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
      $lookup:
      {
        from: "users",
        localField: "hirerId",
        foreignField: "_id",
        as: "hirer",
      },
    },
    {
      $unwind:
      {
        path: "$hirer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        invitedAt: 1,
        updatedAt: 1,
        driverId: 1,
        hirerId: 1,
        description: 1,
        jobTitle: 1,
        startDate: 1,
        endDate: 1,
        employmentType: 1,
        location: 1,
        inviteStatus: 1,
        pay: 1,
        "driver.profile": 1,
        "hirer.profile": 1
      },
    }
  ]);

  console.log("invites ->", invites)

  return res.status(200).json({ invites });
};

exports.retractInvite = async (req, res) => {

  await models.jobInvites.deleteOne({ _id: req.body.inviteId })

  return res.status(200).message("Successfully retracted invite")
}

exports.acceptInvite = async (req, res) => {

  const { inviteId, decision } = req.body

  const invite = await models.jobInvites.findOne({ _id: inviteId });

  if (!invite) return res.status(404).message("Invite not found");

  const updateRes = await models.jobInvites.updateOne({ _id: inviteId }, { $set: { driverId: invite.driverId, jobStatus: decision ? "hired" : "declined" } })
  console.log("update res: " + updateRes)

  if (!decision) return res.status(200).json({ message: "Job Declined" })
  let body = {}
  body = {
    _id: generateCustomID(),
    jobTitle: invite.jobTitle,
    employmentType: invite.employmentType,
    location: invite.location,
    startDate: invite.startDate,
    endDate: invite.endDate,
    description: invite.description,
    hirerId: invite.hirerId,
    jobsStatus: "hired",
    pay: invite.pay,
    driverId: invite.driverId,
    dateHired: new Date()
  }

  await models.Jobs.create(body)

  return res.status(200).json({ message: "Job Accepted" })
}
