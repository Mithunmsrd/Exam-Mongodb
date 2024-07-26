const { Schema } = require('mongoose')
const { model } = require('mongoose')
const user = new Schema({
    ApplicationID: { type: String, required: true },
    CandidateName: { type: String, required: true },
    JobPosition: {type: String, required: true },  
    ApplicationDate: {type: String, required: true},
    Status: {type: String, required: true}
})
const Job = model("apply", user)
module.export = Job;