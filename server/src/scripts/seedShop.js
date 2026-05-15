import mongoose from 'mongoose';
import ShopItem from '../models/ShopItem.js';
import dotenv from 'dotenv';

dotenv.config();

const items = [
  { code: 'streak_freeze', title: 'Заморозка стрика', description: 'Спасает твою серию тренировок от сброса, если ты пропустил день.', price: 50, category: 'utility', icon: 'freeze' },
  { code: 'theme_cyberpunk', title: 'Пак тем: Киберпанк', description: 'Открывает доступ к острым вопросам от ИИ-корпораций будущего.', price: 100, category: 'theme', icon: 'theme-cyber' },
  { code: 'title:guru', title: 'Титул: Гуру мысли', description: 'Уникальное звание, которое будет отображаться у тебя в лидерборде.', price: 150, category: 'title', icon: 'crown-title' }
];

const seedShop = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await ShopItem.deleteMany({});
    await ShopItem.insertMany(items);
    console.log('✅ Витрина магазина успешно заполнена товарами!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedShop();
