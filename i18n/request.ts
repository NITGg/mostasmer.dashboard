import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { } from './lang/en.json'

enum langEnum {
    ar = 'ar',
    en = 'en',
}
export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as langEnum)) notFound();

    return {
        messages: (await import(`./lang/${locale}.json`)).default
    };
});

// import { notFound } from 'next/navigation';
// import { createMiddlewareClient } from 'next-intl/server';
// import { routing } from './routing';

// enum langEnum {
//     ar = 'ar',
//     en = 'en',
// }

// export default async function NextIntlConfig() {
//     const locale = await createMiddlewareClient().requestLocale();
    
//     // Validate that the locale is valid
//     if (!routing.locales.includes(locale as langEnum)) notFound();

//     return {
//         messages: (await import(`./lang/${locale}.json`)).default
//     };
// }

// import { notFound } from 'next/navigation';
// import { setRequestLocale } from 'next-intl/server'; // Make sure this is the correct method
// import { routing } from './routing'; // Assuming routing.locales is an array of valid locales
// import { } from './lang/en.json'; // Importing JSON files

// enum langEnum {
//     ar = 'ar',
//     en = 'en',
// }

// export default async function getLocaleConfig() {
//     // Fetch the locale (pass it explicitly if needed)
//     const locale = setRequestLocale('en'); // Example, set this dynamically based on the request

//     // Validate that the incoming locale parameter is valid
//     if (!routing.locales.includes(locale as unknown as langEnum)) notFound();

//     // Dynamically import the correct language JSON file based on the locale
//     const messages = (await import(`./lang/${locale}.json`)).default;

//     return {
//         messages,
//     };
// }
