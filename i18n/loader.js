(function() {
    const defaultLang = 'en';
    const availableLangs = ['en', 'es', 'fr', 'de', 'hi', 'ja', 'zh-CN', 'ko', 'ru', 'it', 'pt', 'ar', 'tr', 'nl', 'pl', 'vi', 'th', 'id', 'sv', 'cs'];

    async function init() {
        const params = new URLSearchParams(window.location.search);
        let lang = params.get('lang') || localStorage.getItem('language') || defaultLang;
        
        if (!availableLangs.includes(lang)) lang = defaultLang;
        localStorage.setItem('language', lang);

        // Fetch translations
        const data = await fetchTranslations(lang);
        if (data) {
            window.i18nData = data;
            applyTranslations(data, lang);
        }

        setupSelector(lang);
    }

    async function fetchTranslations(lang) {
        if (lang === 'en') return null; // We can use the hardcoded content for EN
        try {
            const response = await fetch(`./i18n/locales/${lang}.json`);
            if (!response.ok) throw new Error("File not found");
            return await response.json();
        } catch (e) {
            console.warn("Translation load failed, using English fallback", e);
            return null;
        }
    }

    function applyTranslations(data, lang) {
        if (!data) return;

        // 1. Data-i18n attributes
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (data[key]) el.innerHTML = data[key];
        });

        // 2. Global Module Data
        window.translationsReady = true;
        window.translations = data;
        
        if (window.onTranslationsLoaded) {
            window.onTranslationsLoaded(data);
        }

        document.documentElement.lang = lang;
    }

    // Handle late assignment of the hook
    Object.defineProperty(window, 'onTranslationsLoaded', {
        get: () => window._onTranslationsLoaded,
        set: (fn) => {
            window._onTranslationsLoaded = fn;
            if (window.translationsReady && fn) {
                fn(window.translations);
            }
        },
        configurable: true
    });

    function setupSelector(currentLang) {
        const interval = setInterval(() => {
            const selector = document.getElementById('language-selector');
            if (selector) {
                selector.value = currentLang;
                selector.addEventListener('change', (e) => {
                    const newLang = e.target.value;
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', newLang);
                    localStorage.setItem('language', newLang);
                    window.location.href = url.href;
                });
                clearInterval(interval);
            }
        }, 50);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
