const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config()


const db = mongoose.createConnection(`mongodb+srv://shiba:${process.env.DB_PASSWORD}@cluster0.zw05f.mongodb.net/drive-share?retryWrites=true&w=majority&appName=Cluster0`);

const UsersSchema = mongoose.Schema({
  "_id": {
    type: String,
  },
  "createdAt": Date,
  "updatedAt": Date,
  "password": String,
  "accountActive": Boolean,
  "profile": {
    "firstName": String,
    "lastName": String,
    "email": String,
    "cellNumber": String,
    "idNumber": String,
    "role": String
  }
})
const JobsSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: Date,
  description: String,
  jobTitle: String,
  startDate: Date,
  endDate: String,
  hirerId: String,
  employmentType: String,
  location: String,
  jobsStatus: String,
  pay: Number,
  driverId: String,
  dateHired: Date
})

const LicenseSchema = mongoose.Schema({
  _id: { type: String },
  addedAt: Date,
  updatedAt: Date,
  driverId: String,
  licenseType: String,
  licenseCode: String,
  firstIssued: Date,
  expiryDate: Date,
  countryIssued: String,
  description: String,
  basedIn: String,
});

const JobApplicationsSchema = mongoose.Schema({
  "_id": {
    type: String,
  },
  createdAt: Date,
  updatedAt: Date,
  applicantId: String,
  jobId: String,
})

const jobInvitesSchema = mongoose.Schema({
  "_id": {
    type: String,
  },
  invitedAt: Date,
  updatedAt: Date,
  driverId: String,
  description: String,
  jobTitle: String,
  startDate: Date,
  endDate: String,
  hirerId: String,
  employmentType: String,
  location: String,
  inviteStatus: String,
  pay: Number
})

const Users = db.model('users', UsersSchema, 'users');
const Jobs = db.model('jobs', JobsSchema, 'jobs');
const License = db.model('Licenses', LicenseSchema, 'Licenses');
const JobApplications = db.model('job-applications', JobApplicationsSchema, 'job-applications');
const jobInvites = db.model('job-invites', jobInvitesSchema, 'job-invites'); 


module.exports = {
  Users,
  Jobs,
  License,
  JobApplications,
  jobInvites
}
