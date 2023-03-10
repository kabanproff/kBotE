const TelegramApi = require('node-telegram-bot-api');
const {gameOptions} = require('./options');

const token = '5932987503:AAH32uSYlc-HpGblAPtWCFCEWIlBRDu2eY4';
const bot = new TelegramApi(token, {polling: true});

const chat = {};

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты угадай!`)
	const  randomNumber = Math.floor(Math.random() * 10);
	chat[chatId] = randomNumber;
	console.log(chat)
	await bot.sendMessage(chatId, 'Я загадал а ты отгадывай', gameOptions);
}

const start = () => {
	bot.setMyCommands([
		{command: '/start', description: 'Начальное приветствие'},
		{command: '/info', description: 'Получить инфу о пользователе'},
		{command: '/game', description: 'Игра отгадай цифру'},
	])
	bot.on('message', async msg=>{

		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start') {
			// await bot.sendSticker(chatId, 'https://gamerwall.pro/uploads/posts/2022-03/1648588898_1-gamerwall-pro-p-mrachnii-zadnii-fon-krasivie-1.jpg');
			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp');
			return await bot.sendMessage(chatId, 'Привет! Вы подключили бота написанного Kabanproff');
		}

		if (text === '/info') {
			return await bot.sendMessage(chatId, `Тебя зовут ${msg.from.username}`)
		}

		if (text === '/game') {
			startGame(chatId)
		}

		if (text.toLowerCase() === 'давай болтать') {
			return await bot.sendMessage(chatId, `А чём ты хочешь со мной поболтать, может о погоде?`)
		}
		console.log(chat)
		await bot.sendSticker(chatId, 'https://api.360tv.ru/get_resized/g6iSUxBKslJ1PUmQ3j-g4ERY3MlGJAyPRBK-uht6ZjM/rs:fill-down:1080:810/g:fp:0.5:0.5/aHR0cHM6Ly8yNTc4MjQuc2VsY2RuLnJ1L2JhYnlsb24tbWVkaWEvYXJ0aWNsZXMvaW1hZ2UvMjAyMC8xMS8wOC8xOS8xMzgzODItNjBlOWJlYTdiY2Y5OWI2NTg3NWI3ODYyNDk4MDVhN2NlYTEzYTc4MS5qcGVn.webp');
		return await bot.sendMessage(chatId, `Не понимаю что ты хочешь ${msg.from.username}`)
	});

	bot.on('callback_query', async msg => {

		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (+data === chat[chatId]) {
			chat[chatId] = Math.floor(Math.random() * 10);
			return await bot.sendMessage(chatId, 'Ты победил');
		} else {
			return await bot.sendMessage(chatId, 'Ты выбрал цифру ' + data + `, а я загадал ${chat[chatId] < data ? 'меньшее число' : 'большее число'}`)
		}
		console.log(msg)
	})
}

start();