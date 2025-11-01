const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { detectCategory } = require("../utils/categories");

class TransactionService {
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
}
