import { Button } from 'antd'

function handleLogout() {
  localStorage.removeItem('token')
  location.reload()
}

export default function LogoutButton() {
  return (
    <Button type='link' danger onClick={handleLogout} size='large'>
      Выйти
    </Button>
  )
}
