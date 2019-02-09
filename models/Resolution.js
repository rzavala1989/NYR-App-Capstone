const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Import Schema
const ResolutionSchema = new Schema({
    title: {
        type: String,
        required:true
    },
    body:{
        type: String,
        required: true
    },
    status: {
        type: String,
        default:'incomplete'
    },
    updates: [{
        updateBody: {
          type: String,
          required: true
        },
        updateUser: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        updateDate:{
          type: Date,
          default: Date.now
        }
      }],
      user:{
        type: Schema.Types.ObjectId,
        ref:'users'
      },
      date:{
        type: Date,
        default: Date.now
      },
      name: {
          type: String
      }
});

const Resolution = mongoose.model('resolutions', ResolutionSchema);


//for testing purposes

module.exports = {Resolution}

//title
//email.id for user that created it
//date-create Date.now
//description
//What is the motivation behind making this change?
//updates -give new date, report on progress, create an array and push into 
//Have you met this resolution? boolean

//if met, any advice - (clientside now)