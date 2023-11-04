const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const rolesSchema = new mongoose.Schema(
    {
        
    },
    {
        collection: "AdminRoles",
        versionKey: false,
        timestamps: true,
        autoCreate: false,
    }
);

rolesSchema.plugin(AutoIncrement, { id: "id_seq", inc_field: "id" });

module.exports = mongoose.model("AdminRoles", rolesSchema);
