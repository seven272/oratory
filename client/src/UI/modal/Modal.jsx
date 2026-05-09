import React, { useEffect } from 'react'
import styles from './Modal.module.css' 

const Modal = ({ active, onClose, children }) => {
  // закрываем модальное окно при нажатии на ESC 
  useEffect(() => {
    const closeModal = (evt) => {
      if (evt.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', closeModal)
    return () => window.removeEventListener('keydown', closeModal)
  }, [])
  
  return ( 
    <div
      className={
        active ? `${styles.modal} ${styles.active}` : styles.modal
      }
      onClick={onClose}
    >
      <div
        className={
          active
            ? `${styles.modal__content} ${styles.active}`
            : styles.modal__content
        }
        onClick={(evt) => evt.stopPropagation()}
      >
        {children}
        <span
          className={styles.close}
          onClick={onClose}
        >
          &times;
        </span>
      </div>
    </div>
  )
}

export default Modal
