import { prisma } from '~/utils/db.server'

const data = [
  { id: 'ADM_ACC_BULK', title: 'Admin Account Bulk', remark: null },
  { id: 'ADM_MTR_CLS', title: 'Admin Master Class', remark: null },
  { id: 'ADM_MTR_CLS_JDWL_PLJR', title: 'Admin Lesson Timetable', remark: null },
  { id: 'ADM_MTR_CLS_ADD_SDT', title: 'Admin Add Student', remark: null },
]

async function seed() {
  try {
    await prisma.importExcelTemplate.createMany({
      data: data.map(item => ({
        id: item.id,
        title: item.title,
        remark: item.remark,
      })),
    })
  } catch (e) {
    console.log('ERROR! Failed to seed days.ts', e)
  }
}

const ImportExcelTemplateSeeder = {
  seed,
}

export default ImportExcelTemplateSeeder
