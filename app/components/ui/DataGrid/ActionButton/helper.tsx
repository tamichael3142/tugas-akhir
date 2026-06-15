import { FaInfo, FaRegEdit, FaTrashAlt, FaUserEdit } from 'react-icons/fa'
import { MdManageHistory, MdPassword } from 'react-icons/md'

function getDeleteIcon() {
  return <FaTrashAlt />
}

function getEditIcon() {
  return <FaRegEdit />
}

function getMutateIcon() {
  return <FaUserEdit />
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
  getMutateIcon,
  getDetailIcon,
  getManageIcon,
  getPasswordIcon,
}

export default DataGridActionButtonHelper
