import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { IoMdClose } from 'react-icons/io'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

import Login from './login/Login'
import Register from './register/Register'
import Logout from './logout/Logout'
import styles from './AuthForm.module.css'
import { checkIsAuth } from '../../../redux/slices/authSlice'

const AuthForm = () => {
  const routerNavigator = useRouteNavigator()
  const isAuth = useSelector(checkIsAuth)
  const [showComponent, setShowComponent] = useState('login')
  const [closeForm, setCloseForm] = useState(false)

  useEffect(() => {
    if (closeForm) {
      routerNavigator.push('/')
    }
  }, [closeForm, routerNavigator])

  return (
    <>
      {!isAuth && (
        <div className={styles.section}>
          <IoMdClose
            size={30}
            className={styles.icon_close}
            onClick={() => setCloseForm(true)}
          />
          {showComponent === 'login' && (
            <Login showRegister={setShowComponent} />
          )}
          {showComponent === 'register' && (
            <Register showLogin={setShowComponent} />
          )}
        </div>
      )}
      {isAuth && (
        <div className={styles.section}>
          <IoMdClose
            size={30}
            className={styles.icon_close}
            onClick={() => setCloseForm(true)}
          />
          <Logout />
        </div>
      )}
    </>
  )
}

export default AuthForm
