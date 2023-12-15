import { Button, Input, Row, Select, Space, Table, Typography } from 'antd'
import { Dispatch, SetStateAction, useState, useMemo, useEffect, ChangeEventHandler } from 'react'
import { FilterOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'

import { SettingsType } from '../../hooks/useEquipmentTableSettings'

import styles from './EquipmentTable.module.scss'

interface ColumnType {
  title: string
  dataIndex: string
  key?: string
  sorter?: (a: EquipmentWithDescription, b: EquipmentWithDescription) => number
  sortDirections?: string[]
  defaultSortOrder?: string
  filteredValue?: string[][]
  onFilter?: (value: string[], record: EquipmentWithDescription) => boolean
}

function filterTableData(
  equipmentData: EquipmentWithDescription[],
  settings: SettingsType,
  showArchived: boolean
): EquipmentWithDescription[] {
  const columnsKeys = Object.keys(settings) as Array<keyof SettingsType>
  const filteredTableRows = equipmentData.filter((item) => {
    if ((!item.archived && !showArchived) || showArchived) {
      const matchFilters = columnsKeys.every((key) => {
        const filtersOptions = settings[key].filtersOptions
        return (
          !filtersOptions ||
          filtersOptions.length === 0 ||
          filtersOptions.includes(item[key]?.toString() || '')
        )
      })
      return matchFilters
    } else {
      return null
    }
  })
  return filteredTableRows
}

function formTableColumns(chosenSettings: SettingsType) {
  // initial array
  const columns: ColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: EquipmentWithDescription, b: EquipmentWithDescription) => a.id - b.id,
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'ascend',
    },
  ]

  // prepare array
  const keys = Object.keys(chosenSettings) as Array<keyof SettingsType>
  keys.forEach((key) => {
    const currentDataIndex = chosenSettings[key].dataIndex
    if (chosenSettings[key].shownSetting) {
      const newColumn: ColumnType = {
        title: chosenSettings[key].title,
        dataIndex: currentDataIndex,
      }

      if (currentDataIndex !== 'comment') {
        newColumn.key = chosenSettings[key].dataIndex
        newColumn.sorter = (a: EquipmentWithDescription, b: EquipmentWithDescription) => {
          if (currentDataIndex === 'invNumber') {
            return a.invNumber - b.invNumber
          }
          return ('' + a[currentDataIndex]).localeCompare('' + b[currentDataIndex])
        }

        newColumn.sortDirections = ['ascend', 'descend', 'ascend']
        const currentFiltersOptions = chosenSettings[key].filtersOptions
        if (currentFiltersOptions && currentFiltersOptions.length !== 0) {
          newColumn.filteredValue = [currentFiltersOptions]

          newColumn.onFilter = (value, record) => {
            // record is an object with all equipment properties, we need a key to filter, this key is a value of dataIndex of current option
            const recordKey = currentDataIndex as keyof EquipmentWithDescription

            // if selectors are empty
            if (currentFiltersOptions.length === 0) {
              return true
            }

            return currentFiltersOptions.includes(record[recordKey]?.toString() || '')
          }
        }
      }

      columns.push(newColumn)
    }
  })

  return columns
}

function filterTableDataBySearch(
  tableData: EquipmentWithDescription[] | undefined,
  searchString: string,
  settingToSearch: SettingToSearch | SettingToSearch[]
) {
  if (tableData) {
    if (searchString.length !== 0) {
      const filteredTableData = tableData.filter((item) => {
        if (isNaN(parseInt(item[settingToSearch.value]))) {
          return item[settingToSearch.value].toLowerCase().includes(searchString.toLocaleLowerCase())
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

function getSearchSettings(settings: SettingsType) {
  const keys = Object.keys(settings) as Array<keyof SettingsType>
  const settingsToSearch: SettingToSearch[] = []

  keys.forEach((key) => {
    if (key !== 'comment')
      settingsToSearch.push({
        label: settings[key].title,
        value: settings[key].dataIndex,
      })
  })

  return settingsToSearch
}

interface EquipmentTableProps {
  setCurrentEquipment: Dispatch<SetStateAction<EquipmentWithDescription>>
  settings: SettingsType
  tableData: EquipmentWithDescription[] | undefined
  tableLoading: boolean
  asideMode: AsideMode
  setAsideMode: Dispatch<SetStateAction<AsideMode>>
  showArchived: boolean
}
const EquipmentTable = ({
  setCurrentEquipment,
  settings,
  tableData,
  tableLoading,
  asideMode,
  setAsideMode,
  showArchived,
}: EquipmentTableProps) => {
  const currentColumns = useMemo(() => {
    return formTableColumns(settings)
  }, [settings])
  const [currentRows, setCurrentRows] = useState<EquipmentWithDescription[]>()
  const [searchValue, setSearchValue] = useState('')
  const [selectedSettingToSearch, setSelectedSettingToSearch] = useState<SettingToSearch | SettingToSearch[]>(
    {
      label: 'Модель',
      value: 'equipmentModelName',
    }
  )

  useEffect(() => {
    if (tableData) {
      setCurrentRows(() => {
        return filterTableData(tableData, settings, showArchived)
      })
    }
  }, [tableData, settings])

  return (
    // TODO add error handling
    <>
      <Row className={styles.row}>
        <Typography.Title level={3} className={styles.tableTitle}>
          Все оборудование
        </Typography.Title>
        <div className={styles.buttonsContainer}>
          <button
            className={styles.settingsButton}
            onClick={() => {
              if (asideMode === 'settings') {
                setAsideMode('default')
                setTimeout(() => {
                  setAsideMode('filters')
                }, 400)
              } else if (asideMode === 'filters') {
                setAsideMode('default')
              } else {
                setAsideMode('filters')
              }
            }}>
            <FilterOutlined
              className={`${styles.settingsButtonIcon} ${
                asideMode === 'filters' && styles.settingsButtonIconActive
              }`}
            />
          </button>

          <button
            className={styles.settingsButton}
            onClick={() => {
              if (asideMode === 'filters') {
                setAsideMode('default')
                setTimeout(() => {
                  setAsideMode('settings')
                }, 400)
              } else if (asideMode === 'settings') {
                setAsideMode('default')
              } else {
                setAsideMode('settings')
              }
            }}>
            <EditOutlined
              className={`${styles.settingsButtonIcon} ${
                asideMode === 'settings' && styles.settingsButtonIconActive
              }`}
            />
          </button>
          <Button
            type='primary'
            onClick={() => {
              setAsideMode('newEquipment')
            }}>
            Добавить сущность
          </Button>
        </div>
      </Row>
      <Space.Compact className={styles.search}>
        <Input
          placeholder='Поиск'
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.currentTarget.value)
          }}
          onPressEnter={() =>
            setCurrentRows(() => {
              return filterTableDataBySearch(tableData, searchValue, selectedSettingToSearch)
            })
          }
          style={{
            borderRadius: '2px',
          }}
        />
        <Select
          style={{ borderLeft: '0px', width: '30%' }}
          options={getSearchSettings(settings)}
          defaultValue={selectedSettingToSearch}
          onChange={(value, options) => {
            setSelectedSettingToSearch(options)
          }}
        />
        <Button
          type='primary'
          onClick={() =>
            setCurrentRows(() => {
              return filterTableDataBySearch(tableData, searchValue, selectedSettingToSearch)
            })
          }>
          <SearchOutlined />
        </Button>
      </Space.Compact>
      <Table
        scroll={{ x: currentColumns.length * 150 }}
        sticky
        size='small'
        loading={tableLoading}
        columns={currentColumns}
        dataSource={currentRows}
        rowKey='id'
        pagination={false}
        bordered
        rowSelection={{
          type: 'radio',
          checkStrictly: false,
          hideSelectAll: true,
          onSelect: (e) => {
            setCurrentEquipment(e)
            setAsideMode('default')
          },
        }}
        className={styles.table}
      />
    </>
  )
}

export default EquipmentTable
