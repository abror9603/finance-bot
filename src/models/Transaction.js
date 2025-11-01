const { Schema, model, default: mongoose } = require("mongoose");

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
    // Telegram ID ham saqlaymiz (tezkor qidiruv uchun)
  telegramId: {
    type: Number,
    required: true,
    index: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true,
    default: 'expense'
  },
  
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  
  note: {
    type: String,
    trim: true
  },
  
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
},
{
    timestamps: true
});

// Compound index - tezkor statistika uchun
transactionSchema.index({telegramId: 1, date: -1});
transactionSchema.index({ telegramId: 1, type: 1, date: -1 })

// Virtual field - formatted amount
transactionSchema.virtual('formattedAmount').get(function(){
    return this.amount.toLocaleString('uz-UZ')
})

// Method - bugungi xarajatlarni olish
transactionSchema.statics.getTodayExpenses = async function(telegramId){
     const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await this.aggregate([
    {
      $match: {
        telegramId: telegramId,
        type: 'expense',
        date: { $gte: today, $lt: tomorrow }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result[0] || { total: 0, count: 0 };
}

module.exports = mongoose.model('Transaction', transactionSchema);