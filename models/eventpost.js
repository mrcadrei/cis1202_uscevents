var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    author: String,
    title: String,
    body: String,
    image: String,
    category: String,
    date: String
});

module.exports = mongoose.model("Post", PostSchema);