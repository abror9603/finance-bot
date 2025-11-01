const { Bot } = require('grammy');
const { languageMiddleware, changeLanguage } = require('./middlewares/i18n');
const { 
  getLanguageKeyboard, 
  getMainMenuKeyboard,
  getSettingsKeyboard 
} = require('./keyboards/language');

const bot = new Bot(process.env.BOT_TOKEN);

// Middleware
bot.use(languageMiddleware);

// ==================== COMMANDS ====================

// /start command
bot.command('start', async (ctx) => {
  try {
    console.log('📍 /start command received');
    
    const message = `${ctx.t('welcome.title')}\n\n${ctx.t('welcome.description')}`;
    
    await ctx.reply(message, {
      reply_markup: getMainMenuKeyboard(ctx.lang)
    });

    console.log('✅ Start message sent');
  } catch (error) {
    console.error('❌ Start command error:', error);
    await ctx.reply('Xatolik yuz berdi. Iltimos /start ni qayta bosing.');
  }
});

// /language command
bot.command('language', async (ctx) => {
  try {
    await ctx.reply(
      ctx.t('welcome.choose_language'),
      {
        reply_markup: getLanguageKeyboard()
      }
    );
  } catch (error) {
    console.error('❌ Language command error:', error);
  }
});

// /help command
bot.command('help', async (ctx) => {
  const helpText = `
🤖 *Yordam*

*Buyruqlar:*
/start - Botni qayta boshlash
/language - Tilni o'zgartirish
/help - Yordam

*Xarajat qo'shish:*
\`50000 oziq-ovqat\`
\`30000 transport\`

*Kategoriyalar:*
🍔 oziq-ovqat
🚗 transport
🏠 kommunal
🎮 o'yin-kulgi
💊 sog'liq
📚 ta'lim
🛍 xarid
📦 boshqa
  `;

  await ctx.reply(helpText, { parse_mode: 'Markdown' });
});

// ==================== CALLBACK QUERIES ====================

// Til tanlash
bot.callbackQuery(/^lang_(.+)$/, async (ctx) => {
  const newLang = ctx.match[1]; // uz, ru, en
  
  try {
    console.log(`🌍 Changing language to: ${newLang}`);
    
    // Database'da tilni o'zgartirish
    await changeLanguage(ctx.from.id, newLang);
    
    // Context'ni yangilash
    ctx.user.language = newLang;
    ctx.lang = newLang;
    
    // ctx.t funksiyasini yangilash
    const i18n = require('./utils/i18n');
    ctx.t = (key, params) => i18n.translate(newLang, key, params);
    
    await ctx.answerCallbackQuery({
      text: '✅',
      show_alert: false
    });
    
    // Xabarni yangilash
    await ctx.editMessageText(ctx.t('welcome.language_set'));
    
    // Yangi menyuni ko'rsatish
    setTimeout(async () => {
      await ctx.reply(
        ctx.t('menu.main'),
        {
          reply_markup: getMainMenuKeyboard(newLang)
        }
      );
    }, 500);
    
    console.log('✅ Language changed successfully');
  } catch (error) {
    console.error('❌ Language change error:', error);
    await ctx.answerCallbackQuery({
      text: 'Xatolik yuz berdi',
      show_alert: true
    });
  }
});

// Sozlamalar
bot.callbackQuery('settings_language', async (ctx) => {
  try {
    await ctx.editMessageText(
      ctx.t('settings.change_language'),
      {
        reply_markup: getLanguageKeyboard()
      }
    );
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('❌ Settings language error:', error);
  }
});

// Orqaga
bot.callbackQuery('back_to_menu', async (ctx) => {
  try {
    await ctx.deleteMessage().catch(() => {});
    
    await ctx.reply(
      ctx.t('menu.main'),
      {
        reply_markup: getMainMenuKeyboard(ctx.lang)
      }
    );
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('❌ Back to menu error:', error);
  }
});

// ==================== TEXT HANDLERS ====================

// Sozlamalar tugmasi
bot.hears([/⚙️ Sozlamalar/, /⚙️ Настройки/, /⚙️ Settings/], async (ctx) => {
  try {
    await ctx.reply(
      ctx.t('settings.title'),
      {
        reply_markup: getSettingsKeyboard(ctx.lang)
      }
    );
  } catch (error) {
    console.error('❌ Settings handler error:', error);
  }
});

// Statistika tugmasi
bot.hears([/📊 Statistika/, /📊 Статистика/, /📊 Statistics/], async (ctx) => {
  try {
    const message = `${ctx.t('stats.title')}\n\n` +
      `${ctx.t('stats.total_expense', { amount: '0' })}\n` +
      `${ctx.t('stats.total_income', { amount: '0' })}\n` +
      `${ctx.t('stats.balance', { amount: '0' })}`;
    
    await ctx.reply(message);
  } catch (error) {
    console.error('❌ Stats handler error:', error);
  }
});

// Xarajat qo'shish tugmasi
bot.hears([/💸 Xarajat qo'shish/, /💸 Добавить расход/, /💸 Add Expense/], async (ctx) => {
  try {
    await ctx.reply(ctx.t('expense.add'));
  } catch (error) {
    console.error('❌ Add expense handler error:', error);
  }
});

// ==================== ERROR HANDLER ====================

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`❌ Error while handling update ${ctx.update.update_id}:`);
  console.error('Error:', err.error);
  
  if (ctx) {
    ctx.reply('❌ Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.')
      .catch(() => console.error('Failed to send error message'));
  }
});

module.exports = bot;