const canvas = document.getElementById("myCanvas");
const anchorLinks = document.querySelectorAll('.ctx');
const ctx = canvas.getContext("2d");

const convasLineColor = getComputedStyle(
	document.documentElement).getPropertyValue(
		'--convas-line-color');
const anchorColor = getComputedStyle(
	document.documentElement).getPropertyValue(
		'--anchor-color');

anchorLinks.forEach(anchorLink => {
	anchorLink.style.color = anchorColor;
});

canvas.width = window.innerWidth;
canvas.height = 100;

let baseAmplitude = 10; // Базовая высота волн
let frequency = 0.02; // Частота волн
let time = 0; // Время для колебания

const numberOfPoints = 4;
let distanceBetweenPoints = canvas.width / (numberOfPoints + 1);
let targetIndex = 1; // Индекс текущей цели (1, 2, 3 или 4)
let targetX = targetIndex * distanceBetweenPoints; // Начальная позиция каретки
let currentX = targetX; // Текущая позиция каретки

// Обновление размеров при изменении ширины окна
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	distanceBetweenPoints = canvas.width / (numberOfPoints + 1);

	// Пересчитываем позицию каретки относительно новой ширины экрана
	targetX = targetIndex * distanceBetweenPoints;
	currentX = targetX; // Переносим каретку в актуальную позицию
});

// Функция для вычисления координаты Y на волне
function getWaveY(x) {
	return canvas.height / 2 + Math.sin(x * frequency) * baseAmplitude * Math.sin(time);
}

// Функция для рисования точки
function drawPoint(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, Math.PI * 2);
	ctx.fillStyle = anchorColor;
	ctx.fill();
}

// Функция для рисования каретки с изгибом
function drawCurvedCaret(x) {
	const caretLength = 80; // Длина каретки
	const segments = 10; // Количество отрезков каретки
	const segmentLength = caretLength / segments;

	ctx.beginPath();
	for (let i = -segments / 2; i <= segments / 2; i++) {
		let xi = x + i * segmentLength;
		let yi = getWaveY(xi);

		if (i === -segments / 2) {
			ctx.moveTo(xi, yi);
		} else {
			ctx.lineTo(xi, yi);
		}
	}
	ctx.strokeStyle = anchorColor;
	ctx.lineWidth = 0.5;
	ctx.stroke();
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let amplitude = baseAmplitude * Math.sin(time);

	// Рисуем волну
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	for (let i = 0; i < canvas.width; i += 5) {
		let y = canvas.height / 2 + Math.sin(i * frequency) * amplitude;
		ctx.lineTo(i, y);
	}
	ctx.strokeStyle = convasLineColor;
	ctx.lineWidth = 0.5;
	ctx.stroke();

	// Рисуем точки
	let points = [];
	for (let i = 1; i <= numberOfPoints; i++) {
		let x = i * distanceBetweenPoints;
		let y = getWaveY(x);
		points.push({ x, y });
		drawPoint(x, y);

		// Позиционируем блоки city под точками
		const cityElement = document.querySelector(`.ctx[data-index="${i - 1}"]`);
		if (cityElement) {
			cityElement.style.left = `${x - cityElement.offsetWidth / 2}px`;
		}
	}

	// Анимация каретки (плавное движение)
	currentX += (targetX - currentX) * 0.05;

	// Рисуем каретку с изгибом
	drawCurvedCaret(currentX);

	time += 0.005;

	requestAnimationFrame(animate);
}

animate();

// Обработчик кликов на меню
document.querySelectorAll(".ctx").forEach((link, index) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		targetIndex = index + 1; // Сохраняем индекс выбранной точки
		targetX = targetIndex * distanceBetweenPoints; // Пересчитываем X-координату
	});
});
