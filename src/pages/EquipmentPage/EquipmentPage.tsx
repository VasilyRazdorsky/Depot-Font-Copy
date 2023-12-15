import { Card, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import EquipmentSider from '../../components/EquipmentSider'
import EquipmentTable from '../../components/EquipmentTable'
import NewEquipmentSider from '../../components/NewEquipmentSider'
import SettingsAsideContent from '../../components/SettingsAsideContent'
import { useTableSettings } from '../../hooks/useEquipmentTableSettings'
import styles from './EquipmentPage.module.scss'
import FiltersAsideContent from '../../components/FiltersAsideContent'
import { useTableData } from '../../hooks/useEquipmentTableData'

const EquipmentPage = () => {
  const { data, isLoading } = useTableData()
  const settingsFromStorage = localStorage.getItem('mainTableSettings')
  const { settings, handleSettingsChange } = useTableSettings(
    settingsFromStorage ? JSON.parse(settingsFromStorage) : null
  )
  const [asideMode, setAsideMode] = useState<AsideMode>('default')
  const [currentEquipment, setCurrentEquipment] = useState<EquipmentWithDescription>(
    {} as EquipmentWithDescription
  )
  const [showArchived, setShowArchived] = useState(localStorage.getItem('showArchived') === 'true')

  return (
    <Card className={styles.card} bodyStyle={{ padding: 0 }}>
      <Row>
        <Col span={14} className={styles.tableColumn}>
          <EquipmentTable
            setCurrentEquipment={setCurrentEquipment}
            settings={settings}
            tableData={data}
            tableLoading={isLoading}
            asideMode={asideMode}
            setAsideMode={setAsideMode}
            showArchived={showArchived}
          />
        </Col>
        <Col span={10}>
          <aside className={styles.equipmentAside}>
            {asideMode === 'newEquipment' ? (
              <NewEquipmentSider onAsideModeChange={setAsideMode} />
            ) : (
              <EquipmentSider receivedEquipment={currentEquipment} />
            )}
          </aside>
        </Col>

        <Col
          span={10}
          className={`${styles.tableSettingsAside} ${
            asideMode === 'settings' && styles.tableSettingsAsideOpened
          }`}>
          <SettingsAsideContent
            settings={settings}
            handleSettingsChange={handleSettingsChange}
            handleAsideClose={() => setAsideMode('default')}
          />
        </Col>

        <Col
          span={10}
          className={`${styles.tableSettingsAside} ${
            asideMode === 'filters' && styles.tableSettingsAsideOpened
          }`}>
          <FiltersAsideContent
            settings={settings}
            handleSettingsChange={handleSettingsChange}
            data={data}
            handleAsideClose={() => setAsideMode('default')}
            handleShowArhivedChange={setShowArchived}
            showArchived={showArchived}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default EquipmentPage
