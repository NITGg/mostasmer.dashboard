export default function mlang(str: string, lang: 'ar' | 'en') {
    const regex = new RegExp(`\\{mlang ${lang}\\}([^\\{]+)\\{mlang\\}`, 'i');
    const match = str?.match(regex);
    return match ? match[1].trim() : "";
}