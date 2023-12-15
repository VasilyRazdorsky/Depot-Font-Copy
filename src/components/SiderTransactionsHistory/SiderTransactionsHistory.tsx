import { useQuery } from '@tanstack/react-query'
import { Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { api } from '../../api'

interface TransactionsHistoryProps {
  id: number
  invNumber: number
}

// interface TransactionsDataType {
//   id: number
//   invNumber: number
// }

const columns: ColumnsType = [
  {
    title: 'ID',
    dataIndex: 'id',
    defaultSortOrder: 'ascend',
  },
  {
    title: 'ID сущности',
    dataIndex: 'equipmentId',
  },
  {
    title: 'ID модели',
    dataIndex: 'equipmentModelId',
  },
  {
    title: 'Модель',
    dataIndex: 'equipmentModelName',
  },
  {
    title: 'ID автора',
    dataIndex: 'authorId',
  },
  {
    title: 'Автор',
    dataIndex: 'authorName',
  },
  {
    title: 'Дата',
    dataIndex: 'date',
    render: (text) => new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(text)),
  },
  {
    title: 'ID транзакции',
    dataIndex: 'transactionTypeId',
  },
  {
    title: 'Тип транзакции',
    dataIndex: 'transactionTypeName',
  },
  {
    title: 'Комментарий транзакции',
    dataIndex: 'transactionComment',
  },
  {
    title: 'Сущность архивирована',
    dataIndex: 'equipmentArchived',
  },
  // {
  //   title: 'Архивировано',
  //   dataIndex: 'archived',
  //   render: (archived: boolean) => <>{archived ? 'Да' : 'Нет'}</>,
  // },
  // from table
  {
    title: 'Инв. Номер',
    dataIndex: 'invNumber',
  },
  {
    title: 'Место',
    dataIndex: 'area',
  },
  {
    title: 'Сотрудник',
    dataIndex: 'employeeName', // ? whats the difference from author
  },
  {
    title: 'ID Департамента',
    dataIndex: 'departmentId',
  },
  {
    title: 'Департамент',
    dataIndex: 'departmentName',
  },
  { title: 'Тип', dataIndex: 'glType' },
  { title: 'Статус', dataIndex: 'status' },
  { title: 'Мат. Ответственный', dataIndex: 'mot' },
  { title: 'Комментарий', dataIndex: 'comment' },
  {
    title: 'Сущность архивирована',
    dataIndex: 'equipmentArchived',
    render: (archived: boolean) => <>{archived ? 'Да' : 'Нет'}</>,
  },
  {
    title: 'Часть?',
    dataIndex: 'partOf',
  },
  {
    title: 'Часть чего',
    dataIndex: 'partOfField',
  },
  {
    title: 'Родитель кого',
    dataIndex: 'fatherOf',
  },
  {
    title: 'Серийник',
    dataIndex: 'snNumber',
  },
  {
    title: 'binv',
    dataIndex: 'binvNumber',
  },
]

function formHistoryTableData(
  data: TransactionsResponse[],
  transactionTypes: TransactionTypesResponse[] | undefined,
  employees: EmployeeResponse[] | undefined,
  equipmentModels: EquipmentModelResponse[] | undefined,
  departments: DepartmentResponse[] | undefined
): TransactionsResponse[] {
  // console.log('form History Table Data', data)
  const tableRows = data.map((item) => {
    return {
      ...item,
      transactionTypeName:
        transactionTypes?.find((transactionType) => transactionType.id === item.transactionTypeId)?.type ||
        'Неизвестно',
      authorName: employees?.find((employee) => +employee.id === item.issuedToId)?.userName || 'Неизвестно',
      equipmentModelName:
        equipmentModels?.find((equipment) => equipment.id === item.equipmentModelId)?.name || 'Неизвестно',
      departmentName:
        departments?.find((department) => department.id === item.departmentId)?.name || 'Неизвестно',
    }
  })
  return tableRows
}

const SiderTransactionsHistory = ({ id, invNumber }: TransactionsHistoryProps) => {
  const { data: transactionTypes } = useQuery({
    queryKey: ['transactionTypes', { origin: 'TransactionsHistory' }],
    queryFn: async () => {
      const resp = await api.transactionTypes.getAll()
      return resp.data
    },
  })

  const { data: employees } = useQuery({
    queryKey: ['employee', 'department', { origin: 'TransactionsHistory' }],
    queryFn: async () => {
      const resp = await api.users.getAllUsers()
      return resp.data
    },
  })

  const { data: equipmentModels } = useQuery({
    queryKey: ['equipmentModel', { origin: 'TransactionsHistory' }],
    queryFn: async () => {
      const resp = await api.equipmentModel.getAll()
      return resp.data
    },
  })

  const { data: departments } = useQuery({
    queryKey: ['department', { origin: 'TransactionsHistory' }],
    queryFn: async () => {
      const resp = await api.department.getAll()
      return resp.data
    },
  })

  const { data: transactionsHistory, isLoading } = useQuery({
    queryKey: ['transactionsHistory', transactionTypes, employees, { origin: 'TransactionsHistory', id }],
    queryFn: async () => {
      const resp = await api.transactions.getAllById(id, invNumber)
      const tableData = formHistoryTableData(
        resp.data,
        transactionTypes,
        employees,
        equipmentModels,
        departments
      )
      return tableData
    },
    enabled: !!id,
  })

  return (
    <>
      <Typography.Title level={4}>История</Typography.Title>
      <Table
        scroll={{ x: 3100, y: 'auto' }}
        loading={isLoading}
        columns={columns}
        dataSource={transactionsHistory}
        rowKey='id'
        pagination={false}
      />
    </>
  )
}

export default SiderTransactionsHistory
