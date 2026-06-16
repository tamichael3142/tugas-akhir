import { TextAreaInput, TextInput } from '~/components/forms'

type Props = {
  defaultId?: string
  defaultTitle?: string
  defaultRemark?: string
  currentFileUrl?: string | null
  isSystemRecord?: boolean
  errors?: {
    id?: string
    title?: string
  }
}

export default function AdminImportExcelTemplateFormComponent(props: Props) {
  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <div className='col-span-2 md:col-span-1'>
        <TextInput
          label='ID'
          isError={!!props.errors?.id}
          helperText={
            props.errors?.id ??
            (props.isSystemRecord
              ? 'This is a system record. ID cannot be changed.'
              : 'Auto-generated. You may replace with a custom value.')
          }
          inputProps={{
            name: 'id',
            defaultValue: props.defaultId ?? '',
            required: true,
            readOnly: props.isSystemRecord,
            disabled: props.isSystemRecord,
          }}
        />
      </div>
      <div className='col-span-2 md:col-span-1'>
        <TextInput
          label='Title'
          isError={!!props.errors?.title}
          helperText={props.errors?.title}
          inputProps={{
            name: 'title',
            defaultValue: props.defaultTitle ?? '',
            required: true,
          }}
        />
      </div>
      <div className='col-span-2'>
        <p className='text-sm'>File (Excel)</p>
        <div className='mt-1'>
          {props.currentFileUrl && (
            <p className='text-sm text-neutral-500 mb-2'>
              Current file:{' '}
              <a href={props.currentFileUrl} target='_blank' rel='noreferrer' className='text-primary underline'>
                Download
              </a>
              . Upload a new file to replace it.
            </p>
          )}
          <input
            type='file'
            name='file'
            accept='.xlsx,.xls,.csv'
            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:opacity-90'
          />
        </div>
      </div>
      <div className='col-span-2'>
        <TextAreaInput
          label='Remark'
          inputProps={{
            name: 'remark',
            defaultValue: props.defaultRemark ?? '',
            placeholder: 'Optional description...',
          }}
        />
      </div>
    </div>
  )
}
