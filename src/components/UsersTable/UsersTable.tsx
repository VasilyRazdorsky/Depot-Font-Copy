import { Row, Typography, Button, Table, Space, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import styles from './UsersTable.module.scss'
import { api } from '../../api'

const tableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: (a: EmployeeResponseExtended, b: EmployeeResponseExtended) => a.id - b.id,
    sortDirections: ['ascend', 'descend', 'ascend'],
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Фамилия',
    dataIndex: 'surname',
    key: 'surname',
    sorter: (a: EmployeeResponseExtended, b: EmployeeResponseExtended) =>
      ('' + a.surname).localeCompare('' + b.surname),
    sortDirections: ['ascend', 'descend', 'ascend'],
  },
  {
    title: 'Имя',
    dataIndex: 'name',
    key: 'name',
    sorter: (a: EmployeeResponseExtended, b: EmployeeResponseExtended) =>
      ('' + a.name).localeCompare('' + b.name),
    sortDirections: ['ascend', 'descend', 'ascend'],
  },
  {
    title: 'Отчество',
    dataIndex: 'patronymic',
    key: 'patronymic',
    sorter: (a: EmployeeResponseExtended, b: EmployeeResponseExtended) =>
      ('' + a.patronymic).localeCompare('' + b.patronymic),
    sortDirections: ['ascend', 'descend', 'ascend'],
  },
  {
    title: 'Логин',
    dataIndex: 'email',
    key: 'email',
    sorter: (a: EmployeeResponseExtended, b: EmployeeResponseExtended) =>
      ('' + a.email).localeCompare('' + b.email),
    sortDirections: ['ascend', 'descend', 'ascend'],
  },
  {
    title: 'Телефон',
    dataIndex: 'phone',
    key: 'phone',
  },
]

function formTableData(usersData: EmployeeResponse[]): EmployeeResponseExtended[] {
  const tableRows = usersData.map((user) => {
    const fioSplit = user.fio.split(' ')
    return {
      ...user,
      surname: fioSplit[0],
      name: fioSplit[1],
      patronymic: fioSplit[2],
    }
  })

  return tableRows
}

const searchOptions = tableColumns
  .filter((column) => {
    return column.dataIndex !== 'id'
  })
  .map((column) => {
    return { value: column.dataIndex, label: column.title }
  })

const filterTableBySearch = (
  tableData: EmployeeResponseExtended[] | undefined,
  searchString: string,
  settingToSearch: SettingToSearch | SettingToSearch[]
) => {
  if (tableData) {
    if (searchString.length !== 0) {
      const filteredTableData = tableData.filter((item) => {
        if (isNaN(parseInt(item[settingToSearch.value]))) {
          return item[settingToSearch.value].toLowerCase().startsWith(searchString.toLocaleLowerCase())
        }
        return item[settingToSearch.value].toString() === searchString
      })
      return filteredTableData
    } else {
      return tableData
    }
  }
  return []
}

interface UsersTableProps {
  setChosenUser: Dispatch<SetStateAction<EmployeeResponseExtended>>
  handleAsideModeChange: Dispatch<SetStateAction<AsideModeUsersType>>
}

export function UsersTable({ setChosenUser, handleAsideModeChange }: UsersTableProps) {
  const [selectedSettingToSearch, setSelectedSettingToSearch] = useState<SettingToSearch | SettingToSearch[]>(
    {
      value: 'surname',
      label: 'Фамилия',
    }
  )
  const [searchValue, setSearchValue] = useState('')

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const resp = await api.users.getAllUsers()
      const tableData = formTableData(resp.data)
      return tableData
    },
  })

  const [currentRows, setCurrentRows] = useState<EmployeeResponseExtended[]>()

  useEffect(() => {
    if (users) {
      setCurrentRows(users)
    }
  }, [users])

  return (
    <>
      <Row className={styles.row}>
        <Typography.Title level={3} className={styles.tableTitle}>
          Пользователи
        </Typography.Title>
        <div className={styles.buttonsContainer}>
          <Button type='primary' onClick={() => handleAsideModeChange('newUser')}>
            Добавить пользователя
          </Button>
        </div>

        <Space.Compact className={styles.search}>
          <Input
            placeholder='Поиск'
            style={{
              borderRadius: '2px',
            }}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value)
            }}
            onPressEnter={() =>
              setCurrentRows(filterTableBySearch(users, searchValue, selectedSettingToSearch))
            }
          />
          <Select
            style={{ borderLeft: '0px', width: '30%' }}
            options={searchOptions}
            defaultValue={selectedSettingToSearch}
            onChange={(value, options) => {
              setSelectedSettingToSearch(options)
            }}
          />
          <Button
            type='primary'
            onClick={() => {
              setCurrentRows(filterTableBySearch(users, searchValue, selectedSettingToSearch))
            }}>
            <SearchOutlined />
          </Button>
        </Space.Compact>

        <Table
          scroll={{ x: tableColumns.length * 150 }}
          sticky
          size='small'
          loading={usersLoading}
          columns={tableColumns}
          dataSource={currentRows}
          rowKey='id'
          pagination={false}
          bordered
          rowSelection={{
            type: 'radio',
            checkStrictly: false,
            hideSelectAll: true,
            onSelect: (e) => {
              setChosenUser(e)
              // setAsideMode('default')
            },
          }}
          className={styles.table}
        />
      </Row>
    </>
  )
}
