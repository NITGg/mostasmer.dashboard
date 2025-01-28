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