const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '----Not available----'
    },
    cat: {
        type: String,
        enum: ['Technology','Electronics','Physics','Chemistry','Mathematics','Fiction','Philosophy','Language','Arts','Other'],
        required: true
    },
    copies: {
        type: Number,
        min: 1,
        max: 1000,
        required: true
    },
}, {
    timestamps: true
});
var Books = mongoose.model('Book',bookSchema);

module.exports=Books;