import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

export function formTableData(
  data: EquipmentResponse[],
  departments: DepartmentResponse[] | undefined,
  equipmentModels: EquipmentModelResponse[] | undefined,
  equipmentTypes: EquipmentType[] | undefined,
  employees: EmployeeResponse[] | undefined,
  areas: AreaResponse[] | undefined,
  globalTypes: GlobalTypeResponse[] | undefined,
  statuses: StatusResponse[] | undefined
): EquipmentWithDescription[] {
  const tableRows = data.map((item) => {
    const currentEquipment = equipmentModels?.find((model) => model.id === item.equipmentModelId)
    return {
      ...item,
      id: item.invNumber,
      departmentName:
        departments?.find((department) => department.id === item.departmentId)?.name || 'Неизвестно',
      equipmentModelName: currentEquipment?.name || 'Неизвестно',
      employeeName: employees?.find((employee) => employee.id === item.issuedToId)?.fio || '-',
      equipmentModelType:
        equipmentTypes?.find((type) => type.id === currentEquipment?.equipmentTypeId)?.name || 'Неизвестно',
      area: areas?.find((area) => area.id === item.areaId)?.name || 'Неизвестно',
      mot: employees?.find((employee) => employee.id === item.matResponsiblePersonId)?.fio || '-',
      glType: globalTypes?.find((type) => type.id === item.globalTypeId)?.name || '-',
      status: statuses?.find((status) => status.id === item.statusId)?.name || '-',
    }
  })
  return tableRows
}

export function useTableData() {
  const { data: departments } = useQuery({
    queryKey: ['department'],
    queryFn: async () => {
      const resp = await api.department.getAll()
      return resp.data
    },
  })
  const { data: equipmentModels } = useQuery({
    queryKey: ['equipmentModel'],
    queryFn: async () => {
      const resp = await api.equipmentModel.getAll()
      return resp.data
    },
  })
  const { data: equipmentTypes } = useQuery({
    queryKey: ['equipmentType'],
    queryFn: async () => {
      const resp = await api.equipmentTypes.getAll()
      return resp.data
    },
  })

  const { data: employees } = useQuery({
    queryKey: ['employee'],
    queryFn: async () => {
      const resp = await api.users.getAllUsers()
      return resp.data
    },
  })

  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const resp = await api.area.getAll()
      return resp.data
    },
  })

  const { data: globalTypes } = useQuery({
    queryKey: ['globalType'],
    queryFn: async () => {
      const resp = await api.globalType.getAll()
      return resp.data
    },
  })

  const { data: statuses } = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const resp = await api.status.getAll()
      return resp.data
    },
  })
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      'Equipment',
      areas,
      globalTypes,
      statuses,
      departments,
      equipmentModels,
      equipmentTypes,
      { origin: 'EquipmentTable' },
    ],
    queryFn: async () => {
      const resp = await api.equipment.getAll()
      const tableData = formTableData(
        resp.data,
        departments,
        equipmentModels,
        equipmentTypes,
        employees,
        areas,
        globalTypes,
        statuses
      )
      return tableData
    },
    enabled:
      !!employees &&
      !!departments &&
      !!areas &&
      !!equipmentModels &&
      !!equipmentTypes &&
      !!globalTypes &&
      !!statuses,
    onError: (err) => {
      console.log('error in "Equipment" query', err)
      // TODO check error and redirect to login page if token expired
    },
  })

  return {
    data,
    isLoading,
    departments,
    areas,
    globalTypes,
    statuses,
    equipmentModels,
    equipmentTypes,
    employees,
  }
}
