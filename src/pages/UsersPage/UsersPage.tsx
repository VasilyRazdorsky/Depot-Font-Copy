import { Row, Col, Card } from 'antd'

import UsersTable from '../../components/UsersTable'
import UsersSider from '../../components/UsersSider'

import styles from './UsersPage.module.scss'
import { useState } from 'react'
import NewUserSider from '../../components/NewUserSider'

export function UsersPage() {
  const [chosenUser, setChosenUser] = useState<EmployeeResponseExtended>({} as EmployeeResponseExtended)
  const [asideMode, setAsideMode] = useState<AsideModeUsersType>('default')

  return (
    <Card className={styles.card} bodyStyle={{ padding: 0 }}>
      <Row>
        <Col span={14} className={styles.tableColumn}>
          <UsersTable setChosenUser={setChosenUser} handleAsideModeChange={setAsideMode} />
        </Col>

        <Col span={10}>
          <aside className={styles.userAside}>
            {asideMode === 'newUser' ? (
              <NewUserSider handleAsideModeChange={setAsideMode} />
            ) : (
              <UsersSider chosenUser={chosenUser} />
            )}
          </aside>
        </Col>
      </Row>
    </Card>
  )
}
