const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 100;

let baseAmplitude = 5; // Базовая высота волн
let frequency = 0.02; // Частота волн
let time = 0; // Время для колебания

const numberOfPoints = 4;
const distanceBetweenPoints = canvas.width / (numberOfPoints + 1);
let targetX = distanceBetweenPoints; // Каретка изначально у первой точки
let currentX = targetX; // Текущая позиция каретки

// Функция для вычисления координаты Y на волне
function getWaveY(x) {
	return canvas.height / 2 + Math.sin(x * frequency) * baseAmplitude * Math.sin(time);
}

// Функция для вычисления наклона (производной синусоиды)
function getWaveSlope(x) {
	return Math.cos(x * frequency) * baseAmplitude * frequency * Math.sin(time);
}

// Функция для рисования точки
function drawPoint(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, Math.PI * 2);
	ctx.fillStyle = "red";
	ctx.fill();
}

// Функция для рисования каретки с наклоном
function drawCaret(x, y) {
	const caretLength = 80; // Длина каретки

	let slope = getWaveSlope(x); // Наклон
	let angle = Math.atan(slope); // Угол наклона

	// Вычисляем концы линии с учётом наклона
	let x1 = x - (caretLength / 2) * Math.cos(angle);
	let y1 = y - (caretLength / 2) * Math.sin(angle);
	let x2 = x + (caretLength / 2) * Math.cos(angle);
	let y2 = y + (caretLength / 2) * Math.sin(angle);

	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 0.5;
	ctx.stroke();
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let amplitude = baseAmplitude * Math.sin(time); // Колебание вверх-вниз

	// Рисуем волну
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	for (let i = 0; i < canvas.width; i += 5) {
		let y = canvas.height / 2 + Math.sin(i * frequency) * amplitude;
		ctx.lineTo(i, y);
	}
	ctx.strokeStyle = "blueviolet";
	ctx.lineWidth = 0.3;
	ctx.stroke();

	// Рисуем точки
	let points = [];
	for (let i = 1; i <= numberOfPoints; i++) {
		let x = i * distanceBetweenPoints;
		let y = getWaveY(x);
		points.push({ x, y });
		drawPoint(x, y);
	}

	// Анимация каретки (плавное движение)
	currentX += (targetX - currentX) * 0.1;

	// Найдём текущую Y-координату каретки и рисуем её
	let caretY = getWaveY(currentX);
	drawCaret(currentX, caretY);

	time += 0.005; // Контролирует верхний и нижний пик

	requestAnimationFrame(animate);
}

animate();

// Обработчик кликов на меню
document.querySelectorAll(".menu a").forEach((link, index) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		targetX = (index + 1) * distanceBetweenPoints; // Меняем цель каретки
	});
});