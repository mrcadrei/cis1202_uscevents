//PACKAGES
var express = require('express'),
    bodyParser = require('body-parser'),
	cookieParser = require("cookie-parser"),
	mongoose = require('mongoose'),
	expressSanitizer = require('express-sanitizer'),
	passport = require("passport"),
	methodOverride = require('method-override'),
	flash = require("connect-flash"),
	session = require("express-session"),
	passportLocalMongoose = require("passport-local-mongoose"),
	localStrategy = require("passport-local"),
	app = express();

const { ObjectId } = require('mongoose');

//MODELS
var Register = require("./models/userregister"),
    Post = require('./models/eventpost'),
	Volunteer = require('./models/volunteers'),
	postDB = require('./seed');

//CONNECT TO DATABASE
mongoose.connect('mongodb://localhost/postdb', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

//INITIALIZATION
app.use(express.json());
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));

//SEED
postDB();

app.use(require("express-session")({
	secret: "It is a secret.",
	resave: false,
	saveUninitialized: false
}));

//AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Register.authenticate()));
passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());

app.use(flash());
app.use(function(req, res, next){
	res.locals.currentRegister = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})

/*-----------ROUTING-----------*/

//LOGIN
app.get("/", (req, res) => {
	res.locals.title = "USC EVENTS | Login";
	res.render("login");
});

//LOGIN LOGIC HANDLING
app.post("/userlog", passport.authenticate('local', {
	successRedirect: "/index",
	failureRedirect: "/",
}), function(req, res){
});

//REGISTER
app.get("/register", function (req, res) {
	res.locals.title = "USC Events | Register";
	res.render("register");
});

//REGISTER LOGIC HANDLING
app.post("/register", function (req, res) {
	Register.register(new Register({
		username: req.body.username}),
		req.body.password,
		(error, user) => {
			if(error) {
				console.log(error);
				return res.render("register");
			}else{
				console.log(user);
				res.redirect("/");
			}
		});
});

//LOGOUT
app.get("/", function(req, res){
	req.logout();
	req.flash("success", "Logged out.");
	res.redirect("/");
});

//AUTHENTICATION
function authCheck(req, res, next){
	if(req.isAuthenticated()) { 
		req.isLogged = true;
		return next();
	}
	res.redirect("/");
}

app.get("/index", authCheck, (req, res) => {
	Post.find({}, (error, post) => {
		if(error) {
			console.log(error);
		} else {
			console.log(post);
			res.render("index", {post: post, currentRegister: req.user});
		}
	});
});

app.get("/index/:id/single", authCheck, (req, res) => {
	Post.find({}, (error, post) => {
		if(error) {
			console.log(error);
		} else {
			Post.findById(req.params.id, (error, values) => {
				if(error) {
					console.log(error);
				} else {
					console.log(post);
					res.render("single", {post: post, values: values, currentRegister: req.user});
				}
			});
		}
	});
});

app.get("/createvolunteersindex", authCheck, (req, res) => {
	Volunteer.find({}, (error, volunteer) => {
		if(error) {
			console.log(error);
		} else {
			console.log(volunteer);
			res.render("createvolunteersindex", {volunteer: volunteer, currentRegister: req.user});
		}
	});
});

app.post("/index", function(req, res) {
	req.body.volunteer.body = req.sanitize(req.body.volunteer.body);
	Volunteer.create(req.body.volunteer, (error, newVolunteer) => {
		if(error) {
			console.log(error);
		} else {
			console.log(newVolunteer);
			Post.find({}, (error, post) => {
				if(error) {
					console.log(error);
				} else {
					console.log(post);
					res.render("index", {post: post, currentRegister: req.user});
				}
			});
		}
	});
});

app.delete("/createvolunteersindex/:id", (req, res) => {
	Volunteer.findByIdAndRemove(req.params.id, (error) => {
		if(error) {
			console.log(error);
			res.redirect("/index");
		} else {
			res.redirect("/createvolunteersindex");
		}
	});
});

app.get("/createpostsindex", authCheck, function(req, res){
	Post.find({}, (error, post) => {
		if(error) {
			console.log(error);
		} else {
			console.log(post);
			res.render("createpostsindex", {post: post, currentRegister: req.user});
		}
	});
});

app.post("/createpostsindex", function(req, res) {
	req.body.post.body = req.sanitize(req.body.post.body);
	Post.create(req.body.post, (error, newPost) => {
		if(error) {
			console.log(error);
		} else {
			console.log(newPost);
			res.redirect("/createpostsindex");
		}
	});
});

app.delete("/createpostsindex/:id", (req, res) => {
	Post.findByIdAndRemove(req.params.id, (error) => {
		if(error) {
			console.log(error);
			res.redirect("/index");
		} else {
			res.redirect("/createpostsindex");
		}
	});
});

app.get("/createpostsindex/:id/editpost" ,(req, res) => {
	Post.findById(req.params.id, (error, post) => {
		if(error) {
			console.log(error);
			res.redirect("/createpostsindex");
		} else {
			res.render("editpost", {post: post});
		}
	});
});

app.put("/createpostsindex/:id", (req, res) => {
	req.body.post.body = req.sanitize(req.body.post.body);
	Post.findByIdAndUpdate(req.params.id, req.body.post, (error, updatedPost) => {
		if(error) {
			console.log(error);
			res.redirect("/createpostsindex");
		} else {
			console.log(updatedPost);
			res.redirect("/createpostsindex");
		}
	});
});

app.get("/createposts", authCheck, function(req, res){
	res.render("createposts", {currentRegister: req.user});
});

app.get('*', function(req, res){
	res.send("<h3>ERROR 404</h3><p>The URL you requested is not found.</p>");
});

app.listen(3000, function(){
	console.log("Server is running.");
});