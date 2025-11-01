const { Keyboard, InlineKeyboard } = require("grammy");

// Til tanlash inline keyboard
function getLanguageKeyboard() {
  return new InlineKeyboard()
    .text("🇺🇿 O'zbekcha", "lang_uz")
    .text("🇷🇺 Русский", "lang_ru")
    .row()
    .text("🇬🇧 English", "lang_en");
}

// Asosiy menyu keyboard (har til uchun)
function getMainMenuKeyboard(lang) {
  const keyboards = {
    uz: new Keyboard()
      .text("💸 Xarajat qo'shish")
      .text("💰 Daromad qo'shish")
      .row()
      .text("📊 Statistika")
      .text("🎯 Maqsadlar")
      .row()
      .text("📋 Byudjet")
      .text("⚙️ Sozlamalar")
      .resized()
      .persistent(),

    ru: new Keyboard()
      .text("💸 Добавить расход")
      .text("💰 Добавить доход")
      .row()
      .text("📊 Статистика")
      .text("🎯 Цели")
      .row()
      .text("📋 Бюджет")
      .text("⚙️ Настройки")
      .resized()
      .persistent(),

    en: new Keyboard()
      .text("💸 Add Expense")
      .text("💰 Add Income")
      .row()
      .text("📊 Statistics")
      .text("🎯 Goals")
      .row()
      .text("📋 Budget")
      .text("⚙️ Settings")
      .resized()
      .persistent(),
  };

  return keyboards[lang] || keyboards.uz
}

// Sozlamalar inline keyboard
function getSettingsKeyboard(lang) {
  const keyboards = {
    uz: new InlineKeyboard()
      .text('🌍 Til', 'settings_language')
      .text('💱 Valyuta', 'settings_currency').row()
      .text('🔔 Bildirishnomalar', 'settings_notifications').row()
      .text('◀️ Orqaga', 'back_to_menu'),
    
    ru: new InlineKeyboard()
      .text('🌍 Язык', 'settings_language')
      .text('💱 Валюта', 'settings_currency').row()
      .text('🔔 Уведомления', 'settings_notifications').row()
      .text('◀️ Назад', 'back_to_menu'),
    
    en: new InlineKeyboard()
      .text('🌍 Language', 'settings_language')
      .text('💱 Currency', 'settings_currency').row()
      .text('🔔 Notifications', 'settings_notifications').row()
      .text('◀️ Back', 'back_to_menu')
  };
  
  return keyboards[lang] || keyboards.uz;
}

module.exports = {
  getLanguageKeyboard,
  getMainMenuKeyboard,
  getSettingsKeyboard
};
