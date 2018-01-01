var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var NoteSchema = new Schema({

    title: String,
    note: String,
    type: Schema.Types.ObjectId,
});


var Note = mongoose.model("Note", NoteSchema);


