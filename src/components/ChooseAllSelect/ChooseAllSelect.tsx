import { useState, useEffect } from 'react'
import styles from './ChooseAllSelect.module.scss'
import { Checkbox } from 'antd'
import { SettingsType } from '../../hooks/useEquipmentTableSettings'
import { DefaultOptionType } from 'antd/es/select'

interface ChooseAllSelectProps {
  optionKey: keyof SettingsType
  currentColumnFilters: DefaultOptionType[]
  handleFiltersOptionsChange: (
    key: keyof SettingsType,
    newFiltersOptions: (string | undefined)[] | DefaultOptionType[]
  ) => void
  currentFilterValues: string[] | undefined
}

export default function ChooseAllSelect({
  optionKey,
  currentColumnFilters,
  handleFiltersOptionsChange,
  currentFilterValues,
}: ChooseAllSelectProps) {
  const [checkAll, setCheckAll] = useState(false)

  function handleCheckBoxChange(key: keyof SettingsType, currentColumnFilters: DefaultOptionType[]) {
    if (!checkAll) {
      setCheckAll(true)
      const currentFilterOptions = currentColumnFilters.map((item) => item.value?.toString())
      handleFiltersOptionsChange(key, currentFilterOptions)
    } else {
      setCheckAll(false)
      handleFiltersOptionsChange(key, [])
    }
  }

  useEffect(() => {
    const currentFilters = currentColumnFilters.map((item) => item.value?.toString())
    const allAvailableFilters = currentFilterValues?.sort()
    if (JSON.stringify(currentFilters) !== JSON.stringify(allAvailableFilters)) {
      setCheckAll(false)
    } else if (JSON.stringify(currentFilters) === JSON.stringify(allAvailableFilters)) {
      setCheckAll(true)
    }
  }, [currentColumnFilters])

  return (
    <div
      className={styles.customSelectOption}
      onClick={() => {
        handleCheckBoxChange(optionKey, currentColumnFilters)
      }}>
      <Checkbox checked={checkAll} className={styles.customCheckbox} />
      <span>Выбрать все</span>
    </div>
  )
}
