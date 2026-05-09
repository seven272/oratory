//LEVEL 1
import IconEx1 from '../images/card-icons/association.png'
import IconEx2 from '../images/card-icons/description.png'
import IconEx3 from '../images/card-icons/tongue-twister.png'
import IconEx4 from '../images/card-icons/synonyms.png'
import IconEx5 from '../images/card-icons/emotion.png'
import IconEx6 from '../images/card-icons/logic-chain.png'
//LEVEL 2
import IconEx7 from '../images/card-icons/jargon-task.png'
import IconEx8 from '../images/card-icons/speaking-thread.png'
import IconEx9 from '../images/card-icons/toast-master.png'
import IconEx10 from '../images/card-icons/joke-master.png'
import IconEx11 from '../images/card-icons/taboo.png'
import IconEx12 from '../images/card-icons/science-translator.png'
import IconEx13 from '../images/card-icons/fear-explosive.png'
import IconEx14 from '../images/card-icons/king-failure.png'
//LEVEL 3
import IconEx15 from '../images/card-icons/ai-debate.png'
import IconEx16 from '../images/card-icons/ai-inrerview.png'
import IconEx17 from '../images/card-icons/ai-icebreaker.png'
import IconEx18 from '../images/card-icons/ai-tribune.png'

const SKILLS_MAP = {
  дикция: ['tongue-twister', 'fear-explosive'],
  лаконичность: ['description', 'taboo', 'science-translator'],
  логика: ['logic-chain', 'association', 'speaking-thread'],
  убедительность: ['jargon-task', 'ai-debate', 'ai-inrerview'],
  импровизация: [
    'emotion',
    'joke-master',
    'toast-master',
    'synonyms',
  ],
  'small talk': ['ai-icebreaker', 'description'],
}

const All_EXERCISES = {
  level1: [
    {
      id: '1',
      alias: 'association',
      title: 'Словесный мост',
      description: 'Найди общее между двумя словами',
      reward: 30,
      icon: IconEx1,
      skill: 'логика',
      minLevel: 1,
      premium: false,
    },
    {
      id: '2',
      alias: 'description',
      title: 'Ода предмету',
      description: 'Описывай предмет 30 секунд без пауз',
      reward: 30,
      icon: IconEx2,
      skill: 'лаконичность',
      minLevel: 1,
      premium: false,
    },
    {
      id: '3',
      alias: 'tongue-twister',
      title: 'Битва дикции',
      description: 'Прочитай быстро и четко',
      reward: 30,
      icon: IconEx3,
      skill: 'дикция',
      minLevel: 1,
      premium: false,
    },
    {
      id: '4',
      alias: 'synonyms',
      title: 'Синонимайзер',
      description: 'Назови 5 синонимов к слову',
      reward: 30,
      icon: IconEx4,
      skill: 'импровизация',
      minLevel: 1,
      premium: false,
    },
    {
      id: '5',
      alias: 'emotion',
      title: 'Эмоциональный окрас',
      description: 'Прочитай фразу с заданной эмоцией',
      reward: 30,
      icon: IconEx5,
      skill: 'импровизация',
      minLevel: 1,
      premium: false,
    },
    {
      id: '6',
      alias: 'logic-chain',
      title: 'Логическая цепь',
      description: 'Продолжи фразу за 15 секунд',
      reward: 30,
      icon: IconEx6,
      skill: 'логика',
      minLevel: 1,
      premium: false,
    },
  ],
  level2: [
    {
      id: '7',
      alias: 'jargon-task',
      title: 'Блатной базар',
      description: 'Ответь на провокацию испульзуя ключевые слова',
      reward: 50,
      icon: IconEx7,
      skill: 'импровизация',
      minLevel: 2,
      premium: false,
    },
    {
      id: '8',
      alias: 'speaking-thread',
      title: 'Нить разговора',
      description: 'Свяжи два понятия и ответь на вопросы',
      reward: 50,
      icon: IconEx8,
      skill: 'small talk',
      minLevel: 2,
      premium: false,
    },
    {
      id: '9',
      alias: 'toast-master',
      title: 'Мастер тостов',
      description: 'Произнеси тост по заданной схеме',
      reward: 50,
      icon: IconEx9,
      skill: 'импровизация',
      minLevel: 2,
      premium: false,
    },
    {
      id: '10',
      alias: 'joke-master',
      title: 'Импровизатор анекдотов',
      description: 'Придумай свою смешную концовку анекдота',
      reward: 50,
      icon: IconEx10,
      skill: 'импровизация',
      minLevel: 2,
      premium: false,
    },
    {
      id: '11',
      alias: 'taboo',
      title: 'Словесное табу',
      description:
        'Расскажи про предмет или явление не используя ключевые слова',
      reward: 50,
      icon: IconEx11,
      skill: 'лаконичность',
      minLevel: 2,
      premium: false,
    },
    {
      id: '12',
      alias: 'science-translator',
      title: 'Просто о сложном',
      description: 'Опиши сложный термин максимально просто',
      reward: 50,
      icon: IconEx12,
      skill: 'small talk',
      minLevel: 2,
      premium: false,
    },
    {
      id: '13',
      alias: 'fear-explosive',
      title: 'Громкий вызов',
      description:
        'Победа над тихим голосом и страхом привлечь внимание',
      reward: 50,
      icon: IconEx13,
      skill: 'дикция',
      minLevel: 2,
      premium: false,
    },
    {
      id: '14',
      alias: 'king-failure',
      title: 'Король провала',
      description:
        'Учит не бояться фейлов и делать их частью своего триумфа',
      reward: 50,
      icon: IconEx14,
      skill: 'убедительность',
      minLevel: 2,
      premium: false,
    },
  ],

  level3: [
    {
      id: '15',
      alias: 'ai-debate',
      title: 'Дебат-клуб',
      description: 'Жаркие дебаты и горячие споры с ИИ-оппонентом',
      reward: 100,
      icon: IconEx15,
      skill: 'убедительность',
      minLevel: 1,
      premium: true,
    },
    {
      id: '16',
      alias: 'ai-interview',
      title: 'Неудобный вопрос',
      description:
        'Формат телеинтервью с острыми вопросами с ИИ в роли ведущего',
      reward: 100,
      icon: IconEx16,
      skill: 'импровизация',
      minLevel: 1,
      premium: true,
    },
    {
      id: '17',
      alias: 'ai-icebreaker',
      title: 'Ледокол',
      description: 'Разговори закрытого собеседника',
      reward: 100,
      icon: IconEx17,
      skill: 'small talk',
      minLevel: 1,
      premium: true,
    }, 
    {
      id: '18',
      alias: 'ai-tribune',
      title: 'Трибуна',
      description: 'Выскажись по теме и получи анализ текста',
      reward: 100,
      icon: IconEx18,
      skill: 'дикция',
      minLevel: 1,
      premium: true,
    },
  ],
}

export { All_EXERCISES }
