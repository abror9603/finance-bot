const { Schema, model } = require("mongoose");

const User = new Schema(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    username: String,
    firstName: String,
    lastName: String,

    // Til sozlamalari
    language: {
      type: String,
      enum: ["uz", "ru", "en"],
      default: "uz",
    },

    // Boshqa sozlamalar
    settings: {
      currency: {
        type: String,
        default: "UZS",
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      reminderTime: {
        type: String,
        default: "20:00",
      },
    },

    premium: {
      type: Boolean,
      default: false,
    },

    premiumUntil: Date,

    createdAt: {
      type: Date,
      default: Date.now,
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

User.methods.updateActivity = function(){
    this.lastActive = new Date();
    return this.save();
}

module.exports = model("User", User)
