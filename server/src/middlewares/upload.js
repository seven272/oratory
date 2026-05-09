import multer from 'multer'
import fs from 'fs'

const storage = multer.diskStorage({
  //определяю директорию куда сохраняются изображения
  destination: (req, file, cb) => {
    //проверяю существует ли папка в которую загружаются изображения, если нет, то создаю
    if (!fs.existsSync('./src/uploads')) {
      console.log('Папки не существует, создаю ее')
      fs.mkdirSync('./src/uploads')
    }
    if (file.fieldname === 'category') {
      // проверка на наличие папки
      if (!fs.existsSync('./src/uploads/categories')) { 
        console.log('Папки не существует, создаю ее')
        fs.mkdirSync('./src/uploads/categories')
      }
      cb(null, './src/uploads/categories')
    } else if (file.fieldname === 'sound') {
      // проверка на наличие папки
      if (!fs.existsSync('./src/uploads/sounds')) {
        console.log('Папки не существует, создаю ее')
        fs.mkdirSync('./src/uploads/sounds')
      }
      cb(null, './src/uploads/sounds/')
    } else if (file.fieldname === 'cover') {
      // проверка на наличие папки
      if (!fs.existsSync('./src/uploads/covers')) {
        console.log('Папки не существует, создаю ее')
        fs.mkdirSync('./src/uploads/covers')
      }
      cb(null, './src/uploads/covers/')
    } else {
      cb(null, './src/uploads/')
    }
  },
  //задаю уникальное имя для файла
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        '-' +
        file.originalname,
    )
  },
})

// Настройка фильтра файлов
const fileFilter = (req, file, cb) => {
  // Принимать изображения и PDF
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'audio/wav',
    'audio/mp3',
    'audio/mpeg',
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Неверный формат файла. Разрешены только JPEG, PNG, GIF, PDF, MP3, MPEG, WAV',
      ),
      false,
    )
  }
}

// Настройка Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10МБ
    files: 5,
  },
})

export default upload
