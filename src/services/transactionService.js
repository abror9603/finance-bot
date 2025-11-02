const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { detectCategory } = require("../utils/categories");

class TransactionService {
  // Xarajat qo'shish
  async addExpense(telegramId, amount, categoryText, note = "") {
    try {
      // User'ni topish
      const user = await User.findOne({ telegramId });

      if (!user) {
        throw new Error("User not found");
      }

      // Kategoriyani aniqlash
      const category = detectCategory(categoryText, user.language);

      // Tranzaksiya yaratish
      const transaction = await Transaction.create({
        userId: user._id,
        telegramId: telegramId,
        amount: amount,
        type: "expense",
        category: category,
        note: note,
      });

      return {
        success: true,
        transaction: transaction,
        category: category,
      };
    } catch (error) {
      console.error("Add expense error:", error);
      throw error;
    }
  }

  // Daromad qo'shish
  async addIncome(telegramId, amount, note = ''){
    try {
      const user = await User.findOne({telegramId})
      if (!user) {
        throw new Error("User not found");
      }

      const transaction = await Transaction.create({
        userId: user._id,
        telegramId: telegramId,
        amount: amount,
        type: 'income',
        category: 'income',
        note: note
      });
      
      return {
        success: true,
        transaction: transaction
      };
    } catch (error) {
      console.error('Add income error:', error);
      throw error;
    }
  }

  // Bugungi statistika
  async getTodayStats(telegramId){
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Transaction.aggregate([
      {
        $match: {
          telegramId: telegramId,
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])

    const result = {
      expense: 0,
      income: 0,
      balance: 0,
      expenseCount: 0,
      incomeCount: 0
    };
    
    stats.forEach(stat => {
      if (stat._id === 'expense') {
        result.expense = stat.total;
        result.expenseCount = stat.count;
      } else if (stat._id === 'income') {
        result.income = stat.total;
        result.incomeCount = stat.count;
      }
    });
    
    result.balance = result.income - result.expense;
    
    return result;
  }

  // Oxirgi N ta tranzaksiya
  async getRecentTransactions(telegramId, limit = 10) {
    return await Transaction.find({ telegramId })
      .sort({ date: -1 })
      .limit(limit)
      .lean();
  }
}

module.exports = new TransactionService();
