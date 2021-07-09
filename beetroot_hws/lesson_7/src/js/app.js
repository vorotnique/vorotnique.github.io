const colorLabels = document.querySelectorAll('[data-color]');
const image = document.querySelector('.card__img')

Array.from(colorLabels).forEach((el) => {
	el.addEventListener('click', (e) => {
		const target = e.target;
		const color = target.getAttribute('data-color')
		image.setAttribute('src', `img/${color}.png`);
	});
});