import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
{
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true,
    collection: "registrations"
}
);

// Prevent duplicate registration
registrationSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

// Faster queries
registrationSchema.index({ event_id: 1 });
registrationSchema.index({ user_id: 1 });

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;