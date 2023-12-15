import axios from 'axios'
import type { Dispatch, SetStateAction } from 'react'

interface Token {
  aud: string
  exp: number
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string
  iss: string
  jti: string
  fullToken: string
  hasToken: boolean
}

const defaultToken: Token = {
  aud: '',
  exp: 0,
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': '',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': '',
  iss: '',
  jti: '',
  fullToken: '',
  hasToken: false,
}

export function readJWT(): Token {
  const fullToken = window.localStorage.getItem('token') || ''
  if (!fullToken) return defaultToken
  const token = fullToken.split('.')[1]
  const payload = JSON.parse(atob(token))
  axios.defaults.headers.common.Authorization = `Bearer ${fullToken}`
  return { ...payload, hasToken: true, fullToken }
}

export function checkIsAuth(setIsAuth: Dispatch<SetStateAction<boolean>>) {
  users.getAllUsers().catch(() => {
    setIsAuth(false)
  })
}

const baseUrl = import.meta.env.VITE_BASE_URL + 'api/v1/'

const users = {
  baseUrl: baseUrl + 'users/',
  login: (username: string, password: string) =>
    axios.post<LoginResponse>(users.baseUrl + 'login', { username, password }),
  getUserById: (id: number | void) => axios.get<EmployeeResponse>(users.baseUrl + id),
  getAllUsers: () => axios.get<EmployeeResponse[]>(users.baseUrl),
  upadateUser: (user: EmployeeResponseExtended, model: EmloyeeUpdateRequest) =>
    axios.put(users.baseUrl + user.id, model),
  createUser: (model: EmployeeCreateRequest) => axios.post<EmployeeResponse>(users.baseUrl, model),
}

const equipment = {
  baseUrl: baseUrl + 'equipment/',
  getAll: () => axios.get<EquipmentResponse[]>(equipment.baseUrl),
  getById: (id: number) => axios.get<EquipmentResponse>(equipment.baseUrl + id),
  getChildren: (invNumber: number) =>
    axios.get<EquipmentResponse[]>(equipment.baseUrl + invNumber + '/children'),
  getParent: (invNumber: number) =>
    axios
      .get<EquipmentResponse>(equipment.baseUrl + invNumber + '/parent')
      .then((data) => data)
      .catch((err) => err),
  create: (model: EquipmentRequest) => axios.post(equipment.baseUrl, model),
  reserve: (invNumber: number) => axios.put<EquipmentResponse>(equipment.baseUrl + invNumber + '/reserve'),
  unreserve: (invNumber: number) =>
    axios.put<EquipmentResponse>(equipment.baseUrl + invNumber + '/unreserve'),
  update: (model: EquipmentWithDescription) => axios.put(equipment.baseUrl + model.invNumber, model),
  archive: (invNumber: number) => axios.put(equipment.baseUrl + invNumber + '/archive'),
  setChild: (invNumber: number, parentInvNumber: string) =>
    axios.put(equipment.baseUrl + invNumber + '/parent/' + parentInvNumber),
}

const equipmentModel = {
  baseUrl: baseUrl + 'equipment-models/',
  getAll: () => axios.get<EquipmentModelResponse[]>(equipmentModel.baseUrl, { params: { all: true } }),
  update: (id: number, newValue: EquipmentModelResponse) => axios.put(equipmentModel.baseUrl + id, newValue),
  create: (model: EquipmentModelRequest) => axios.post(equipmentModel.baseUrl, model),
}

const equipmentTypes = {
  baseUrl: baseUrl + 'equipment-types/',
  getAll: () => axios.get<EquipmentType[]>(equipmentTypes.baseUrl, { params: { all: true } }),
  update: (id: number, newValue: EquipmentType) => axios.put(equipmentTypes.baseUrl + id, newValue),
  create: (newValue: EquipmentTypeRequest) => axios.post(equipmentTypes.baseUrl, newValue),
}

const equipmentManufactures = {
  baseUrl: baseUrl + 'equipment-manufactures/',
  getAll: () =>
    axios.get<EquipmentManufacturesResponse[]>(equipmentManufactures.baseUrl, {
      params: { all: true },
    }),
  update: (id: number, newValue: EquipmentManufacturesResponse) =>
    axios.put(equipmentManufactures.baseUrl + id, newValue),
  create: (newValue: EquipmentManufacturesRequest) => axios.post(equipmentManufactures.baseUrl, newValue),
}

const employees = {
  baseUrl: baseUrl + 'Employees/',
  getAll: () => axios.get<EmployeeResponse[]>(employees.baseUrl + 'to_get', { params: { all: true } }),
  update: (id: number, newValue: EmployeeResponse) =>
    axios.put(employees.baseUrl + 'to_update', newValue, { params: { id } }),
}

const department = {
  baseUrl: baseUrl + 'departments/',
  getAll: () => axios.get<DepartmentResponse[]>(department.baseUrl, { params: { all: true } }),
  update: (id: number, newValue: DepartmentResponse) => axios.put(department.baseUrl + id, newValue),
  create: (newValue: DepartmentRequest) => axios.post(department.baseUrl, newValue),
}

const area = {
  baseUrl: baseUrl + 'areas/',
  getAll: () => axios.get<AreaResponse[]>(area.baseUrl),
}

const globalType = {
  baseUrl: baseUrl + 'global-types/',
  getAll: () => axios.get<GlobalTypeResponse[]>(globalType.baseUrl),
}

const status = {
  baseUrl: baseUrl + 'statuses/',
  getAll: () => axios.get<StatusResponse[]>(status.baseUrl),
}

const api = {
  baseUrl,
  users,
  equipment,
  equipmentTypes,
  equipmentModel,
  equipmentManufactures,
  employees,
  department,
  area,
  globalType,
  status,
}

export { api }
