import mongoose from 'mongoose'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const testUsers = [
  {
    displayName: 'Алексей Оратор',
    email: 'alex@test.com',
    progression: { level: 8, xp: 450, coins: 120 },
    weeklyXp: 850,
    isPremium: true,
  },
  {
    displayName: 'Мария Дебаты',
    email: 'maria@test.com',
    progression: { level: 6, xp: 200, coins: 50 },
    weeklyXp: 620,
    isPremium: false,
  },
  {
    displayName: 'Дмитрий Сторителлер',
    email: 'dima@test.com',
    progression: { level: 5, xp: 800, coins: 90 },
    weeklyXp: 510,
    isPremium: false,
  },
  {
    displayName: 'Анна Лингвист',
    email: 'anna@test.com',
    progression: { level: 7, xp: 120, coins: 140 },
    weeklyXp: 490,
    isPremium: true,
  },
  {
    displayName: 'Иван Ледокол',
    email: 'ivan@test.com',
    progression: { level: 4, xp: 650, coins: 30 },
    weeklyXp: 450,
    isPremium: false,
  },
  {
    displayName: 'Елена Харизма',
    email: 'elena@test.com',
    progression: { level: 5, xp: 310, coins: 40 },
    weeklyXp: 310,
    isPremium: false,
  },
  {
    displayName: 'Павел Риторика',
    email: 'pavel@test.com',
    progression: { level: 4, xp: 150, coins: 15 },
    weeklyXp: 280,
    isPremium: false,
  },
  {
    displayName: 'Ольга Публика',
    email: 'olga@test.com',
    progression: { level: 3, xp: 900, coins: 75 },
    weeklyXp: 210,
    isPremium: true,
  },
  {
    displayName: 'Сергей Аргумент',
    email: 'sergey@test.com',
    progression: { level: 3, xp: 420, coins: 20 },
    weeklyXp: 180,
    isPremium: false,
  },
  {
    displayName: 'Наталья Слово',
    email: 'natasha@test.com',
    progression: { level: 2, xp: 850, coins: 10 },
    weeklyXp: 150,
    isPremium: false,
  },
  {
    displayName: 'Константин Спич',
    email: 'kostya@test.com',
    progression: { level: 3, xp: 100, coins: 5 },
    weeklyXp: 90,
    isPremium: false,
  },
  {
    displayName: 'Татьяна Тезис',
    email: 'tanya@test.com',
    progression: { level: 2, xp: 300, coins: 0 },
    weeklyXp: 40,
    isPremium: false,
  },
]

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    // Удаляем только старых тестовых пользователей, чтобы не затереть твоего админа
    await User.deleteMany({
      email: { $in: testUsers.map((u) => u.email) },
    })

    // Генерируем аватарки на основе имен
    const usersWithAvatars = testUsers.map((user) => ({
      ...user,
      password: 'hashed_password_123', // Заглушка
      avatar: `dicebear.com{encodeURIComponent(user.displayName)}`,
    }))

    await User.insertMany(usersWithAvatars)
    console.log(
      '✅ 12 тестовых пользователей успешно добавлены в базу данных!',
    )
    process.exit()
  } catch (err) {
    console.error('❌ Ошибка сидирования пользователей:', err)
    process.exit(1)
  }
}

seedUsers()
