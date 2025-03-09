import { buildSwiper } from './build-swiper.js';
import pagination from '../assets/pagination.js';
import Swiper from 'swiper/bundle';

buildSwiper('._swiper');

export function mainSlide(partnersSlide = '.section-slide__body') {
	if (partnersSlide) {
		new Swiper(partnersSlide, {
			speed: 800,
			spaceBetween: 30,
			loop: true,
			grabCursor: true,
			slidesPerView: 1,
			on: {
				init: function (swiperInstance) {
					setupCustomPagination(swiperInstance);
					pagination(swiperInstance); // Передаём swiper в pagination
				},
				slideChange: function (swiperInstance) {
					updateActivePagination(swiperInstance);
				},
			},
		});
	}
}

function setupCustomPagination(swiper) {
	console.log('setupCustomPagination получил swiper:', swiper);
	const links = document.querySelectorAll('.wave-container__link.ctx');
	links.forEach((link, index) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			swiper.slideToLoop(index);
		});
	});
	updateActivePagination(swiper);
}

function updateActivePagination(swiper) {
	console.log('updateActivePagination получил swiper:', swiper);
	const links = document.querySelectorAll('.wave-container__link.ctx');
	links.forEach((link, index) => {
		if (index === swiper.realIndex) {
			link.classList.add('active');
		} else {
			link.classList.remove('active');
		}
	});

	if (window.updateCaretPosition) {
		window.updateCaretPosition(swiper.realIndex);
	}
}
