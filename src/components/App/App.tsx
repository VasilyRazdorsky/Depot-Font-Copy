import { Layout, Tabs } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import EquipmentPage from '../../pages/EquipmentPage'
import GuidesPage from '../../pages/GuidesPage'
import UsersPage from '../../pages/UsersPage'
import LogoutButton from '../LogoutButton'
import styles from './App.module.scss'

interface Tab {
  key: string
  label: string
}

const items: Tab[] = [
  {
    label: 'Оборудование',
    key: 'equipment',
    // icon: <MailOutlined />,
  },
  {
    label: 'Справочники',
    key: 'guides',
    // icon: <AppstoreOutlined />,
  },
  {
    label: 'Пользователи',
    key: 'users',
  },
]

const handleHistory = () =>
  window.location.pathname === '/' || window.location.pathname === '/equipment'
    ? 'equipment'
    : window.location.pathname === '/guides'
    ? 'guides'
    : window.location.pathname === '/users'
    ? 'users'
    : 'equipment'

export const App = () => {
  const [currentPage, setCurrentPage] = useState(handleHistory)

  const onTabClick = (key: string) => {
    setCurrentPage(key)
    history.pushState(null, '', key)
  }

  const handleHistoryBack = () => setCurrentPage(handleHistory)

  useEffect(() => {
    window.addEventListener('popstate', handleHistoryBack)
    return () => window.removeEventListener('popstate', handleHistoryBack)
  }, [])

  return (
    <Layout className={styles.App}>
      <Header className={styles.Header}>
        <Tabs size='large' items={items} activeKey={currentPage} onTabClick={onTabClick} />
        <LogoutButton />
      </Header>
      <Content className='content'>
        {currentPage === 'equipment' ? (
          <EquipmentPage />
        ) : currentPage === 'guides' ? (
          <GuidesPage />
        ) : currentPage === 'users' ? (
          <UsersPage />
        ) : (
          <EquipmentPage />
        )}
      </Content>
    </Layout>
  )
}
