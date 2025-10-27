import * as z from 'zod'

const idNameObject = z
  .object({
    id: z.string().min(2),
    nama: z.string().min(2),
  })
  .nullable()

const zodDefinitions = {
  idNameObject,
}

export default zodDefinitions
