var mongoose = require('mongoose'),
    passport = require("passport"),
    LocalStrategy = require("passport-local");

var Register = require("./models/userregister"),
    Post = require('./models/eventpost'),
    Volunteer = require('./models/volunteers');
    
passport.use(new LocalStrategy(Register.authenticate()));
passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());

/*
DEPT ACCOUNTS
usernames: SAS, SOE, SBE, SAFAD, SLG, SED, SHCP, SHS
*/

//ADMIN PER DEPARTMENT PASSWORD
var pass = "deptadmin";

var deptReg = [
    {
        username: "SAS",
        type: "Admin"
    },
    {
        username: "SOE",
        type: "Admin"
    },
    {
        username: "SBE",
        type: "Admin"
    },
    {
        username: "SAFAD",
        type: "Admin"
    },
    {
        username: "SLG",
        type: "Admin"
    },
    {
        username: "SED",
        type: "Admin"
    },
    {
        username: "SHCP",
        type: "Admin"
    },
    {
        username: "SHS",
        type: "Admin"
    },
]

var postIt = [
    {
        author: "Marc Andrei",

        title: "Welcome Party 2020",

        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

        image: "https://d14f1v6bh52agh.cloudfront.net/NE_m0f9MOK27wvKC2eWynXgR-BI=/fit-in/1400xorig/uploads/ATp93IxATNgOoG1BY51F2f3FZ4e7YKDNlf7w3f9U.jpeg",
        
        category: "Event",

        date: "January 1, 2020"
    },
    {
        author: "Arnold Loudel",

        title: "Just a USC Party 2020",

        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

        image: "https://blogmedia.evbstatic.com/wp-content/uploads/wpmulti/sites/8/shutterstock_199419065.jpg",
        
        category: "Event",

        date: "January 2, 2020"
    },
    {
        author: "Marc Andrei",

        title: "Gadja 2020",

        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

        image: "https://i2.wp.com/todayscarolinian.net/wp-content/uploads/2017/08/GADJA_Meets_UNITE_Article_Photo-2.jpg?resize=960%2C640&ssl=1",
        
        category: "Event",

        date: "January 3, 2020"
    }
]

var vol = [
    {
        firstname: "Amiel Joseph",

        lastname: "Lozada",

        department: "SAS",

        idnumber: "11111111",

        course: "BSCS",

        year: "2",

        email: "amiellozada182@gmail.com",

        contact: "0911 111 1111",

        eventname: "Welcome Party 2020",

        role: "Media"
    },
    {
        firstname: "Nigel",

        lastname: "Monsanto",

        department: "SAS",

        idnumber: "22222222",

        course: "BSCS",

        year: "2",

        email: "nigel.monsanto@gmail.com",

        contact: "0922 222 2222",

        eventname: "Gadja 2020",

        role: "Documentation"
    }
]

function postDB() {
    //REMOVE ALL POSTS
    Post.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("Removed Posts");
        //ADD POSTS
        postIt.forEach(function(seed){
            Post.create(seed, function(err){
                if(err) {
                    console.log(err)
                } else {
                    console.log("Post Added");
                }
            });
        });
    });
    //REMOVE ALL VOLUNTEERS
    Volunteer.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("Removed Volunteers");
        //ADD VOLUNTEERS
        vol.forEach(function(seed){
            Volunteer.create(seed, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("Volunteer Added");
                }
            });
        });
    });
    //REMOVE ALL USERS
    Register.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("Removed Accounts");
        //ADD ACCOUNTS
        deptReg.forEach(function(userSeed){
            Register.register(userSeed, pass, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("Account Added");
                }
            });
        });
    });
}

module.exports = postDB;