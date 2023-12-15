import { useState, useEffect } from 'react'
import { SettingsType } from '../../hooks/useEquipmentTableSettings'
import { Typography, Switch, Button } from 'antd'
import styles from './SettingsAsideContent.module.scss'

interface SettingsPopupProps {
  settings: SettingsType
  handleSettingsChange: (settingsClone: SettingsType) => void
  handleAsideClose: () => void
}

export default function SettingsAsideContent({
  settings,
  handleSettingsChange,
  handleAsideClose,
}: SettingsPopupProps) {
  const [currentSettings, setCurrentSettings] = useState<SettingsType>(structuredClone(settings))
  const keys = Object.keys(currentSettings) as Array<keyof SettingsType>

  useEffect(() => {
    setCurrentSettings(structuredClone(settings))
  }, [settings])

  function handleSettingsReset() {
    keys.forEach((key) => {
      setCurrentSettings((oldSettings) => {
        return {
          ...oldSettings,
          [key]: {
            ...oldSettings[key],
            shownSetting: true,
          },
        }
      })
    })
  }

  return (
    <div>
      <Typography.Title level={3} className={styles.asideTitle}>
        Редактировать таблицу
      </Typography.Title>
      <div className={styles.container}>
        {keys.map((key, index) => {
          return (
            <div key={key + index} className={styles.item}>
              <Typography.Text>{currentSettings[key].title}</Typography.Text>
              <Switch
                checked={currentSettings[key].shownSetting}
                onChange={(checked: boolean) => {
                  setCurrentSettings((oldSettings) => {
                    return {
                      ...oldSettings,
                      [key]: {
                        ...oldSettings[key],
                        shownSetting: checked,
                      },
                    }
                  })
                }}
              />
            </div>
          )
        })}
      </div>

      <div className={styles.buttonsContainer}>
        <Button onClick={handleSettingsReset}>Сбросить</Button>
        <Button
          type='primary'
          className={styles.buttonPrimary}
          onClick={() => {
            handleSettingsChange(currentSettings)
            handleAsideClose()
          }}>
          Применить
        </Button>
      </div>
    </div>
  )
}
