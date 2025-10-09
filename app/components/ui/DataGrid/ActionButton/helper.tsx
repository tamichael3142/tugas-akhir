import { FaInfo, FaRegEdit, FaTrashAlt } from 'react-icons/fa'

function getDeleteIcon() {
  return <FaTrashAlt />
}

function getEditIcon() {
  return <FaRegEdit />
}

function getDetailIcon() {
  return <FaInfo />
}

const DataGridActionButtonHelper = {
  getDeleteIcon,
  getEditIcon,
  getDetailIcon,
}

export default DataGridActionButtonHelper
