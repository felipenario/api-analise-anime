let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reviewSchema = new Schema({
    anime: {type: String, require: true},
    description: {type: String, require: true},
    user: {type: String, require: true}
});

module.exports = mongoose.model('Review', reviewSchema);
