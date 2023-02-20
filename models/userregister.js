var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var RegisterSchema = new mongoose.Schema({
	username: String,
	password: String,
	type: {type: String, default: "User"}
});

RegisterSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Register", RegisterSchema);
