import React, { useEffect, useState } from 'react'
import { TbHandClick } from "react-icons/tb";

import styles from './Footer.module.css'

const Footer = () => {
  const [year, setYear] = useState('')
  const [activeItem, setActiveItem] = useState(null)
  //Получаем текущий год
  useEffect(() => {
    const dateObj = new Date()
    const yearNow = dateObj.getUTCFullYear()
    setYear(yearNow)
  }, [])

  const handleClick  = (item) => {
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
          <TbHandClick
            size={25}
            className={styles.btn_icon}

          />
          <span className={styles.btn_title}>Пункт 1</span>
        </li>
        <li
          className={`${styles.btn} ${activeItem === 2 ? styles.active : ''}`}
          onClick={() => handleClick(2)}
        >
          <TbHandClick size={25} className={styles.btn_icon} />
          <span className={styles.btn_title}>Пункт 2</span>
        </li>

        <li     className={`${styles.btn} ${activeItem === 3 ? styles.active : ''}`}
          onClick={() => handleClick(3)}>
          < TbHandClick size={25} className={styles.btn_icon} />
          <span className={styles.btn_title}>Пункт 3</span>
        </li>

        <li    className={`${styles.btn} ${activeItem === 4 ? styles.active : ''}`}
          onClick={() => handleClick(4)}>
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
