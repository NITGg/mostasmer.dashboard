import { useTranslations } from "next-intl"

const OrderTitle = () => {
    const t = useTranslations('order')
    return (<h2>{t('title')}</h2>)
}

export default OrderTitle