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

      <div className='mt-8'>
        <p className='font-semibold text-lg mb-2'>List Anak:</p>
        <div className='grid grid-cols-3 gap-4'>
          {loader.user.children?.map(item => (
            <button
              key={`list-anak-${item.id}`}
              type='button'
              className='col-span-3 md:col-span-1 p-2 bg-neutral-200 rounded-lg border border-neutral-300 text-left cursor-pointer hover:shadow'
            >
              {DBHelpers.akun.getDisplayName(item.siswa)} ({item.siswa.username})
            </button>
          ))}
        </div>
      </div>
    </OrtuPageContainer>
  )
}
