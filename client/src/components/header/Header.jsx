import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Avatar } from 'antd'
import { GiOlive } from 'react-icons/gi'
import { FiUser } from 'react-icons/fi'
import { useSelector } from 'react-redux'

import styles from './Header.module.css'
import DropdownMenu from '../dropdown-menu/DropdownMenu'
import { checkIsAuth } from '../../redux/slices/authSlice'

const Header = () => {
  const routerNavigator = useRouteNavigator()
  const { user } = useSelector((state) => state.auth)
  const isAuth = useSelector(checkIsAuth)

  return (
    <div className={styles.header}>
      <div className={styles.header_wrapper}>
        <DropdownMenu />
        <div className={styles.logo_wrap}>
          <GiOlive size={25} className={styles.logo_icon} />
          <span className={styles.logo_title}>говори смело</span>
        </div>
        {isAuth ? (
          <Avatar
            size={35}
            className={styles.avatar}
            onClick={() => routerNavigator.push('/auth')}
          >
            +
          </Avatar>
        ) : (
          <Avatar
            icon={<FiUser size={25} />}
            size={35}
            className={styles.avatar}
            onClick={() => routerNavigator.push('/auth')}
          />
        )}
      </div>
    </div>
  )
}

export default Header
