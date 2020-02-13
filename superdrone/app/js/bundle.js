(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _storageHelper = _interopRequireDefault(require("./storageHelper"));

var _fetch = _interopRequireDefault(require("./fetch"));

var _render = require("./render");

var _cart = require("./cart");

var _modal = require("./modal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var productsReadyEventName = 'products_ready';
var productsReadyEvent = new Event(productsReadyEventName);
var cartForm = document.querySelector('.modal__form');
(0, _fetch["default"])('https://my-json-server.typicode.com/vorotnique/fakeserver/db').then(function (response) {
  if (response.status !== 200) {
    console.log("Looks like there was a problem. Status Code: ".concat(response.status));
    return;
  }

  response.json().then(function (_ref) {
    var products = _ref.products;

    _storageHelper["default"].set('products', products);

    document.dispatchEvent(productsReadyEvent);
  });
})["catch"](function (err) {
  console.log('Fetch Error :-S', err);
});
document.addEventListener('click', function (event) {
  var target = event.target;

  if (target.classList.contains('add-to-cart')) {
    (0, _cart.addToCartHandler)(target);
    (0, _render.renderSuccessMsg)();
  }

  if (target.classList.contains('cart')) {
    (0, _modal.modalOpenHandler)();
    (0, _render.renderCart)((0, _cart.getCartItems)((0, _cart.getCartValue)(), _storageHelper["default"].get('products')));
  }

  if (target.classList.contains('modal__close')) {
    (0, _modal.modalCloseHandler)();
  }

  if (target.classList.contains('clear-btn')) {
    _storageHelper["default"].set('cart', {});

    (0, _render.renderCart)([]);
    (0, _cart.getCartValue)();
  }

  if (target.classList.contains('submit-btn')) {
    event.preventDefault();
  }

  if (target.classList.contains('cart-list__item-remove')) {
    event.preventDefault();
    (0, _cart.removeProductFromCart)(target);
    (0, _render.renderCart)((0, _cart.getCartItems)((0, _cart.getCartValue)(), _storageHelper["default"].get('products')));
  }
});
document.addEventListener(productsReadyEventName, function () {
  var loader = document.querySelector('#propeller-loader');
  (0, _render.renderProducts)(_storageHelper["default"].get('products'));
  (0, _cart.getCartValue)();
  loader.classList.add('hidden');
});
cartForm.addEventListener('change', function (event) {
  (0, _cart.changeProductQuantity)(event.target);
  (0, _render.renderCart)((0, _cart.getCartItems)((0, _cart.getCartValue)(), _storageHelper["default"].get('products')));
});
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.scrollup').fadeIn();
    } else {
      $('.scrollup').fadeOut();
    }
  });
  $('.scrollup').click(function () {
    $("html, body").animate({
      scrollTop: 0
    }, 600);
    return false;
  });
}); // $(document).ready(function(){
//   $(".owl-carousel").owlCarousel();
// });

$(document).ready(function () {
  $('.carousel').slick({
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    responsive: [{
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 3
      }
    }, {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }]
  });
});

},{"./cart":2,"./fetch":3,"./modal":4,"./render":5,"./storageHelper":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalSum = exports.removeProductFromCart = exports.changeProductQuantity = exports.removeFromCartHandler = exports.addToCartHandler = exports.getCartItems = exports.getCartValue = void 0;

var _storageHelper = _interopRequireDefault(require("./storageHelper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getCartValue = function getCartValue() {
  var label = document.querySelector('.cart__label');

  var cartValue = _storageHelper["default"].get('cart');

  if (!cartValue || !Object.keys(cartValue).length) {
    label.innerText = 0;
    return {};
  }

  label.innerText = Object.values(cartValue).reduce(function (acc, cur) {
    return +acc + +cur;
  });
  return cartValue;
};

exports.getCartValue = getCartValue;

var getCartItems = function getCartItems(cartValue, products) {
  return Object.keys(cartValue).map(function (id) {
    return products.filter(function (product) {
      if (product.id == id) {
        product.total = cartValue[id];
        return product;
      }
    })[0];
  });
};

exports.getCartItems = getCartItems;

var addToCartHandler = function addToCartHandler(target) {
  var cart = getCartValue();
  var productId = target.getAttribute('data-id');

  var productsList = _storageHelper["default"].get('products');

  var chosenProduct = productsList.filter(function (element) {
    return element.id == productId;
  })[0];

  if (cart[chosenProduct.id]) {
    cart[chosenProduct.id]++;
  } else {
    cart[chosenProduct.id] = 1;
  }

  _storageHelper["default"].set('cart', cart);

  getCartValue();
};

exports.addToCartHandler = addToCartHandler;

var removeFromCartHandler = function removeFromCartHandler(target) {
  var cart = getCartValue();
  var productId = target.getAttribute('data-id');

  var productsList = _storageHelper["default"].get('products');

  var chosenProduct = productsList.filter(function (element) {
    return element.id == productId;
  })[0];

  if (cart[chosenProduct.id] && cart[chosenProduct.id] > 0) {
    cart[chosenProduct.id]--;
  } else {
    cart[chosenProduct.id] = 0;
  }

  _storageHelper["default"].set('cart', cart);

  getCartValue();
};

exports.removeFromCartHandler = removeFromCartHandler;

var changeProductQuantity = function changeProductQuantity(target) {
  var newQuantity = +target.value < 1 ? 1 : +target.value;
  var productId = target.attributes['data-id'].value;
  var cart = getCartValue();

  var productsList = _storageHelper["default"].get('products');

  var chosenProduct = productsList.filter(function (element) {
    return element.id == productId;
  })[0];

  if (cart[chosenProduct.id]) {
    cart[chosenProduct.id] = newQuantity;
  }

  _storageHelper["default"].set('cart', cart);

  getCartValue();
};

exports.changeProductQuantity = changeProductQuantity;

var removeProductFromCart = function removeProductFromCart(target) {
  var cart = getCartValue();
  var productId = target.getAttribute('data-id');
  delete cart[productId];

  _storageHelper["default"].set('cart', cart);
};

exports.removeProductFromCart = removeProductFromCart;

var getTotalSum = function getTotalSum() {
  return getCartItems(getCartValue(), _storageHelper["default"].get('products')).map(function (product) {
    return +product.price * +product.total;
  }).reduce(function (acc, cur) {
    return acc + cur;
  });
};

exports.getTotalSum = getTotalSum;

},{"./storageHelper":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var getProducts = function getProducts(url) {
  return fetch(url);
};

var _default = getProducts;
exports["default"] = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modalCloseHandler = exports.modalOpenHandler = void 0;

var _cart = require("./cart");

var modal = document.querySelector('.modal');

var modalOpenHandler = function modalOpenHandler() {
  modal.classList.add('open');
};

exports.modalOpenHandler = modalOpenHandler;

var modalCloseHandler = function modalCloseHandler() {
  modal.classList.remove('open');
};

exports.modalCloseHandler = modalCloseHandler;

},{"./cart":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderSuccessMsg = exports.renderCart = exports.renderProducts = void 0;

var _cart = require("./cart");

var generateElement = function generateElement(tagName) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var el = document.createElement(tagName);

  if (className) {
    el.classList.add(className);
  }

  return el;
};

var insertElementIntoParent = function insertElementIntoParent(elements, parentElement) {
  elements.forEach(function (element) {
    parentElement.appendChild(element);
  });
};

var createProductItem = function createProductItem(_ref) {
  var currency = _ref.currency,
      description = _ref.description,
      id = _ref.id,
      img_url = _ref.img_url,
      price = _ref.price,
      title = _ref.title;
  var col = generateElement('div', 'col-md-4');
  var productGrid = generateElement('div', 'product-grid');
  var productImageWrap = generateElement('div', 'product-image');
  var imageWrapper = generateElement('div', 'image-wrapper');
  var productImage = generateElement('img', 'pic-1');
  var productNewLabel = generateElement('span', 'product-new-label');
  var productDiscountLabel = generateElement('span', 'product-discount-label');
  var productDescription = generateElement('p', 'product-description');
  var productContent = generateElement('div', 'product-content');
  var productTitle = generateElement('h3', 'title');
  var productPrice = generateElement('div', 'price');
  var addToCart = generateElement('button', 'add-to-cart');
  productNewLabel.innerText = 'Sale';
  addToCart.innerText = '+ Add To Cart';
  productDiscountLabel.innerText = 'NEW';
  productImage.setAttribute('src', img_url);
  addToCart.setAttribute('data-id', id);
  addToCart.classList.add('btn');
  addToCart.classList.add('btn-success');
  productTitle.innerText = title;
  productPrice.innerText = currency + price;
  col.appendChild(productGrid);
  imageWrapper.appendChild(productImage);
  var wrappedGrid = [productImageWrap, productDescription, productContent];
  var wrappedImageWrap = [imageWrapper, productNewLabel, productDiscountLabel];
  var wrappedContent = [productTitle, productPrice, addToCart];
  insertElementIntoParent(wrappedGrid, productGrid);
  insertElementIntoParent(wrappedImageWrap, productImageWrap);
  insertElementIntoParent(wrappedContent, productContent);
  return col;
};

var createCartItem = function createCartItem(_ref2) {
  var id = _ref2.id,
      title = _ref2.title,
      img_url = _ref2.img_url,
      price = _ref2.price,
      currency = _ref2.currency,
      total = _ref2.total;
  var listItem = generateElement('li');
  var productItem = generateElement('div', 'cart-list__item');
  var productArticul = generateElement('input');
  var imgWrapper = generateElement('div', 'cart-list__img-wrapper');
  var productImg = generateElement('img', 'cart-list__item-img');
  var productTitle = generateElement('h4', 'cart-list__item-title');
  var productPrice = generateElement('span', 'cart-list__item-price');
  var productQuantity = generateElement('input', 'cart-list__item-quantity');
  var productTotalPrice = generateElement('span', 'cart-list__item-total');
  var productRemove = generateElement('button', 'cart-list__item-remove');
  productArticul.setAttribute('type', 'hidden');
  productArticul.setAttribute('name', 'articul');
  productArticul.setAttribute('value', id);
  productImg.setAttribute('src', img_url);
  productQuantity.setAttribute('data-id', id);
  productRemove.setAttribute('data-id', id);
  productQuantity.setAttribute('type', 'number');
  productQuantity.setAttribute('name', 'quantity');
  productQuantity.setAttribute('value', total);
  productTitle.innerText = title;
  productPrice.innerText = currency + price;
  productTotalPrice.innerText = "".concat(currency).concat(+price * +total);
  productRemove.innerText = '-';
  var wrappedProductItems = [productArticul, imgWrapper, productTitle, productPrice, productQuantity, productTotalPrice, productRemove];
  insertElementIntoParent(wrappedProductItems, productItem);
  imgWrapper.appendChild(productImg);
  listItem.appendChild(productItem);
  return listItem;
};

var renderProducts = function renderProducts(products) {
  var grid = document.getElementById('productsGrid');
  products.forEach(function (product) {
    grid.appendChild(createProductItem(product));
  });
};

exports.renderProducts = renderProducts;

var renderCart = function renderCart(products) {
  var grid = document.querySelector('.cart-list');
  var emptyMsg = document.querySelector('.cart__empty');
  var total = document.querySelector('.cart__total');

  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }

  if (!products.length) {
    return grid.classList.add('empty-list');
  } else {
    grid.classList.remove('empty-list');
  }

  var currency;
  products.forEach(function (product) {
    currency = product.currency;
    grid.appendChild(createCartItem(product));
  });
  total.innerText = "Total: ".concat(currency).concat((0, _cart.getTotalSum)());
};

exports.renderCart = renderCart;

var renderSuccessMsg = function renderSuccessMsg() {
  var span = generateElement('span', 'success-msg');
  span.classList.add('badge');
  span.classList.add('badge-success');
  span.innerText = 'Added to cart';
  document.body.appendChild(span);
  setTimeout(function () {
    document.body.removeChild(span);
  }, 2500);
};

exports.renderSuccessMsg = renderSuccessMsg;

},{"./cart":2}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function StorageHelper() {
  this.storage = localStorage;

  this.get = function (key) {
    return JSON.parse(localStorage.getItem(key));
  };

  this.set = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  };

  this.remove = function (key) {
    localStorage.removeItem(key);
  };
}

var Storage = new StorageHelper();
var _default = Storage;
exports["default"] = _default;

},{}]},{},[1])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9hcHAuanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9jYXJ0LmpzIiwicHJvamVjdHMvc3VwZXJkcm9uZS9zcmMvanMvZmV0Y2guanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9tb2RhbC5qcyIsInByb2plY3RzL3N1cGVyZHJvbmUvc3JjL2pzL3JlbmRlci5qcyIsInByb2plY3RzL3N1cGVyZHJvbmUvc3JjL2pzL3N0b3JhZ2VIZWxwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTSxzQkFBc0IsR0FBRyxnQkFBL0I7QUFDQSxJQUFJLGtCQUFrQixHQUFHLElBQUksS0FBSixDQUFVLHNCQUFWLENBQXpCO0FBRUEsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBakI7QUFFQSx1QkFBWSw4REFBWixFQUNDLElBREQsQ0FFQyxVQUFTLFFBQVQsRUFBbUI7QUFDbEIsTUFBSSxRQUFRLENBQUMsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUM1QixJQUFBLE9BQU8sQ0FBQyxHQUFSLHdEQUE0RCxRQUFRLENBQUMsTUFBckU7QUFDQTtBQUNBOztBQUVELEVBQUEsUUFBUSxDQUFDLElBQVQsR0FDQyxJQURELENBQ00sZ0JBQWdCO0FBQUEsUUFBZCxRQUFjLFFBQWQsUUFBYzs7QUFDckIsOEJBQVEsR0FBUixDQUFZLFVBQVosRUFBd0IsUUFBeEI7O0FBQ0EsSUFBQSxRQUFRLENBQUMsYUFBVCxDQUF1QixrQkFBdkI7QUFDQSxHQUpEO0FBS0EsQ0FiRixXQWVPLFVBQVMsR0FBVCxFQUFjO0FBQ3BCLEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQkFBWixFQUErQixHQUEvQjtBQUNBLENBakJEO0FBbUJBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxVQUFDLEtBQUQsRUFBVztBQUM3QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBckI7O0FBRUEsTUFBSSxNQUFNLENBQUMsU0FBUCxDQUFpQixRQUFqQixDQUEwQixhQUExQixDQUFKLEVBQThDO0FBQzdDLGdDQUFpQixNQUFqQjtBQUNBO0FBQ0E7O0FBRUQsTUFBSSxNQUFNLENBQUMsU0FBUCxDQUFpQixRQUFqQixDQUEwQixNQUExQixDQUFKLEVBQXVDO0FBQ3RDO0FBQ0EsNEJBQVcsd0JBQWEseUJBQWIsRUFBNkIsMEJBQVEsR0FBUixDQUFZLFVBQVosQ0FBN0IsQ0FBWDtBQUNBOztBQUVELE1BQUksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsY0FBMUIsQ0FBSixFQUErQztBQUM5QztBQUNBOztBQUVELE1BQUksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsV0FBMUIsQ0FBSixFQUE0QztBQUMzQyw4QkFBUSxHQUFSLENBQVksTUFBWixFQUFvQixFQUFwQjs7QUFDQSw0QkFBVyxFQUFYO0FBQ0E7QUFDQTs7QUFFRCxNQUFJLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLFlBQTFCLENBQUosRUFBNkM7QUFDNUMsSUFBQSxLQUFLLENBQUMsY0FBTjtBQUNBOztBQUVELE1BQUksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsd0JBQTFCLENBQUosRUFBeUQ7QUFDeEQsSUFBQSxLQUFLLENBQUMsY0FBTjtBQUNBLHFDQUFzQixNQUF0QjtBQUNBLDRCQUFXLHdCQUFhLHlCQUFiLEVBQTZCLDBCQUFRLEdBQVIsQ0FBWSxVQUFaLENBQTdCLENBQVg7QUFDQTtBQUVELENBakNEO0FBbUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixzQkFBMUIsRUFBa0QsWUFBTTtBQUN2RCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixtQkFBdkIsQ0FBZjtBQUNBLDhCQUFlLDBCQUFRLEdBQVIsQ0FBWSxVQUFaLENBQWY7QUFDQTtBQUNBLEVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsR0FBakIsQ0FBcUIsUUFBckI7QUFDQSxDQUxEO0FBT0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLFFBQTFCLEVBQW9DLFVBQUMsS0FBRCxFQUFXO0FBQzlDLG1DQUFzQixLQUFLLENBQUMsTUFBNUI7QUFDQSwwQkFBVyx3QkFBYSx5QkFBYixFQUE2QiwwQkFBUSxHQUFSLENBQVksVUFBWixDQUE3QixDQUFYO0FBQ0EsQ0FIRDtBQUtBLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWSxLQUFaLENBQWtCLFlBQVU7QUFFM0IsRUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUsTUFBVixDQUFpQixZQUFVO0FBQzFCLFFBQUksQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRLFNBQVIsS0FBc0IsR0FBMUIsRUFBK0I7QUFDOUIsTUFBQSxDQUFDLENBQUMsV0FBRCxDQUFELENBQWUsTUFBZjtBQUNBLEtBRkQsTUFFTztBQUNOLE1BQUEsQ0FBQyxDQUFDLFdBQUQsQ0FBRCxDQUFlLE9BQWY7QUFDQTtBQUNELEdBTkQ7QUFRQSxFQUFBLENBQUMsQ0FBQyxXQUFELENBQUQsQ0FBZSxLQUFmLENBQXFCLFlBQVU7QUFDOUIsSUFBQSxDQUFDLENBQUMsWUFBRCxDQUFELENBQWdCLE9BQWhCLENBQXdCO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QixFQUEwQyxHQUExQztBQUNBLFdBQU8sS0FBUDtBQUNBLEdBSEQ7QUFLQSxDQWZELEUsQ0FpQkE7QUFDQTtBQUNBOztBQUVBLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWSxLQUFaLENBQWtCLFlBQVU7QUFDM0IsRUFBQSxDQUFDLENBQUMsV0FBRCxDQUFELENBQWUsS0FBZixDQUFxQjtBQUNwQixJQUFBLFVBQVUsRUFBRSxJQURRO0FBRXBCLElBQUEsYUFBYSxFQUFFLE1BRks7QUFHcEIsSUFBQSxZQUFZLEVBQUUsQ0FITTtBQUlwQixJQUFBLFVBQVUsRUFBRSxDQUNaO0FBQ0MsTUFBQSxVQUFVLEVBQUUsR0FEYjtBQUVDLE1BQUEsUUFBUSxFQUFFO0FBQ1QsUUFBQSxNQUFNLEVBQUUsS0FEQztBQUVULFFBQUEsVUFBVSxFQUFFLElBRkg7QUFHVCxRQUFBLGFBQWEsRUFBRSxNQUhOO0FBSVQsUUFBQSxZQUFZLEVBQUU7QUFKTDtBQUZYLEtBRFksRUFVWjtBQUNDLE1BQUEsVUFBVSxFQUFFLEdBRGI7QUFFQyxNQUFBLFFBQVEsRUFBRTtBQUNULFFBQUEsTUFBTSxFQUFFLEtBREM7QUFFVCxRQUFBLFVBQVUsRUFBRSxJQUZIO0FBR1QsUUFBQSxhQUFhLEVBQUUsTUFITjtBQUlULFFBQUEsWUFBWSxFQUFFO0FBSkw7QUFGWCxLQVZZO0FBSlEsR0FBckI7QUF5QkEsQ0ExQkQ7Ozs7Ozs7Ozs7QUNsR0E7Ozs7QUFFTyxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQWUsR0FBTTtBQUNqQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixjQUF2QixDQUFkOztBQUNBLE1BQU0sU0FBUyxHQUFHLDBCQUFRLEdBQVIsQ0FBWSxNQUFaLENBQWxCOztBQUVBLE1BQUksQ0FBQyxTQUFELElBQWMsQ0FBQyxNQUFNLENBQUMsSUFBUCxDQUFZLFNBQVosRUFBdUIsTUFBMUMsRUFBa0Q7QUFDakQsSUFBQSxLQUFLLENBQUMsU0FBTixHQUFrQixDQUFsQjtBQUNBLFdBQU8sRUFBUDtBQUNBOztBQUVELEVBQUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkLEVBQXlCLE1BQXpCLENBQWdDLFVBQUMsR0FBRCxFQUFNLEdBQU47QUFBQSxXQUFjLENBQUMsR0FBRCxHQUFPLENBQUMsR0FBdEI7QUFBQSxHQUFoQyxDQUFsQjtBQUVBLFNBQU8sU0FBUDtBQUNBLENBWk07Ozs7QUFjQSxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQWUsQ0FBQyxTQUFELEVBQVksUUFBWixFQUF5QjtBQUNwRCxTQUFPLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBWixFQUF1QixHQUF2QixDQUEyQixVQUFBLEVBQUUsRUFBSTtBQUN2QyxXQUFPLFFBQVEsQ0FBQyxNQUFULENBQWdCLFVBQUEsT0FBTyxFQUFJO0FBQ2pDLFVBQUksT0FBTyxDQUFDLEVBQVIsSUFBYyxFQUFsQixFQUFzQjtBQUNyQixRQUFBLE9BQU8sQ0FBQyxLQUFSLEdBQWdCLFNBQVMsQ0FBQyxFQUFELENBQXpCO0FBQ0EsZUFBTyxPQUFQO0FBQ0E7QUFDRCxLQUxNLEVBS0osQ0FMSSxDQUFQO0FBTUEsR0FQTSxDQUFQO0FBUUEsQ0FUTTs7OztBQVdBLElBQU0sZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQW1CLENBQUMsTUFBRCxFQUFZO0FBQzNDLE1BQU0sSUFBSSxHQUFHLFlBQVksRUFBekI7QUFDQSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBUCxDQUFvQixTQUFwQixDQUFsQjs7QUFDQSxNQUFNLFlBQVksR0FBRywwQkFBUSxHQUFSLENBQVksVUFBWixDQUFyQjs7QUFDQSxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsTUFBYixDQUFvQixVQUFBLE9BQU87QUFBQSxXQUFJLE9BQU8sQ0FBQyxFQUFSLElBQWMsU0FBbEI7QUFBQSxHQUEzQixFQUF3RCxDQUF4RCxDQUF0Qjs7QUFFQSxNQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBZixDQUFSLEVBQTRCO0FBQzNCLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFmLENBQUo7QUFDQSxHQUZELE1BRU87QUFDTixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBZixDQUFKLEdBQXlCLENBQXpCO0FBQ0E7O0FBRUQsNEJBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsSUFBcEI7O0FBQ0EsRUFBQSxZQUFZO0FBQ1osQ0FkTTs7OztBQWdCQSxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUF3QixDQUFDLE1BQUQsRUFBWTtBQUNoRCxNQUFNLElBQUksR0FBRyxZQUFZLEVBQXpCO0FBQ0EsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsU0FBcEIsQ0FBbEI7O0FBQ0EsTUFBTSxZQUFZLEdBQUcsMEJBQVEsR0FBUixDQUFZLFVBQVosQ0FBckI7O0FBQ0EsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLE1BQWIsQ0FBb0IsVUFBQSxPQUFPO0FBQUEsV0FBSSxPQUFPLENBQUMsRUFBUixJQUFjLFNBQWxCO0FBQUEsR0FBM0IsRUFBd0QsQ0FBeEQsQ0FBdEI7O0FBRUEsTUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQWYsQ0FBSixJQUEwQixJQUFJLENBQUMsYUFBYSxDQUFDLEVBQWYsQ0FBSixHQUF5QixDQUF2RCxFQUEwRDtBQUN6RCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBZixDQUFKO0FBQ0EsR0FGRCxNQUVPO0FBQ04sSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQWYsQ0FBSixHQUF5QixDQUF6QjtBQUNBOztBQUVELDRCQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW9CLElBQXBCOztBQUNBLEVBQUEsWUFBWTtBQUNaLENBZE07Ozs7QUFnQkEsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBd0IsQ0FBQyxNQUFELEVBQVk7QUFDaEQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBUixHQUFnQixDQUFoQixHQUFvQixDQUFwQixHQUF3QixDQUFDLE1BQU0sQ0FBQyxLQUFwRDtBQUNBLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCLEVBQTZCLEtBQS9DO0FBQ0EsTUFBTSxJQUFJLEdBQUcsWUFBWSxFQUF6Qjs7QUFDQSxNQUFNLFlBQVksR0FBRywwQkFBUSxHQUFSLENBQVksVUFBWixDQUFyQjs7QUFDQSxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsTUFBYixDQUFvQixVQUFBLE9BQU87QUFBQSxXQUFJLE9BQU8sQ0FBQyxFQUFSLElBQWMsU0FBbEI7QUFBQSxHQUEzQixFQUF3RCxDQUF4RCxDQUF0Qjs7QUFFQSxNQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBZixDQUFSLEVBQTRCO0FBQzNCLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFmLENBQUosR0FBeUIsV0FBekI7QUFDQTs7QUFFRCw0QkFBUSxHQUFSLENBQVksTUFBWixFQUFvQixJQUFwQjs7QUFDQSxFQUFBLFlBQVk7QUFDWixDQWJNOzs7O0FBZUEsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBd0IsQ0FBQyxNQUFELEVBQVk7QUFDaEQsTUFBTSxJQUFJLEdBQUcsWUFBWSxFQUF6QjtBQUNBLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFNBQXBCLENBQWxCO0FBRUEsU0FBTyxJQUFJLENBQUMsU0FBRCxDQUFYOztBQUVBLDRCQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW9CLElBQXBCO0FBQ0EsQ0FQTTs7OztBQVNBLElBQU0sV0FBVyxHQUFHLFNBQWQsV0FBYyxHQUFNO0FBQ2hDLFNBQU8sWUFBWSxDQUFDLFlBQVksRUFBYixFQUFpQiwwQkFBUSxHQUFSLENBQVksVUFBWixDQUFqQixDQUFaLENBQ0osR0FESSxDQUNBLFVBQUEsT0FBTztBQUFBLFdBQUksQ0FBQyxPQUFPLENBQUMsS0FBVCxHQUFpQixDQUFDLE9BQU8sQ0FBQyxLQUE5QjtBQUFBLEdBRFAsRUFFSixNQUZJLENBRUcsVUFBQyxHQUFELEVBQU0sR0FBTjtBQUFBLFdBQWMsR0FBRyxHQUFHLEdBQXBCO0FBQUEsR0FGSCxDQUFQO0FBR0EsQ0FKTTs7Ozs7Ozs7Ozs7O0FDbkZQLElBQU0sV0FBVyxHQUFHLFNBQWQsV0FBYyxDQUFDLEdBQUQsRUFBUztBQUM1QixTQUFPLEtBQUssQ0FBQyxHQUFELENBQVo7QUFDQSxDQUZEOztlQUllLFc7Ozs7Ozs7Ozs7O0FDSmY7O0FBRUEsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZDs7QUFFTyxJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFtQixHQUFNO0FBQ3JDLEVBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsR0FBaEIsQ0FBb0IsTUFBcEI7QUFDQSxDQUZNOzs7O0FBSUEsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBb0IsR0FBTTtBQUN0QyxFQUFBLEtBQUssQ0FBQyxTQUFOLENBQWdCLE1BQWhCLENBQXVCLE1BQXZCO0FBQ0EsQ0FGTTs7Ozs7Ozs7Ozs7O0FDUlA7O0FBRUEsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBa0IsQ0FBQyxPQUFELEVBQTZCO0FBQUEsTUFBbkIsU0FBbUIsdUVBQVAsRUFBTztBQUNwRCxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixPQUF2QixDQUFYOztBQUNBLE1BQUksU0FBSixFQUFlO0FBQ2QsSUFBQSxFQUFFLENBQUMsU0FBSCxDQUFhLEdBQWIsQ0FBaUIsU0FBakI7QUFDQTs7QUFFRCxTQUFPLEVBQVA7QUFDQSxDQVBEOztBQVNBLElBQU0sdUJBQXVCLEdBQUcsU0FBMUIsdUJBQTBCLENBQUMsUUFBRCxFQUFXLGFBQVgsRUFBNkI7QUFDNUQsRUFBQSxRQUFRLENBQUMsT0FBVCxDQUFpQixVQUFBLE9BQU8sRUFBSTtBQUMzQixJQUFBLGFBQWEsQ0FBQyxXQUFkLENBQTBCLE9BQTFCO0FBQ0EsR0FGRDtBQUdBLENBSkQ7O0FBTUEsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBb0IsT0FBMEQ7QUFBQSxNQUF2RCxRQUF1RCxRQUF2RCxRQUF1RDtBQUFBLE1BQTdDLFdBQTZDLFFBQTdDLFdBQTZDO0FBQUEsTUFBaEMsRUFBZ0MsUUFBaEMsRUFBZ0M7QUFBQSxNQUE1QixPQUE0QixRQUE1QixPQUE0QjtBQUFBLE1BQW5CLEtBQW1CLFFBQW5CLEtBQW1CO0FBQUEsTUFBWixLQUFZLFFBQVosS0FBWTtBQUVuRixNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsS0FBRCxFQUFRLFVBQVIsQ0FBM0I7QUFDQSxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsS0FBRCxFQUFRLGNBQVIsQ0FBbkM7QUFDQSxNQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxLQUFELEVBQVEsZUFBUixDQUF4QztBQUNBLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxLQUFELEVBQVEsZUFBUixDQUFwQztBQUNBLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxLQUFELEVBQVEsT0FBUixDQUFwQztBQUNBLE1BQU0sZUFBZSxHQUFHLGVBQWUsQ0FBQyxNQUFELEVBQVMsbUJBQVQsQ0FBdkM7QUFDQSxNQUFNLG9CQUFvQixHQUFHLGVBQWUsQ0FBQyxNQUFELEVBQVMsd0JBQVQsQ0FBNUM7QUFDQSxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxHQUFELEVBQU0scUJBQU4sQ0FBMUM7QUFDQSxNQUFNLGNBQWMsR0FBRyxlQUFlLENBQUMsS0FBRCxFQUFRLGlCQUFSLENBQXRDO0FBQ0EsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLElBQUQsRUFBTyxPQUFQLENBQXBDO0FBQ0EsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLEtBQUQsRUFBUSxPQUFSLENBQXBDO0FBQ0EsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLFFBQUQsRUFBVyxhQUFYLENBQWpDO0FBRUEsRUFBQSxlQUFlLENBQUMsU0FBaEIsR0FBNEIsTUFBNUI7QUFDQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLEdBQXNCLGVBQXRCO0FBQ0EsRUFBQSxvQkFBb0IsQ0FBQyxTQUFyQixHQUFpQyxLQUFqQztBQUVBLEVBQUEsWUFBWSxDQUFDLFlBQWIsQ0FBMEIsS0FBMUIsRUFBaUMsT0FBakM7QUFDQSxFQUFBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLFNBQXZCLEVBQWtDLEVBQWxDO0FBQ0EsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixHQUFwQixDQUF3QixLQUF4QjtBQUNBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsYUFBeEI7QUFDQSxFQUFBLFlBQVksQ0FBQyxTQUFiLEdBQXlCLEtBQXpCO0FBQ0EsRUFBQSxZQUFZLENBQUMsU0FBYixHQUF5QixRQUFRLEdBQUcsS0FBcEM7QUFFQSxFQUFBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLFdBQWhCO0FBQ0EsRUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixZQUF6QjtBQUVBLE1BQU0sV0FBVyxHQUFHLENBQUMsZ0JBQUQsRUFBbUIsa0JBQW5CLEVBQXVDLGNBQXZDLENBQXBCO0FBQ0EsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLFlBQUQsRUFBZSxlQUFmLEVBQWdDLG9CQUFoQyxDQUF6QjtBQUNBLE1BQU0sY0FBYyxHQUFHLENBQUMsWUFBRCxFQUFlLFlBQWYsRUFBNkIsU0FBN0IsQ0FBdkI7QUFFQSxFQUFBLHVCQUF1QixDQUFDLFdBQUQsRUFBYyxXQUFkLENBQXZCO0FBQ0EsRUFBQSx1QkFBdUIsQ0FBQyxnQkFBRCxFQUFtQixnQkFBbkIsQ0FBdkI7QUFDQSxFQUFBLHVCQUF1QixDQUFDLGNBQUQsRUFBaUIsY0FBakIsQ0FBdkI7QUFFQSxTQUFPLEdBQVA7QUFDQSxDQXRDRDs7QUF3Q0EsSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBaUIsUUFBb0Q7QUFBQSxNQUFqRCxFQUFpRCxTQUFqRCxFQUFpRDtBQUFBLE1BQTdDLEtBQTZDLFNBQTdDLEtBQTZDO0FBQUEsTUFBdEMsT0FBc0MsU0FBdEMsT0FBc0M7QUFBQSxNQUE3QixLQUE2QixTQUE3QixLQUE2QjtBQUFBLE1BQXRCLFFBQXNCLFNBQXRCLFFBQXNCO0FBQUEsTUFBWixLQUFZLFNBQVosS0FBWTtBQUUxRSxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsSUFBRCxDQUFoQztBQUNBLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxLQUFELEVBQVEsaUJBQVIsQ0FBbkM7QUFDQSxNQUFNLGNBQWMsR0FBRyxlQUFlLENBQUMsT0FBRCxDQUF0QztBQUNBLE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxLQUFELEVBQVEsd0JBQVIsQ0FBbEM7QUFDQSxNQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsS0FBRCxFQUFRLHFCQUFSLENBQWxDO0FBQ0EsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLElBQUQsRUFBTyx1QkFBUCxDQUFwQztBQUNBLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxNQUFELEVBQVMsdUJBQVQsQ0FBcEM7QUFDQSxNQUFNLGVBQWUsR0FBRyxlQUFlLENBQUMsT0FBRCxFQUFVLDBCQUFWLENBQXZDO0FBQ0EsTUFBTSxpQkFBaUIsR0FBRyxlQUFlLENBQUMsTUFBRCxFQUFTLHVCQUFULENBQXpDO0FBQ0EsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDLFFBQUQsRUFBVyx3QkFBWCxDQUFyQztBQUVBLEVBQUEsY0FBYyxDQUFDLFlBQWYsQ0FBNEIsTUFBNUIsRUFBb0MsUUFBcEM7QUFDQSxFQUFBLGNBQWMsQ0FBQyxZQUFmLENBQTRCLE1BQTVCLEVBQW9DLFNBQXBDO0FBQ0EsRUFBQSxjQUFjLENBQUMsWUFBZixDQUE0QixPQUE1QixFQUFxQyxFQUFyQztBQUNBLEVBQUEsVUFBVSxDQUFDLFlBQVgsQ0FBd0IsS0FBeEIsRUFBK0IsT0FBL0I7QUFDQSxFQUFBLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixTQUE3QixFQUF3QyxFQUF4QztBQUNBLEVBQUEsYUFBYSxDQUFDLFlBQWQsQ0FBMkIsU0FBM0IsRUFBc0MsRUFBdEM7QUFDQSxFQUFBLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixNQUE3QixFQUFxQyxRQUFyQztBQUNBLEVBQUEsZUFBZSxDQUFDLFlBQWhCLENBQTZCLE1BQTdCLEVBQXFDLFVBQXJDO0FBQ0EsRUFBQSxlQUFlLENBQUMsWUFBaEIsQ0FBNkIsT0FBN0IsRUFBc0MsS0FBdEM7QUFFQSxFQUFBLFlBQVksQ0FBQyxTQUFiLEdBQXlCLEtBQXpCO0FBQ0EsRUFBQSxZQUFZLENBQUMsU0FBYixHQUF5QixRQUFRLEdBQUcsS0FBcEM7QUFDQSxFQUFBLGlCQUFpQixDQUFDLFNBQWxCLGFBQWlDLFFBQWpDLFNBQTRDLENBQUMsS0FBRCxHQUFTLENBQUMsS0FBdEQ7QUFDQSxFQUFBLGFBQWEsQ0FBQyxTQUFkLEdBQTBCLEdBQTFCO0FBRUEsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLGNBQUQsRUFBaUIsVUFBakIsRUFBNkIsWUFBN0IsRUFBMkMsWUFBM0MsRUFBeUQsZUFBekQsRUFBMEUsaUJBQTFFLEVBQTZGLGFBQTdGLENBQTVCO0FBQ0EsRUFBQSx1QkFBdUIsQ0FBQyxtQkFBRCxFQUFzQixXQUF0QixDQUF2QjtBQUVBLEVBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsVUFBdkI7QUFDQSxFQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLFdBQXJCO0FBRUEsU0FBTyxRQUFQO0FBQ0EsQ0FuQ0Q7O0FBcUNPLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWlCLENBQUMsUUFBRCxFQUFjO0FBQzNDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLGNBQXhCLENBQWI7QUFFQSxFQUFBLFFBQVEsQ0FBQyxPQUFULENBQWlCLFVBQUEsT0FBTyxFQUFJO0FBQzNCLElBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsaUJBQWlCLENBQUMsT0FBRCxDQUFsQztBQUNBLEdBRkQ7QUFHQSxDQU5NOzs7O0FBUUEsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFhLENBQUMsUUFBRCxFQUFjO0FBQ3ZDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFlBQXZCLENBQWI7QUFDQSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixjQUF2QixDQUFqQjtBQUNBLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGNBQXZCLENBQWQ7O0FBRUEsU0FBTyxJQUFJLENBQUMsVUFBWixFQUF3QjtBQUN2QixJQUFBLElBQUksQ0FBQyxXQUFMLENBQWlCLElBQUksQ0FBQyxVQUF0QjtBQUNBOztBQUVELE1BQUksQ0FBQyxRQUFRLENBQUMsTUFBZCxFQUFzQjtBQUNyQixXQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsR0FBZixDQUFtQixZQUFuQixDQUFQO0FBQ0EsR0FGRCxNQUVPO0FBQ04sSUFBQSxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsQ0FBc0IsWUFBdEI7QUFDQTs7QUFFRCxNQUFJLFFBQUo7QUFFQSxFQUFBLFFBQVEsQ0FBQyxPQUFULENBQWlCLFVBQUEsT0FBTyxFQUFJO0FBQzNCLElBQUEsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFuQjtBQUNBLElBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsY0FBYyxDQUFDLE9BQUQsQ0FBL0I7QUFDQSxHQUhEO0FBS0EsRUFBQSxLQUFLLENBQUMsU0FBTixvQkFBNEIsUUFBNUIsU0FBdUMsd0JBQXZDO0FBQ0EsQ0F2Qk07Ozs7QUF5QkEsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBbUIsR0FBTTtBQUNyQyxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsTUFBRCxFQUFTLGFBQVQsQ0FBNUI7QUFDQSxFQUFBLElBQUksQ0FBQyxTQUFMLENBQWUsR0FBZixDQUFtQixPQUFuQjtBQUNBLEVBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxHQUFmLENBQW1CLGVBQW5CO0FBQ0EsRUFBQSxJQUFJLENBQUMsU0FBTCxHQUFpQixlQUFqQjtBQUNBLEVBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLElBQTFCO0FBQ0EsRUFBQSxVQUFVLENBQUMsWUFBTTtBQUNoQixJQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsV0FBZCxDQUEwQixJQUExQjtBQUNBLEdBRlMsRUFFUCxJQUZPLENBQVY7QUFHQSxDQVRNOzs7Ozs7Ozs7Ozs7QUMvSFAsU0FBUyxhQUFULEdBQXdCO0FBQ3ZCLE9BQUssT0FBTCxHQUFlLFlBQWY7O0FBRUEsT0FBSyxHQUFMLEdBQVcsVUFBQyxHQUFELEVBQVM7QUFDbkIsV0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVksQ0FBQyxPQUFiLENBQXFCLEdBQXJCLENBQVgsQ0FBUDtBQUNBLEdBRkQ7O0FBR0EsT0FBSyxHQUFMLEdBQVcsVUFBQyxHQUFELEVBQU0sS0FBTixFQUFnQjtBQUMxQixJQUFBLFlBQVksQ0FBQyxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLElBQUksQ0FBQyxTQUFMLENBQWUsS0FBZixDQUExQjtBQUNBLEdBRkQ7O0FBR0EsT0FBSyxNQUFMLEdBQWMsVUFBQyxHQUFELEVBQVM7QUFDdEIsSUFBQSxZQUFZLENBQUMsVUFBYixDQUF3QixHQUF4QjtBQUNBLEdBRkQ7QUFHQTs7QUFFRCxJQUFNLE9BQU8sR0FBRyxJQUFJLGFBQUosRUFBaEI7ZUFFZSxPIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgU3RvcmFnZSBmcm9tICcuL3N0b3JhZ2VIZWxwZXInO1xyXG5pbXBvcnQgZ2V0UHJvZHVjdHMgZnJvbSAnLi9mZXRjaCc7XHJcbmltcG9ydCB7IHJlbmRlclByb2R1Y3RzLCByZW5kZXJDYXJ0LCByZW5kZXJTdWNjZXNzTXNnIH0gZnJvbSAnLi9yZW5kZXInO1xyXG5pbXBvcnQgeyBnZXRDYXJ0VmFsdWUsIGFkZFRvQ2FydEhhbmRsZXIsIGdldENhcnRJdGVtcywgY2hhbmdlUHJvZHVjdFF1YW50aXR5LCByZW1vdmVQcm9kdWN0RnJvbUNhcnQgfSBmcm9tICcuL2NhcnQnO1xyXG5pbXBvcnQgeyBtb2RhbE9wZW5IYW5kbGVyLCBtb2RhbENsb3NlSGFuZGxlciB9IGZyb20gJy4vbW9kYWwnO1xyXG5cclxuY29uc3QgcHJvZHVjdHNSZWFkeUV2ZW50TmFtZSA9ICdwcm9kdWN0c19yZWFkeSc7XHJcbmxldCBwcm9kdWN0c1JlYWR5RXZlbnQgPSBuZXcgRXZlbnQocHJvZHVjdHNSZWFkeUV2ZW50TmFtZSk7XHJcblxyXG5jb25zdCBjYXJ0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZm9ybScpO1xyXG5cclxuZ2V0UHJvZHVjdHMoJ2h0dHBzOi8vbXktanNvbi1zZXJ2ZXIudHlwaWNvZGUuY29tL3Zvcm90bmlxdWUvZmFrZXNlcnZlci9kYicpXHJcbi50aGVuKFxyXG5cdGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYExvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbS4gU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0cmVzcG9uc2UuanNvbigpXHJcblx0XHQudGhlbigoe3Byb2R1Y3RzfSkgPT4ge1xyXG5cdFx0XHRTdG9yYWdlLnNldCgncHJvZHVjdHMnLCBwcm9kdWN0cyk7XHJcblx0XHRcdGRvY3VtZW50LmRpc3BhdGNoRXZlbnQocHJvZHVjdHNSZWFkeUV2ZW50KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHQpXHJcbi5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuXHRjb25zb2xlLmxvZygnRmV0Y2ggRXJyb3IgOi1TJywgZXJyKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG5cdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuXHJcblx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2FkZC10by1jYXJ0JykpIHtcclxuXHRcdGFkZFRvQ2FydEhhbmRsZXIodGFyZ2V0KTtcclxuXHRcdHJlbmRlclN1Y2Nlc3NNc2coKTtcclxuXHR9XHJcblxyXG5cdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJ0JykpIHtcclxuXHRcdG1vZGFsT3BlbkhhbmRsZXIoKTtcclxuXHRcdHJlbmRlckNhcnQoZ2V0Q2FydEl0ZW1zKGdldENhcnRWYWx1ZSgpLCBTdG9yYWdlLmdldCgncHJvZHVjdHMnKSkpO1xyXG5cdH1cclxuXHJcblx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsX19jbG9zZScpKSB7XHJcblx0XHRtb2RhbENsb3NlSGFuZGxlcigpO1xyXG5cdH1cclxuXHJcblx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NsZWFyLWJ0bicpKSB7XHJcblx0XHRTdG9yYWdlLnNldCgnY2FydCcsIHt9KTtcclxuXHRcdHJlbmRlckNhcnQoW10pO1xyXG5cdFx0Z2V0Q2FydFZhbHVlKCk7XHJcblx0fVxyXG5cclxuXHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc3VibWl0LWJ0bicpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH1cclxuXHJcblx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NhcnQtbGlzdF9faXRlbS1yZW1vdmUnKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHJlbW92ZVByb2R1Y3RGcm9tQ2FydCh0YXJnZXQpO1xyXG5cdFx0cmVuZGVyQ2FydChnZXRDYXJ0SXRlbXMoZ2V0Q2FydFZhbHVlKCksIFN0b3JhZ2UuZ2V0KCdwcm9kdWN0cycpKSk7XHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHByb2R1Y3RzUmVhZHlFdmVudE5hbWUsICgpID0+IHtcclxuXHRjb25zdCBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvcGVsbGVyLWxvYWRlcicpO1xyXG5cdHJlbmRlclByb2R1Y3RzKFN0b3JhZ2UuZ2V0KCdwcm9kdWN0cycpKTtcclxuXHRnZXRDYXJ0VmFsdWUoKTtcclxuXHRsb2FkZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcbn0pO1xyXG5cclxuY2FydEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XHJcblx0Y2hhbmdlUHJvZHVjdFF1YW50aXR5KGV2ZW50LnRhcmdldCk7XHJcblx0cmVuZGVyQ2FydChnZXRDYXJ0SXRlbXMoZ2V0Q2FydFZhbHVlKCksIFN0b3JhZ2UuZ2V0KCdwcm9kdWN0cycpKSk7XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHJcblx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpe1xyXG5cdFx0aWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiAxMDApIHtcclxuXHRcdFx0JCgnLnNjcm9sbHVwJykuZmFkZUluKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcuc2Nyb2xsdXAnKS5mYWRlT3V0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoJy5zY3JvbGx1cCcpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDYwMCk7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSk7XHJcblxyXG59KTtcclxuXHJcbi8vICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbi8vICAgJChcIi5vd2wtY2Fyb3VzZWxcIikub3dsQ2Fyb3VzZWwoKTtcclxuLy8gfSk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdCQoJy5jYXJvdXNlbCcpLnNsaWNrKHtcclxuXHRcdGNlbnRlck1vZGU6IHRydWUsXHJcblx0XHRjZW50ZXJQYWRkaW5nOiAnNjBweCcsXHJcblx0XHRzbGlkZXNUb1Nob3c6IDMsXHJcblx0XHRyZXNwb25zaXZlOiBbXHJcblx0XHR7XHJcblx0XHRcdGJyZWFrcG9pbnQ6IDc2OCxcclxuXHRcdFx0c2V0dGluZ3M6IHtcclxuXHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxyXG5cdFx0XHRcdGNlbnRlck1vZGU6IHRydWUsXHJcblx0XHRcdFx0Y2VudGVyUGFkZGluZzogJzQwcHgnLFxyXG5cdFx0XHRcdHNsaWRlc1RvU2hvdzogM1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRicmVha3BvaW50OiA0ODAsXHJcblx0XHRcdHNldHRpbmdzOiB7XHJcblx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcclxuXHRcdFx0XHRjZW50ZXJNb2RlOiB0cnVlLFxyXG5cdFx0XHRcdGNlbnRlclBhZGRpbmc6ICc0MHB4JyxcclxuXHRcdFx0XHRzbGlkZXNUb1Nob3c6IDFcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XVxyXG5cdH0pO1xyXG59KTsiLCJpbXBvcnQgU3RvcmFnZSBmcm9tICcuL3N0b3JhZ2VIZWxwZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldENhcnRWYWx1ZSA9ICgpID0+IHtcclxuXHRjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X19sYWJlbCcpO1xyXG5cdGNvbnN0IGNhcnRWYWx1ZSA9IFN0b3JhZ2UuZ2V0KCdjYXJ0Jyk7XHJcblxyXG5cdGlmICghY2FydFZhbHVlIHx8ICFPYmplY3Qua2V5cyhjYXJ0VmFsdWUpLmxlbmd0aCkge1xyXG5cdFx0bGFiZWwuaW5uZXJUZXh0ID0gMDtcclxuXHRcdHJldHVybiB7fTtcclxuXHR9XHJcblxyXG5cdGxhYmVsLmlubmVyVGV4dCA9IE9iamVjdC52YWx1ZXMoY2FydFZhbHVlKS5yZWR1Y2UoKGFjYywgY3VyKSA9PiArYWNjICsgK2N1cik7XHJcblxyXG5cdHJldHVybiBjYXJ0VmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDYXJ0SXRlbXMgPSAoY2FydFZhbHVlLCBwcm9kdWN0cykgPT4ge1xyXG5cdHJldHVybiBPYmplY3Qua2V5cyhjYXJ0VmFsdWUpLm1hcChpZCA9PiB7XHJcblx0XHRyZXR1cm4gcHJvZHVjdHMuZmlsdGVyKHByb2R1Y3QgPT4ge1xyXG5cdFx0XHRpZiAocHJvZHVjdC5pZCA9PSBpZCkge1xyXG5cdFx0XHRcdHByb2R1Y3QudG90YWwgPSBjYXJ0VmFsdWVbaWRdO1xyXG5cdFx0XHRcdHJldHVybiBwcm9kdWN0O1xyXG5cdFx0XHR9XHJcblx0XHR9KVswXTtcclxuXHR9KTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZFRvQ2FydEhhbmRsZXIgPSAodGFyZ2V0KSA9PiB7XHJcblx0Y29uc3QgY2FydCA9IGdldENhcnRWYWx1ZSgpO1xyXG5cdGNvbnN0IHByb2R1Y3RJZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcclxuXHRjb25zdCBwcm9kdWN0c0xpc3QgPSBTdG9yYWdlLmdldCgncHJvZHVjdHMnKTtcclxuXHRjb25zdCBjaG9zZW5Qcm9kdWN0ID0gcHJvZHVjdHNMaXN0LmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQuaWQgPT0gcHJvZHVjdElkKVswXTtcclxuXHJcblx0aWYgKGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0pIHtcclxuXHRcdGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0rK1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjYXJ0W2Nob3NlblByb2R1Y3QuaWRdID0gMTtcclxuXHR9XHJcblxyXG5cdFN0b3JhZ2Uuc2V0KCdjYXJ0JywgY2FydCk7XHJcblx0Z2V0Q2FydFZhbHVlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVGcm9tQ2FydEhhbmRsZXIgPSAodGFyZ2V0KSA9PiB7XHJcblx0Y29uc3QgY2FydCA9IGdldENhcnRWYWx1ZSgpO1xyXG5cdGNvbnN0IHByb2R1Y3RJZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcclxuXHRjb25zdCBwcm9kdWN0c0xpc3QgPSBTdG9yYWdlLmdldCgncHJvZHVjdHMnKTtcclxuXHRjb25zdCBjaG9zZW5Qcm9kdWN0ID0gcHJvZHVjdHNMaXN0LmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQuaWQgPT0gcHJvZHVjdElkKVswXTtcclxuXHJcblx0aWYgKGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0gJiYgY2FydFtjaG9zZW5Qcm9kdWN0LmlkXSA+IDApIHtcclxuXHRcdGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0tLVxyXG5cdH0gZWxzZSB7XHJcblx0XHRjYXJ0W2Nob3NlblByb2R1Y3QuaWRdID0gMDtcclxuXHR9XHJcblxyXG5cdFN0b3JhZ2Uuc2V0KCdjYXJ0JywgY2FydCk7XHJcblx0Z2V0Q2FydFZhbHVlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaGFuZ2VQcm9kdWN0UXVhbnRpdHkgPSAodGFyZ2V0KSA9PiB7XHJcblx0Y29uc3QgbmV3UXVhbnRpdHkgPSArdGFyZ2V0LnZhbHVlIDwgMSA/IDEgOiArdGFyZ2V0LnZhbHVlO1xyXG5cdGNvbnN0IHByb2R1Y3RJZCA9IHRhcmdldC5hdHRyaWJ1dGVzWydkYXRhLWlkJ10udmFsdWU7XHJcblx0Y29uc3QgY2FydCA9IGdldENhcnRWYWx1ZSgpO1xyXG5cdGNvbnN0IHByb2R1Y3RzTGlzdCA9IFN0b3JhZ2UuZ2V0KCdwcm9kdWN0cycpO1xyXG5cdGNvbnN0IGNob3NlblByb2R1Y3QgPSBwcm9kdWN0c0xpc3QuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudC5pZCA9PSBwcm9kdWN0SWQpWzBdO1xyXG5cclxuXHRpZiAoY2FydFtjaG9zZW5Qcm9kdWN0LmlkXSkge1xyXG5cdFx0Y2FydFtjaG9zZW5Qcm9kdWN0LmlkXSA9IG5ld1F1YW50aXR5O1xyXG5cdH1cclxuXHJcblx0U3RvcmFnZS5zZXQoJ2NhcnQnLCBjYXJ0KTtcclxuXHRnZXRDYXJ0VmFsdWUoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbW92ZVByb2R1Y3RGcm9tQ2FydCA9ICh0YXJnZXQpID0+IHtcclxuXHRjb25zdCBjYXJ0ID0gZ2V0Q2FydFZhbHVlKCk7XHJcblx0Y29uc3QgcHJvZHVjdElkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xyXG5cclxuXHRkZWxldGUgY2FydFtwcm9kdWN0SWRdO1xyXG5cclxuXHRTdG9yYWdlLnNldCgnY2FydCcsIGNhcnQpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VG90YWxTdW0gPSAoKSA9PiB7XHJcblx0cmV0dXJuIGdldENhcnRJdGVtcyhnZXRDYXJ0VmFsdWUoKSwgU3RvcmFnZS5nZXQoJ3Byb2R1Y3RzJykpXHJcblx0XHRcdC5tYXAocHJvZHVjdCA9PiArcHJvZHVjdC5wcmljZSAqICtwcm9kdWN0LnRvdGFsKVxyXG5cdFx0XHQucmVkdWNlKChhY2MsIGN1cikgPT4gYWNjICsgY3VyKTtcclxufSIsImNvbnN0IGdldFByb2R1Y3RzID0gKHVybCkgPT4ge1xyXG5cdHJldHVybiBmZXRjaCh1cmwpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRQcm9kdWN0czsiLCJpbXBvcnQgeyBnZXRDYXJ0SXRlbXMgfSBmcm9tICcuL2NhcnQnO1xyXG5cclxuY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwnKTtcclxuXHJcbmV4cG9ydCBjb25zdCBtb2RhbE9wZW5IYW5kbGVyID0gKCkgPT4ge1xyXG5cdG1vZGFsLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1vZGFsQ2xvc2VIYW5kbGVyID0gKCkgPT4ge1xyXG5cdG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgZ2V0VG90YWxTdW0gfSBmcm9tICcuL2NhcnQnO1xyXG5cclxuY29uc3QgZ2VuZXJhdGVFbGVtZW50ID0gKHRhZ05hbWUsIGNsYXNzTmFtZSA9ICcnKSA9PiB7XHJcblx0Y29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xyXG5cdGlmIChjbGFzc05hbWUpIHtcclxuXHRcdGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBlbDtcclxufVxyXG5cclxuY29uc3QgaW5zZXJ0RWxlbWVudEludG9QYXJlbnQgPSAoZWxlbWVudHMsIHBhcmVudEVsZW1lbnQpID0+IHtcclxuXHRlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdFx0cGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHR9KVxyXG59XHJcblxyXG5jb25zdCBjcmVhdGVQcm9kdWN0SXRlbSA9ICh7IGN1cnJlbmN5LCBkZXNjcmlwdGlvbiwgaWQsIGltZ191cmwsIHByaWNlLCB0aXRsZSB9KSA9PiB7XHJcblxyXG5cdGNvbnN0IGNvbCA9IGdlbmVyYXRlRWxlbWVudCgnZGl2JywgJ2NvbC1tZC00Jyk7XHJcblx0Y29uc3QgcHJvZHVjdEdyaWQgPSBnZW5lcmF0ZUVsZW1lbnQoJ2RpdicsICdwcm9kdWN0LWdyaWQnKTtcclxuXHRjb25zdCBwcm9kdWN0SW1hZ2VXcmFwID0gZ2VuZXJhdGVFbGVtZW50KCdkaXYnLCAncHJvZHVjdC1pbWFnZScpO1xyXG5cdGNvbnN0IGltYWdlV3JhcHBlciA9IGdlbmVyYXRlRWxlbWVudCgnZGl2JywgJ2ltYWdlLXdyYXBwZXInKTtcclxuXHRjb25zdCBwcm9kdWN0SW1hZ2UgPSBnZW5lcmF0ZUVsZW1lbnQoJ2ltZycsICdwaWMtMScpO1xyXG5cdGNvbnN0IHByb2R1Y3ROZXdMYWJlbCA9IGdlbmVyYXRlRWxlbWVudCgnc3BhbicsICdwcm9kdWN0LW5ldy1sYWJlbCcpO1xyXG5cdGNvbnN0IHByb2R1Y3REaXNjb3VudExhYmVsID0gZ2VuZXJhdGVFbGVtZW50KCdzcGFuJywgJ3Byb2R1Y3QtZGlzY291bnQtbGFiZWwnKTtcclxuXHRjb25zdCBwcm9kdWN0RGVzY3JpcHRpb24gPSBnZW5lcmF0ZUVsZW1lbnQoJ3AnLCAncHJvZHVjdC1kZXNjcmlwdGlvbicpO1xyXG5cdGNvbnN0IHByb2R1Y3RDb250ZW50ID0gZ2VuZXJhdGVFbGVtZW50KCdkaXYnLCAncHJvZHVjdC1jb250ZW50Jyk7XHJcblx0Y29uc3QgcHJvZHVjdFRpdGxlID0gZ2VuZXJhdGVFbGVtZW50KCdoMycsICd0aXRsZScpO1xyXG5cdGNvbnN0IHByb2R1Y3RQcmljZSA9IGdlbmVyYXRlRWxlbWVudCgnZGl2JywgJ3ByaWNlJyk7XHJcblx0Y29uc3QgYWRkVG9DYXJ0ID0gZ2VuZXJhdGVFbGVtZW50KCdidXR0b24nLCAnYWRkLXRvLWNhcnQnKTtcclxuXHJcblx0cHJvZHVjdE5ld0xhYmVsLmlubmVyVGV4dCA9ICdTYWxlJztcclxuXHRhZGRUb0NhcnQuaW5uZXJUZXh0ID0gJysgQWRkIFRvIENhcnQnO1xyXG5cdHByb2R1Y3REaXNjb3VudExhYmVsLmlubmVyVGV4dCA9ICdORVcnO1xyXG5cclxuXHRwcm9kdWN0SW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBpbWdfdXJsKTtcclxuXHRhZGRUb0NhcnQuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgaWQpO1xyXG5cdGFkZFRvQ2FydC5jbGFzc0xpc3QuYWRkKCdidG4nKTtcclxuXHRhZGRUb0NhcnQuY2xhc3NMaXN0LmFkZCgnYnRuLXN1Y2Nlc3MnKTtcclxuXHRwcm9kdWN0VGl0bGUuaW5uZXJUZXh0ID0gdGl0bGU7XHJcblx0cHJvZHVjdFByaWNlLmlubmVyVGV4dCA9IGN1cnJlbmN5ICsgcHJpY2U7XHJcblxyXG5cdGNvbC5hcHBlbmRDaGlsZChwcm9kdWN0R3JpZCk7XHJcblx0aW1hZ2VXcmFwcGVyLmFwcGVuZENoaWxkKHByb2R1Y3RJbWFnZSk7XHJcblxyXG5cdGNvbnN0IHdyYXBwZWRHcmlkID0gW3Byb2R1Y3RJbWFnZVdyYXAsIHByb2R1Y3REZXNjcmlwdGlvbiwgcHJvZHVjdENvbnRlbnRdO1xyXG5cdGNvbnN0IHdyYXBwZWRJbWFnZVdyYXAgPSBbaW1hZ2VXcmFwcGVyLCBwcm9kdWN0TmV3TGFiZWwsIHByb2R1Y3REaXNjb3VudExhYmVsXTtcclxuXHRjb25zdCB3cmFwcGVkQ29udGVudCA9IFtwcm9kdWN0VGl0bGUsIHByb2R1Y3RQcmljZSwgYWRkVG9DYXJ0XTtcclxuXHJcblx0aW5zZXJ0RWxlbWVudEludG9QYXJlbnQod3JhcHBlZEdyaWQsIHByb2R1Y3RHcmlkKTtcclxuXHRpbnNlcnRFbGVtZW50SW50b1BhcmVudCh3cmFwcGVkSW1hZ2VXcmFwLCBwcm9kdWN0SW1hZ2VXcmFwKTtcclxuXHRpbnNlcnRFbGVtZW50SW50b1BhcmVudCh3cmFwcGVkQ29udGVudCwgcHJvZHVjdENvbnRlbnQpO1xyXG5cclxuXHRyZXR1cm4gY29sO1xyXG59XHJcblxyXG5jb25zdCBjcmVhdGVDYXJ0SXRlbSA9ICh7IGlkLCB0aXRsZSwgaW1nX3VybCwgcHJpY2UsIGN1cnJlbmN5LCB0b3RhbCB9KSA9PiB7XHJcblxyXG5cdGNvbnN0IGxpc3RJdGVtID0gZ2VuZXJhdGVFbGVtZW50KCdsaScpO1xyXG5cdGNvbnN0IHByb2R1Y3RJdGVtID0gZ2VuZXJhdGVFbGVtZW50KCdkaXYnLCAnY2FydC1saXN0X19pdGVtJyk7XHJcblx0Y29uc3QgcHJvZHVjdEFydGljdWwgPSBnZW5lcmF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcblx0Y29uc3QgaW1nV3JhcHBlciA9IGdlbmVyYXRlRWxlbWVudCgnZGl2JywgJ2NhcnQtbGlzdF9faW1nLXdyYXBwZXInKTtcclxuXHRjb25zdCBwcm9kdWN0SW1nID0gZ2VuZXJhdGVFbGVtZW50KCdpbWcnLCAnY2FydC1saXN0X19pdGVtLWltZycpO1xyXG5cdGNvbnN0IHByb2R1Y3RUaXRsZSA9IGdlbmVyYXRlRWxlbWVudCgnaDQnLCAnY2FydC1saXN0X19pdGVtLXRpdGxlJyk7XHJcblx0Y29uc3QgcHJvZHVjdFByaWNlID0gZ2VuZXJhdGVFbGVtZW50KCdzcGFuJywgJ2NhcnQtbGlzdF9faXRlbS1wcmljZScpO1xyXG5cdGNvbnN0IHByb2R1Y3RRdWFudGl0eSA9IGdlbmVyYXRlRWxlbWVudCgnaW5wdXQnLCAnY2FydC1saXN0X19pdGVtLXF1YW50aXR5Jyk7XHJcblx0Y29uc3QgcHJvZHVjdFRvdGFsUHJpY2UgPSBnZW5lcmF0ZUVsZW1lbnQoJ3NwYW4nLCAnY2FydC1saXN0X19pdGVtLXRvdGFsJyk7XHJcblx0Y29uc3QgcHJvZHVjdFJlbW92ZSA9IGdlbmVyYXRlRWxlbWVudCgnYnV0dG9uJywgJ2NhcnQtbGlzdF9faXRlbS1yZW1vdmUnKTtcclxuXHJcblx0cHJvZHVjdEFydGljdWwuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2hpZGRlbicpO1xyXG5cdHByb2R1Y3RBcnRpY3VsLnNldEF0dHJpYnV0ZSgnbmFtZScsICdhcnRpY3VsJyk7XHJcblx0cHJvZHVjdEFydGljdWwuc2V0QXR0cmlidXRlKCd2YWx1ZScsIGlkKTtcclxuXHRwcm9kdWN0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgaW1nX3VybCk7XHJcblx0cHJvZHVjdFF1YW50aXR5LnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIGlkKTtcclxuXHRwcm9kdWN0UmVtb3ZlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIGlkKTtcclxuXHRwcm9kdWN0UXVhbnRpdHkuc2V0QXR0cmlidXRlKCd0eXBlJywgJ251bWJlcicpO1xyXG5cdHByb2R1Y3RRdWFudGl0eS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAncXVhbnRpdHknKTtcclxuXHRwcm9kdWN0UXVhbnRpdHkuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRvdGFsKTtcclxuXHJcblx0cHJvZHVjdFRpdGxlLmlubmVyVGV4dCA9IHRpdGxlO1xyXG5cdHByb2R1Y3RQcmljZS5pbm5lclRleHQgPSBjdXJyZW5jeSArIHByaWNlO1xyXG5cdHByb2R1Y3RUb3RhbFByaWNlLmlubmVyVGV4dCA9IGAke2N1cnJlbmN5fSR7K3ByaWNlICogK3RvdGFsfWA7XHJcblx0cHJvZHVjdFJlbW92ZS5pbm5lclRleHQgPSAnLSc7XHJcblxyXG5cdGNvbnN0IHdyYXBwZWRQcm9kdWN0SXRlbXMgPSBbcHJvZHVjdEFydGljdWwsIGltZ1dyYXBwZXIsIHByb2R1Y3RUaXRsZSwgcHJvZHVjdFByaWNlLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RUb3RhbFByaWNlLCBwcm9kdWN0UmVtb3ZlXTtcclxuXHRpbnNlcnRFbGVtZW50SW50b1BhcmVudCh3cmFwcGVkUHJvZHVjdEl0ZW1zLCBwcm9kdWN0SXRlbSk7XHJcblxyXG5cdGltZ1dyYXBwZXIuYXBwZW5kQ2hpbGQocHJvZHVjdEltZyk7XHJcblx0bGlzdEl0ZW0uYXBwZW5kQ2hpbGQocHJvZHVjdEl0ZW0pO1xyXG5cclxuXHRyZXR1cm4gbGlzdEl0ZW07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJQcm9kdWN0cyA9IChwcm9kdWN0cykgPT4ge1xyXG5cdGNvbnN0IGdyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZHVjdHNHcmlkJyk7XHJcblxyXG5cdHByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XHJcblx0XHRncmlkLmFwcGVuZENoaWxkKGNyZWF0ZVByb2R1Y3RJdGVtKHByb2R1Y3QpKTtcclxuXHR9KVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVuZGVyQ2FydCA9IChwcm9kdWN0cykgPT4ge1xyXG5cdGNvbnN0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydC1saXN0Jyk7XHJcblx0Y29uc3QgZW1wdHlNc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fZW1wdHknKTtcclxuXHRjb25zdCB0b3RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X190b3RhbCcpO1xyXG5cclxuXHR3aGlsZSAoZ3JpZC5maXJzdENoaWxkKSB7XHJcblx0XHRncmlkLnJlbW92ZUNoaWxkKGdyaWQuZmlyc3RDaGlsZCk7XHJcblx0fVxyXG5cclxuXHRpZiAoIXByb2R1Y3RzLmxlbmd0aCkge1xyXG5cdFx0cmV0dXJuIGdyaWQuY2xhc3NMaXN0LmFkZCgnZW1wdHktbGlzdCcpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRncmlkLmNsYXNzTGlzdC5yZW1vdmUoJ2VtcHR5LWxpc3QnKTtcclxuXHR9XHJcblxyXG5cdGxldCBjdXJyZW5jeTtcclxuXHJcblx0cHJvZHVjdHMuZm9yRWFjaChwcm9kdWN0ID0+IHtcclxuXHRcdGN1cnJlbmN5ID0gcHJvZHVjdC5jdXJyZW5jeTtcclxuXHRcdGdyaWQuYXBwZW5kQ2hpbGQoY3JlYXRlQ2FydEl0ZW0ocHJvZHVjdCkpO1xyXG5cdH0pO1xyXG5cclxuXHR0b3RhbC5pbm5lclRleHQgPSBgVG90YWw6ICR7Y3VycmVuY3l9JHtnZXRUb3RhbFN1bSgpfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJTdWNjZXNzTXNnID0gKCkgPT4ge1xyXG5cdGNvbnN0IHNwYW4gPSBnZW5lcmF0ZUVsZW1lbnQoJ3NwYW4nLCAnc3VjY2Vzcy1tc2cnKTtcclxuXHRzcGFuLmNsYXNzTGlzdC5hZGQoJ2JhZGdlJyk7XHJcblx0c3Bhbi5jbGFzc0xpc3QuYWRkKCdiYWRnZS1zdWNjZXNzJyk7XHJcblx0c3Bhbi5pbm5lclRleHQgPSAnQWRkZWQgdG8gY2FydCc7XHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzcGFuKTtcclxuXHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc3Bhbik7XHJcblx0fSwgMjUwMCk7XHJcbn0iLCJmdW5jdGlvbiBTdG9yYWdlSGVscGVyKCl7XHJcblx0dGhpcy5zdG9yYWdlID0gbG9jYWxTdG9yYWdlO1xyXG5cclxuXHR0aGlzLmdldCA9IChrZXkpID0+IHtcclxuXHRcdHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG5cdH1cclxuXHR0aGlzLnNldCA9IChrZXksIHZhbHVlKSA9PiB7XHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XHJcblx0fVxyXG5cdHRoaXMucmVtb3ZlID0gKGtleSkgPT4ge1xyXG5cdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IFN0b3JhZ2UgPSBuZXcgU3RvcmFnZUhlbHBlcigpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3RvcmFnZTsiXSwicHJlRXhpc3RpbmdDb21tZW50IjoiLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OWljbTkzYzJWeUxYQmhZMnN2WDNCeVpXeDFaR1V1YW5NaUxDSndjbTlxWldOMGN5OXpkWEJsY21SeWIyNWxMM055WXk5cWN5OWhjSEF1YW5NaUxDSndjbTlxWldOMGN5OXpkWEJsY21SeWIyNWxMM055WXk5cWN5OWpZWEowTG1weklpd2ljSEp2YW1WamRITXZjM1Z3WlhKa2NtOXVaUzl6Y21NdmFuTXZabVYwWTJndWFuTWlMQ0p3Y205cVpXTjBjeTl6ZFhCbGNtUnliMjVsTDNOeVl5OXFjeTl0YjJSaGJDNXFjeUlzSW5CeWIycGxZM1J6TDNOMWNHVnlaSEp2Ym1VdmMzSmpMMnB6TDNKbGJtUmxjaTVxY3lJc0luQnliMnBsWTNSekwzTjFjR1Z5WkhKdmJtVXZjM0pqTDJwekwzTjBiM0poWjJWSVpXeHdaWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPenRCUTBGQk96dEJRVU5CT3p0QlFVTkJPenRCUVVOQk96dEJRVU5CT3pzN08wRkJSVUVzU1VGQlRTeHpRa0ZCYzBJc1IwRkJSeXhuUWtGQkwwSTdRVUZEUVN4SlFVRkpMR3RDUVVGclFpeEhRVUZITEVsQlFVa3NTMEZCU2l4RFFVRlZMSE5DUVVGV0xFTkJRWHBDTzBGQlJVRXNTVUZCVFN4UlFVRlJMRWRCUVVjc1VVRkJVU3hEUVVGRExHRkJRVlFzUTBGQmRVSXNZMEZCZGtJc1EwRkJha0k3UVVGRlFTeDFRa0ZCV1N3NFJFRkJXaXhGUVVORExFbEJSRVFzUTBGRlF5eFZRVUZUTEZGQlFWUXNSVUZCYlVJN1FVRkRiRUlzVFVGQlNTeFJRVUZSTEVOQlFVTXNUVUZCVkN4TFFVRnZRaXhIUVVGNFFpeEZRVUUyUWp0QlFVTTFRaXhKUVVGQkxFOUJRVThzUTBGQlF5eEhRVUZTTEhkRVFVRTBSQ3hSUVVGUkxFTkJRVU1zVFVGQmNrVTdRVUZEUVR0QlFVTkJPenRCUVVWRUxFVkJRVUVzVVVGQlVTeERRVUZETEVsQlFWUXNSMEZEUXl4SlFVUkVMRU5CUTAwc1owSkJRV2RDTzBGQlFVRXNVVUZCWkN4UlFVRmpMRkZCUVdRc1VVRkJZenM3UVVGRGNrSXNPRUpCUVZFc1IwRkJVaXhEUVVGWkxGVkJRVm9zUlVGQmQwSXNVVUZCZUVJN08wRkJRMEVzU1VGQlFTeFJRVUZSTEVOQlFVTXNZVUZCVkN4RFFVRjFRaXhyUWtGQmRrSTdRVUZEUVN4SFFVcEVPMEZCUzBFc1EwRmlSaXhYUVdWUExGVkJRVk1zUjBGQlZDeEZRVUZqTzBGQlEzQkNMRVZCUVVFc1QwRkJUeXhEUVVGRExFZEJRVklzUTBGQldTeHBRa0ZCV2l4RlFVRXJRaXhIUVVFdlFqdEJRVU5CTEVOQmFrSkVPMEZCYlVKQkxGRkJRVkVzUTBGQlF5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNM1F5eE5RVUZOTEUxQlFVMHNSMEZCUnl4TFFVRkxMRU5CUVVNc1RVRkJja0k3TzBGQlJVRXNUVUZCU1N4TlFVRk5MRU5CUVVNc1UwRkJVQ3hEUVVGcFFpeFJRVUZxUWl4RFFVRXdRaXhoUVVFeFFpeERRVUZLTEVWQlFUaERPMEZCUXpkRExHZERRVUZwUWl4TlFVRnFRanRCUVVOQk8wRkJRMEU3TzBGQlJVUXNUVUZCU1N4TlFVRk5MRU5CUVVNc1UwRkJVQ3hEUVVGcFFpeFJRVUZxUWl4RFFVRXdRaXhOUVVFeFFpeERRVUZLTEVWQlFYVkRPMEZCUTNSRE8wRkJRMEVzTkVKQlFWY3NkMEpCUVdFc2VVSkJRV0lzUlVGQk5rSXNNRUpCUVZFc1IwRkJVaXhEUVVGWkxGVkJRVm9zUTBGQk4wSXNRMEZCV0R0QlFVTkJPenRCUVVWRUxFMUJRVWtzVFVGQlRTeERRVUZETEZOQlFWQXNRMEZCYVVJc1VVRkJha0lzUTBGQk1FSXNZMEZCTVVJc1EwRkJTaXhGUVVFclF6dEJRVU01UXp0QlFVTkJPenRCUVVWRUxFMUJRVWtzVFVGQlRTeERRVUZETEZOQlFWQXNRMEZCYVVJc1VVRkJha0lzUTBGQk1FSXNWMEZCTVVJc1EwRkJTaXhGUVVFMFF6dEJRVU16UXl3NFFrRkJVU3hIUVVGU0xFTkJRVmtzVFVGQldpeEZRVUZ2UWl4RlFVRndRanM3UVVGRFFTdzBRa0ZCVnl4RlFVRllPMEZCUTBFN1FVRkRRVHM3UVVGRlJDeE5RVUZKTEUxQlFVMHNRMEZCUXl4VFFVRlFMRU5CUVdsQ0xGRkJRV3BDTEVOQlFUQkNMRmxCUVRGQ0xFTkJRVW9zUlVGQk5rTTdRVUZETlVNc1NVRkJRU3hMUVVGTExFTkJRVU1zWTBGQlRqdEJRVU5CT3p0QlFVVkVMRTFCUVVrc1RVRkJUU3hEUVVGRExGTkJRVkFzUTBGQmFVSXNVVUZCYWtJc1EwRkJNRUlzZDBKQlFURkNMRU5CUVVvc1JVRkJlVVE3UVVGRGVFUXNTVUZCUVN4TFFVRkxMRU5CUVVNc1kwRkJUanRCUVVOQkxIRkRRVUZ6UWl4TlFVRjBRanRCUVVOQkxEUkNRVUZYTEhkQ1FVRmhMSGxDUVVGaUxFVkJRVFpDTERCQ1FVRlJMRWRCUVZJc1EwRkJXU3hWUVVGYUxFTkJRVGRDTEVOQlFWZzdRVUZEUVR0QlFVVkVMRU5CYWtORU8wRkJiVU5CTEZGQlFWRXNRMEZCUXl4blFrRkJWQ3hEUVVFd1FpeHpRa0ZCTVVJc1JVRkJhMFFzV1VGQlRUdEJRVU4yUkN4TlFVRk5MRTFCUVUwc1IwRkJSeXhSUVVGUkxFTkJRVU1zWVVGQlZDeERRVUYxUWl4dFFrRkJka0lzUTBGQlpqdEJRVU5CTERoQ1FVRmxMREJDUVVGUkxFZEJRVklzUTBGQldTeFZRVUZhTEVOQlFXWTdRVUZEUVR0QlFVTkJMRVZCUVVFc1RVRkJUU3hEUVVGRExGTkJRVkFzUTBGQmFVSXNSMEZCYWtJc1EwRkJjVUlzVVVGQmNrSTdRVUZEUVN4RFFVeEVPMEZCVDBFc1VVRkJVU3hEUVVGRExHZENRVUZVTEVOQlFUQkNMRkZCUVRGQ0xFVkJRVzlETEZWQlFVTXNTMEZCUkN4RlFVRlhPMEZCUXpsRExHMURRVUZ6UWl4TFFVRkxMRU5CUVVNc1RVRkJOVUk3UVVGRFFTd3dRa0ZCVnl4M1FrRkJZU3g1UWtGQllpeEZRVUUyUWl3d1FrRkJVU3hIUVVGU0xFTkJRVmtzVlVGQldpeERRVUUzUWl4RFFVRllPMEZCUTBFc1EwRklSRHRCUVV0QkxFTkJRVU1zUTBGQlF5eFJRVUZFTEVOQlFVUXNRMEZCV1N4TFFVRmFMRU5CUVd0Q0xGbEJRVlU3UVVGRk0wSXNSVUZCUVN4RFFVRkRMRU5CUVVNc1RVRkJSQ3hEUVVGRUxFTkJRVlVzVFVGQlZpeERRVUZwUWl4WlFVRlZPMEZCUXpGQ0xGRkJRVWtzUTBGQlF5eERRVUZETEVsQlFVUXNRMEZCUkN4RFFVRlJMRk5CUVZJc1MwRkJjMElzUjBGQk1VSXNSVUZCSzBJN1FVRkRPVUlzVFVGQlFTeERRVUZETEVOQlFVTXNWMEZCUkN4RFFVRkVMRU5CUVdVc1RVRkJaanRCUVVOQkxFdEJSa1FzVFVGRlR6dEJRVU5PTEUxQlFVRXNRMEZCUXl4RFFVRkRMRmRCUVVRc1EwRkJSQ3hEUVVGbExFOUJRV1k3UVVGRFFUdEJRVU5FTEVkQlRrUTdRVUZSUVN4RlFVRkJMRU5CUVVNc1EwRkJReXhYUVVGRUxFTkJRVVFzUTBGQlpTeExRVUZtTEVOQlFYRkNMRmxCUVZVN1FVRkRPVUlzU1VGQlFTeERRVUZETEVOQlFVTXNXVUZCUkN4RFFVRkVMRU5CUVdkQ0xFOUJRV2hDTEVOQlFYZENPMEZCUVVVc1RVRkJRU3hUUVVGVExFVkJRVVU3UVVGQllpeExRVUY0UWl4RlFVRXdReXhIUVVFeFF6dEJRVU5CTEZkQlFVOHNTMEZCVUR0QlFVTkJMRWRCU0VRN1FVRkxRU3hEUVdaRUxFVXNRMEZwUWtFN1FVRkRRVHRCUVVOQk96dEJRVVZCTEVOQlFVTXNRMEZCUXl4UlFVRkVMRU5CUVVRc1EwRkJXU3hMUVVGYUxFTkJRV3RDTEZsQlFWVTdRVUZETTBJc1JVRkJRU3hEUVVGRExFTkJRVU1zVjBGQlJDeERRVUZFTEVOQlFXVXNTMEZCWml4RFFVRnhRanRCUVVOd1FpeEpRVUZCTEZWQlFWVXNSVUZCUlN4SlFVUlJPMEZCUlhCQ0xFbEJRVUVzWVVGQllTeEZRVUZGTEUxQlJrczdRVUZIY0VJc1NVRkJRU3haUVVGWkxFVkJRVVVzUTBGSVRUdEJRVWx3UWl4SlFVRkJMRlZCUVZVc1JVRkJSU3hEUVVOYU8wRkJRME1zVFVGQlFTeFZRVUZWTEVWQlFVVXNSMEZFWWp0QlFVVkRMRTFCUVVFc1VVRkJVU3hGUVVGRk8wRkJRMVFzVVVGQlFTeE5RVUZOTEVWQlFVVXNTMEZFUXp0QlFVVlVMRkZCUVVFc1ZVRkJWU3hGUVVGRkxFbEJSa2c3UVVGSFZDeFJRVUZCTEdGQlFXRXNSVUZCUlN4TlFVaE9PMEZCU1ZRc1VVRkJRU3haUVVGWkxFVkJRVVU3UVVGS1REdEJRVVpZTEV0QlJGa3NSVUZWV2p0QlFVTkRMRTFCUVVFc1ZVRkJWU3hGUVVGRkxFZEJSR0k3UVVGRlF5eE5RVUZCTEZGQlFWRXNSVUZCUlR0QlFVTlVMRkZCUVVFc1RVRkJUU3hGUVVGRkxFdEJSRU03UVVGRlZDeFJRVUZCTEZWQlFWVXNSVUZCUlN4SlFVWklPMEZCUjFRc1VVRkJRU3hoUVVGaExFVkJRVVVzVFVGSVRqdEJRVWxVTEZGQlFVRXNXVUZCV1N4RlFVRkZPMEZCU2t3N1FVRkdXQ3hMUVZaWk8wRkJTbEVzUjBGQmNrSTdRVUY1UWtFc1EwRXhRa1E3T3pzN096czdPenM3UVVOc1IwRTdPenM3UVVGRlR5eEpRVUZOTEZsQlFWa3NSMEZCUnl4VFFVRm1MRmxCUVdVc1IwRkJUVHRCUVVOcVF5eE5RVUZOTEV0QlFVc3NSMEZCUnl4UlFVRlJMRU5CUVVNc1lVRkJWQ3hEUVVGMVFpeGpRVUYyUWl4RFFVRmtPenRCUVVOQkxFMUJRVTBzVTBGQlV5eEhRVUZITERCQ1FVRlJMRWRCUVZJc1EwRkJXU3hOUVVGYUxFTkJRV3hDT3p0QlFVVkJMRTFCUVVrc1EwRkJReXhUUVVGRUxFbEJRV01zUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCVUN4RFFVRlpMRk5CUVZvc1JVRkJkVUlzVFVGQk1VTXNSVUZCYTBRN1FVRkRha1FzU1VGQlFTeExRVUZMTEVOQlFVTXNVMEZCVGl4SFFVRnJRaXhEUVVGc1FqdEJRVU5CTEZkQlFVOHNSVUZCVUR0QlFVTkJPenRCUVVWRUxFVkJRVUVzUzBGQlN5eERRVUZETEZOQlFVNHNSMEZCYTBJc1RVRkJUU3hEUVVGRExFMUJRVkFzUTBGQll5eFRRVUZrTEVWQlFYbENMRTFCUVhwQ0xFTkJRV2RETEZWQlFVTXNSMEZCUkN4RlFVRk5MRWRCUVU0N1FVRkJRU3hYUVVGakxFTkJRVU1zUjBGQlJDeEhRVUZQTEVOQlFVTXNSMEZCZEVJN1FVRkJRU3hIUVVGb1F5eERRVUZzUWp0QlFVVkJMRk5CUVU4c1UwRkJVRHRCUVVOQkxFTkJXazA3T3pzN1FVRmpRU3hKUVVGTkxGbEJRVmtzUjBGQlJ5eFRRVUZtTEZsQlFXVXNRMEZCUXl4VFFVRkVMRVZCUVZrc1VVRkJXaXhGUVVGNVFqdEJRVU53UkN4VFFVRlBMRTFCUVUwc1EwRkJReXhKUVVGUUxFTkJRVmtzVTBGQldpeEZRVUYxUWl4SFFVRjJRaXhEUVVFeVFpeFZRVUZCTEVWQlFVVXNSVUZCU1R0QlFVTjJReXhYUVVGUExGRkJRVkVzUTBGQlF5eE5RVUZVTEVOQlFXZENMRlZCUVVFc1QwRkJUeXhGUVVGSk8wRkJRMnBETEZWQlFVa3NUMEZCVHl4RFFVRkRMRVZCUVZJc1NVRkJZeXhGUVVGc1FpeEZRVUZ6UWp0QlFVTnlRaXhSUVVGQkxFOUJRVThzUTBGQlF5eExRVUZTTEVkQlFXZENMRk5CUVZNc1EwRkJReXhGUVVGRUxFTkJRWHBDTzBGQlEwRXNaVUZCVHl4UFFVRlFPMEZCUTBFN1FVRkRSQ3hMUVV4TkxFVkJTMG9zUTBGTVNTeERRVUZRTzBGQlRVRXNSMEZRVFN4RFFVRlFPMEZCVVVFc1EwRlVUVHM3T3p0QlFWZEJMRWxCUVUwc1owSkJRV2RDTEVkQlFVY3NVMEZCYmtJc1owSkJRVzFDTEVOQlFVTXNUVUZCUkN4RlFVRlpPMEZCUXpORExFMUJRVTBzU1VGQlNTeEhRVUZITEZsQlFWa3NSVUZCZWtJN1FVRkRRU3hOUVVGTkxGTkJRVk1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNXVUZCVUN4RFFVRnZRaXhUUVVGd1FpeERRVUZzUWpzN1FVRkRRU3hOUVVGTkxGbEJRVmtzUjBGQlJ5d3dRa0ZCVVN4SFFVRlNMRU5CUVZrc1ZVRkJXaXhEUVVGeVFqczdRVUZEUVN4TlFVRk5MR0ZCUVdFc1IwRkJSeXhaUVVGWkxFTkJRVU1zVFVGQllpeERRVUZ2UWl4VlFVRkJMRTlCUVU4N1FVRkJRU3hYUVVGSkxFOUJRVThzUTBGQlF5eEZRVUZTTEVsQlFXTXNVMEZCYkVJN1FVRkJRU3hIUVVFelFpeEZRVUYzUkN4RFFVRjRSQ3hEUVVGMFFqczdRVUZGUVN4TlFVRkpMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUlVGQlppeERRVUZTTEVWQlFUUkNPMEZCUXpOQ0xFbEJRVUVzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4RlFVRm1MRU5CUVVvN1FVRkRRU3hIUVVaRUxFMUJSVTg3UVVGRFRpeEpRVUZCTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1JVRkJaaXhEUVVGS0xFZEJRWGxDTEVOQlFYcENPMEZCUTBFN08wRkJSVVFzTkVKQlFWRXNSMEZCVWl4RFFVRlpMRTFCUVZvc1JVRkJiMElzU1VGQmNFSTdPMEZCUTBFc1JVRkJRU3haUVVGWk8wRkJRMW9zUTBGa1RUczdPenRCUVdkQ1FTeEpRVUZOTEhGQ1FVRnhRaXhIUVVGSExGTkJRWGhDTEhGQ1FVRjNRaXhEUVVGRExFMUJRVVFzUlVGQldUdEJRVU5vUkN4TlFVRk5MRWxCUVVrc1IwRkJSeXhaUVVGWkxFVkJRWHBDTzBGQlEwRXNUVUZCVFN4VFFVRlRMRWRCUVVjc1RVRkJUU3hEUVVGRExGbEJRVkFzUTBGQmIwSXNVMEZCY0VJc1EwRkJiRUk3TzBGQlEwRXNUVUZCVFN4WlFVRlpMRWRCUVVjc01FSkJRVkVzUjBGQlVpeERRVUZaTEZWQlFWb3NRMEZCY2tJN08wRkJRMEVzVFVGQlRTeGhRVUZoTEVkQlFVY3NXVUZCV1N4RFFVRkRMRTFCUVdJc1EwRkJiMElzVlVGQlFTeFBRVUZQTzBGQlFVRXNWMEZCU1N4UFFVRlBMRU5CUVVNc1JVRkJVaXhKUVVGakxGTkJRV3hDTzBGQlFVRXNSMEZCTTBJc1JVRkJkMFFzUTBGQmVFUXNRMEZCZEVJN08wRkJSVUVzVFVGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRVZCUVdZc1EwRkJTaXhKUVVFd1FpeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRVZCUVdZc1EwRkJTaXhIUVVGNVFpeERRVUYyUkN4RlFVRXdSRHRCUVVONlJDeEpRVUZCTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1JVRkJaaXhEUVVGS08wRkJRMEVzUjBGR1JDeE5RVVZQTzBGQlEwNHNTVUZCUVN4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFVkJRV1lzUTBGQlNpeEhRVUY1UWl4RFFVRjZRanRCUVVOQk96dEJRVVZFTERSQ1FVRlJMRWRCUVZJc1EwRkJXU3hOUVVGYUxFVkJRVzlDTEVsQlFYQkNPenRCUVVOQkxFVkJRVUVzV1VGQldUdEJRVU5hTEVOQlpFMDdPenM3UVVGblFrRXNTVUZCVFN4eFFrRkJjVUlzUjBGQlJ5eFRRVUY0UWl4eFFrRkJkMElzUTBGQlF5eE5RVUZFTEVWQlFWazdRVUZEYUVRc1RVRkJUU3hYUVVGWExFZEJRVWNzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCVWl4SFFVRm5RaXhEUVVGb1FpeEhRVUZ2UWl4RFFVRndRaXhIUVVGM1FpeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRndSRHRCUVVOQkxFMUJRVTBzVTBGQlV5eEhRVUZITEUxQlFVMHNRMEZCUXl4VlFVRlFMRU5CUVd0Q0xGTkJRV3hDTEVWQlFUWkNMRXRCUVM5RE8wRkJRMEVzVFVGQlRTeEpRVUZKTEVkQlFVY3NXVUZCV1N4RlFVRjZRanM3UVVGRFFTeE5RVUZOTEZsQlFWa3NSMEZCUnl3d1FrRkJVU3hIUVVGU0xFTkJRVmtzVlVGQldpeERRVUZ5UWpzN1FVRkRRU3hOUVVGTkxHRkJRV0VzUjBGQlJ5eFpRVUZaTEVOQlFVTXNUVUZCWWl4RFFVRnZRaXhWUVVGQkxFOUJRVTg3UVVGQlFTeFhRVUZKTEU5QlFVOHNRMEZCUXl4RlFVRlNMRWxCUVdNc1UwRkJiRUk3UVVGQlFTeEhRVUV6UWl4RlFVRjNSQ3hEUVVGNFJDeERRVUYwUWpzN1FVRkZRU3hOUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNSVUZCWml4RFFVRlNMRVZCUVRSQ08wRkJRek5DTEVsQlFVRXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhGUVVGbUxFTkJRVW9zUjBGQmVVSXNWMEZCZWtJN1FVRkRRVHM3UVVGRlJDdzBRa0ZCVVN4SFFVRlNMRU5CUVZrc1RVRkJXaXhGUVVGdlFpeEpRVUZ3UWpzN1FVRkRRU3hGUVVGQkxGbEJRVms3UVVGRFdpeERRV0pOT3pzN08wRkJaVUVzU1VGQlRTeHhRa0ZCY1VJc1IwRkJSeXhUUVVGNFFpeHhRa0ZCZDBJc1EwRkJReXhOUVVGRUxFVkJRVms3UVVGRGFFUXNUVUZCVFN4SlFVRkpMRWRCUVVjc1dVRkJXU3hGUVVGNlFqdEJRVU5CTEUxQlFVMHNVMEZCVXl4SFFVRkhMRTFCUVUwc1EwRkJReXhaUVVGUUxFTkJRVzlDTEZOQlFYQkNMRU5CUVd4Q08wRkJSVUVzVTBGQlR5eEpRVUZKTEVOQlFVTXNVMEZCUkN4RFFVRllPenRCUVVWQkxEUkNRVUZSTEVkQlFWSXNRMEZCV1N4TlFVRmFMRVZCUVc5Q0xFbEJRWEJDTzBGQlEwRXNRMEZRVFRzN096dEJRVk5CTEVsQlFVMHNWMEZCVnl4SFFVRkhMRk5CUVdRc1YwRkJZeXhIUVVGTk8wRkJRMmhETEZOQlFVOHNXVUZCV1N4RFFVRkRMRmxCUVZrc1JVRkJZaXhGUVVGcFFpd3dRa0ZCVVN4SFFVRlNMRU5CUVZrc1ZVRkJXaXhEUVVGcVFpeERRVUZhTEVOQlEwb3NSMEZFU1N4RFFVTkJMRlZCUVVFc1QwRkJUenRCUVVGQkxGZEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCVkN4SFFVRnBRaXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUU1UWp0QlFVRkJMRWRCUkZBc1JVRkZTaXhOUVVaSkxFTkJSVWNzVlVGQlF5eEhRVUZFTEVWQlFVMHNSMEZCVGp0QlFVRkJMRmRCUVdNc1IwRkJSeXhIUVVGSExFZEJRWEJDTzBGQlFVRXNSMEZHU0N4RFFVRlFPMEZCUjBFc1EwRktUVHM3T3pzN096czdPenM3TzBGRGJrWlFMRWxCUVUwc1YwRkJWeXhIUVVGSExGTkJRV1FzVjBGQll5eERRVUZETEVkQlFVUXNSVUZCVXp0QlFVTTFRaXhUUVVGUExFdEJRVXNzUTBGQlF5eEhRVUZFTEVOQlFWbzdRVUZEUVN4RFFVWkVPenRsUVVsbExGYzdPenM3T3pzN096czdPMEZEU21ZN08wRkJSVUVzU1VGQlRTeExRVUZMTEVkQlFVY3NVVUZCVVN4RFFVRkRMR0ZCUVZRc1EwRkJkVUlzVVVGQmRrSXNRMEZCWkRzN1FVRkZUeXhKUVVGTkxHZENRVUZuUWl4SFFVRkhMRk5CUVc1Q0xHZENRVUZ0UWl4SFFVRk5PMEZCUTNKRExFVkJRVUVzUzBGQlN5eERRVUZETEZOQlFVNHNRMEZCWjBJc1IwRkJhRUlzUTBGQmIwSXNUVUZCY0VJN1FVRkRRU3hEUVVaTk96czdPMEZCU1VFc1NVRkJUU3hwUWtGQmFVSXNSMEZCUnl4VFFVRndRaXhwUWtGQmIwSXNSMEZCVFR0QlFVTjBReXhGUVVGQkxFdEJRVXNzUTBGQlF5eFRRVUZPTEVOQlFXZENMRTFCUVdoQ0xFTkJRWFZDTEUxQlFYWkNPMEZCUTBFc1EwRkdUVHM3T3pzN096czdPenM3TzBGRFVsQTdPMEZCUlVFc1NVRkJUU3hsUVVGbExFZEJRVWNzVTBGQmJFSXNaVUZCYTBJc1EwRkJReXhQUVVGRUxFVkJRVFpDTzBGQlFVRXNUVUZCYmtJc1UwRkJiVUlzZFVWQlFWQXNSVUZCVHp0QlFVTndSQ3hOUVVGTkxFVkJRVVVzUjBGQlJ5eFJRVUZSTEVOQlFVTXNZVUZCVkN4RFFVRjFRaXhQUVVGMlFpeERRVUZZT3p0QlFVTkJMRTFCUVVrc1UwRkJTaXhGUVVGbE8wRkJRMlFzU1VGQlFTeEZRVUZGTEVOQlFVTXNVMEZCU0N4RFFVRmhMRWRCUVdJc1EwRkJhVUlzVTBGQmFrSTdRVUZEUVRzN1FVRkZSQ3hUUVVGUExFVkJRVkE3UVVGRFFTeERRVkJFT3p0QlFWTkJMRWxCUVUwc2RVSkJRWFZDTEVkQlFVY3NVMEZCTVVJc2RVSkJRVEJDTEVOQlFVTXNVVUZCUkN4RlFVRlhMR0ZCUVZnc1JVRkJOa0k3UVVGRE5VUXNSVUZCUVN4UlFVRlJMRU5CUVVNc1QwRkJWQ3hEUVVGcFFpeFZRVUZCTEU5QlFVOHNSVUZCU1R0QlFVTXpRaXhKUVVGQkxHRkJRV0VzUTBGQlF5eFhRVUZrTEVOQlFUQkNMRTlCUVRGQ08wRkJRMEVzUjBGR1JEdEJRVWRCTEVOQlNrUTdPMEZCVFVFc1NVRkJUU3hwUWtGQmFVSXNSMEZCUnl4VFFVRndRaXhwUWtGQmIwSXNUMEZCTUVRN1FVRkJRU3hOUVVGMlJDeFJRVUYxUkN4UlFVRjJSQ3hSUVVGMVJEdEJRVUZCTEUxQlFUZERMRmRCUVRaRExGRkJRVGRETEZkQlFUWkRPMEZCUVVFc1RVRkJhRU1zUlVGQlowTXNVVUZCYUVNc1JVRkJaME03UVVGQlFTeE5RVUUxUWl4UFFVRTBRaXhSUVVFMVFpeFBRVUUwUWp0QlFVRkJMRTFCUVc1Q0xFdEJRVzFDTEZGQlFXNUNMRXRCUVcxQ08wRkJRVUVzVFVGQldpeExRVUZaTEZGQlFWb3NTMEZCV1R0QlFVVnVSaXhOUVVGTkxFZEJRVWNzUjBGQlJ5eGxRVUZsTEVOQlFVTXNTMEZCUkN4RlFVRlJMRlZCUVZJc1EwRkJNMEk3UVVGRFFTeE5RVUZOTEZkQlFWY3NSMEZCUnl4bFFVRmxMRU5CUVVNc1MwRkJSQ3hGUVVGUkxHTkJRVklzUTBGQmJrTTdRVUZEUVN4TlFVRk5MR2RDUVVGblFpeEhRVUZITEdWQlFXVXNRMEZCUXl4TFFVRkVMRVZCUVZFc1pVRkJVaXhEUVVGNFF6dEJRVU5CTEUxQlFVMHNXVUZCV1N4SFFVRkhMR1ZCUVdVc1EwRkJReXhMUVVGRUxFVkJRVkVzWlVGQlVpeERRVUZ3UXp0QlFVTkJMRTFCUVUwc1dVRkJXU3hIUVVGSExHVkJRV1VzUTBGQlF5eExRVUZFTEVWQlFWRXNUMEZCVWl4RFFVRndRenRCUVVOQkxFMUJRVTBzWlVGQlpTeEhRVUZITEdWQlFXVXNRMEZCUXl4TlFVRkVMRVZCUVZNc2JVSkJRVlFzUTBGQmRrTTdRVUZEUVN4TlFVRk5MRzlDUVVGdlFpeEhRVUZITEdWQlFXVXNRMEZCUXl4TlFVRkVMRVZCUVZNc2QwSkJRVlFzUTBGQk5VTTdRVUZEUVN4TlFVRk5MR3RDUVVGclFpeEhRVUZITEdWQlFXVXNRMEZCUXl4SFFVRkVMRVZCUVUwc2NVSkJRVTRzUTBGQk1VTTdRVUZEUVN4TlFVRk5MR05CUVdNc1IwRkJSeXhsUVVGbExFTkJRVU1zUzBGQlJDeEZRVUZSTEdsQ1FVRlNMRU5CUVhSRE8wRkJRMEVzVFVGQlRTeFpRVUZaTEVkQlFVY3NaVUZCWlN4RFFVRkRMRWxCUVVRc1JVRkJUeXhQUVVGUUxFTkJRWEJETzBGQlEwRXNUVUZCVFN4WlFVRlpMRWRCUVVjc1pVRkJaU3hEUVVGRExFdEJRVVFzUlVGQlVTeFBRVUZTTEVOQlFYQkRPMEZCUTBFc1RVRkJUU3hUUVVGVExFZEJRVWNzWlVGQlpTeERRVUZETEZGQlFVUXNSVUZCVnl4aFFVRllMRU5CUVdwRE8wRkJSVUVzUlVGQlFTeGxRVUZsTEVOQlFVTXNVMEZCYUVJc1IwRkJORUlzVFVGQk5VSTdRVUZEUVN4RlFVRkJMRk5CUVZNc1EwRkJReXhUUVVGV0xFZEJRWE5DTEdWQlFYUkNPMEZCUTBFc1JVRkJRU3h2UWtGQmIwSXNRMEZCUXl4VFFVRnlRaXhIUVVGcFF5eExRVUZxUXp0QlFVVkJMRVZCUVVFc1dVRkJXU3hEUVVGRExGbEJRV0lzUTBGQk1FSXNTMEZCTVVJc1JVRkJhVU1zVDBGQmFrTTdRVUZEUVN4RlFVRkJMRk5CUVZNc1EwRkJReXhaUVVGV0xFTkJRWFZDTEZOQlFYWkNMRVZCUVd0RExFVkJRV3hETzBGQlEwRXNSVUZCUVN4VFFVRlRMRU5CUVVNc1UwRkJWaXhEUVVGdlFpeEhRVUZ3UWl4RFFVRjNRaXhMUVVGNFFqdEJRVU5CTEVWQlFVRXNVMEZCVXl4RFFVRkRMRk5CUVZZc1EwRkJiMElzUjBGQmNFSXNRMEZCZDBJc1lVRkJlRUk3UVVGRFFTeEZRVUZCTEZsQlFWa3NRMEZCUXl4VFFVRmlMRWRCUVhsQ0xFdEJRWHBDTzBGQlEwRXNSVUZCUVN4WlFVRlpMRU5CUVVNc1UwRkJZaXhIUVVGNVFpeFJRVUZSTEVkQlFVY3NTMEZCY0VNN1FVRkZRU3hGUVVGQkxFZEJRVWNzUTBGQlF5eFhRVUZLTEVOQlFXZENMRmRCUVdoQ08wRkJRMEVzUlVGQlFTeFpRVUZaTEVOQlFVTXNWMEZCWWl4RFFVRjVRaXhaUVVGNlFqdEJRVVZCTEUxQlFVMHNWMEZCVnl4SFFVRkhMRU5CUVVNc1owSkJRVVFzUlVGQmJVSXNhMEpCUVc1Q0xFVkJRWFZETEdOQlFYWkRMRU5CUVhCQ08wRkJRMEVzVFVGQlRTeG5Ra0ZCWjBJc1IwRkJSeXhEUVVGRExGbEJRVVFzUlVGQlpTeGxRVUZtTEVWQlFXZERMRzlDUVVGb1F5eERRVUY2UWp0QlFVTkJMRTFCUVUwc1kwRkJZeXhIUVVGSExFTkJRVU1zV1VGQlJDeEZRVUZsTEZsQlFXWXNSVUZCTmtJc1UwRkJOMElzUTBGQmRrSTdRVUZGUVN4RlFVRkJMSFZDUVVGMVFpeERRVUZETEZkQlFVUXNSVUZCWXl4WFFVRmtMRU5CUVhaQ08wRkJRMEVzUlVGQlFTeDFRa0ZCZFVJc1EwRkJReXhuUWtGQlJDeEZRVUZ0UWl4blFrRkJia0lzUTBGQmRrSTdRVUZEUVN4RlFVRkJMSFZDUVVGMVFpeERRVUZETEdOQlFVUXNSVUZCYVVJc1kwRkJha0lzUTBGQmRrSTdRVUZGUVN4VFFVRlBMRWRCUVZBN1FVRkRRU3hEUVhSRFJEczdRVUYzUTBFc1NVRkJUU3hqUVVGakxFZEJRVWNzVTBGQmFrSXNZMEZCYVVJc1VVRkJiMFE3UVVGQlFTeE5RVUZxUkN4RlFVRnBSQ3hUUVVGcVJDeEZRVUZwUkR0QlFVRkJMRTFCUVRkRExFdEJRVFpETEZOQlFUZERMRXRCUVRaRE8wRkJRVUVzVFVGQmRFTXNUMEZCYzBNc1UwRkJkRU1zVDBGQmMwTTdRVUZCUVN4TlFVRTNRaXhMUVVFMlFpeFRRVUUzUWl4TFFVRTJRanRCUVVGQkxFMUJRWFJDTEZGQlFYTkNMRk5CUVhSQ0xGRkJRWE5DTzBGQlFVRXNUVUZCV2l4TFFVRlpMRk5CUVZvc1MwRkJXVHRCUVVVeFJTeE5RVUZOTEZGQlFWRXNSMEZCUnl4bFFVRmxMRU5CUVVNc1NVRkJSQ3hEUVVGb1F6dEJRVU5CTEUxQlFVMHNWMEZCVnl4SFFVRkhMR1ZCUVdVc1EwRkJReXhMUVVGRUxFVkJRVkVzYVVKQlFWSXNRMEZCYmtNN1FVRkRRU3hOUVVGTkxHTkJRV01zUjBGQlJ5eGxRVUZsTEVOQlFVTXNUMEZCUkN4RFFVRjBRenRCUVVOQkxFMUJRVTBzVlVGQlZTeEhRVUZITEdWQlFXVXNRMEZCUXl4TFFVRkVMRVZCUVZFc2QwSkJRVklzUTBGQmJFTTdRVUZEUVN4TlFVRk5MRlZCUVZVc1IwRkJSeXhsUVVGbExFTkJRVU1zUzBGQlJDeEZRVUZSTEhGQ1FVRlNMRU5CUVd4RE8wRkJRMEVzVFVGQlRTeFpRVUZaTEVkQlFVY3NaVUZCWlN4RFFVRkRMRWxCUVVRc1JVRkJUeXgxUWtGQlVDeERRVUZ3UXp0QlFVTkJMRTFCUVUwc1dVRkJXU3hIUVVGSExHVkJRV1VzUTBGQlF5eE5RVUZFTEVWQlFWTXNkVUpCUVZRc1EwRkJjRU03UVVGRFFTeE5RVUZOTEdWQlFXVXNSMEZCUnl4bFFVRmxMRU5CUVVNc1QwRkJSQ3hGUVVGVkxEQkNRVUZXTEVOQlFYWkRPMEZCUTBFc1RVRkJUU3hwUWtGQmFVSXNSMEZCUnl4bFFVRmxMRU5CUVVNc1RVRkJSQ3hGUVVGVExIVkNRVUZVTEVOQlFYcERPMEZCUTBFc1RVRkJUU3hoUVVGaExFZEJRVWNzWlVGQlpTeERRVUZETEZGQlFVUXNSVUZCVnl4M1FrRkJXQ3hEUVVGeVF6dEJRVVZCTEVWQlFVRXNZMEZCWXl4RFFVRkRMRmxCUVdZc1EwRkJORUlzVFVGQk5VSXNSVUZCYjBNc1VVRkJjRU03UVVGRFFTeEZRVUZCTEdOQlFXTXNRMEZCUXl4WlFVRm1MRU5CUVRSQ0xFMUJRVFZDTEVWQlFXOURMRk5CUVhCRE8wRkJRMEVzUlVGQlFTeGpRVUZqTEVOQlFVTXNXVUZCWml4RFFVRTBRaXhQUVVFMVFpeEZRVUZ4UXl4RlFVRnlRenRCUVVOQkxFVkJRVUVzVlVGQlZTeERRVUZETEZsQlFWZ3NRMEZCZDBJc1MwRkJlRUlzUlVGQkswSXNUMEZCTDBJN1FVRkRRU3hGUVVGQkxHVkJRV1VzUTBGQlF5eFpRVUZvUWl4RFFVRTJRaXhUUVVFM1FpeEZRVUYzUXl4RlFVRjRRenRCUVVOQkxFVkJRVUVzWVVGQllTeERRVUZETEZsQlFXUXNRMEZCTWtJc1UwRkJNMElzUlVGQmMwTXNSVUZCZEVNN1FVRkRRU3hGUVVGQkxHVkJRV1VzUTBGQlF5eFpRVUZvUWl4RFFVRTJRaXhOUVVFM1FpeEZRVUZ4UXl4UlFVRnlRenRCUVVOQkxFVkJRVUVzWlVGQlpTeERRVUZETEZsQlFXaENMRU5CUVRaQ0xFMUJRVGRDTEVWQlFYRkRMRlZCUVhKRE8wRkJRMEVzUlVGQlFTeGxRVUZsTEVOQlFVTXNXVUZCYUVJc1EwRkJOa0lzVDBGQk4wSXNSVUZCYzBNc1MwRkJkRU03UVVGRlFTeEZRVUZCTEZsQlFWa3NRMEZCUXl4VFFVRmlMRWRCUVhsQ0xFdEJRWHBDTzBGQlEwRXNSVUZCUVN4WlFVRlpMRU5CUVVNc1UwRkJZaXhIUVVGNVFpeFJRVUZSTEVkQlFVY3NTMEZCY0VNN1FVRkRRU3hGUVVGQkxHbENRVUZwUWl4RFFVRkRMRk5CUVd4Q0xHRkJRV2xETEZGQlFXcERMRk5CUVRSRExFTkJRVU1zUzBGQlJDeEhRVUZUTEVOQlFVTXNTMEZCZEVRN1FVRkRRU3hGUVVGQkxHRkJRV0VzUTBGQlF5eFRRVUZrTEVkQlFUQkNMRWRCUVRGQ08wRkJSVUVzVFVGQlRTeHRRa0ZCYlVJc1IwRkJSeXhEUVVGRExHTkJRVVFzUlVGQmFVSXNWVUZCYWtJc1JVRkJOa0lzV1VGQk4wSXNSVUZCTWtNc1dVRkJNME1zUlVGQmVVUXNaVUZCZWtRc1JVRkJNRVVzYVVKQlFURkZMRVZCUVRaR0xHRkJRVGRHTEVOQlFUVkNPMEZCUTBFc1JVRkJRU3gxUWtGQmRVSXNRMEZCUXl4dFFrRkJSQ3hGUVVGelFpeFhRVUYwUWl4RFFVRjJRanRCUVVWQkxFVkJRVUVzVlVGQlZTeERRVUZETEZkQlFWZ3NRMEZCZFVJc1ZVRkJka0k3UVVGRFFTeEZRVUZCTEZGQlFWRXNRMEZCUXl4WFFVRlVMRU5CUVhGQ0xGZEJRWEpDTzBGQlJVRXNVMEZCVHl4UlFVRlFPMEZCUTBFc1EwRnVRMFE3TzBGQmNVTlBMRWxCUVUwc1kwRkJZeXhIUVVGSExGTkJRV3BDTEdOQlFXbENMRU5CUVVNc1VVRkJSQ3hGUVVGak8wRkJRek5ETEUxQlFVMHNTVUZCU1N4SFFVRkhMRkZCUVZFc1EwRkJReXhqUVVGVUxFTkJRWGRDTEdOQlFYaENMRU5CUVdJN1FVRkZRU3hGUVVGQkxGRkJRVkVzUTBGQlF5eFBRVUZVTEVOQlFXbENMRlZCUVVFc1QwRkJUeXhGUVVGSk8wRkJRek5DTEVsQlFVRXNTVUZCU1N4RFFVRkRMRmRCUVV3c1EwRkJhVUlzYVVKQlFXbENMRU5CUVVNc1QwRkJSQ3hEUVVGc1F6dEJRVU5CTEVkQlJrUTdRVUZIUVN4RFFVNU5PenM3TzBGQlVVRXNTVUZCVFN4VlFVRlZMRWRCUVVjc1UwRkJZaXhWUVVGaExFTkJRVU1zVVVGQlJDeEZRVUZqTzBGQlEzWkRMRTFCUVUwc1NVRkJTU3hIUVVGSExGRkJRVkVzUTBGQlF5eGhRVUZVTEVOQlFYVkNMRmxCUVhaQ0xFTkJRV0k3UVVGRFFTeE5RVUZOTEZGQlFWRXNSMEZCUnl4UlFVRlJMRU5CUVVNc1lVRkJWQ3hEUVVGMVFpeGpRVUYyUWl4RFFVRnFRanRCUVVOQkxFMUJRVTBzUzBGQlN5eEhRVUZITEZGQlFWRXNRMEZCUXl4aFFVRlVMRU5CUVhWQ0xHTkJRWFpDTEVOQlFXUTdPMEZCUlVFc1UwRkJUeXhKUVVGSkxFTkJRVU1zVlVGQldpeEZRVUYzUWp0QlFVTjJRaXhKUVVGQkxFbEJRVWtzUTBGQlF5eFhRVUZNTEVOQlFXbENMRWxCUVVrc1EwRkJReXhWUVVGMFFqdEJRVU5CT3p0QlFVVkVMRTFCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlpDeEZRVUZ6UWp0QlFVTnlRaXhYUVVGUExFbEJRVWtzUTBGQlF5eFRRVUZNTEVOQlFXVXNSMEZCWml4RFFVRnRRaXhaUVVGdVFpeERRVUZRTzBGQlEwRXNSMEZHUkN4TlFVVlBPMEZCUTA0c1NVRkJRU3hKUVVGSkxFTkJRVU1zVTBGQlRDeERRVUZsTEUxQlFXWXNRMEZCYzBJc1dVRkJkRUk3UVVGRFFUczdRVUZGUkN4TlFVRkpMRkZCUVVvN1FVRkZRU3hGUVVGQkxGRkJRVkVzUTBGQlF5eFBRVUZVTEVOQlFXbENMRlZCUVVFc1QwRkJUeXhGUVVGSk8wRkJRek5DTEVsQlFVRXNVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGdVFqdEJRVU5CTEVsQlFVRXNTVUZCU1N4RFFVRkRMRmRCUVV3c1EwRkJhVUlzWTBGQll5eERRVUZETEU5QlFVUXNRMEZCTDBJN1FVRkRRU3hIUVVoRU8wRkJTMEVzUlVGQlFTeExRVUZMTEVOQlFVTXNVMEZCVGl4dlFrRkJORUlzVVVGQk5VSXNVMEZCZFVNc2QwSkJRWFpETzBGQlEwRXNRMEYyUWswN096czdRVUY1UWtFc1NVRkJUU3huUWtGQlowSXNSMEZCUnl4VFFVRnVRaXhuUWtGQmJVSXNSMEZCVFR0QlFVTnlReXhOUVVGTkxFbEJRVWtzUjBGQlJ5eGxRVUZsTEVOQlFVTXNUVUZCUkN4RlFVRlRMR0ZCUVZRc1EwRkJOVUk3UVVGRFFTeEZRVUZCTEVsQlFVa3NRMEZCUXl4VFFVRk1MRU5CUVdVc1IwRkJaaXhEUVVGdFFpeFBRVUZ1UWp0QlFVTkJMRVZCUVVFc1NVRkJTU3hEUVVGRExGTkJRVXdzUTBGQlpTeEhRVUZtTEVOQlFXMUNMR1ZCUVc1Q08wRkJRMEVzUlVGQlFTeEpRVUZKTEVOQlFVTXNVMEZCVEN4SFFVRnBRaXhsUVVGcVFqdEJRVU5CTEVWQlFVRXNVVUZCVVN4RFFVRkRMRWxCUVZRc1EwRkJZeXhYUVVGa0xFTkJRVEJDTEVsQlFURkNPMEZCUTBFc1JVRkJRU3hWUVVGVkxFTkJRVU1zV1VGQlRUdEJRVU5vUWl4SlFVRkJMRkZCUVZFc1EwRkJReXhKUVVGVUxFTkJRV01zVjBGQlpDeERRVUV3UWl4SlFVRXhRanRCUVVOQkxFZEJSbE1zUlVGRlVDeEpRVVpQTEVOQlFWWTdRVUZIUVN4RFFWUk5PenM3T3pzN096czdPenM3UVVNdlNGQXNVMEZCVXl4aFFVRlVMRWRCUVhkQ08wRkJRM1pDTEU5QlFVc3NUMEZCVEN4SFFVRmxMRmxCUVdZN08wRkJSVUVzVDBGQlN5eEhRVUZNTEVkQlFWY3NWVUZCUXl4SFFVRkVMRVZCUVZNN1FVRkRia0lzVjBGQlR5eEpRVUZKTEVOQlFVTXNTMEZCVEN4RFFVRlhMRmxCUVZrc1EwRkJReXhQUVVGaUxFTkJRWEZDTEVkQlFYSkNMRU5CUVZnc1EwRkJVRHRCUVVOQkxFZEJSa1E3TzBGQlIwRXNUMEZCU3l4SFFVRk1MRWRCUVZjc1ZVRkJReXhIUVVGRUxFVkJRVTBzUzBGQlRpeEZRVUZuUWp0QlFVTXhRaXhKUVVGQkxGbEJRVmtzUTBGQlF5eFBRVUZpTEVOQlFYRkNMRWRCUVhKQ0xFVkJRVEJDTEVsQlFVa3NRMEZCUXl4VFFVRk1MRU5CUVdVc1MwRkJaaXhEUVVFeFFqdEJRVU5CTEVkQlJrUTdPMEZCUjBFc1QwRkJTeXhOUVVGTUxFZEJRV01zVlVGQlF5eEhRVUZFTEVWQlFWTTdRVUZEZEVJc1NVRkJRU3haUVVGWkxFTkJRVU1zVlVGQllpeERRVUYzUWl4SFFVRjRRanRCUVVOQkxFZEJSa1E3UVVGSFFUczdRVUZGUkN4SlFVRk5MRTlCUVU4c1IwRkJSeXhKUVVGSkxHRkJRVW9zUlVGQmFFSTdaVUZGWlN4UElpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUlvWm5WdVkzUnBiMjRvS1h0bWRXNWpkR2x2YmlCeUtHVXNiaXgwS1h0bWRXNWpkR2x2YmlCdktHa3NaaWw3YVdZb0lXNWJhVjBwZTJsbUtDRmxXMmxkS1h0MllYSWdZejFjSW1aMWJtTjBhVzl1WENJOVBYUjVjR1Z2WmlCeVpYRjFhWEpsSmlaeVpYRjFhWEpsTzJsbUtDRm1KaVpqS1hKbGRIVnliaUJqS0drc0lUQXBPMmxtS0hVcGNtVjBkWEp1SUhVb2FTd2hNQ2s3ZG1GeUlHRTlibVYzSUVWeWNtOXlLRndpUTJGdWJtOTBJR1pwYm1RZ2JXOWtkV3hsSUNkY0lpdHBLMXdpSjF3aUtUdDBhSEp2ZHlCaExtTnZaR1U5WENKTlQwUlZURVZmVGs5VVgwWlBWVTVFWENJc1lYMTJZWElnY0QxdVcybGRQWHRsZUhCdmNuUnpPbnQ5ZlR0bFcybGRXekJkTG1OaGJHd29jQzVsZUhCdmNuUnpMR1oxYm1OMGFXOXVLSElwZTNaaGNpQnVQV1ZiYVYxYk1WMWJjbDA3Y21WMGRYSnVJRzhvYm54OGNpbDlMSEFzY0M1bGVIQnZjblJ6TEhJc1pTeHVMSFFwZlhKbGRIVnliaUJ1VzJsZExtVjRjRzl5ZEhOOVptOXlLSFpoY2lCMVBWd2lablZ1WTNScGIyNWNJajA5ZEhsd1pXOW1JSEpsY1hWcGNtVW1KbkpsY1hWcGNtVXNhVDB3TzJrOGRDNXNaVzVuZEdnN2FTc3JLVzhvZEZ0cFhTazdjbVYwZFhKdUlHOTljbVYwZFhKdUlISjlLU2dwSWl3aWFXMXdiM0owSUZOMGIzSmhaMlVnWm5KdmJTQW5MaTl6ZEc5eVlXZGxTR1ZzY0dWeUp6dGNjbHh1YVcxd2IzSjBJR2RsZEZCeWIyUjFZM1J6SUdaeWIyMGdKeTR2Wm1WMFkyZ25PMXh5WEc1cGJYQnZjblFnZXlCeVpXNWtaWEpRY205a2RXTjBjeXdnY21WdVpHVnlRMkZ5ZEN3Z2NtVnVaR1Z5VTNWalkyVnpjMDF6WnlCOUlHWnliMjBnSnk0dmNtVnVaR1Z5Snp0Y2NseHVhVzF3YjNKMElIc2daMlYwUTJGeWRGWmhiSFZsTENCaFpHUlViME5oY25SSVlXNWtiR1Z5TENCblpYUkRZWEowU1hSbGJYTXNJR05vWVc1blpWQnliMlIxWTNSUmRXRnVkR2wwZVN3Z2NtVnRiM1psVUhKdlpIVmpkRVp5YjIxRFlYSjBJSDBnWm5KdmJTQW5MaTlqWVhKMEp6dGNjbHh1YVcxd2IzSjBJSHNnYlc5a1lXeFBjR1Z1U0dGdVpHeGxjaXdnYlc5a1lXeERiRzl6WlVoaGJtUnNaWElnZlNCbWNtOXRJQ2N1TDIxdlpHRnNKenRjY2x4dVhISmNibU52Ym5OMElIQnliMlIxWTNSelVtVmhaSGxGZG1WdWRFNWhiV1VnUFNBbmNISnZaSFZqZEhOZmNtVmhaSGtuTzF4eVhHNXNaWFFnY0hKdlpIVmpkSE5TWldGa2VVVjJaVzUwSUQwZ2JtVjNJRVYyWlc1MEtIQnliMlIxWTNSelVtVmhaSGxGZG1WdWRFNWhiV1VwTzF4eVhHNWNjbHh1WTI5dWMzUWdZMkZ5ZEVadmNtMGdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3ViVzlrWVd4ZlgyWnZjbTBuS1R0Y2NseHVYSEpjYm1kbGRGQnliMlIxWTNSektDZG9kSFJ3Y3pvdkwyMTVMV3B6YjI0dGMyVnlkbVZ5TG5SNWNHbGpiMlJsTG1OdmJTOTJiM0p2ZEc1cGNYVmxMMlpoYTJWelpYSjJaWEl2WkdJbktWeHlYRzR1ZEdobGJpaGNjbHh1WEhSbWRXNWpkR2x2YmloeVpYTndiMjV6WlNrZ2UxeHlYRzVjZEZ4MGFXWWdLSEpsYzNCdmJuTmxMbk4wWVhSMWN5QWhQVDBnTWpBd0tTQjdYSEpjYmx4MFhIUmNkR052Ym5OdmJHVXViRzluS0dCTWIyOXJjeUJzYVd0bElIUm9aWEpsSUhkaGN5QmhJSEJ5YjJKc1pXMHVJRk4wWVhSMWN5QkRiMlJsT2lBa2UzSmxjM0J2Ym5ObExuTjBZWFIxYzMxZ0tUdGNjbHh1WEhSY2RGeDBjbVYwZFhKdU8xeHlYRzVjZEZ4MGZWeHlYRzVjY2x4dVhIUmNkSEpsYzNCdmJuTmxMbXB6YjI0b0tWeHlYRzVjZEZ4MExuUm9aVzRvS0h0d2NtOWtkV04wYzMwcElEMCtJSHRjY2x4dVhIUmNkRngwVTNSdmNtRm5aUzV6WlhRb0ozQnliMlIxWTNSekp5d2djSEp2WkhWamRITXBPMXh5WEc1Y2RGeDBYSFJrYjJOMWJXVnVkQzVrYVhOd1lYUmphRVYyWlc1MEtIQnliMlIxWTNSelVtVmhaSGxGZG1WdWRDazdYSEpjYmx4MFhIUjlLVHRjY2x4dVhIUjlYSEpjYmx4MEtWeHlYRzR1WTJGMFkyZ29ablZ1WTNScGIyNG9aWEp5S1NCN1hISmNibHgwWTI5dWMyOXNaUzVzYjJjb0owWmxkR05vSUVWeWNtOXlJRG90VXljc0lHVnljaWs3WEhKY2JuMHBPMXh5WEc1Y2NseHVaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQW9aWFpsYm5RcElEMCtJSHRjY2x4dVhIUmpiMjV6ZENCMFlYSm5aWFFnUFNCbGRtVnVkQzUwWVhKblpYUTdYSEpjYmx4eVhHNWNkR2xtSUNoMFlYSm5aWFF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaFpHUXRkRzh0WTJGeWRDY3BLU0I3WEhKY2JseDBYSFJoWkdSVWIwTmhjblJJWVc1a2JHVnlLSFJoY21kbGRDazdYSEpjYmx4MFhIUnlaVzVrWlhKVGRXTmpaWE56VFhObktDazdYSEpjYmx4MGZWeHlYRzVjY2x4dVhIUnBaaUFvZEdGeVoyVjBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWTJGeWRDY3BLU0I3WEhKY2JseDBYSFJ0YjJSaGJFOXdaVzVJWVc1a2JHVnlLQ2s3WEhKY2JseDBYSFJ5Wlc1a1pYSkRZWEowS0dkbGRFTmhjblJKZEdWdGN5aG5aWFJEWVhKMFZtRnNkV1VvS1N3Z1UzUnZjbUZuWlM1blpYUW9KM0J5YjJSMVkzUnpKeWtwS1R0Y2NseHVYSFI5WEhKY2JseHlYRzVjZEdsbUlDaDBZWEpuWlhRdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHRiMlJoYkY5ZlkyeHZjMlVuS1NrZ2UxeHlYRzVjZEZ4MGJXOWtZV3hEYkc5elpVaGhibVJzWlhJb0tUdGNjbHh1WEhSOVhISmNibHh5WEc1Y2RHbG1JQ2gwWVhKblpYUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RqYkdWaGNpMWlkRzRuS1NrZ2UxeHlYRzVjZEZ4MFUzUnZjbUZuWlM1elpYUW9KMk5oY25RbkxDQjdmU2s3WEhKY2JseDBYSFJ5Wlc1a1pYSkRZWEowS0Z0ZEtUdGNjbHh1WEhSY2RHZGxkRU5oY25SV1lXeDFaU2dwTzF4eVhHNWNkSDFjY2x4dVhISmNibHgwYVdZZ0tIUmhjbWRsZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0ozTjFZbTFwZEMxaWRHNG5LU2tnZTF4eVhHNWNkRngwWlhabGJuUXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNjbHh1WEhSOVhISmNibHh5WEc1Y2RHbG1JQ2gwWVhKblpYUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RqWVhKMExXeHBjM1JmWDJsMFpXMHRjbVZ0YjNabEp5a3BJSHRjY2x4dVhIUmNkR1YyWlc1MExuQnlaWFpsYm5SRVpXWmhkV3gwS0NrN1hISmNibHgwWEhSeVpXMXZkbVZRY205a2RXTjBSbkp2YlVOaGNuUW9kR0Z5WjJWMEtUdGNjbHh1WEhSY2RISmxibVJsY2tOaGNuUW9aMlYwUTJGeWRFbDBaVzF6S0dkbGRFTmhjblJXWVd4MVpTZ3BMQ0JUZEc5eVlXZGxMbWRsZENnbmNISnZaSFZqZEhNbktTa3BPMXh5WEc1Y2RIMWNjbHh1WEhKY2JuMHBPMXh5WEc1Y2NseHVaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpaHdjbTlrZFdOMGMxSmxZV1I1UlhabGJuUk9ZVzFsTENBb0tTQTlQaUI3WEhKY2JseDBZMjl1YzNRZ2JHOWhaR1Z5SUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduSTNCeWIzQmxiR3hsY2kxc2IyRmtaWEluS1R0Y2NseHVYSFJ5Wlc1a1pYSlFjbTlrZFdOMGN5aFRkRzl5WVdkbExtZGxkQ2duY0hKdlpIVmpkSE1uS1NrN1hISmNibHgwWjJWMFEyRnlkRlpoYkhWbEtDazdYSEpjYmx4MGJHOWhaR1Z5TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmhwWkdSbGJpY3BPMXh5WEc1OUtUdGNjbHh1WEhKY2JtTmhjblJHYjNKdExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTm9ZVzVuWlNjc0lDaGxkbVZ1ZENrZ1BUNGdlMXh5WEc1Y2RHTm9ZVzVuWlZCeWIyUjFZM1JSZFdGdWRHbDBlU2hsZG1WdWRDNTBZWEpuWlhRcE8xeHlYRzVjZEhKbGJtUmxja05oY25Rb1oyVjBRMkZ5ZEVsMFpXMXpLR2RsZEVOaGNuUldZV3gxWlNncExDQlRkRzl5WVdkbExtZGxkQ2duY0hKdlpIVmpkSE1uS1NrcE8xeHlYRzU5S1R0Y2NseHVYSEpjYmlRb1pHOWpkVzFsYm5RcExuSmxZV1I1S0daMWJtTjBhVzl1S0NsN1hISmNibHh5WEc1Y2RDUW9kMmx1Wkc5M0tTNXpZM0p2Ykd3b1puVnVZM1JwYjI0b0tYdGNjbHh1WEhSY2RHbG1JQ2drS0hSb2FYTXBMbk5qY205c2JGUnZjQ2dwSUQ0Z01UQXdLU0I3WEhKY2JseDBYSFJjZENRb0p5NXpZM0p2Ykd4MWNDY3BMbVpoWkdWSmJpZ3BPMXh5WEc1Y2RGeDBmU0JsYkhObElIdGNjbHh1WEhSY2RGeDBKQ2duTG5OamNtOXNiSFZ3SnlrdVptRmtaVTkxZENncE8xeHlYRzVjZEZ4MGZWeHlYRzVjZEgwcE8xeHlYRzVjY2x4dVhIUWtLQ2N1YzJOeWIyeHNkWEFuS1M1amJHbGpheWhtZFc1amRHbHZiaWdwZTF4eVhHNWNkRngwSkNoY0ltaDBiV3dzSUdKdlpIbGNJaWt1WVc1cGJXRjBaU2g3SUhOamNtOXNiRlJ2Y0RvZ01DQjlMQ0EyTURBcE8xeHlYRzVjZEZ4MGNtVjBkWEp1SUdaaGJITmxPMXh5WEc1Y2RIMHBPMXh5WEc1Y2NseHVmU2s3WEhKY2JseHlYRzR2THlBa0tHUnZZM1Z0Wlc1MEtTNXlaV0ZrZVNobWRXNWpkR2x2YmlncGUxeHlYRzR2THlBZ0lDUW9YQ0l1YjNkc0xXTmhjbTkxYzJWc1hDSXBMbTkzYkVOaGNtOTFjMlZzS0NrN1hISmNiaTh2SUgwcE8xeHlYRzVjY2x4dUpDaGtiMk4xYldWdWRDa3VjbVZoWkhrb1puVnVZM1JwYjI0b0tYdGNjbHh1WEhRa0tDY3VZMkZ5YjNWelpXd25LUzV6YkdsamF5aDdYSEpjYmx4MFhIUmpaVzUwWlhKTmIyUmxPaUIwY25WbExGeHlYRzVjZEZ4MFkyVnVkR1Z5VUdGa1pHbHVaem9nSnpZd2NIZ25MRnh5WEc1Y2RGeDBjMnhwWkdWelZHOVRhRzkzT2lBekxGeHlYRzVjZEZ4MGNtVnpjRzl1YzJsMlpUb2dXMXh5WEc1Y2RGeDBlMXh5WEc1Y2RGeDBYSFJpY21WaGEzQnZhVzUwT2lBM05qZ3NYSEpjYmx4MFhIUmNkSE5sZEhScGJtZHpPaUI3WEhKY2JseDBYSFJjZEZ4MFlYSnliM2R6T2lCbVlXeHpaU3hjY2x4dVhIUmNkRngwWEhSalpXNTBaWEpOYjJSbE9pQjBjblZsTEZ4eVhHNWNkRngwWEhSY2RHTmxiblJsY2xCaFpHUnBibWM2SUNjME1IQjRKeXhjY2x4dVhIUmNkRngwWEhSemJHbGtaWE5VYjFOb2IzYzZJRE5jY2x4dVhIUmNkRngwZlZ4eVhHNWNkRngwZlN4Y2NseHVYSFJjZEh0Y2NseHVYSFJjZEZ4MFluSmxZV3R3YjJsdWREb2dORGd3TEZ4eVhHNWNkRngwWEhSelpYUjBhVzVuY3pvZ2UxeHlYRzVjZEZ4MFhIUmNkR0Z5Y205M2N6b2dabUZzYzJVc1hISmNibHgwWEhSY2RGeDBZMlZ1ZEdWeVRXOWtaVG9nZEhKMVpTeGNjbHh1WEhSY2RGeDBYSFJqWlc1MFpYSlFZV1JrYVc1bk9pQW5OREJ3ZUNjc1hISmNibHgwWEhSY2RGeDBjMnhwWkdWelZHOVRhRzkzT2lBeFhISmNibHgwWEhSY2RIMWNjbHh1WEhSY2RIMWNjbHh1WEhSY2RGMWNjbHh1WEhSOUtUdGNjbHh1ZlNrN0lpd2lhVzF3YjNKMElGTjBiM0poWjJVZ1puSnZiU0FuTGk5emRHOXlZV2RsU0dWc2NHVnlKenRjY2x4dVhISmNibVY0Y0c5eWRDQmpiMjV6ZENCblpYUkRZWEowVm1Gc2RXVWdQU0FvS1NBOVBpQjdYSEpjYmx4MFkyOXVjM1FnYkdGaVpXd2dQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VZMkZ5ZEY5ZmJHRmlaV3duS1R0Y2NseHVYSFJqYjI1emRDQmpZWEowVm1Gc2RXVWdQU0JUZEc5eVlXZGxMbWRsZENnblkyRnlkQ2NwTzF4eVhHNWNjbHh1WEhScFppQW9JV05oY25SV1lXeDFaU0I4ZkNBaFQySnFaV04wTG10bGVYTW9ZMkZ5ZEZaaGJIVmxLUzVzWlc1bmRHZ3BJSHRjY2x4dVhIUmNkR3hoWW1Wc0xtbHVibVZ5VkdWNGRDQTlJREE3WEhKY2JseDBYSFJ5WlhSMWNtNGdlMzA3WEhKY2JseDBmVnh5WEc1Y2NseHVYSFJzWVdKbGJDNXBibTVsY2xSbGVIUWdQU0JQWW1wbFkzUXVkbUZzZFdWektHTmhjblJXWVd4MVpTa3VjbVZrZFdObEtDaGhZMk1zSUdOMWNpa2dQVDRnSzJGall5QXJJQ3RqZFhJcE8xeHlYRzVjY2x4dVhIUnlaWFIxY200Z1kyRnlkRlpoYkhWbE8xeHlYRzU5WEhKY2JseHlYRzVsZUhCdmNuUWdZMjl1YzNRZ1oyVjBRMkZ5ZEVsMFpXMXpJRDBnS0dOaGNuUldZV3gxWlN3Z2NISnZaSFZqZEhNcElEMCtJSHRjY2x4dVhIUnlaWFIxY200Z1QySnFaV04wTG10bGVYTW9ZMkZ5ZEZaaGJIVmxLUzV0WVhBb2FXUWdQVDRnZTF4eVhHNWNkRngwY21WMGRYSnVJSEJ5YjJSMVkzUnpMbVpwYkhSbGNpaHdjbTlrZFdOMElEMCtJSHRjY2x4dVhIUmNkRngwYVdZZ0tIQnliMlIxWTNRdWFXUWdQVDBnYVdRcElIdGNjbHh1WEhSY2RGeDBYSFJ3Y205a2RXTjBMblJ2ZEdGc0lEMGdZMkZ5ZEZaaGJIVmxXMmxrWFR0Y2NseHVYSFJjZEZ4MFhIUnlaWFIxY200Z2NISnZaSFZqZER0Y2NseHVYSFJjZEZ4MGZWeHlYRzVjZEZ4MGZTbGJNRjA3WEhKY2JseDBmU2s3WEhKY2JuMWNjbHh1WEhKY2JtVjRjRzl5ZENCamIyNXpkQ0JoWkdSVWIwTmhjblJJWVc1a2JHVnlJRDBnS0hSaGNtZGxkQ2tnUFQ0Z2UxeHlYRzVjZEdOdmJuTjBJR05oY25RZ1BTQm5aWFJEWVhKMFZtRnNkV1VvS1R0Y2NseHVYSFJqYjI1emRDQndjbTlrZFdOMFNXUWdQU0IwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMV2xrSnlrN1hISmNibHgwWTI5dWMzUWdjSEp2WkhWamRITk1hWE4wSUQwZ1UzUnZjbUZuWlM1blpYUW9KM0J5YjJSMVkzUnpKeWs3WEhKY2JseDBZMjl1YzNRZ1kyaHZjMlZ1VUhKdlpIVmpkQ0E5SUhCeWIyUjFZM1J6VEdsemRDNW1hV3gwWlhJb1pXeGxiV1Z1ZENBOVBpQmxiR1Z0Wlc1MExtbGtJRDA5SUhCeWIyUjFZM1JKWkNsYk1GMDdYSEpjYmx4eVhHNWNkR2xtSUNoallYSjBXMk5vYjNObGJsQnliMlIxWTNRdWFXUmRLU0I3WEhKY2JseDBYSFJqWVhKMFcyTm9iM05sYmxCeWIyUjFZM1F1YVdSZEt5dGNjbHh1WEhSOUlHVnNjMlVnZTF4eVhHNWNkRngwWTJGeWRGdGphRzl6Wlc1UWNtOWtkV04wTG1sa1hTQTlJREU3WEhKY2JseDBmVnh5WEc1Y2NseHVYSFJUZEc5eVlXZGxMbk5sZENnblkyRnlkQ2NzSUdOaGNuUXBPMXh5WEc1Y2RHZGxkRU5oY25SV1lXeDFaU2dwTzF4eVhHNTlYSEpjYmx4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnY21WdGIzWmxSbkp2YlVOaGNuUklZVzVrYkdWeUlEMGdLSFJoY21kbGRDa2dQVDRnZTF4eVhHNWNkR052Ym5OMElHTmhjblFnUFNCblpYUkRZWEowVm1Gc2RXVW9LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wU1dRZ1BTQjBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXbGtKeWs3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEhOTWFYTjBJRDBnVTNSdmNtRm5aUzVuWlhRb0ozQnliMlIxWTNSekp5azdYSEpjYmx4MFkyOXVjM1FnWTJodmMyVnVVSEp2WkhWamRDQTlJSEJ5YjJSMVkzUnpUR2x6ZEM1bWFXeDBaWElvWld4bGJXVnVkQ0E5UGlCbGJHVnRaVzUwTG1sa0lEMDlJSEJ5YjJSMVkzUkpaQ2xiTUYwN1hISmNibHh5WEc1Y2RHbG1JQ2hqWVhKMFcyTm9iM05sYmxCeWIyUjFZM1F1YVdSZElDWW1JR05oY25SYlkyaHZjMlZ1VUhKdlpIVmpkQzVwWkYwZ1BpQXdLU0I3WEhKY2JseDBYSFJqWVhKMFcyTm9iM05sYmxCeWIyUjFZM1F1YVdSZExTMWNjbHh1WEhSOUlHVnNjMlVnZTF4eVhHNWNkRngwWTJGeWRGdGphRzl6Wlc1UWNtOWtkV04wTG1sa1hTQTlJREE3WEhKY2JseDBmVnh5WEc1Y2NseHVYSFJUZEc5eVlXZGxMbk5sZENnblkyRnlkQ2NzSUdOaGNuUXBPMXh5WEc1Y2RHZGxkRU5oY25SV1lXeDFaU2dwTzF4eVhHNTlYSEpjYmx4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnWTJoaGJtZGxVSEp2WkhWamRGRjFZVzUwYVhSNUlEMGdLSFJoY21kbGRDa2dQVDRnZTF4eVhHNWNkR052Ym5OMElHNWxkMUYxWVc1MGFYUjVJRDBnSzNSaGNtZGxkQzUyWVd4MVpTQThJREVnUHlBeElEb2dLM1JoY21kbGRDNTJZV3gxWlR0Y2NseHVYSFJqYjI1emRDQndjbTlrZFdOMFNXUWdQU0IwWVhKblpYUXVZWFIwY21saWRYUmxjMXNuWkdGMFlTMXBaQ2RkTG5aaGJIVmxPMXh5WEc1Y2RHTnZibk4wSUdOaGNuUWdQU0JuWlhSRFlYSjBWbUZzZFdVb0tUdGNjbHh1WEhSamIyNXpkQ0J3Y205a2RXTjBjMHhwYzNRZ1BTQlRkRzl5WVdkbExtZGxkQ2duY0hKdlpIVmpkSE1uS1R0Y2NseHVYSFJqYjI1emRDQmphRzl6Wlc1UWNtOWtkV04wSUQwZ2NISnZaSFZqZEhOTWFYTjBMbVpwYkhSbGNpaGxiR1Z0Wlc1MElEMCtJR1ZzWlcxbGJuUXVhV1FnUFQwZ2NISnZaSFZqZEVsa0tWc3dYVHRjY2x4dVhISmNibHgwYVdZZ0tHTmhjblJiWTJodmMyVnVVSEp2WkhWamRDNXBaRjBwSUh0Y2NseHVYSFJjZEdOaGNuUmJZMmh2YzJWdVVISnZaSFZqZEM1cFpGMGdQU0J1WlhkUmRXRnVkR2wwZVR0Y2NseHVYSFI5WEhKY2JseHlYRzVjZEZOMGIzSmhaMlV1YzJWMEtDZGpZWEowSnl3Z1kyRnlkQ2s3WEhKY2JseDBaMlYwUTJGeWRGWmhiSFZsS0NrN1hISmNibjFjY2x4dVhISmNibVY0Y0c5eWRDQmpiMjV6ZENCeVpXMXZkbVZRY205a2RXTjBSbkp2YlVOaGNuUWdQU0FvZEdGeVoyVjBLU0E5UGlCN1hISmNibHgwWTI5dWMzUWdZMkZ5ZENBOUlHZGxkRU5oY25SV1lXeDFaU2dwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSSlpDQTlJSFJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRhV1FuS1R0Y2NseHVYSEpjYmx4MFpHVnNaWFJsSUdOaGNuUmJjSEp2WkhWamRFbGtYVHRjY2x4dVhISmNibHgwVTNSdmNtRm5aUzV6WlhRb0oyTmhjblFuTENCallYSjBLVHRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdOdmJuTjBJR2RsZEZSdmRHRnNVM1Z0SUQwZ0tDa2dQVDRnZTF4eVhHNWNkSEpsZEhWeWJpQm5aWFJEWVhKMFNYUmxiWE1vWjJWMFEyRnlkRlpoYkhWbEtDa3NJRk4wYjNKaFoyVXVaMlYwS0Nkd2NtOWtkV04wY3ljcEtWeHlYRzVjZEZ4MFhIUXViV0Z3S0hCeWIyUjFZM1FnUFQ0Z0szQnliMlIxWTNRdWNISnBZMlVnS2lBcmNISnZaSFZqZEM1MGIzUmhiQ2xjY2x4dVhIUmNkRngwTG5KbFpIVmpaU2dvWVdOakxDQmpkWElwSUQwK0lHRmpZeUFySUdOMWNpazdYSEpjYm4waUxDSmpiMjV6ZENCblpYUlFjbTlrZFdOMGN5QTlJQ2gxY213cElEMCtJSHRjY2x4dVhIUnlaWFIxY200Z1ptVjBZMmdvZFhKc0tUdGNjbHh1ZlZ4eVhHNWNjbHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdaMlYwVUhKdlpIVmpkSE03SWl3aWFXMXdiM0owSUhzZ1oyVjBRMkZ5ZEVsMFpXMXpJSDBnWm5KdmJTQW5MaTlqWVhKMEp6dGNjbHh1WEhKY2JtTnZibk4wSUcxdlpHRnNJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbTF2WkdGc0p5azdYSEpjYmx4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnYlc5a1lXeFBjR1Z1U0dGdVpHeGxjaUE5SUNncElEMCtJSHRjY2x4dVhIUnRiMlJoYkM1amJHRnpjMHhwYzNRdVlXUmtLQ2R2Y0dWdUp5azdYSEpjYm4xY2NseHVYSEpjYm1WNGNHOXlkQ0JqYjI1emRDQnRiMlJoYkVOc2IzTmxTR0Z1Wkd4bGNpQTlJQ2dwSUQwK0lIdGNjbHh1WEhSdGIyUmhiQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2R2Y0dWdUp5azdYSEpjYm4xY2NseHVYSEpjYmlJc0ltbHRjRzl5ZENCN0lHZGxkRlJ2ZEdGc1UzVnRJSDBnWm5KdmJTQW5MaTlqWVhKMEp6dGNjbHh1WEhKY2JtTnZibk4wSUdkbGJtVnlZWFJsUld4bGJXVnVkQ0E5SUNoMFlXZE9ZVzFsTENCamJHRnpjMDVoYldVZ1BTQW5KeWtnUFQ0Z2UxeHlYRzVjZEdOdmJuTjBJR1ZzSUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2gwWVdkT1lXMWxLVHRjY2x4dVhIUnBaaUFvWTJ4aGMzTk9ZVzFsS1NCN1hISmNibHgwWEhSbGJDNWpiR0Z6YzB4cGMzUXVZV1JrS0dOc1lYTnpUbUZ0WlNrN1hISmNibHgwZlZ4eVhHNWNjbHh1WEhSeVpYUjFjbTRnWld3N1hISmNibjFjY2x4dVhISmNibU52Ym5OMElHbHVjMlZ5ZEVWc1pXMWxiblJKYm5SdlVHRnlaVzUwSUQwZ0tHVnNaVzFsYm5SekxDQndZWEpsYm5SRmJHVnRaVzUwS1NBOVBpQjdYSEpjYmx4MFpXeGxiV1Z1ZEhNdVptOXlSV0ZqYUNobGJHVnRaVzUwSUQwK0lIdGNjbHh1WEhSY2RIQmhjbVZ1ZEVWc1pXMWxiblF1WVhCd1pXNWtRMmhwYkdRb1pXeGxiV1Z1ZENrN1hISmNibHgwZlNsY2NseHVmVnh5WEc1Y2NseHVZMjl1YzNRZ1kzSmxZWFJsVUhKdlpIVmpkRWwwWlcwZ1BTQW9leUJqZFhKeVpXNWplU3dnWkdWelkzSnBjSFJwYjI0c0lHbGtMQ0JwYldkZmRYSnNMQ0J3Y21salpTd2dkR2wwYkdVZ2ZTa2dQVDRnZTF4eVhHNWNjbHh1WEhSamIyNXpkQ0JqYjJ3Z1BTQm5aVzVsY21GMFpVVnNaVzFsYm5Rb0oyUnBkaWNzSUNkamIyd3RiV1F0TkNjcE8xeHlYRzVjZEdOdmJuTjBJSEJ5YjJSMVkzUkhjbWxrSUQwZ1oyVnVaWEpoZEdWRmJHVnRaVzUwS0Nka2FYWW5MQ0FuY0hKdlpIVmpkQzFuY21sa0p5azdYSEpjYmx4MFkyOXVjM1FnY0hKdlpIVmpkRWx0WVdkbFYzSmhjQ0E5SUdkbGJtVnlZWFJsUld4bGJXVnVkQ2duWkdsMkp5d2dKM0J5YjJSMVkzUXRhVzFoWjJVbktUdGNjbHh1WEhSamIyNXpkQ0JwYldGblpWZHlZWEJ3WlhJZ1BTQm5aVzVsY21GMFpVVnNaVzFsYm5Rb0oyUnBkaWNzSUNkcGJXRm5aUzEzY21Gd2NHVnlKeWs3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEVsdFlXZGxJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2RwYldjbkxDQW5jR2xqTFRFbktUdGNjbHh1WEhSamIyNXpkQ0J3Y205a2RXTjBUbVYzVEdGaVpXd2dQU0JuWlc1bGNtRjBaVVZzWlcxbGJuUW9KM053WVc0bkxDQW5jSEp2WkhWamRDMXVaWGN0YkdGaVpXd25LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wUkdselkyOTFiblJNWVdKbGJDQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25jM0JoYmljc0lDZHdjbTlrZFdOMExXUnBjMk52ZFc1MExXeGhZbVZzSnlrN1hISmNibHgwWTI5dWMzUWdjSEp2WkhWamRFUmxjMk55YVhCMGFXOXVJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2R3Snl3Z0ozQnliMlIxWTNRdFpHVnpZM0pwY0hScGIyNG5LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wUTI5dWRHVnVkQ0E5SUdkbGJtVnlZWFJsUld4bGJXVnVkQ2duWkdsMkp5d2dKM0J5YjJSMVkzUXRZMjl1ZEdWdWRDY3BPMXh5WEc1Y2RHTnZibk4wSUhCeWIyUjFZM1JVYVhSc1pTQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25hRE1uTENBbmRHbDBiR1VuS1R0Y2NseHVYSFJqYjI1emRDQndjbTlrZFdOMFVISnBZMlVnUFNCblpXNWxjbUYwWlVWc1pXMWxiblFvSjJScGRpY3NJQ2R3Y21salpTY3BPMXh5WEc1Y2RHTnZibk4wSUdGa1pGUnZRMkZ5ZENBOUlHZGxibVZ5WVhSbFJXeGxiV1Z1ZENnblluVjBkRzl1Snl3Z0oyRmtaQzEwYnkxallYSjBKeWs3WEhKY2JseHlYRzVjZEhCeWIyUjFZM1JPWlhkTVlXSmxiQzVwYm01bGNsUmxlSFFnUFNBblUyRnNaU2M3WEhKY2JseDBZV1JrVkc5RFlYSjBMbWx1Ym1WeVZHVjRkQ0E5SUNjcklFRmtaQ0JVYnlCRFlYSjBKenRjY2x4dVhIUndjbTlrZFdOMFJHbHpZMjkxYm5STVlXSmxiQzVwYm01bGNsUmxlSFFnUFNBblRrVlhKenRjY2x4dVhISmNibHgwY0hKdlpIVmpkRWx0WVdkbExuTmxkRUYwZEhKcFluVjBaU2duYzNKakp5d2dhVzFuWDNWeWJDazdYSEpjYmx4MFlXUmtWRzlEWVhKMExuTmxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXBaQ2NzSUdsa0tUdGNjbHh1WEhSaFpHUlViME5oY25RdVkyeGhjM05NYVhOMExtRmtaQ2duWW5SdUp5azdYSEpjYmx4MFlXUmtWRzlEWVhKMExtTnNZWE56VEdsemRDNWhaR1FvSjJKMGJpMXpkV05qWlhOekp5azdYSEpjYmx4MGNISnZaSFZqZEZScGRHeGxMbWx1Ym1WeVZHVjRkQ0E5SUhScGRHeGxPMXh5WEc1Y2RIQnliMlIxWTNSUWNtbGpaUzVwYm01bGNsUmxlSFFnUFNCamRYSnlaVzVqZVNBcklIQnlhV05sTzF4eVhHNWNjbHh1WEhSamIyd3VZWEJ3Wlc1a1EyaHBiR1FvY0hKdlpIVmpkRWR5YVdRcE8xeHlYRzVjZEdsdFlXZGxWM0poY0hCbGNpNWhjSEJsYm1SRGFHbHNaQ2h3Y205a2RXTjBTVzFoWjJVcE8xeHlYRzVjY2x4dVhIUmpiMjV6ZENCM2NtRndjR1ZrUjNKcFpDQTlJRnR3Y205a2RXTjBTVzFoWjJWWGNtRndMQ0J3Y205a2RXTjBSR1Z6WTNKcGNIUnBiMjRzSUhCeWIyUjFZM1JEYjI1MFpXNTBYVHRjY2x4dVhIUmpiMjV6ZENCM2NtRndjR1ZrU1cxaFoyVlhjbUZ3SUQwZ1cybHRZV2RsVjNKaGNIQmxjaXdnY0hKdlpIVmpkRTVsZDB4aFltVnNMQ0J3Y205a2RXTjBSR2x6WTI5MWJuUk1ZV0psYkYwN1hISmNibHgwWTI5dWMzUWdkM0poY0hCbFpFTnZiblJsYm5RZ1BTQmJjSEp2WkhWamRGUnBkR3hsTENCd2NtOWtkV04wVUhKcFkyVXNJR0ZrWkZSdlEyRnlkRjA3WEhKY2JseHlYRzVjZEdsdWMyVnlkRVZzWlcxbGJuUkpiblJ2VUdGeVpXNTBLSGR5WVhCd1pXUkhjbWxrTENCd2NtOWtkV04wUjNKcFpDazdYSEpjYmx4MGFXNXpaWEowUld4bGJXVnVkRWx1ZEc5UVlYSmxiblFvZDNKaGNIQmxaRWx0WVdkbFYzSmhjQ3dnY0hKdlpIVmpkRWx0WVdkbFYzSmhjQ2s3WEhKY2JseDBhVzV6WlhKMFJXeGxiV1Z1ZEVsdWRHOVFZWEpsYm5Rb2QzSmhjSEJsWkVOdmJuUmxiblFzSUhCeWIyUjFZM1JEYjI1MFpXNTBLVHRjY2x4dVhISmNibHgwY21WMGRYSnVJR052YkR0Y2NseHVmVnh5WEc1Y2NseHVZMjl1YzNRZ1kzSmxZWFJsUTJGeWRFbDBaVzBnUFNBb2V5QnBaQ3dnZEdsMGJHVXNJR2x0WjE5MWNtd3NJSEJ5YVdObExDQmpkWEp5Wlc1amVTd2dkRzkwWVd3Z2ZTa2dQVDRnZTF4eVhHNWNjbHh1WEhSamIyNXpkQ0JzYVhOMFNYUmxiU0E5SUdkbGJtVnlZWFJsUld4bGJXVnVkQ2duYkdrbktUdGNjbHh1WEhSamIyNXpkQ0J3Y205a2RXTjBTWFJsYlNBOUlHZGxibVZ5WVhSbFJXeGxiV1Z1ZENnblpHbDJKeXdnSjJOaGNuUXRiR2x6ZEY5ZmFYUmxiU2NwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSQmNuUnBZM1ZzSUQwZ1oyVnVaWEpoZEdWRmJHVnRaVzUwS0NkcGJuQjFkQ2NwTzF4eVhHNWNkR052Ym5OMElHbHRaMWR5WVhCd1pYSWdQU0JuWlc1bGNtRjBaVVZzWlcxbGJuUW9KMlJwZGljc0lDZGpZWEowTFd4cGMzUmZYMmx0WnkxM2NtRndjR1Z5SnlrN1hISmNibHgwWTI5dWMzUWdjSEp2WkhWamRFbHRaeUE5SUdkbGJtVnlZWFJsUld4bGJXVnVkQ2duYVcxbkp5d2dKMk5oY25RdGJHbHpkRjlmYVhSbGJTMXBiV2NuS1R0Y2NseHVYSFJqYjI1emRDQndjbTlrZFdOMFZHbDBiR1VnUFNCblpXNWxjbUYwWlVWc1pXMWxiblFvSjJnMEp5d2dKMk5oY25RdGJHbHpkRjlmYVhSbGJTMTBhWFJzWlNjcE8xeHlYRzVjZEdOdmJuTjBJSEJ5YjJSMVkzUlFjbWxqWlNBOUlHZGxibVZ5WVhSbFJXeGxiV1Z1ZENnbmMzQmhiaWNzSUNkallYSjBMV3hwYzNSZlgybDBaVzB0Y0hKcFkyVW5LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wVVhWaGJuUnBkSGtnUFNCblpXNWxjbUYwWlVWc1pXMWxiblFvSjJsdWNIVjBKeXdnSjJOaGNuUXRiR2x6ZEY5ZmFYUmxiUzF4ZFdGdWRHbDBlU2NwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSVWIzUmhiRkJ5YVdObElEMGdaMlZ1WlhKaGRHVkZiR1Z0Wlc1MEtDZHpjR0Z1Snl3Z0oyTmhjblF0YkdsemRGOWZhWFJsYlMxMGIzUmhiQ2NwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSU1pXMXZkbVVnUFNCblpXNWxjbUYwWlVWc1pXMWxiblFvSjJKMWRIUnZiaWNzSUNkallYSjBMV3hwYzNSZlgybDBaVzB0Y21WdGIzWmxKeWs3WEhKY2JseHlYRzVjZEhCeWIyUjFZM1JCY25ScFkzVnNMbk5sZEVGMGRISnBZblYwWlNnbmRIbHdaU2NzSUNkb2FXUmtaVzRuS1R0Y2NseHVYSFJ3Y205a2RXTjBRWEowYVdOMWJDNXpaWFJCZEhSeWFXSjFkR1VvSjI1aGJXVW5MQ0FuWVhKMGFXTjFiQ2NwTzF4eVhHNWNkSEJ5YjJSMVkzUkJjblJwWTNWc0xuTmxkRUYwZEhKcFluVjBaU2duZG1Gc2RXVW5MQ0JwWkNrN1hISmNibHgwY0hKdlpIVmpkRWx0Wnk1elpYUkJkSFJ5YVdKMWRHVW9KM055WXljc0lHbHRaMTkxY213cE8xeHlYRzVjZEhCeWIyUjFZM1JSZFdGdWRHbDBlUzV6WlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0YVdRbkxDQnBaQ2s3WEhKY2JseDBjSEp2WkhWamRGSmxiVzkyWlM1elpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGFXUW5MQ0JwWkNrN1hISmNibHgwY0hKdlpIVmpkRkYxWVc1MGFYUjVMbk5sZEVGMGRISnBZblYwWlNnbmRIbHdaU2NzSUNkdWRXMWlaWEluS1R0Y2NseHVYSFJ3Y205a2RXTjBVWFZoYm5ScGRIa3VjMlYwUVhSMGNtbGlkWFJsS0NkdVlXMWxKeXdnSjNGMVlXNTBhWFI1SnlrN1hISmNibHgwY0hKdlpIVmpkRkYxWVc1MGFYUjVMbk5sZEVGMGRISnBZblYwWlNnbmRtRnNkV1VuTENCMGIzUmhiQ2s3WEhKY2JseHlYRzVjZEhCeWIyUjFZM1JVYVhSc1pTNXBibTVsY2xSbGVIUWdQU0IwYVhSc1pUdGNjbHh1WEhSd2NtOWtkV04wVUhKcFkyVXVhVzV1WlhKVVpYaDBJRDBnWTNWeWNtVnVZM2tnS3lCd2NtbGpaVHRjY2x4dVhIUndjbTlrZFdOMFZHOTBZV3hRY21salpTNXBibTVsY2xSbGVIUWdQU0JnSkh0amRYSnlaVzVqZVgwa2V5dHdjbWxqWlNBcUlDdDBiM1JoYkgxZ08xeHlYRzVjZEhCeWIyUjFZM1JTWlcxdmRtVXVhVzV1WlhKVVpYaDBJRDBnSnkwbk8xeHlYRzVjY2x4dVhIUmpiMjV6ZENCM2NtRndjR1ZrVUhKdlpIVmpkRWwwWlcxeklEMGdXM0J5YjJSMVkzUkJjblJwWTNWc0xDQnBiV2RYY21Gd2NHVnlMQ0J3Y205a2RXTjBWR2wwYkdVc0lIQnliMlIxWTNSUWNtbGpaU3dnY0hKdlpIVmpkRkYxWVc1MGFYUjVMQ0J3Y205a2RXTjBWRzkwWVd4UWNtbGpaU3dnY0hKdlpIVmpkRkpsYlc5MlpWMDdYSEpjYmx4MGFXNXpaWEowUld4bGJXVnVkRWx1ZEc5UVlYSmxiblFvZDNKaGNIQmxaRkJ5YjJSMVkzUkpkR1Z0Y3l3Z2NISnZaSFZqZEVsMFpXMHBPMXh5WEc1Y2NseHVYSFJwYldkWGNtRndjR1Z5TG1Gd2NHVnVaRU5vYVd4a0tIQnliMlIxWTNSSmJXY3BPMXh5WEc1Y2RHeHBjM1JKZEdWdExtRndjR1Z1WkVOb2FXeGtLSEJ5YjJSMVkzUkpkR1Z0S1R0Y2NseHVYSEpjYmx4MGNtVjBkWEp1SUd4cGMzUkpkR1Z0TzF4eVhHNTlYSEpjYmx4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnY21WdVpHVnlVSEp2WkhWamRITWdQU0FvY0hKdlpIVmpkSE1wSUQwK0lIdGNjbHh1WEhSamIyNXpkQ0JuY21sa0lEMGdaRzlqZFcxbGJuUXVaMlYwUld4bGJXVnVkRUo1U1dRb0ozQnliMlIxWTNSelIzSnBaQ2NwTzF4eVhHNWNjbHh1WEhSd2NtOWtkV04wY3k1bWIzSkZZV05vS0hCeWIyUjFZM1FnUFQ0Z2UxeHlYRzVjZEZ4MFozSnBaQzVoY0hCbGJtUkRhR2xzWkNoamNtVmhkR1ZRY205a2RXTjBTWFJsYlNod2NtOWtkV04wS1NrN1hISmNibHgwZlNsY2NseHVmVnh5WEc1Y2NseHVaWGh3YjNKMElHTnZibk4wSUhKbGJtUmxja05oY25RZ1BTQW9jSEp2WkhWamRITXBJRDArSUh0Y2NseHVYSFJqYjI1emRDQm5jbWxrSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1OaGNuUXRiR2x6ZENjcE8xeHlYRzVjZEdOdmJuTjBJR1Z0Y0hSNVRYTm5JRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbU5oY25SZlgyVnRjSFI1SnlrN1hISmNibHgwWTI5dWMzUWdkRzkwWVd3Z1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVkyRnlkRjlmZEc5MFlXd25LVHRjY2x4dVhISmNibHgwZDJocGJHVWdLR2R5YVdRdVptbHljM1JEYUdsc1pDa2dlMXh5WEc1Y2RGeDBaM0pwWkM1eVpXMXZkbVZEYUdsc1pDaG5jbWxrTG1acGNuTjBRMmhwYkdRcE8xeHlYRzVjZEgxY2NseHVYSEpjYmx4MGFXWWdLQ0Z3Y205a2RXTjBjeTVzWlc1bmRHZ3BJSHRjY2x4dVhIUmNkSEpsZEhWeWJpQm5jbWxrTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMlZ0Y0hSNUxXeHBjM1FuS1R0Y2NseHVYSFI5SUdWc2MyVWdlMXh5WEc1Y2RGeDBaM0pwWkM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkbGJYQjBlUzFzYVhOMEp5azdYSEpjYmx4MGZWeHlYRzVjY2x4dVhIUnNaWFFnWTNWeWNtVnVZM2s3WEhKY2JseHlYRzVjZEhCeWIyUjFZM1J6TG1admNrVmhZMmdvY0hKdlpIVmpkQ0E5UGlCN1hISmNibHgwWEhSamRYSnlaVzVqZVNBOUlIQnliMlIxWTNRdVkzVnljbVZ1WTNrN1hISmNibHgwWEhSbmNtbGtMbUZ3Y0dWdVpFTm9hV3hrS0dOeVpXRjBaVU5oY25SSmRHVnRLSEJ5YjJSMVkzUXBLVHRjY2x4dVhIUjlLVHRjY2x4dVhISmNibHgwZEc5MFlXd3VhVzV1WlhKVVpYaDBJRDBnWUZSdmRHRnNPaUFrZTJOMWNuSmxibU41ZlNSN1oyVjBWRzkwWVd4VGRXMG9LWDFnTzF4eVhHNTlYSEpjYmx4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnY21WdVpHVnlVM1ZqWTJWemMwMXpaeUE5SUNncElEMCtJSHRjY2x4dVhIUmpiMjV6ZENCemNHRnVJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2R6Y0dGdUp5d2dKM04xWTJObGMzTXRiWE5uSnlrN1hISmNibHgwYzNCaGJpNWpiR0Z6YzB4cGMzUXVZV1JrS0NkaVlXUm5aU2NwTzF4eVhHNWNkSE53WVc0dVkyeGhjM05NYVhOMExtRmtaQ2duWW1Ga1oyVXRjM1ZqWTJWemN5Y3BPMXh5WEc1Y2RITndZVzR1YVc1dVpYSlVaWGgwSUQwZ0owRmtaR1ZrSUhSdklHTmhjblFuTzF4eVhHNWNkR1J2WTNWdFpXNTBMbUp2WkhrdVlYQndaVzVrUTJocGJHUW9jM0JoYmlrN1hISmNibHgwYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEhKY2JseDBYSFJrYjJOMWJXVnVkQzVpYjJSNUxuSmxiVzkyWlVOb2FXeGtLSE53WVc0cE8xeHlYRzVjZEgwc0lESTFNREFwTzF4eVhHNTlJaXdpWm5WdVkzUnBiMjRnVTNSdmNtRm5aVWhsYkhCbGNpZ3BlMXh5WEc1Y2RIUm9hWE11YzNSdmNtRm5aU0E5SUd4dlkyRnNVM1J2Y21GblpUdGNjbHh1WEhKY2JseDBkR2hwY3k1blpYUWdQU0FvYTJWNUtTQTlQaUI3WEhKY2JseDBYSFJ5WlhSMWNtNGdTbE5QVGk1d1lYSnpaU2hzYjJOaGJGTjBiM0poWjJVdVoyVjBTWFJsYlNoclpYa3BLVHRjY2x4dVhIUjlYSEpjYmx4MGRHaHBjeTV6WlhRZ1BTQW9hMlY1TENCMllXeDFaU2tnUFQ0Z2UxeHlYRzVjZEZ4MGJHOWpZV3hUZEc5eVlXZGxMbk5sZEVsMFpXMG9hMlY1TENCS1UwOU9Mbk4wY21sdVoybG1lU2gyWVd4MVpTa3BPMXh5WEc1Y2RIMWNjbHh1WEhSMGFHbHpMbkpsYlc5MlpTQTlJQ2hyWlhrcElEMCtJSHRjY2x4dVhIUmNkR3h2WTJGc1UzUnZjbUZuWlM1eVpXMXZkbVZKZEdWdEtHdGxlU2s3WEhKY2JseDBmVnh5WEc1OVhISmNibHh5WEc1amIyNXpkQ0JUZEc5eVlXZGxJRDBnYm1WM0lGTjBiM0poWjJWSVpXeHdaWElvS1R0Y2NseHVYSEpjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRk4wYjNKaFoyVTdJbDE5In0=
