import { Panel } from '@vkontakte/vkui'

import styles from './AuthPage.module.css'
import AuthForm from './auth-form/AuthForm'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'


const AuthPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.main}>
        <AuthForm />
      </div>
      <Footer />
    </Panel>
  )
}

export default AuthPage
