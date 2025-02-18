// import { getTranslations } from 'next-intl/server'
// import UserClassList from '@/components/user-class/UserClassList'

// export async function generateMetadata({ params: { locale } }) {
//   const t = await getTranslations({ locale, namespace: 'metadata' })
//   return {
//     title: t('user_class'),
//     description: t('user_class_description')
//   }
// }

// export default async function UserClassPage() {
//   return (
//     <div className="container mx-auto py-6 space-y-8">
//       <UserClassList />
//     </div>
//   )
// } 

import { getTranslations } from 'next-intl/server'
import UserClassList from '@/components/user-class/UserClassList'

export async function generateMetadata() {
  const t = await getTranslations({  namespace: 'metadata' })
  return {
    title: t('user_class'),
    description: t('user_class_description')
  }
}

export default async function UserClassPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <UserClassList />
    </div>
  )
} 