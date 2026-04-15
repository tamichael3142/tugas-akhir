import { AssignmentSubmissionStatus } from '~/database/enums/prisma.enums'
import DBHelpers from '~/database/helpers'
import { LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail } from '~/types/loaders-data/guru'
import EnumsTitleUtils from '~/utils/enums-title.utils'

type Props = {
  siswaPerKelasPerSemester: LoaderDataGuruDaftarKelasDetailMataPelajaranDetailAssignmentDetail['siswaPerKelasPerSemesters'][0]
}

export default function SubmissionCardPlaceholder(props: Props) {
  const { siswaPerKelasPerSemester } = props

  return (
    <div className='col-span-3 lg:col-span-1 border-4 border-dashed rounded-lg p-4 duration-200 text-left'>
      <div className='flex flex-row items-center gap-4'>
        <div>
          <h1 className='font-semibold'>{DBHelpers.akun.getDisplayName(siswaPerKelasPerSemester.siswa)}</h1>
        </div>
        <div className='grow'></div>
        <div className='rounded-lg px-1 py-0.5 bg-gray-500 text-white'>
          <p className='text-sm'>
            {EnumsTitleUtils.getAssignmentSubmissionStatus(AssignmentSubmissionStatus.ASSIGNED)}
          </p>
        </div>
      </div>

      <div className='mt-4'>
        <p className='text-red-500'>Not Submited</p>
      </div>
    </div>
  )
}
