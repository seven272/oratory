import { Panel } from '@vkontakte/vkui'

import styles from './ShopPage.module.css'

import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import Shop from './shop/Shop'

const ShopPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.shop_page}>
        <Shop />
      </div>
      <Footer />
    </Panel>
  )
}

export default ShopPage
