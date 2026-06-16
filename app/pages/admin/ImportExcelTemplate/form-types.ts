export type ImportExcelTemplateFormData = {
  id: string
  title: string
  remark?: string
}

export const SYSTEM_IMPORT_EXCEL_TEMPLATE_IDS = [
  'ADM_ACC_BULK',
  'ADM_MTR_CLS',
  'ADM_MTR_CLS_JDWL_PLJR',
  'ADM_MTR_CLS_ADD_SDT',
] as const
