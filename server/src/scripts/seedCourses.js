import mongoose from 'mongoose';
import Course from '../models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const pitchMasterCourse = {
  courseCode: "pitch_master",
  title: "Питч на миллион: Как презентовать идею",
  description: "Курс-интенсив по жесткой аргументации, логике публичных выступлений и продаже проектов инвесторам за 3 минуты.",
  targetSkill: "Техника речи",
  priceCoins: 0,
  blocks: [
    {
      blockType: "theory",
      title: "📖 Блок 1: Анатомия идеального питча",
      theoryData: {
        quiz: {
          question: "Инвестор заскучал или начал листать телефон на 2-й минуте вашего питча. Ваше оптимальное действие согласно методу Ударного тезиса?",
          options: [
            "Увеличить громкость речи и продолжить читать презентацию строго по слайдам.",
            "Остановиться, сбросить шаблон фразой-крючком (например: «А теперь самое главное, где здесь деньги») и сократить речь до сути.",
            "Сделать паузу, обиженно подождать, пока он поднимет глаза, и спросить, интересно ли ему."
          ],
          correctAnswerIndex: 1
        }
      }
    },
    {
      blockType: "ai_workout",
      title: "🤖 Блок 2: Скоростной воркаут аргументации",
      aiWorkoutData: {
        exercises: ["science-translator", "logic-chain"],
        requiredScore: 300
      }
    },
    {
      blockType: "irl_challenge",
      title: "🎯 Блок 3: Выход в реальность (Боевое крещение)",
      irlChallengeData: {
        challengeCode: "irl_pitch_pioneer",
        instructions: "Подойдите к коллеге, другу или знакомому. Презентуйте ему свою текущую рабочую идею, проект или хобби по формуле «Проблема -> Решение -> Деньги» строго за 60 секунд. Запишите в отчет его краткий честный фидбек: что он понял, а что показалось ему скучным."
      }
    },
    {
      blockType: "exam",
      title: "🎓 Блок 4: Финальный экзамен «Жесткий Инвестор»",
      examData: {
        systemPrompt: "Ты — Александр Вершинин, управляющий партнер венчурного фонда с 15-летним опытом. Ты циничен, ценишь время и сухие цифры, ненавидишь 'воду' и общие фразы в духе 'наш продукт уникален'. Пользователь питчит тебе свой проект. Твоя задача — найти 2 уязвимых места в его аргументации и задать каверзные вопросы. Сессия длится ровно 3 сообщения от пользователя. В финальном ответе проведи жесткий разбор и поставь оценку от 1 до 100. Если спикер был логичен и убеденилен — поставь от 85 до 100. Если плавал в цифрах или уходил от ответа — ставь меньше 85.",
        minScoreToPass: 85
      }
    }
  ],
  reward: {
    xp: 500,
    achievementCode: "pitch_hero"
  }
};

// 3. Функция подключения к БД и сохранения курса
const seedCourse = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_app_db';
  
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Успешное подключение к MongoDB.");

    // Обновляем курс, если он существует, или создаем новый (upsert)
    await Course.findOneAndUpdate(
      { courseCode: pitchMasterCourse.courseCode },
      pitchMasterCourse,
      { upsert: true, new: true }
    );

    console.log(`Курс '${pitchMasterCourse.title}' успешно добавлен/обновлен в БД.`);
  } catch (error) {
    console.error("Ошибка при сидировании базы данных:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Сессия MongoDB закрыта.");
  }
}

seedCourse()