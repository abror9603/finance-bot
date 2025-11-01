const User = require('../models/User');
const i18n = require('../utils/i18n');

async function languageMiddleware(ctx, next) {
  try {
    // Foydalanuvchi ma'lumotlarini olish yoki yaratish
    if (ctx.from) {
      let user = await User.findOne({ telegramId: ctx.from.id });

      if (!user) {
        // Yangi foydalanuvchi
        const userLang = ctx.from.language_code === 'ru' ? 'ru' : 'uz';
        
        user = await User.create({
          telegramId: ctx.from.id,
          username: ctx.from.username,
          firstName: ctx.from.first_name,
          lastName: ctx.from.last_name,
          language: userLang
        });

        console.log(`✅ New user created: ${user.telegramId} (${userLang})`);
      } else {
        // Mavjud foydalanuvchi - faolligini yangilash
        user.lastActive = new Date();
        await user.save();
      }

      // Context ga qo'shish
      ctx.user = user;
      ctx.lang = user.language;

      // ctx.t funksiyasini qo'shish
      ctx.t = (key, params) => {
        return i18n.translate(user.language, key, params);
      };

      console.log(`👤 User: ${user.telegramId}, Lang: ${user.language}`);
    }

    await next();
  } catch (error) {
    console.error('❌ Language middleware error:', error);
    
    // Fallback
    ctx.t = (key, params) => i18n.translate('uz', key, params);
    
    await next();
  }
}

// Tilni o'zgartirish funksiyasi
async function changeLanguage(userId, newLang) {
  try {
    const user = await User.findOneAndUpdate(
      { telegramId: userId },
      { language: newLang },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    console.log(`✅ Language changed: ${userId} -> ${newLang}`);
    return user;
  } catch (error) {
    console.error('❌ Change language error:', error);
    throw error;
  }
}

module.exports = {
  languageMiddleware,
  changeLanguage
};