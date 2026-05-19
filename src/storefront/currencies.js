// Currency configuration. Base currency is JOD.
// Edit the `rate` values when market rates change.
// rate = how many units of this currency equal 1 JOD.

export const CURRENCIES = {
  JOD: {
    code: 'JOD',
    country: 'JO',
    countryName: { en: 'Jordan', ar: 'الأردن' },
    name: { en: 'Jordanian Dinar', ar: 'دينار أردني' },
    symbol: 'JOD',
    flag: '🇯🇴',
    rate: 1,
    decimals: 2,
    // Round display to nearest N units (e.g. 100 SYP). 0 = no rounding.
    roundTo: 0,
  },
  SYP: {
    code: 'SYP',
    country: 'SY',
    countryName: { en: 'Syria', ar: 'سوريا' },
    name: { en: 'Syrian Pound', ar: 'ليرة سورية' },
    symbol: 'ل.س',
    flag: '🇸🇾',
    rate: 18000,
    decimals: 0,
    roundTo: 500,
  },
  IQD: {
    code: 'IQD',
    country: 'IQ',
    countryName: { en: 'Iraq', ar: 'العراق' },
    name: { en: 'Iraqi Dinar', ar: 'دينار عراقي' },
    symbol: 'د.ع',
    flag: '🇮🇶',
    rate: 1850,
    decimals: 0,
    roundTo: 50,
  },
};

export const COUNTRY_TO_CURRENCY = {
  SY: 'SYP',
  IQ: 'IQD',
  JO: 'JOD',
};

export const DEFAULT_CURRENCY = 'JOD';
