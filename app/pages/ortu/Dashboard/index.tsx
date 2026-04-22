import { useLoaderData, useRevalidator } from '@remix-run/react'
import { LoadingFullScreen } from '~/components/ui'
import DBHelpers from '~/database/helpers'
import OrtuPageContainer from '~/layouts/ortu/OrtuPageContainer'
import { LoaderDataOrtuIndex } from '~/types/loaders-data/ortu'

export default function OrtuDashboardPage() {
  const loader = useLoaderData<LoaderDataOrtuIndex>()
  const revalidator = useRevalidator()

  if (revalidator.state === 'loading' || !loader.user) return <LoadingFullScreen />
  return (
    <OrtuPageContainer title='Dashboard'>
      <div className='text-xl p-4 rounded-lg bg-secondary text-white text-center max-w-sm'>
        Selamat datang {DBHelpers.akun.getDisplayName(loader.user)} !
      </div>

      <div className='mt-4'>
        <p className='font-semibold text-lg'>List Anak:</p>
        <div className='grid grid-cols-3 gap-4'></div>
      </div>
    </OrtuPageContainer>
  )
}
