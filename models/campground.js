const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema ({
    title : String,
    image:String,
    category : String ,
    description : String,
    location : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
})

module.exports = mongoose.model('Campground' , CampgroundSchema);
