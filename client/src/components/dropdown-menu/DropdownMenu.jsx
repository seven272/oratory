import { Dropdown, Space } from 'antd'
import { TfiMenu } from 'react-icons/tfi'
import { FaRegHandPointRight } from "react-icons/fa";
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

import styles from './DropdownMenu.module.css'

const DropdownMenu = () => {
  const routeNavigator = useRouteNavigator()

  const arrData = [
    {
      title: 'главная',
      alias: 'main',
    },
     {
      title: 'карточка заданий',
      alias: 'exercise-card',
    },
    {
      title: 'магазин',
      alias: 'shop',
    },
    {
      title: '404',
      alias: 'notfound',
    },
  ]

  const handleMenuClick = (payload) => {
    const { key } = payload
    const categories = [
      '/',
      'exercise-card',
      'shop',
      'notfound',
    ]

    if (categories.includes(key)) {
      // Используем replace, чтобы не плодить историю при переходах между категориями
      routeNavigator.replace(`/${key}`)
    } else {
      routeNavigator.push('/')
    }
  }

  const objectStyles = {
    root: {
      backgroundColor: '#ffffff',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
    },
    item: {
      padding: '8px 12px',
      fontSize: '16px',
    },
    itemTitle: {
      fontWeight: '500',
    },
    itemIcon: {
      color: `#007aff`,
      marginRight: '5px',
    },
    itemContent: {
      backgroundColor: 'transparent',
    },
  }

  const items = arrData.map((elem) => {
    return {
      label: elem.title,
      key: elem.alias,
      icon: <FaRegHandPointRight />,
    }
  })

  const menuProps = {
    items,
    onClick: handleMenuClick,
  }

  return (
    <Dropdown
      menu={menuProps}
      className={styles.menu}
      styles={objectStyles}
    >
      <Space align="center" orientation="horizontal">
        <TfiMenu className={styles.icon} />
      </Space>
    </Dropdown>
  )
}

export default DropdownMenu
