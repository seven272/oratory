import React, { useEffect, useState } from 'react'
import { TbHandClick } from 'react-icons/tb'
import { FaBasketShopping, FaPeopleGroup } from 'react-icons/fa6'
import { GiDuel } from "react-icons/gi";

import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

import styles from './Footer.module.css'

const Footer = () => {
  const [year, setYear] = useState('')
  const [activeItem, setActiveItem] = useState(null)
  const routeNavigator = useRouteNavigator()
  //Получаем текущий год
  useEffect(() => {
    const dateObj = new Date()
    const yearNow = dateObj.getUTCFullYear()
    setYear(yearNow)
  }, [])

  const handleClick = (item) => {
    console.log(`click ${item}`)
    setActiveItem(item)
  }

  return (
    <footer className={styles.footer}>
      <ul className={styles.btns}>
        <li
          className={`${styles.btn} ${activeItem === 1 ? styles.active : ''}`}
          onClick={() => handleClick(1)}
        >
          <FaBasketShopping
            size={25}
            className={styles.btn_icon}
            onClick={() => routeNavigator.go('/shop')}
          />
          <span className={styles.btn_title}>Магазин</span>
        </li>
        <li
          className={`${styles.btn} ${activeItem === 2 ? styles.active : ''}`}
          onClick={() => routeNavigator.go('/challenges')}
        >
          <FaPeopleGroup size={25} className={styles.btn_icon} />
          <span className={styles.btn_title}>Реальные испытания</span>
        </li>

        <li
          className={`${styles.btn} ${activeItem === 3 ? styles.active : ''}`}
          onClick={() => routeNavigator.go('/live-duel')}
        >
          <GiDuel size={25} className={styles.btn_icon} />
          <span className={styles.btn_title}>Живые дуэли</span>
        </li>

        <li
          className={`${styles.btn} ${activeItem === 4 ? styles.active : ''}`}
          onClick={() => handleClick(4)}
        >
          <TbHandClick size={25} className={styles.btn_icon} />
          <span className={styles.btn_title}>Пункт 4</span>
        </li>
      </ul>
      {/* <span className={styles.text}>
                &#169; {year}
            </span> */}
    </footer>
  )
}

export default Footer
