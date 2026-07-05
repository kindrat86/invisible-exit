/**
 * Language configuration for all 100 supported languages.
 * Each language has: ISO 639-1/3 code, English name, native name (autonym),
 * RTL flag, and BCP 47 tag for hreflang.
 */

export interface Language {
  /** URL path segment, e.g. "es", "zh", "pt-br" */
  code: string;
  /** BCP 47 tag for hreflang, e.g. "es-ES", "zh-CN" */
  hreflang: string;
  /** English name */
  name: string;
  /** Native name (autonym) for display in language switcher */
  nativeName: string;
  /** ISO 639-1 or ISO 639-3 code for translation API */
  iso: string;
  /** Right-to-left script */
  rtl: boolean;
  /** Emoji flag (best-effort; regional for diaspora languages) */
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", hreflang: "en", name: "English", nativeName: "English", iso: "en", rtl: false, flag: "🇬🇧" },
  { code: "zh", hreflang: "zh-CN", name: "Mandarin Chinese", nativeName: "简体中文", iso: "zh", rtl: false, flag: "🇨🇳" },
  { code: "hi", hreflang: "hi", name: "Hindi", nativeName: "हिन्दी", iso: "hi", rtl: false, flag: "🇮🇳" },
  { code: "es", hreflang: "es", name: "Spanish", nativeName: "Español", iso: "es", rtl: false, flag: "🇪🇸" },
  { code: "fr", hreflang: "fr", name: "French", nativeName: "Français", iso: "fr", rtl: false, flag: "🇫🇷" },
  { code: "ar", hreflang: "ar", name: "Arabic", nativeName: "العربية", iso: "ar", rtl: true, flag: "🇸🇦" },
  { code: "bn", hreflang: "bn", name: "Bengali", nativeName: "বাংলা", iso: "bn", rtl: false, flag: "🇧🇩" },
  { code: "pt", hreflang: "pt", name: "Portuguese", nativeName: "Português", iso: "pt", rtl: false, flag: "🇵🇹" },
  { code: "ru", hreflang: "ru", name: "Russian", nativeName: "Русский", iso: "ru", rtl: false, flag: "🇷🇺" },
  { code: "ur", hreflang: "ur", name: "Urdu", nativeName: "اردو", iso: "ur", rtl: true, flag: "🇵🇰" },
  { code: "id", hreflang: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", iso: "id", rtl: false, flag: "🇮🇩" },
  { code: "de", hreflang: "de", name: "German", nativeName: "Deutsch", iso: "de", rtl: false, flag: "🇩🇪" },
  { code: "ja", hreflang: "ja", name: "Japanese", nativeName: "日本語", iso: "ja", rtl: false, flag: "🇯🇵" },
  { code: "pcm", hreflang: "pcm", name: "Nigerian Pidgin", nativeName: "Naijá", iso: "pcm", rtl: false, flag: "🇳🇬" },
  { code: "mr", hreflang: "mr", name: "Marathi", nativeName: "मराठी", iso: "mr", rtl: false, flag: "🇮🇳" },
  { code: "te", hreflang: "te", name: "Telugu", nativeName: "తెలుగు", iso: "te", rtl: false, flag: "🇮🇳" },
  { code: "tr", hreflang: "tr", name: "Turkish", nativeName: "Türkçe", iso: "tr", rtl: false, flag: "🇹🇷" },
  { code: "ta", hreflang: "ta", name: "Tamil", nativeName: "தமிழ்", iso: "ta", rtl: false, flag: "🇮🇳" },
  { code: "vi", hreflang: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", iso: "vi", rtl: false, flag: "🇻🇳" },
  { code: "yue", hreflang: "yue", name: "Cantonese (Yue)", nativeName: "粵語", iso: "yue", rtl: false, flag: "🇭🇰" },
  { code: "pa", hreflang: "pa", name: "Western Punjabi", nativeName: "پنجابی", iso: "pa", rtl: true, flag: "🇵🇰" },
  { code: "ko", hreflang: "ko", name: "Korean", nativeName: "한국어", iso: "ko", rtl: false, flag: "🇰🇷" },
  { code: "fa", hreflang: "fa", name: "Persian (Farsi)", nativeName: "فارسی", iso: "fa", rtl: true, flag: "🇮🇷" },
  { code: "it", hreflang: "it", name: "Italian", nativeName: "Italiano", iso: "it", rtl: false, flag: "🇮🇹" },
  { code: "th", hreflang: "th", name: "Thai", nativeName: "ไทย", iso: "th", rtl: false, flag: "🇹🇭" },
  { code: "gu", hreflang: "gu", name: "Gujarati", nativeName: "ગુજરાતી", iso: "gu", rtl: false, flag: "🇮🇳" },
  { code: "kn", hreflang: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", iso: "kn", rtl: false, flag: "🇮🇳" },
  { code: "ml", hreflang: "ml", name: "Malayalam", nativeName: "മലയാളം", iso: "ml", rtl: false, flag: "🇮🇳" },
  { code: "or", hreflang: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", iso: "or", rtl: false, flag: "🇮🇳" },
  { code: "pl", hreflang: "pl", name: "Polish", nativeName: "Polski", iso: "pl", rtl: false, flag: "🇵🇱" },
  { code: "uk", hreflang: "uk", name: "Ukrainian", nativeName: "Українська", iso: "uk", rtl: false, flag: "🇺🇦" },
  { code: "nl", hreflang: "nl", name: "Dutch", nativeName: "Nederlands", iso: "nl", rtl: false, flag: "🇳🇱" },
  { code: "ro", hreflang: "ro", name: "Romanian", nativeName: "Română", iso: "ro", rtl: false, flag: "🇷🇴" },
  { code: "el", hreflang: "el", name: "Greek", nativeName: "Ελληνικά", iso: "el", rtl: false, flag: "🇬🇷" },
  { code: "cs", hreflang: "cs", name: "Czech", nativeName: "Čeština", iso: "cs", rtl: false, flag: "🇨🇿" },
  { code: "hu", hreflang: "hu", name: "Hungarian", nativeName: "Magyar", iso: "hu", rtl: false, flag: "🇭🇺" },
  { code: "sv", hreflang: "sv", name: "Swedish", nativeName: "Svenska", iso: "sv", rtl: false, flag: "🇸🇪" },
  { code: "fi", hreflang: "fi", name: "Finnish", nativeName: "Suomi", iso: "fi", rtl: false, flag: "🇫🇮" },
  { code: "no", hreflang: "no", name: "Norwegian", nativeName: "Norsk", iso: "no", rtl: false, flag: "🇳🇴" },
  { code: "da", hreflang: "da", name: "Danish", nativeName: "Dansk", iso: "da", rtl: false, flag: "🇩🇰" },
  { code: "he", hreflang: "he", name: "Hebrew", nativeName: "עברית", iso: "he", rtl: true, flag: "🇮🇱" },
  { code: "sw", hreflang: "sw", name: "Swahili", nativeName: "Kiswahili", iso: "sw", rtl: false, flag: "🇰🇪" },
  { code: "am", hreflang: "am", name: "Amharic", nativeName: "አማርኛ", iso: "am", rtl: false, flag: "🇪🇹" },
  { code: "so", hreflang: "so", name: "Somali", nativeName: "Soomaali", iso: "so", rtl: false, flag: "🇸🇴" },
  { code: "ha", hreflang: "ha", name: "Hausa", nativeName: "Hausa", iso: "ha", rtl: false, flag: "🇳🇬" },
  { code: "yo", hreflang: "yo", name: "Yoruba", nativeName: "Yorùbá", iso: "yo", rtl: false, flag: "🇳🇬" },
  { code: "ig", hreflang: "ig", name: "Igbo", nativeName: "Igbo", iso: "ig", rtl: false, flag: "🇳🇬" },
  { code: "zu", hreflang: "zu", name: "Zulu", nativeName: "isiZulu", iso: "zu", rtl: false, flag: "🇿🇦" },
  { code: "xh", hreflang: "xh", name: "Xhosa", nativeName: "isiXhosa", iso: "xh", rtl: false, flag: "🇿🇦" },
  { code: "af", hreflang: "af", name: "Afrikaans", nativeName: "Afrikaans", iso: "af", rtl: false, flag: "🇿🇦" },
  { code: "ms", hreflang: "ms", name: "Malay", nativeName: "Bahasa Melayu", iso: "ms", rtl: false, flag: "🇲🇾" },
  { code: "my", hreflang: "my", name: "Burmese", nativeName: "ဗမာ", iso: "my", rtl: false, flag: "🇲🇲" },
  { code: "km", hreflang: "km", name: "Khmer", nativeName: "ខ្មែរ", iso: "km", rtl: false, flag: "🇰🇭" },
  { code: "lo", hreflang: "lo", name: "Lao", nativeName: "ລາວ", iso: "lo", rtl: false, flag: "🇱🇦" },
  { code: "ne", hreflang: "ne", name: "Nepali", nativeName: "नेपाली", iso: "ne", rtl: false, flag: "🇳🇵" },
  { code: "si", hreflang: "si", name: "Sinhala", nativeName: "සිංහල", iso: "si", rtl: false, flag: "🇱🇰" },
  { code: "ps", hreflang: "ps", name: "Pashto", nativeName: "پښتو", iso: "ps", rtl: true, flag: "🇦🇫" },
  { code: "kk", hreflang: "kk", name: "Kazakh", nativeName: "Қазақша", iso: "kk", rtl: false, flag: "🇰🇿" },
  { code: "uz", hreflang: "uz", name: "Uzbek", nativeName: "Oʻzbekcha", iso: "uz", rtl: false, flag: "🇺🇿" },
  { code: "az", hreflang: "az", name: "Azerbaijani", nativeName: "Azərbaycan", iso: "az", rtl: false, flag: "🇦🇿" },
  { code: "ka", hreflang: "ka", name: "Georgian", nativeName: "ქართული", iso: "ka", rtl: false, flag: "🇬🇪" },
  { code: "hy", hreflang: "hy", name: "Armenian", nativeName: "Հայերեն", iso: "hy", rtl: false, flag: "🇦🇲" },
  { code: "mn", hreflang: "mn", name: "Mongolian", nativeName: "Монгол", iso: "mn", rtl: false, flag: "🇲🇳" },
  { code: "bo", hreflang: "bo", name: "Tibetan", nativeName: "བོད་སྐད", iso: "bo", rtl: false, flag: "🇨🇳" },
  { code: "ug", hreflang: "ug", name: "Uyghur", nativeName: "ئۇيغۇرچە", iso: "ug", rtl: true, flag: "🇨🇳" },
  { code: "tl", hreflang: "tl", name: "Tagalog", nativeName: "Tagalog", iso: "tl", rtl: false, flag: "🇵🇭" },
  { code: "ceb", hreflang: "ceb", name: "Cebuano", nativeName: "Cebuano", iso: "ceb", rtl: false, flag: "🇵🇭" },
  { code: "ilo", hreflang: "ilo", name: "Ilocano", nativeName: "Ilokano", iso: "ilo", rtl: false, flag: "🇵🇭" },
  { code: "jv", hreflang: "jv", name: "Javanese", nativeName: "Basa Jawa", iso: "jv", rtl: false, flag: "🇮🇩" },
  { code: "su", hreflang: "su", name: "Sundanese", nativeName: "Basa Sunda", iso: "su", rtl: false, flag: "🇮🇩" },
  { code: "mad", hreflang: "mad", name: "Madurese", nativeName: "Madhurâ", iso: "mad", rtl: false, flag: "🇮🇩" },
  { code: "nan", hreflang: "nan", name: "Min Nan", nativeName: "閩南語", iso: "nan", rtl: false, flag: "🇹🇼" },
  { code: "wuu", hreflang: "wuu", name: "Wu Chinese", nativeName: "吳語", iso: "wuu", rtl: false, flag: "🇨🇳" },
  { code: "hak", hreflang: "hak", name: "Hakka Chinese", nativeName: "客家話", iso: "hak", rtl: false, flag: "🇹🇼" },
  { code: "hmn", hreflang: "hmn", name: "Hmong", nativeName: "Hmoob", iso: "hmn", rtl: false, flag: "🇱🇦" },
  { code: "ku", hreflang: "ku", name: "Kurdish", nativeName: "Kurdî", iso: "ku", rtl: false, flag: "🇮🇶" },
  { code: "bal", hreflang: "bal", name: "Balochi", nativeName: "بلوچی", iso: "bal", rtl: true, flag: "🇵🇰" },
  { code: "tg", hreflang: "tg", name: "Tajik", nativeName: "Тоҷикӣ", iso: "tg", rtl: false, flag: "🇹🇯" },
  { code: "tk", hreflang: "tk", name: "Turkmen", nativeName: "Türkmen", iso: "tk", rtl: false, flag: "🇹🇲" },
  { code: "sq", hreflang: "sq", name: "Albanian", nativeName: "Shqip", iso: "sq", rtl: false, flag: "🇦🇱" },
  { code: "sr", hreflang: "sr", name: "Serbian", nativeName: "Српски", iso: "sr", rtl: false, flag: "🇷🇸" },
  { code: "hr", hreflang: "hr", name: "Croatian", nativeName: "Hrvatski", iso: "hr", rtl: false, flag: "🇭🇷" },
  { code: "bs", hreflang: "bs", name: "Bosnian", nativeName: "Bosanski", iso: "bs", rtl: false, flag: "🇧🇦" },
  { code: "sk", hreflang: "sk", name: "Slovak", nativeName: "Slovenčina", iso: "sk", rtl: false, flag: "🇸🇰" },
  { code: "sl", hreflang: "sl", name: "Slovenian", nativeName: "Slovenščina", iso: "sl", rtl: false, flag: "🇸🇮" },
  { code: "lt", hreflang: "lt", name: "Lithuanian", nativeName: "Lietuvių", iso: "lt", rtl: false, flag: "🇱🇹" },
  { code: "lv", hreflang: "lv", name: "Latvian", nativeName: "Latviešu", iso: "lv", rtl: false, flag: "🇱🇻" },
  { code: "et", hreflang: "et", name: "Estonian", nativeName: "Eesti", iso: "et", rtl: false, flag: "🇪🇪" },
  { code: "be", hreflang: "be", name: "Belarusian", nativeName: "Беларуская", iso: "be", rtl: false, flag: "🇧🇾" },
  { code: "bg", hreflang: "bg", name: "Bulgarian", nativeName: "Български", iso: "bg", rtl: false, flag: "🇧🇬" },
  { code: "mk", hreflang: "mk", name: "Macedonian", nativeName: "Македонски", iso: "mk", rtl: false, flag: "🇲🇰" },
  { code: "ca", hreflang: "ca", name: "Catalan", nativeName: "Català", iso: "ca", rtl: false, flag: "🇪🇸" },
  { code: "eu", hreflang: "eu", name: "Basque", nativeName: "Euskara", iso: "eu", rtl: false, flag: "🇪🇸" },
  { code: "gl", hreflang: "gl", name: "Galician", nativeName: "Galego", iso: "gl", rtl: false, flag: "🇪🇸" },
  { code: "cy", hreflang: "cy", name: "Welsh", nativeName: "Cymraeg", iso: "cy", rtl: false, flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "ga", hreflang: "ga", name: "Irish", nativeName: "Gaeilge", iso: "ga", rtl: false, flag: "🇮🇪" },
  { code: "gd", hreflang: "gd", name: "Scottish Gaelic", nativeName: "Gàidhlig", iso: "gd", rtl: false, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "br", hreflang: "br", name: "Breton", nativeName: "Brezhoneg", iso: "br", rtl: false, flag: "🇫🇷" },
  { code: "is", hreflang: "is", name: "Icelandic", nativeName: "Íslenska", iso: "is", rtl: false, flag: "🇮🇸" },
  { code: "lb", hreflang: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch", iso: "lb", rtl: false, flag: "🇱🇺" },
  { code: "mt", hreflang: "mt", name: "Maltese", nativeName: "Malti", iso: "mt", rtl: false, flag: "🇲🇹" },
];

export const DEFAULT_LANGUAGE = "en";

export const RTL_LANGUAGES = LANGUAGES.filter((l) => l.rtl).map((l) => l.code);

export const LANGUAGE_MAP = Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));

export function getLanguage(code: string): Language | undefined {
  return LANGUAGE_MAP[code];
}

export function isRTL(code: string): boolean {
  return RTL_LANGUAGES.includes(code);
}

/** Get all hreflang alternates for a given path (for SEO tags) */
export function getHreflangAlternates(path: string): Array<{ hreflang: string; href: string }> {
  const SITE = "https://invisibleexit.com";
  const cleanPath = path.replace(/^\//, "");
  const alts: Array<{ hreflang: string; href: string }> = [];

  for (const lang of LANGUAGES) {
    if (lang.code === DEFAULT_LANGUAGE) {
      alts.push({ hreflang: "en", href: cleanPath ? `${SITE}/${cleanPath}` : SITE });
    } else {
      alts.push({ hreflang: lang.hreflang, href: cleanPath ? `${SITE}/${lang.code}/${cleanPath}` : `${SITE}/${lang.code}` });
    }
  }
  // x-default
  alts.push({ hreflang: "x-default", href: cleanPath ? `${SITE}/${cleanPath}` : SITE });
  return alts;
}
