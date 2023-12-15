import { useQuery } from '@tanstack/react-query'
import { Button, Row, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { api } from '../../api'
import { guideTypes, itemTypes } from '../../pages/GuidesPage/GuidesPage'
import { items } from '../GuidesLeftMenu/GuidesLeftMenu'

interface GuidesTypeRowsProps {
  type: guideTypes
  setItem: Dispatch<SetStateAction<itemTypes>>
  item: itemTypes
}

export function pickColumns(type: guideTypes) {
  let columns
  switch (type) {
    case 'department':
      columns = [
        {
          dataIndex: 'id',
          title: 'ID',
          className: 'hidden',
        },
        {
          dataIndex: 'name',
          title: 'Название',
          sorter: (a, b) => a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase() || ''),
        },
        { dataIndex: 'description', title: 'Описание' },
        { dataIndex: 'geo', title: 'Местоположение' },
        { dataIndex: 'phone', title: 'Телефон' },
      ] as ColumnsType<DepartmentResponse>
      break
    case 'area':
      columns = [
        {
          dataIndex: 'id',
          title: 'ID',
          className: 'hidden',
        },
        {
          dataIndex: 'name',
          title: 'Название',
          sorter: (a, b) => a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase() || ''),
        },
        { dataIndex: 'description', title: 'Описание' },
      ] as ColumnsType<AreaResponse>
      break
    case 'equipmentTypes':
      columns = [
        { dataIndex: 'id', title: 'ID', className: 'hidden' },
        {
          dataIndex: 'name',
          title: 'Название',
          sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        },
        { dataIndex: 'description', title: 'Описание' },
      ] as ColumnsType<EquipmentType>
      break
    case 'equipmentManufactures':
      columns = [
        { dataIndex: 'id', title: 'ID', className: 'hidden' },
        {
          dataIndex: 'name',
          title: 'Название',
          sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        },
        { dataIndex: 'country', title: 'Страна' },
        { dataIndex: 'description', title: 'Описание' },
      ] as ColumnsType<EquipmentManufacturesResponse>
      break
    case 'equipmentModel':
      columns = [
        { dataIndex: 'id', title: 'ID', className: 'hidden' },
        {
          dataIndex: 'name',
          title: 'Название',
          sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        },
        { dataIndex: 'equipmentManufactureId', title: 'Мануфактура', className: 'hidden' },
        { dataIndex: 'equipmentManufactureName', title: 'Мануфактура' },
        { dataIndex: 'equipmentTypeId', title: 'Тип', className: 'hidden' },
        { dataIndex: 'equipmentTypeName', title: 'Тип' },
        { dataIndex: 'description', title: 'Описание' },
      ] as ColumnsType<EquipmentModelResponse>
      break

    default:
      columns = [] as ColumnsType
  }
  return columns
}

function formModelsTableData(
  modelsData: EquipmentModelResponse[],
  equipmentMonufactures: EquipmentManufacturesResponse[] | undefined,
  equipmentTypes: EquipmentType[] | undefined
) {
  const tableRows = modelsData.map((model) => {
    return {
      ...model,
      equipmentManufactureName: equipmentMonufactures?.find(
        (manufacture) => manufacture.id === model.equipmentManufactureId
      )?.name,
      equipmentTypeName: equipmentTypes?.find((type) => type.id === model.equipmentTypeId)?.name,
    }
  })

  return tableRows
}

const GuidesTypeRows = ({ type, item, setItem }: GuidesTypeRowsProps): JSX.Element => {
  const currentColumns = useMemo(() => pickColumns(type), [type])
  const title = type && items.find((item) => item.key === type)?.label

  const { data: departments } = useQuery({
    queryKey: ['department', { origin: 'GuidesTypeRows' }],
    queryFn: async () => {
      const resp = await api.department.getAll()
      return resp.data
    },
  })

  const { data: areas } = useQuery({
    queryKey: ['areas', { origin: 'GuidesTypeRows' }],
    queryFn: async () => {
      const resp = await api.area.getAll()
      return resp.data
    },
  })

  const { data: equipmentTypes } = useQuery({
    queryKey: ['equipmentTypes', { origin: 'GuidesTypeRows' }],
    queryFn: async () => {
      const resp = await api.equipmentTypes.getAll()
      return resp.data
    },
  })

  const { data: equipmentManufactures } = useQuery({
    queryKey: ['equipmentManufactories', { origin: 'GuidesTypeRows' }],
    queryFn: async () => {
      const resp = await api.equipmentManufactures.getAll()
      return resp.data
    },
  })

  const { data: equipmentModels } = useQuery({
    queryKey: ['equipmentModels', { origin: 'GuidesTypeRows' }],
    queryFn: async () => {
      const resp = await api.equipmentModel.getAll()
      return formModelsTableData(resp.data, equipmentManufactures, equipmentTypes)
    },
    enabled: !!equipmentManufactures && !!equipmentTypes,
  })

  function getDataSource() {
    let currentData
    switch (type) {
      case 'department':
        currentData = departments
        break
      case 'area':
        currentData = areas
        break
      case 'equipmentManufactures':
        currentData = equipmentManufactures
        break
      case 'equipmentTypes':
        currentData = equipmentTypes
        break
      case 'equipmentModel':
        currentData = equipmentModels
        break
      default:
        currentData = departments
    }
    return currentData
  }

  return (
    <>
      <Row justify='space-between' align='middle'>
        <Typography.Title level={3}>{title}</Typography.Title>
        {type !== 'employees' && (
          <Button type='primary' style={{ marginTop: '12px' }} onClick={() => setItem('new')}>
            Добавить
          </Button>
        )}
      </Row>
      <Row>
        <Table
          style={{ width: '100%', marginTop: '10px' }}
          size='small'
          bordered
          scroll={{ x: true }}
          columns={currentColumns}
          dataSource={getDataSource()}
          rowKey='id'
          pagination={false}
          rowSelection={{
            type: 'radio',
            checkStrictly: false,
            hideSelectAll: true,
            selectedRowKeys: [item.id],
            onSelect: (e) => setItem(e as itemTypes),
          }}
        />
      </Row>
    </>
  )
}

export default GuidesTypeRows
