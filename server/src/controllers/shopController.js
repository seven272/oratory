import ShopItem from '../models/ShopItem.js'
import User from '../models/User.js'

// 1. Получить все товары
const getShopItems = async (req, res) => {
  try {
    const items = await ShopItem.find({})
    res.status(200).json(items)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ошибка при получении товаров' })
  }
}

// 2. Купить товар
const buyItem = async (req, res) => {
  try {
    const { itemCode } = req.body
    const userId = req.userId

    const [item, user] = await Promise.all([
      ShopItem.findOne({ code: itemCode }),
      User.findById(userId),
    ])

    if (!item)
      return res.status(404).json({ message: 'Товар не найден' })
    if (!user)
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })

    // Проверяем баланс
    if (user.progression.coins < item.price) {
      return res
        .status(400)
        .json({ message: 'Недостаточно жетонов оратора' })
    }

    // Для уникальных вещей (темы, титулы) проверяем, нет ли их уже в инвентаре
    const hasItem = user.inventory.some(
      (inv) => inv.itemCode === itemCode,
    )
    if (hasItem && item.category !== 'utility') {
      return res
        .status(400)
        .json({ message: 'Вы уже приобрели этот товар' })
    }

    // Списываем монеты
    user.progression.coins -= item.price

    // Добавляем в инвентарь (если это расходник вроде заморозки — увеличиваем количество)
    if (item.category === 'utility' && hasItem) {
      const invItem = user.inventory.find(
        (inv) => inv.itemCode === itemCode,
      )
      invItem.quantity += 1
    } else {
      user.inventory.push({ itemCode: item.code, quantity: 1 })
    }

    // Специфическая логика: если купили титул, сразу пушим его в достижения (achievements)
    if (item.category === 'title') {
      user.progression.achievements.push({
        title: item.title,
        code: item.code,
        unlockedAt: new Date(),
      })
    }

    await user.save()

    res.status(200).json({
      message: 'Покупка успешно совершена!',
      coins: user.progression.coins,
      inventory: user.inventory,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ошибка сервера при покупке' })
  }
}

export { getShopItems, buyItem }
