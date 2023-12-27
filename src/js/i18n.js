// From https://github.com/PhraseApp-Blog/javascript-l10n-ultimate-guide
//
// See deps/LICENSE-javascript-l10n-ultimate-guide.txt

// The locale our app first shows
const defaultLocale = "de";

const fullyQualifiedLocaleDefaults = {
    de: 'de-AT',
    en: 'en-US',
    ja: 'ja-JP',
};

// The active locale
let locale;

// Gets filled with active locale translations
let translations = {};

// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
    // use ['en', 'fr'] instead of ['en-US', 'fr-FR']
    let wantedLocales = navigator.languages.map((locale) => locale.split("-")[0]);

    // If the user has already chosen a local once, use that. It will
    // have been stored in the localStorage. This way we don't need to
    // pass the locale around in links.
    let storedLocale = localStorage.getItem('userLocale');
    if (typeof storedLocale !== 'undefined') {
        wantedLocales.unshift(storedLocale);
    }

    // Get the first locale we support from the given array, or use our
    // default locale.
    const initialLocale = wantedLocales.find(
        (locale) => fullyQualifiedLocaleDefaults.hasOwnProperty(locale)
    ) || defaultLocale;

    setLocale(initialLocale);

    // bind the locale switcher
    const switcher = document.querySelector("[data-i18n-switcher]");
    switcher.value = initialLocale;
    switcher.onchange = (e) => {
        setLocale(e.target.value)
    };
});

// Load translations for the given locale and translate
// the page to this locale
function setLocale(newLocale) {
    if (newLocale === locale) return;
    const newTranslations = fetchTranslationsFor(newLocale);
    locale = newLocale;
    localStorage.setItem('userLocale', newLocale);
    translations = newTranslations;
    document.documentElement.lang = newLocale;
    document.documentElement.dir = 'ltr';

    translatePage();
}

// Retrieves translations JSON object for the given
// locale over the network
function fetchTranslationsFor(newLocale) {
    const request = new XMLHttpRequest();
    request.open('GET', `/lang/${newLocale}.json`, false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    }
    return null;

}

// Replace the inner text of all elements with the
// data-i18n-key attribute to translations corresponding
// to their data-i18n-key
function translatePage() {
    document
        .querySelectorAll("[data-i18n-key]")
        .forEach((el) => el.innerText = translateElement(el));
}

// Return the given HTML element's translation in the active locale,
// corresponding to the element's data-i18n-key
function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");

    const interpolations =
        JSON.parse(element.getAttribute("data-i18n-opt")) || {};

    const message = translations[key];

    // Missing entry in a dictionary?
    if (typeof message === 'undefined') {
        return 'missing key ' + key;
    }

    if (key.endsWith("-plural")) {
        return interpolate(
            pluralFormFor(message, interpolations.count),
            interpolations,
        );
    }

    return interpolate(message, interpolations);
}

// Convert a message like "Hello, {name}" to "Hello, Chad"
// where the given interpolations object is {name: "Chad"}
function interpolate(message, interpolations) {
    return Object.keys(interpolations).reduce(
        (interpolated, key) => {
            const value = formatDate(
                formatNumber(interpolations[key]),
            );

            return interpolated.replace(
                new RegExp(`{\s*${key}\s*}`, "g"),
                value,
            );
        },
        message,
    );
}

/*
  Given a value object like
  {
    "number" : 300000,
    "style": "currency",
    "currency": "EUR"
  } and that the current locale is en, returns "€300,000.00"
*/
function formatNumber(value) {
    if (typeof value === "object" && value.number) {
        const {
            number,
            ...options
        } = value;

        return new Intl.NumberFormat(
            fullyQualifiedLocaleDefaults[locale],
            options,
        ).format(number);
    } else {
        return value;
    }
}

/*
  Given a value object like
  {
    "date": "2021-12-05 15:29:00",
    "dateStyle": "long",
    "timeStyle": "short"
  } and that the current locale is en,
  returns "December 5, 2021 at 3:29 PM"
*/
function formatDate(value) {
    if (typeof value === "object" && value.date) {
        const {
            date,
            ...options
        } = value;

        const parsedDate =
            typeof date === "string" ? Date.parse(date) : date;

        return new Intl.DateTimeFormat(
            fullyQualifiedLocaleDefaults[locale],
            options,
        ).format(parsedDate);
    } else {
        return value;
    }
}

/*
  Given a forms object like
  {
    "zero": "No articles",
    "one": "One article",
    "other": "{count} articles"
  } and a count of 1, returns "One article"
*/
function pluralFormFor(forms, count) {
    const matchingForm = new Intl.PluralRules(locale).select(
        count,
    );

    return forms[matchingForm];
}
