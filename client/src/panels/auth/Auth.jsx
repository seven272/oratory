import { Panel } from '@vkontakte/vkui'

import styles from './Auth.module.css'
import AuthForm from './auth-form/AuthForm'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'


const Auth = ({ id }) => {
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

export default Auth
