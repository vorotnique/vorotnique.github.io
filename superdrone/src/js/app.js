import Storage from './storageHelper';
import getProducts from './fetch';
import { renderProducts, renderCart, renderSuccessMsg } from './render';
import { getCartValue, addToCartHandler, getCartItems, changeProductQuantity, removeProductFromCart } from './cart';
import { modalOpenHandler, modalCloseHandler } from './modal';

const productsReadyEventName = 'products_ready';
let productsReadyEvent = new Event(productsReadyEventName);

const cartForm = document.querySelector('.modal__form');

getProducts('https://my-json-server.typicode.com/vorotnique/fakeserver/db')
.then(
	function(response) {
		if (response.status !== 200) {
			console.log(`Looks like there was a problem. Status Code: ${response.status}`);
			return;
		}

		response.json()
		.then(({products}) => {
			Storage.set('products', products);
			document.dispatchEvent(productsReadyEvent);
		});
	}
	)
.catch(function(err) {
	console.log('Fetch Error :-S', err);
});

document.addEventListener('click', (event) => {
	const target = event.target;

	if (target.classList.contains('add-to-cart')) {
		addToCartHandler(target);
		renderSuccessMsg();
	}

	if (target.classList.contains('cart')) {
		modalOpenHandler();
		renderCart(getCartItems(getCartValue(), Storage.get('products')));
	}

	if (target.classList.contains('modal__close')) {
		modalCloseHandler();
	}

	if (target.classList.contains('clear-btn')) {
		Storage.set('cart', {});
		renderCart([]);
		getCartValue();
	}

	if (target.classList.contains('submit-btn')) {
		event.preventDefault();
	}

	if (target.classList.contains('cart-list__item-remove')) {
		event.preventDefault();
		removeProductFromCart(target);
		renderCart(getCartItems(getCartValue(), Storage.get('products')));
	}

});

document.addEventListener(productsReadyEventName, () => {
	const loader = document.querySelector('#propeller-loader');
	renderProducts(Storage.get('products'));
	getCartValue();
	loader.classList.add('hidden');
});

cartForm.addEventListener('change', (event) => {
	changeProductQuantity(event.target);
	renderCart(getCartItems(getCartValue(), Storage.get('products')));
});

$(document).ready(function(){

	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});

	$('.scrollup').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});

});

// $(document).ready(function(){
//   $(".owl-carousel").owlCarousel();
// });

$(document).ready(function(){
	$('.carousel').slick({
		centerMode: true,
		centerPadding: '60px',
		slidesToShow: 3,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
		{
			breakpoint: 768,
			settings: {
				arrows: false,
				centerMode: true,
				centerPadding: '40px',
				slidesToShow: 3
			}
		},
		{
			breakpoint: 480,
			settings: {
				arrows: false,
				centerMode: true,
				centerPadding: '40px',
				slidesToShow: 1
			}
		}
		]
	});
});