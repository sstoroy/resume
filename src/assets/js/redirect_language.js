const AVAILABLELANGUAGES = {
    "no": ["no", "nn", "nb"] // Norwegian
}

let codeMatch = (codes, code) => codes.some(c => code.startsWith(c));

const browserLanguages = [
    ...new Set([
            ...(navigator.languages || []),
            navigator.userLanguage,
            navigator.language,
            navigator.browserLanguage,
            navigator.systemLanguage
        ]
    .filter(Boolean)
    )
]

const navigatorLanguage = () => { 
    for (lang in AVAILABLELANGUAGES) {
        let availableLanguageCodes = AVAILABLELANGUAGES[lang];
        for (i in browserLanguages) {
            let code = browserLanguages[i];
            if (codeMatch(availableLanguageCodes, code)) {
                return lang;
            }
        }
    }
    // default is English
    return "en";
}

setTimeout(function () {
  window.location.replace("/" + navigatorLanguage() + "/");
}, 2000); 
