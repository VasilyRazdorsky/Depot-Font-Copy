type AsideMode = 'settings' | 'filters' | 'newEquipment' | 'default'
type AsideModeUsersType = 'default' | 'newUser'

interface LoginResponse {
  token: string
  roleName: string
  expiration: string
}

interface Equipment {
  departmentId: number
  equipmentModelId: number
}

interface EquipmentResponse {
  invNumber: number
  archived: boolean
  isReserved: boolean
  isParent: boolean
  snNumber: string
  binvNumber: string
  statusId?: number
  globalTypeId: number
  comment: string
  areaId: number
  matResponsiblePersonId: number
  departmentId: number
  equipmentModelId: number
  issuedToId: number
  parentInvNumber: string
}

interface EquipmentWithDescription extends EquipmentResponse {
  departmentName?: string
  equipmentModelName?: string
  employeeName?: string
  equipmentModelType?: string
  area: string
  glType: string
  mot: string
  status: string
  id: number
}

interface EmployeeResponse {
  id: number
  userName: string
  roles: string[]
  archived: boolean
  fio: string
  departmentId: number
  phone: string
  link: string
  email: string
}

interface EmployeeResponseExtended extends EmployeeResponse {
  patronymic: string
  name: string
  surname: string
}

interface EmployeeWithPassword extends EmployeeResponseExtended {
  password: string
}

interface EmployeeCreateRequest {
  userName: string
  password: string
  fio: string
  phone: string
  email: string
  link: string
}

interface EmloyeeUpdateRequest {
  userName?: string
  fio?: string
  phone?: string
  email?: string
  link?: string
}

type EquipmentRequest = Equipment & { [P in keyof EquipmentResponse]?: EquipmentResponse[P] }

type EquipmentUpdateRequest = EquipmentWithDescription

interface EquipmentType {
  id: number
  name: string
  description: string
}

type EquipmentTypeRequest = Omit<EquipmentType, 'id'>

interface EquipmentModel {
  equipmentManufactureId: number
  equipmentTypeId: number
}

interface EquipmentModelResponse extends EquipmentModel {
  id: number
  name: string
  description: string
  archived: boolean
}

interface EquipmentModelRequest extends EquipmentModel {
  name?: string
  description?: string
}

type EmployeeRequest = Employee & { [P in keyof EmployeeResponse]?: EmployeeResponse[P] }

interface Department {
  id: number
  archived: boolean
}

interface DepartmentResponse extends Department {
  name?: string
  description?: string
  geo?: string
  phone?: string
}

type DepartmentRequest = Omit<DepartmentResponse, 'id' | 'archived'>

interface EquipmentManufactures {
  name: string
  country: string
  description: string
}

interface EquipmentManufacturesResponse extends EquipmentManufactures {
  id: number
  archived: boolean
}

type EquipmentManufacturesRequest = { [P in keyof EquipmentManufactures]?: EquipmentManufactures[P] }

interface TransactionsResponse extends EquipmentResponse {
  // ???? wheres type in swagger
  archived: boolean
  equipmentId: number
  authorId: number
  date: Date
  transactionTypeId: number
  transactionComment: string
  equipmentArchived: boolean
}

interface TransactionType {
  type: string
}

interface TransactionTypesResponse extends TransactionType {
  id: number
}

interface AreaResponse {
  id: number
  name: string
  description: string
}

interface GlobalTypeResponse {
  id: number
  name: string
  description: string
  archived: boolean
}

interface StatusResponse {
  id: number
  name: string
  description: string
  archived: boolean
}

interface SettingToSearch {
  label: string
  value: string
}
