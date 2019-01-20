const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

let options = {
    errorMessages: {
     IncorrectPasswordError: 'Password is incorrect',
     IncorrectUsernameError: 'Username is incorrect'
    }
};

UserSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", UserSchema);