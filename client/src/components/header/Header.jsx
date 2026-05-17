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
  const { user } = useSelector((state) => state.profile)
  const isAuth = useSelector(checkIsAuth)

  return (
    <div className={styles.header}>
      <div className={styles.header_wrapper}>
        {/* Левый блок теперь объединяет меню и логотип на смартфонах */}
        <div className={styles.left_block}>
          <DropdownMenu />
          <div className={styles.logo_wrap} onClick={() => routerNavigator.replace('/')}>
            <GiOlive size={25} className={styles.logo_icon} />
            <span className={styles.logo_title}>говори смело</span>
          </div>
        </div>

        <div className={styles.right_block}>
          {isAuth ? (
            <div 
              className={styles.profile_widget} 
              onClick={() => routerNavigator.push('/auth')}
            >
              <div className={styles.status_badge}>
                {user?.level && (
                  <>
                    {/* На больших экранах пишем полностью, на маленьких — "Ур." */}
                    <span className={`${styles.status_text} ${styles.level_full}`}>Lvl {user.level}</span>
                    <span className={`${styles.status_text} ${styles.level_short}`}>Lvl {user.level}</span>
                  </>
                )}
                {user?.level && user?.xp !== undefined && (
                  <span className={styles.divider}>|</span>
                )}
                {user?.xp !== undefined && (
                  <span className={styles.status_text}>{user.xp} XP</span>
                )}
              </div>
              
              <Avatar
                size={34}
                className={styles.avatar}
                src={user?.avatar}
              >
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : '+'}
              </Avatar>
            </div>
          ) : (
            <Avatar
              icon={<FiUser size={22} />}
              size={34}
              className={styles.avatar}
              onClick={() => routerNavigator.push('/auth')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
