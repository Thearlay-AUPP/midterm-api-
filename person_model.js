const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema(
    {  
      
       name: { type: String },
       pass: { type: String },
       role: { type: String },
       stat: { type: Number }
    }, 
    {
       timestamps: true
    }
    );

const Person = mongoose.model("personlist", PersonSchema)
module.exports = Person 