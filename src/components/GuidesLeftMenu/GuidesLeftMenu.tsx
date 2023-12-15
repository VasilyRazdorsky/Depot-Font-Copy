import { Tabs } from 'antd'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { guideTypes } from '../../pages/GuidesPage/GuidesPage'

interface GuidesLeftMenuProps {
  setType: Dispatch<SetStateAction<guideTypes>>
}

export const items = [
  { label: 'Отделы', key: 'department' },
  { label: 'Кабинеты', key: 'area' },
  { label: 'Типы', key: 'equipmentTypes' },
  { label: 'Производители', key: 'equipmentManufactures' },
  { label: 'Модели', key: 'equipmentModel' },
]

const GuidesLeftMenu = ({ setType }: GuidesLeftMenuProps): JSX.Element => {
  useEffect(() => setType('department'), [])
  return (
    <Tabs
      tabPosition='left'
      items={items}
      defaultActiveKey='departments'
      style={{ height: '100vh', position: 'sticky', top: 0 }}
      renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} style={{ width: '100%' }} />}
      onTabClick={(key) => setType(key as guideTypes)}
    />
  )
}

export default GuidesLeftMenu
