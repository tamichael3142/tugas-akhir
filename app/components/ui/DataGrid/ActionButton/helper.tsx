import { FaInfo, FaRegEdit, FaTrashAlt } from 'react-icons/fa'
import { MdManageHistory } from 'react-icons/md'

function getDeleteIcon() {
  return <FaTrashAlt />
}

function getEditIcon() {
  return <FaRegEdit />
}

function getDetailIcon() {
  return <FaInfo />
}

function getManageIcon() {
  return <MdManageHistory />
}

const DataGridActionButtonHelper = {
  getDeleteIcon,
  getEditIcon,
  getDetailIcon,
  getManageIcon,
}

export default DataGridActionButtonHelper
