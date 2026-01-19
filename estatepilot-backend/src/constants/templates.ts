export const SALUTATION_TEMPLATES = {
  hi: {
    en: "Hello! Welcome to {projectName}. I'm your AI assistant. How can I help you with our {projectName} project today?",
    hi: "नमस्ते! {projectName} में आपका स्वागत है। मैं आपकी AI सहायक हूँ। आज मैं आपकी {projectName} प्रोजेक्ट के बारे में कैसे मदद कर सकती हूँ?",
    hinglish: "Hello! {projectName} mein aapka swagat hai. I'm your AI assistant. Aaj main aapki {projectName} project ke baare mein kaise help kar sakti hoon?"
  },
  hello: {
    en: "Hello! Thanks for reaching out about {projectName}. What information would you like to know?",
    hi: "नमस्ते! {projectName} के बारे में संपर्क करने के लिए धन्यवाद। आप क्या जानकारी चाहते हैं?",
    hinglish: "Hello! {projectName} ke baare mein contact karne ke liye dhanyawaad. Aap kya jaankari chahte hain?"
  }
};

export const QUALIFICATION_QUESTIONS = {
  budget: {
    en: "To help you better, could you please share your approximate budget range?\n\n1. ₹50L - ₹1Cr\n2. ₹1Cr - ₹2Cr\n3. ₹2Cr+",
    hi: "आपकी बेहतर सहायता के लिए, कृपया अपना अनुमानित बजट सीमा साझा करें?\n\n1. ₹50 लाख - ₹1 करोड़\n2. ₹1 करोड़ - ₹2 करोड़\n3. ₹2 करोड़+",
    hinglish: "Aapki better help ke liye, please apna approximate budget range share karein?\n\n1. ₹50L - ₹1Cr\n2. ₹1Cr - ₹2Cr\n3. ₹2Cr+"
  },
  unitType: {
    en: "What type of unit are you looking for?\n\n1. 2 BHK\n2. 3 BHK\n3. 4 BHK\n4. Penthouse",
    hi: "आप किस प्रकार का यूनिट ढूंढ रहे हैं?\n\n1. 2 बीएचके\n2. 3 बीएचके\n3. 4 बीएचके\n4. पेंटहाउस",
    hinglish: "Aap kis type ka unit dhoondh rahe hain?\n\n1. 2 BHK\n2. 3 BHK\n3. 4 BHK\n4. Penthouse"
  },
  timeline: {
    en: "What is your planned timeline for purchase?\n\n1. Immediate (within 1 month)\n2. Short-term (1-3 months)\n3. Medium-term (3-6 months)\n4. Just exploring",
    hi: "खरीद के लिए आपकी नियोजित समय सीमा क्या है?\n\n1. तत्काल (1 महीने के भीतर)\n2. अल्पकालिक (1-3 महीने)\n3. मध्यम अवधि (3-6 महीने)\n4. बस एक्सप्लोर कर रहे हैं",
    hinglish: "Purchase ke liye aapki planned timeline kya hai?\n\n1. Immediate (within 1 month)\n2. Short-term (1-3 months)\n3. Medium-term (3-6 months)\n4. Just exploring"
  }
};

export const ESCALATION_TEMPLATES = {
  unknown: {
    en: "I'll connect you with our sales team who can provide more detailed assistance.",
    hi: "मैं आपको हमारी सेल्स टीम से कनेक्ट करूंगा जो अधिक विस्तृत सहायता प्रदान कर सकती है।",
    hinglish: "Main aapko humari sales team se connect karunga jo detailed assistance provide kar sakti hai."
  },
  dataMissing: {
    en: "I need to connect you with our team for accurate information on this.",
    hi: "इस पर सटीक जानकारी के लिए मुझे आपको हमारी टीम से जोड़ने की आवश्यकता है।",
    hinglish: "Is par accurate information ke liye main aapko humari team se jodna hoga."
  }
};

export const FOLLOWUP_TEMPLATES = {
  hot: {
    en: "Hi {name}, following up on your interest in {projectName}. Have any questions about {unitType}? Our team can schedule a site visit.",
    hi: "नमस्ते {name}, {projectName} में आपकी रुचि का अनुसरण कर रहे हैं। {unitType} के बारे में कोई प्रश्न हैं? हमारी टीम साइट विज़िट शेड्यूल कर सकती है।",
    hinglish: "Hi {name}, {projectName} mein aapki interest ka follow up kar rahe hain. {unitType} ke baare mein koi questions hain? Humari team site visit schedule kar sakti hai."
  },
  warm: {
    en: "Hello {name}, hope you're doing well. Wanted to share updates on {projectName}. Limited units available in {unitType}.",
    hi: "नमस्ते {name}, आशा है आप ठीक हैं। {projectName} पर अपडेट साझा करना चाहते थे। {unitType} में सीमित यूनिट उपलब्ध हैं।",
    hinglish: "Hello {name}, hope aap theek hain. {projectName} par updates share karna chahte the. {unitType} mein limited units available hain."
  }
};
