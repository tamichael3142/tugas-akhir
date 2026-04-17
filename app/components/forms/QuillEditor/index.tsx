import { useEffect, useRef, useState } from 'react'
import 'quill/dist/quill.snow.css'
import './styles.css'
import classNames from 'classnames'

export type QuillEditorProps = {
  id?: string
  label?: string
  name?: string
  value?: string
  placeholder?: string
  onChange?: (html: string) => void
  className?: string
  disabled?: boolean
}

export default function QuillEditor({
  label,
  id,
  name = 'content',
  value = '',
  placeholder = 'Type here...',
  onChange,
  className,
  disabled,
}: QuillEditorProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const editorRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      const Quill = (await import('quill')).default

      if (!mounted || !editorRef.current || quillRef.current) return

      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean'],
          ],
        },
      })

      quill.root.innerHTML = value

      quill.on('text-change', () => {
        const html = quill.root.innerHTML
        onChange?.(html)
      })

      quill.root.onblur = e => {
        setIsFocused(false)
        quill.root.onblur?.(e)
      }

      quill.root.onfocus = e => {
        setIsFocused(true)
        quill.root.onfocus?.(e)
      }

      quillRef.current = quill
    }

    init()

    return () => {
      mounted = false
      quillRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!quillRef.current) return

    const current = quillRef.current.root.innerHTML

    if (value !== current) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return (
    <div className={classNames('', className)}>
      {label ? (
        typeof label === 'string' ? (
          <label htmlFor={id} className='text-sm'>
            {label}
          </label>
        ) : (
          label
        )
      ) : null}

      <div
        className={classNames('border-2 border-gray-300 rounded-lg', {
          ['mt-1']: typeof label === 'string',
          ['border-primary']: isFocused,
          ['bg-gray-300 text-gray-600 cursor-not-allowed']: disabled,
        })}
      >
        <input type='hidden' id={id} name={name} value={value} readOnly />

        <div ref={editorRef} className='text-black !border-0' />
      </div>
    </div>
  )
}
