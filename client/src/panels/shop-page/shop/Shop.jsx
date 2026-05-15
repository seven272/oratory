import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchShopItems,
  fetchPurchaseItem,
  resetShopStatus,
} from '../../../redux/slices/shopSlice'

import styles from './Shop.module.css'

const Shop = () => {
  const dispatch = useDispatch()

  // Берем данные из профиля
  const userCoins = useSelector(
    (state) => state.profile.user?.coins || 0,
  )
  const userInventory = useSelector(
    (state) => state.profile.user?.inventory || [],
  )

  // Берем данные из магазина
  const { items, status, purchaseStatus, error } = useSelector(
    (state) => state.shop,
  )

  const iconMap = {
    freeze: '❄️',
    'theme-cyber': '🌐',
    'crown-title': '👑',
  }

  useEffect(() => {
    dispatch(fetchShopItems())

    // При размонтировании сбрасываем статус ошибок покупки
    return () => dispatch(resetShopStatus())
  }, [dispatch])

  // Следим за ошибками или успехом покупки для вывода алертов
  useEffect(() => {
    if (purchaseStatus === 'failed' && error) {
      alert(error.message || 'Ошибка транзакции')
      dispatch(resetShopStatus())
    }
  }, [purchaseStatus, error, dispatch])

  const handleBuy = (itemCode, price) => {
    if (userCoins < price) {
      alert('Недостаточно жетонов!')
      return
    }
    dispatch(fetchPurchaseItem(itemCode))
  }

  if (status === 'loading')
    return (
      <div className={styles.container}>Загрузка магазина...</div>
    )
  if (status === 'failed')
    return (
      <div className={styles.container}>
        Не удалось загрузить витрину
      </div>
    )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Магазин Жетонов</h2>
        <div className={styles.balanceBadge}>
          🪙 {userCoins} жетонов
        </div>
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const isOwned = userInventory.some(
            (inv) => inv.itemCode === item.code,
          )
          const isUnique = item.category !== 'utility'
          const isBuying = purchaseStatus === 'loading'

          return (
            <div key={item.code} className={styles.card}>
              <div className={styles.iconBox}>
                {iconMap[item.icon] || '📦'}
              </div>

              <div className={styles.info}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.description}>
                  {item.description}
                </span>
              </div>

              <button
                className={styles.buyButton}
                disabled={(isUnique && isOwned) || isBuying}
                onClick={() => handleBuy(item.code, item.price)}
              >
                {isUnique && isOwned ? 'Куплено' : `🪙 ${item.price}`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Shop
