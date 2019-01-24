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
    comments: [{
        commentBody: {
          type: String,
          required: true
        },
        commentDate:{
          type: Date,
          default: Date.now
        },
        commentUser:{
          type: Schema.Types.ObjectId,
          ref:'users'
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

mongoose.model('resolutions', ResolutionSchema);

//title
//email.id for user that created it
//date-create Date.now
//description
//What is the motivation behind making this change?
//updates -give new date, report on progress, create an array and push into 
//Have you met this resolution? boolean

//if met, any advice - (clientside now)