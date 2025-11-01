const fs = require('fs');
const path = require('path');

class I18n {
  constructor() {
    this.translations = {};
    this.defaultLocale = 'uz';
    this.loadTranslations();
  }

  // Barcha tarjimalarni yuklash
  loadTranslations() {
    const localesDir = path.join(__dirname, '../locales');
    const files = fs.readdirSync(localesDir);

    files.forEach(file => {
      if (file.endsWith('.json')) {
        const locale = file.replace('.json', '');
        const filePath = path.join(localesDir, file);
        
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          this.translations[locale] = JSON.parse(content);
          console.log(`✅ Loaded translation: ${locale}`);
        } catch (error) {
          console.error(`❌ Error loading ${file}:`, error.message);
        }
      }
    });
  }

  // Nested object dan qiymat olish (welcome.title)
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, obj);
  }

  // Asosiy translate funksiyasi
  translate(locale, key, params = {}) {
    // Locale mavjud emasligini tekshirish
    if (!this.translations[locale]) {
      console.warn(`⚠️ Locale not found: ${locale}, using default: ${this.defaultLocale}`);
      locale = this.defaultLocale;
    }

    // Tarjimani olish
    let translation = this.getNestedValue(this.translations[locale], key);

    // Agar topilmasa - key qaytarish
    if (!translation) {
      console.warn(`⚠️ Translation not found: ${key} in ${locale}`);
      return key;
    }

    // Parametrlarni almashtirish {{amount}} -> 1000
    Object.keys(params).forEach(param => {
      const placeholder = new RegExp(`{{${param}}}`, 'g');
      translation = translation.replace(placeholder, params[param]);
    });

    return translation;
  }

  // Qisqa metod
  t(locale, key, params) {
    return this.translate(locale, key, params);
  }
}

// Singleton pattern
const i18n = new I18n();

module.exports = i18n;