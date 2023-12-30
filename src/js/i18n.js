// From https://github.com/PhraseApp-Blog/javascript-l10n-ultimate-guide
//
// See deps/LICENSE-javascript-l10n-ultimate-guide.txt

// The locale our app first shows; also the fallback locale for missing
// translations.
const defaultLocale = "en";

const fullyQualifiedLocaleDefaults = {
    de: 'de-AT',
    en: 'en-US',
    ja: 'ja-JP',
};

// The active locale
let locale;

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

// Set the given locale and translate the page to this locale
function setLocale(newLocale) {
    if (newLocale === locale) return;
    locale = newLocale;
    localStorage.setItem('userLocale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = 'ltr';

    translatePage();
}

// Replace the target of all elements with the data-i18n-key attribute to
// translations corresponding to their data-i18n-key. Normally the innerText
// will be replaced, but if there is a data-i18n-target attribute, the
// attribute with that name will be replaced. The 'target' mechanism is useful
// for <optgroup label='...'>.

function translatePage() {
    document
        .querySelectorAll("[data-i18n-key]")
        .forEach((el) => {
            let target = el.getAttribute('data-i18n-target');

            // getAttribute() may return null, not undefined
            if (target) {
                el.setAttribute(target, translateElement(el));
            } else {
                el.innerText = translateElement(el)
            }
        });
}

// Return the given HTML element's translation in the active locale,
// corresponding to the element's data-i18n-key
function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");

    const interpolations =
        JSON.parse(element.getAttribute("data-i18n-opt")) || {};

    let message = translations[locale][key];
    if (typeof message === 'undefined') {
        console.log(`locale '${locale}' has no key '${key}'`);

        // try to find the key in the defaultLocale, if it's not the
        // locale already

        if (locale != defaultLocale) {
            message = translations[defaultLocale][key];
            if (typeof message === 'undefined') {
                console.log(`default locale '${defaultLocale}' also has no key '${key}'`);
            }
        }
        if (typeof message === 'undefined') return 'missing key ' + key;
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
