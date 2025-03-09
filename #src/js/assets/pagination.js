export default function pagination(swiper) {
	if (!swiper) {
		return;
	}

	const canvas = document.getElementById('myCanvas');
	const anchorLinks = document.querySelectorAll('.ctx');
	const ctx = canvas.getContext('2d');

	const convasLineColor = getComputedStyle(document.documentElement).getPropertyValue('--convas-line-color');
	const anchorColor = getComputedStyle(document.documentElement).getPropertyValue('--anchor-color');

	anchorLinks.forEach(anchorLink => {
		anchorLink.style.color = anchorColor;
	});

	canvas.width = window.innerWidth;
	canvas.height = 100;

	let baseAmplitude = 10;
	let frequency = 0.01;
	let time = 0;

	let numberOfPoints = anchorLinks.length;
	let distanceBetweenPoints = canvas.width / (numberOfPoints + 1);
	let targetIndex = 0;
	let targetX = (targetIndex + 1) * distanceBetweenPoints;
	let currentX = targetX;

	// ✅ Глобальная функция для обновления каретки (без TypeScript)
	window.updateCaretPosition = function (index) {
		targetIndex = index + 1;
		targetX = targetIndex * distanceBetweenPoints;
	};

	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		distanceBetweenPoints = canvas.width / (numberOfPoints + 1);
		targetX = (targetIndex + 1) * distanceBetweenPoints;
		currentX = targetX;
	});

	function getWaveY(x) {
		return canvas.height / 2 + Math.sin(x * frequency) * baseAmplitude * Math.sin(time);
	}

	function drawPoint(x, y) {
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, Math.PI * 2);
		ctx.fillStyle = anchorColor;
		ctx.fill();
	}

	function drawCurvedCaret(x) {
		const caretLength = 80;
		const segments = 10;
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
		ctx.lineWidth = 2;
		ctx.stroke();
	}

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		let amplitude = baseAmplitude * Math.sin(time);

		ctx.beginPath();
		ctx.moveTo(0, canvas.height / 2);
		for (let i = 0; i < canvas.width; i += 5) {
			let y = canvas.height / 2 + Math.sin(i * frequency) * amplitude;
			ctx.lineTo(i, y);
		}
		ctx.strokeStyle = convasLineColor;
		ctx.lineWidth = 2;
		ctx.stroke();

		let points = [];
		for (let i = 0; i < numberOfPoints; i++) {
			let x = (i + 1) * distanceBetweenPoints;
			let y = getWaveY(x);
			points.push({ x, y });
			drawPoint(x, y);

			const cityElement = document.querySelector(`.ctx[data-index="${i}"]`);
			if (cityElement) {
				cityElement.style.left = `${x - cityElement.offsetWidth / 2}px`;
			}
		}

		currentX += (targetX - currentX) * 0.05;
		drawCurvedCaret(currentX);
		time += 0.005;

		requestAnimationFrame(animate);
	}

	animate();

	// ✅ Обрабатываем клики по .ctx
	anchorLinks.forEach((link, index) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			window.updateCaretPosition(index);
			if (swiper) {
				swiper.slideToLoop(index);
			} else {
				console.error('Swiper не найден');
			}
		});
	});
}
