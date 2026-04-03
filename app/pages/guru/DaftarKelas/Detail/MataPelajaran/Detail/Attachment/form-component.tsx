import { Button, TextAreaInput, TextInput } from '~/components/forms'
import { ReactNode } from 'react'
import classNames from 'classnames'
import { MataPelajaranAttachment } from '@prisma/client'

type Props = {
  mataPelajaranAttaachment?: MataPelajaranAttachment & { downloadUrl?: string }
}

export default function AdminDaftarKelasDetailMataPelajaranDetailAttachmentFormComponent(props: Props) {
  function InputWrapper({ children, cutting = 'full' }: { children?: ReactNode; cutting?: 'full' | 'half' }) {
    return (
      <div
        className={classNames({
          ['col-span-2']: cutting === 'full',
          ['col-span-1']: cutting === 'half',
        })}
      >
        {children}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
      <InputWrapper>
        <TextInput
          label='Title'
          inputProps={{ type: 'text', name: 'title', defaultValue: props.mataPelajaranAttaachment?.title }}
        />
      </InputWrapper>
      <InputWrapper>
        <TextInput label='File' inputProps={{ type: 'file', name: 'file' }} />
        {props.mataPelajaranAttaachment?.path && props.mataPelajaranAttaachment.downloadUrl ? (
          <a target='_blank' rel='noreferrer' href={props.mataPelajaranAttaachment.downloadUrl}>
            <Button label='Preview' size='sm' color='secondary' className='mt-2 ml-auto' />
          </a>
        ) : null}
      </InputWrapper>
      <InputWrapper>
        <TextAreaInput
          label='Description'
          inputProps={{ name: 'description', defaultValue: props.mataPelajaranAttaachment?.description ?? '' }}
        />
      </InputWrapper>
    </div>
  )
}
