import { FaInfo, FaRegEdit, FaTrashAlt } from 'react-icons/fa'
import { MdManageHistory, MdPassword } from 'react-icons/md'

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

function getPasswordIcon() {
  return <MdPassword />
}

const DataGridActionButtonHelper = {
  getDeleteIcon,
  getEditIcon,
  getDetailIcon,
  getManageIcon,
  getPasswordIcon,
}

export default DataGridActionButtonHelper
