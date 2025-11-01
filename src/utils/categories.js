// Kategoriyalar va ularning sinonim nomlari
const categories = {
  uz: {
    'food': ['oziq-ovqat', 'ovqat', 'non', 'taom', 'restoran', 'kafe', 'eda'],
    'transport': ['transport', 'taxi', 'taksi', 'metro', 'avtobus', 'benzin', 'yoqilg\'i'],
    'utilities': ['kommunal', 'elektr', 'gaz', 'suv', 'internet', 'telefon'],
    'entertainment': ['o\'yin-kulgi', 'kulgi', 'kino', 'teatr', 'konsert', 'o\'yin'],
    'health': ['sog\'liq', 'dorixona', 'shifokor', 'dori', 'klinika', 'hospital'],
    'education': ['ta\'lim', 'o\'qish', 'maktab', 'universitet', 'kurs', 'kitob'],
    'shopping': ['xarid', 'kiyim', 'oyoq-kiyim', 'magazin', 'market'],
    'other': ['boshqa', 'boshqalar', 'har xil']
  },
  ru: {
    'food': ['продукты', 'еда', 'ресторан', 'кафе', 'питание'],
    'transport': ['транспорт', 'такси', 'метро', 'автобус', 'бензин'],
    'utilities': ['коммунальные', 'электричество', 'газ', 'вода', 'интернет'],
    'entertainment': ['развлечения', 'кино', 'театр', 'концерт'],
    'health': ['здоровье', 'аптека', 'врач', 'лекарства'],
    'education': ['образование', 'учеба', 'курсы', 'книги'],
    'shopping': ['покупки', 'одежда', 'магазин'],
    'other': ['другое', 'прочее']
  },
  en: {
    'food': ['food', 'restaurant', 'cafe', 'meal', 'groceries'],
    'transport': ['transport', 'taxi', 'metro', 'bus', 'fuel'],
    'utilities': ['utilities', 'electricity', 'gas', 'water', 'internet'],
    'entertainment': ['entertainment', 'cinema', 'theater', 'concert'],
    'health': ['health', 'pharmacy', 'doctor', 'medicine'],
    'education': ['education', 'school', 'course', 'books'],
    'shopping': ['shopping', 'clothes', 'store'],
    'other': ['other', 'misc']
  }
};

// Kategoriyani aniqlash funksiyasi
function detectCategory(text, lang = 'uz') {
  text = text.toLowerCase().trim();
  
  const langCategories = categories[lang] || categories.uz;
  
  for (const [category, keywords] of Object.entries(langCategories)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'other'; // Default
}

// Kategoriya nomini olish (tarjimali)
function getCategoryName(category, lang = 'uz') {
  const i18n = require('./i18n');
  return i18n.translate(lang, `expense.categories.${category}`);
}

// Barcha kategoriyalar ro'yxati
function getAllCategories() {
  return ['food', 'transport', 'utilities', 'entertainment', 'health', 'education', 'shopping', 'other'];
}

module.exports = {
  detectCategory,
  getCategoryName,
  getAllCategories
};