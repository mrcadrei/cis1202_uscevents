var mongoose = require('mongoose');

var VolunteerSchema = new mongoose.Schema({
    idnumber: String,
    firstname: String,
    lastname: String,
    department: String,
    course: String,
    year: String,
    email: String,
    contact: String,
    eventname: String,
    role: String
});

module.exports = mongoose.model("Volunteer", VolunteerSchema);