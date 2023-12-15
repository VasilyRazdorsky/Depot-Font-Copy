import styles from './FiltersAsideContent.module.scss'
import { Typography, TreeSelect, Button, Switch } from 'antd'
import { SettingsType, DataIndexType } from '../../hooks/useEquipmentTableSettings'
import type { SelectProps } from 'antd'
import { useEffect, useState, Fragment, Dispatch, SetStateAction } from 'react'
import { DefaultOptionType } from 'antd/es/select'
import ChooseAllSelect from '../ChooseAllSelect'

interface FiltersPopupContentProps {
  settings: SettingsType
  handleSettingsChange: (settingsClone: SettingsType) => void
  data: EquipmentWithDescription[] | undefined
  handleAsideClose: () => void
  handleShowArhivedChange: Dispatch<SetStateAction<boolean>>
  showArchived: boolean
}

export default function FiltersAsideContent({
  settings,
  handleSettingsChange,
  data,
  handleAsideClose,
  handleShowArhivedChange,
  showArchived,
}: FiltersPopupContentProps) {
  const [currentSettings, setCurrentSettings] = useState<SettingsType>(structuredClone(settings))
  const keys = Object.keys(currentSettings) as Array<keyof SettingsType>
  const [archived, setArchived] = useState(showArchived)

  useEffect(() => {
    setCurrentSettings(structuredClone(settings))
  }, [settings])

  function handleDataParse(filterOption: DataIndexType) {
    const filterOptionNames = data?.map((equipment) => {
      return equipment[filterOption] || ''
    })

    const arrayWithOptions: SelectProps['options'] = [...new Set(filterOptionNames)].map((equipment) => {
      return {
        label: equipment.toString(),
        value: equipment.toString(),
      }
    })

    return arrayWithOptions
  }

  function handleFiltersOptionsChange(
    key: keyof SettingsType,
    newFiltersOptions: (string | undefined)[] | DefaultOptionType[]
  ) {
    setCurrentSettings((oldSettings) => {
      return {
        ...oldSettings,
        [key]: {
          ...oldSettings[key],
          filtersOptions: newFiltersOptions,
        },
      }
    })
  }

  function handleFiltersReset() {
    keys.forEach((key) => {
      if ('filtersOptions' in currentSettings[key]) {
        handleFiltersOptionsChange(key, [])
      }
    })
  }

  // TODO поменять контейнер на фрагмент если не будет стилей
  return (
    <Fragment>
      <Typography.Title level={3} className={styles.asideTitle}>
        Фильтрация
      </Typography.Title>
      <div className={styles.selectsContainer}>
        {keys.map((key, index) => {
          const currentColumnFilters = handleDataParse(currentSettings[key].dataIndex).filter((item) => {
            return item.value !== '-'
          })
          const defaultValues = currentColumnFilters.filter((filter) => {
            return currentSettings[key].filtersOptions?.includes(filter.value?.toString() || '')
          })
          return (
            currentSettings[key].filtersOptions && (
              <div key={key + index} className={styles.selectBlock}>
                <Typography.Text>{currentSettings[key].title}</Typography.Text>
                <TreeSelect
                  allowClear
                  placeholder='Введите название'
                  className={styles.select}
                  treeCheckable={true}
                  onChange={(value) => {
                    handleFiltersOptionsChange(key, value)
                  }}
                  value={defaultValues}
                  treeData={[
                    {
                      title: (
                        <ChooseAllSelect
                          currentFilterValues={currentSettings[key].filtersOptions?.filter((item) => {
                            return item !== '-'
                          })}
                          optionKey={key}
                          currentColumnFilters={currentColumnFilters}
                          handleFiltersOptionsChange={handleFiltersOptionsChange}
                        />
                      ),
                      checkable: false,
                    },
                    ...currentColumnFilters,
                  ]}
                />
              </div>
            )
          )
        })}
        <div className={styles.selectBlock}>
          <Typography.Text>Показать архивированное</Typography.Text>
          <Switch checked={archived} onChange={() => setArchived((oldState) => !oldState)} />
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <Button
          onClick={() => {
            handleFiltersReset()
            setArchived(false)
          }}>
          Cбросить
        </Button>
        <Button
          type='primary'
          className={styles.buttonPrimary}
          onClick={() => {
            handleSettingsChange(currentSettings)
            handleShowArhivedChange(archived)
            localStorage.setItem('showArchived', archived.toString())
            handleAsideClose()
          }}>
          Применить
        </Button>
      </div>
    </Fragment>
  )
}
