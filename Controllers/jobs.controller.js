const models = require("../Models");
const { generateCustomID } = require("../Helpers/generateID");

const aggregate = [
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
      jobTitle: 1,
      startDate: 1,
      endDate: 1,
      hirerId: 1,
      employmentType: 1,
      location: 1,
      description: 1,
      pay: 1,
      driverId: 1,
      jobStatus: 1,
      "hirer.profile": 1
    },
  },
] 

exports.createJob = async (req, res) => {

  const values = {
    _id: generateCustomID(),
    jobTitle: req.body.jobTitle,
    employmentType: req.body.employmentType,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    hirerId: req.body.hirerId,
    jobsStatus: req.body.jobsStatus,
    pay: req.body.pay,
  };

  await models.Jobs.create(values).then(response => {
    if (!response) return res.status(400).json({ message: "Failed to save job" });
    return res.status(201).json({ message: "Job saved successfully" });
  }).catch(err => {
    console.log(err)
  });
};

exports.editJob = async (req, res) => {

  const job = await models.Jobs.find({ _id: req.body.jobId });
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const values = {
    updatedAt: new Date(),
    jobTitle: req.body.jobTitle,
    employmentType: req.body.employmentType,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    hirerId: req.body.hirerId,
    jobsStatus: req.body.jobsStatus,
    pay: req.body.pay,
  }

  if(req.body.driverId) values.driverId = req.body.driverId;

  await models.Jobs.update({ _id: job_id}, { $set: values });

  return res.status(200).json({ message: "Job updated successfully" });
}

exports.deleteJob = async (req, res) => {

  const { jobId } = req.body;
  const job = await models.Jobs.find({ _id: jobId });
  if (!job) return res.status.json({ message: 'Job not found' });

  await models.Jobs.deleteOne({ _id: jobId });

  return res.status(200).json({ message: "Job updated successfully" });
}

exports.fetchOneJob = async (req, res) => {
  const job = await models.Jobs.aggregate([...aggregate, {
    $match: { _id: req.body.jobId }
  }]);
  const oneJob = job[0]
  return res.status(200).json({ job: oneJob });
}

exports.fetchAllJob = async (req, res) => {
  const jobs = await models.Jobs.aggregate(aggregate)


  return res.status(200).json({ jobs });
}

exports.fectchHiredJobs = async (req, res) => {
  console.log("body ->", req.body)

  const hiredJobs = await models.Jobs.aggregate([{ $match: { jobsStatus: req.body.jobStatus, hirerId: req.body.hirerId } }, {
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
        jobTitle: 1,
        startDate: 1,
        endDate: 1,
        hirerId: 1,
        employmentType: 1,
        location: 1,
        description: 1,
        pay: 1,
        driverId: 1,
        jobStatus: 1,
        dateHired: 1,
        "driver.profile": 1
      },
    }])

  console.log("hiredJobs ->", hiredJobs)
  return res.status(200).json({ hiredJobs})
}
