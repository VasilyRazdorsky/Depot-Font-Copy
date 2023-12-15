import { Divider, Row, Typography } from 'antd'
import Table from 'antd/es/table'
import { useState, useEffect, useMemo } from 'react'
import { api } from '../../api'
import { useTableData, formTableData } from '../../hooks/useEquipmentTableData'
import { SettingsType, useTableSettings } from '../../hooks/useEquipmentTableSettings'

interface SiderFamilyProps {
  invNumber: number
}

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

function formTableColumns(chosenSettings: SettingsType) {
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
      }

      columns.push(newColumn)
    }
  })

  return columns
}

const SiderFamily = ({ invNumber }: SiderFamilyProps) => {
  const { departments, equipmentModels, equipmentTypes, areas, statuses, employees, globalTypes } =
    useTableData()
  const { settings } = useTableSettings(null)
  const currentChildrenColumns = useMemo(() => {
    return formTableColumns(settings)
  }, [settings])
  const [currentChildrenRows, setCurrentChildrenRows] = useState<EquipmentWithDescription[] | null>(null)
  const [currentParentRow, setCurrentParentRow] = useState<EquipmentWithDescription[] | null>(null)

  async function getCurrentEquipmentChildren() {
    const { data: childrenData } = await api.equipment.getChildren(invNumber)

    setCurrentChildrenRows(() => {
      if (childrenData.length !== 0) {
        return formTableData(
          childrenData,
          departments,
          equipmentModels,
          equipmentTypes,
          employees,
          areas,
          globalTypes,
          statuses
        )
      } else {
        return null
      }
    })
  }

  async function getCurrentEquipmentParent() {
    const { data: parentData } = await api.equipment.getParent(invNumber)

    setCurrentParentRow(() => {
      if (parentData) {
        return formTableData(
          [parentData],
          departments,
          equipmentModels,
          equipmentTypes,
          employees,
          areas,
          globalTypes,
          statuses
        )
      } else {
        return null
      }
    })
  }

  useEffect(() => {
    getCurrentEquipmentChildren()
    getCurrentEquipmentParent()
  }, [invNumber])

  return (
    <>
      {currentParentRow && (
        <>
          <Divider style={{ marginTop: '40px', marginBottom: '19px' }} />
          <Typography.Title level={4}>Часть от</Typography.Title>
          <Table
            columns={currentChildrenColumns}
            dataSource={currentParentRow}
            scroll={{ x: currentChildrenColumns.length * 123 }}
            size='small'
            rowKey='id'
            pagination={false}
            bordered
          />
        </>
      )}

      {currentChildrenRows && (
        <>
          <Divider style={{ marginBottom: '19px' }} />
          <Row justify='start' align='middle'>
            <Typography.Title level={4} style={{ marginTop: 0, marginBottom: '17px' }}>
              Содержимое
            </Typography.Title>
            <Table
              columns={currentChildrenColumns}
              dataSource={currentChildrenRows}
              scroll={{ x: currentChildrenColumns.length * 123 }}
              size='small'
              rowKey='id'
              pagination={false}
              bordered
            />
          </Row>
        </>
      )}
    </>
  )
}

export default SiderFamily
