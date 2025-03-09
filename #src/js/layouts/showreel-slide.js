import { buildSwiper } from './build-swiper.js';

buildSwiper('._swiper');
//* import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

export function slideShowreel(
	partnersSlide = '.slide-showreel',
	pagination = '.showreel-slide__pagination',
	// scrollbar = '',
	nextEl = '.showreel-slide__next',
	prevEl = '.showreel-slide__prev',
) {
	if (partnersSlide) {
		new Swiper(partnersSlide, {
			speed: 800,
			spaceBetween: 30,
			autoHeight: true,
			// allowTouchMove: false,
			grabCursor: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
			pagination: {
				el: pagination,
				clickable: true,
			},
			breakpoints: {
				260: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 2,
				},
			},
		});
	}
	// return null;
}