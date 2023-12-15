import { useState } from 'react'

export type DataIndexType = keyof EquipmentWithDescription

export interface SettingType {
  title: string
  dataIndex: DataIndexType
  shownSetting: boolean
  filtersOptions?: string[]
}

export interface SettingsType {
  glType: SettingType
  equipmentModelName: SettingType
  invNumber: SettingType
  snNumber: SettingType
  binvNumber: SettingType
  mot: SettingType
  area: SettingType
  employeeName: SettingType
  departmentName: SettingType
  equipmentModelType: SettingType
  status: SettingType
  comment: SettingType
}

export function useTableSettings(defaultSettings: SettingsType | null | undefined) {
  const [settings, setSettings] = useState<SettingsType>(
    defaultSettings || {
      glType: {
        title: 'Тип',
        dataIndex: 'glType',
        shownSetting: true,
        filtersOptions: [],
      },
      equipmentModelName: {
        title: 'Модель',
        dataIndex: 'equipmentModelName',
        shownSetting: true,
        filtersOptions: [],
      },
      invNumber: {
        title: 'Инв. номер',
        dataIndex: 'invNumber',
        shownSetting: true,
        filtersOptions: [],
      },
      snNumber: {
        title: 'Серийный',
        dataIndex: 'snNumber',
        shownSetting: true,
        filtersOptions: [],
      },
      binvNumber: {
        title: 'Бух. номер',
        dataIndex: 'binvNumber',
        shownSetting: true,
        filtersOptions: [],
      },
      mot: {
        title: 'МОЛ',
        dataIndex: 'mot',
        shownSetting: true,
        filtersOptions: [],
      },
      area: {
        title: 'МОО',
        dataIndex: 'area',
        shownSetting: true,
        filtersOptions: [],
      },
      employeeName: {
        title: 'Сотрудник',
        dataIndex: 'employeeName',
        shownSetting: true,
        filtersOptions: [],
      },
      departmentName: {
        title: 'Департамент',
        dataIndex: 'departmentName',
        shownSetting: true,
        filtersOptions: [],
      },
      equipmentModelType: {
        title: 'Тип модели',
        dataIndex: 'equipmentModelType',
        shownSetting: true,
        filtersOptions: [],
      },
      status: {
        title: 'Статус',
        dataIndex: 'status',
        shownSetting: true,
        filtersOptions: [],
      },
      comment: { title: 'Комментарий', dataIndex: 'comment', shownSetting: true },
    }
  )

  function handleSettingsChange(settingsClone: SettingsType) {
    localStorage.setItem('mainTableSettings', JSON.stringify(settingsClone))
    setSettings(settingsClone)
  }

  return { settings, handleSettingsChange }
}
