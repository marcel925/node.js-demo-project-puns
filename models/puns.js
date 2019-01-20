const mongoose = require("mongoose");

let punSchema = new mongoose.Schema({
    name: String,
    description: String,
    upvotes: [],
    downvotes: [],
    totalVotes: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Pun", punSchema);