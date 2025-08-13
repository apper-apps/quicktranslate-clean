import translationsData from "@/services/mockData/translations.json";

class TranslationService {
  constructor() {
    this.translations = [...translationsData];
    this.mockTranslations = {
      "en-es": {
        "hello": "hola",
        "goodbye": "adiós",
        "thank you": "gracias",
        "please": "por favor",
        "yes": "sí",
        "no": "no",
        "good morning": "buenos días",
        "good night": "buenas noches",
        "how are you": "cómo estás",
        "hello, how are you?": "hola, ¿cómo estás?",
        "thank you very much": "muchas gracias",
        "excuse me": "disculpe",
        "where is the bathroom?": "¿dónde está el baño?",
        "how much does it cost?": "¿cuánto cuesta?",
        "i don't understand": "no entiendo",
        "can you help me?": "¿puedes ayudarme?",
        "see you later": "hasta luego"
      },
      "en-fr": {
        "hello": "bonjour",
        "goodbye": "au revoir",
        "thank you": "merci",
        "please": "s'il vous plaît",
        "yes": "oui",
        "no": "non",
        "good morning": "bonjour",
        "good night": "bonne nuit",
        "how are you": "comment allez-vous",
        "hello, how are you?": "bonjour, comment allez-vous?",
        "thank you very much": "merci beaucoup",
        "excuse me": "excusez-moi",
        "where is the bathroom?": "où sont les toilettes?",
        "how much does it cost?": "combien ça coûte?",
        "i don't understand": "je ne comprends pas",
        "can you help me?": "pouvez-vous m'aider?",
        "see you later": "à plus tard"
      },
      "en-de": {
        "hello": "hallo",
        "goodbye": "auf wiedersehen",
        "thank you": "danke",
        "please": "bitte",
        "yes": "ja",
        "no": "nein",
        "good morning": "guten morgen",
        "good night": "gute nacht",
        "how are you": "wie geht es dir",
        "hello, how are you?": "hallo, wie geht es dir?",
        "thank you very much": "vielen dank",
        "excuse me": "entschuldigung",
        "where is the bathroom?": "wo ist das badezimmer?",
        "how much does it cost?": "wie viel kostet das?",
        "i don't understand": "ich verstehe nicht",
        "can you help me?": "können sie mir helfen?",
        "see you later": "bis später"
      },
      "en-hi": {
        "hello": "नमस्ते",
        "goodbye": "अलविदा",
        "thank you": "धन्यवाद",
        "please": "कृपया",
        "yes": "हाँ",
        "no": "नहीं",
        "good morning": "सुप्रभात",
        "good night": "शुभ रात्रि",
        "how are you": "आप कैसे हैं",
        "hello, how are you?": "नमस्ते, आप कैसे हैं?",
        "thank you very much": "बहुत धन्यवाद",
        "excuse me": "माफ़ कीजिये",
        "where is the bathroom?": "बाथरूम कहाँ है?",
        "how much does it cost?": "यह कितने का है?",
        "i don't understand": "मुझे समझ नहीं आया",
        "can you help me?": "क्या आप मेरी मदद कर सकते हैं?",
        "see you later": "बाद में मिलते हैं"
      }
    };
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

async translate(text, sourceLang, targetLang) {
    if (!text || !text.trim()) {
      throw new Error("Text is required for translation");
    }

    if (sourceLang === targetLang) {
      throw new Error("Source and target languages cannot be the same");
    }

    try {
      // Construct Google Translate API URL
      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.trim())}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }

const data = await response.json();
      
      // Parse Google Translate response format using structured list selection
      // Response format: [[[translated_text, original_text, null, null, confidence]], null, source_lang, null, null, null, confidence]
      let translatedText = text;
      
      // Implement "select list item list" pattern - get first item from first list
      if (data && Array.isArray(data) && data.length > 0) {
        // Select list item (index 1) from main response array
        const translationList = data[0];
        
        if (Array.isArray(translationList) && translationList.length > 0) {
          // Select list item (index 1) from translation segments
          const firstTranslationSegment = translationList[0];
          
          if (Array.isArray(firstTranslationSegment) && firstTranslationSegment.length > 0) {
            // Extract translated text (first item in segment)
            translatedText = translationList.map(item => 
              Array.isArray(item) && item.length > 0 ? item[0] : ''
            ).join('');
          }
        }
      }

      const translation = {
        Id: this.getNextId(),
        sourceText: text,
        translatedText: translatedText,
        sourceLang: sourceLang,
        targetLang: targetLang,
        timestamp: new Date().toISOString()
      };

      this.translations.push(translation);
      return { ...translation };
      
    } catch (error) {
      // Fallback to mock translation if API fails
      console.warn('Google Translate API failed, using mock translation:', error.message);
      
      const translationKey = sourceLang === "auto" ? `en-${targetLang}` : `${sourceLang}-${targetLang}`;
      const textLower = text.toLowerCase().trim();
      
      let translatedText = text;
      
      if (this.mockTranslations[translationKey]) {
        const mockTranslation = this.mockTranslations[translationKey][textLower];
        if (mockTranslation) {
          translatedText = mockTranslation;
        } else {
          translatedText = this.generateMockTranslation(text, targetLang);
        }
      } else {
        translatedText = this.generateMockTranslation(text, targetLang);
      }

      const translation = {
        Id: this.getNextId(),
        sourceText: text,
        translatedText: translatedText,
        sourceLang: sourceLang,
        targetLang: targetLang,
        timestamp: new Date().toISOString()
      };

      this.translations.push(translation);
      return { ...translation };
    }
  }

  generateMockTranslation(text, targetLang) {
    // Simple mock translation by adding language prefix
    const prefixes = {
      "es": "[ES] ",
      "fr": "[FR] ",
      "de": "[DE] ",
      "it": "[IT] ",
      "pt": "[PT] ",
      "ru": "[RU] ",
      "ja": "[JA] ",
      "ko": "[KO] ",
      "zh": "[ZH] ",
      "ar": "[AR] ",
      "hi": "[HI] ",
      "tr": "[TR] ",
      "nl": "[NL] ",
      "pl": "[PL] ",
      "sv": "[SV] ",
      "da": "[DA] ",
      "no": "[NO] ",
      "fi": "[FI] "
    };
    
    return `${prefixes[targetLang] || "[TRANSLATED] "}${text}`;
  }

  getNextId() {
    const maxId = this.translations.length > 0 
      ? Math.max(...this.translations.map(t => t.Id)) 
      : 0;
    return maxId + 1;
  }

  async getAll() {
    await this.delay();
    return [...this.translations];
  }

  async getById(id) {
    await this.delay();
    const translation = this.translations.find(t => t.Id === parseInt(id));
    if (!translation) {
      throw new Error("Translation not found");
    }
    return { ...translation };
  }

  async create(translationData) {
    await this.delay();
    const newTranslation = {
      Id: this.getNextId(),
      timestamp: new Date().toISOString(),
      ...translationData
    };
    this.translations.push(newTranslation);
    return { ...newTranslation };
  }

  async update(id, translationData) {
    await this.delay();
    const index = this.translations.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Translation not found");
    }
    this.translations[index] = { ...this.translations[index], ...translationData };
    return { ...this.translations[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.translations.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Translation not found");
    }
    const deletedTranslation = { ...this.translations[index] };
    this.translations.splice(index, 1);
    return deletedTranslation;
  }
}

const translationService = new TranslationService();
export default translationService;