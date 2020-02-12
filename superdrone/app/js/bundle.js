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
  $(".owl-carousel").owlCarousel();
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
  var col = generateElement('div', 'col-4');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9hcHAuanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9jYXJ0LmpzIiwicHJvamVjdHMvc3VwZXJkcm9uZS9zcmMvanMvZmV0Y2guanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9tb2RhbC5qcyIsInByb2plY3RzL3N1cGVyZHJvbmUvc3JjL2pzL3JlbmRlci5qcyIsInByb2plY3RzL3N1cGVyZHJvbmUvc3JjL2pzL3N0b3JhZ2VIZWxwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTSxzQkFBc0IsR0FBRyxnQkFBL0I7QUFDQSxJQUFJLGtCQUFrQixHQUFHLElBQUksS0FBSixDQUFVLHNCQUFWLENBQXpCO0FBRUEsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBakI7QUFFQSx1QkFBWSw4REFBWixFQUNDLElBREQsQ0FFQyxVQUFTLFFBQVQsRUFBbUI7QUFDbEIsTUFBSSxRQUFRLENBQUMsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUM1QixJQUFBLE9BQU8sQ0FBQyxHQUFSLHdEQUE0RCxRQUFRLENBQUMsTUFBckU7QUFDQTtBQUNBOztBQUVELEVBQUEsUUFBUSxDQUFDLElBQVQsR0FDQyxJQURELENBQ00sZ0JBQWdCO0FBQUEsUUFBZCxRQUFjLFFBQWQsUUFBYzs7QUFDckIsOEJBQVEsR0FBUixDQUFZLFVBQVosRUFBd0IsUUFBeEI7O0FBQ0EsSUFBQSxRQUFRLENBQUMsYUFBVCxDQUF1QixrQkFBdkI7QUFDQSxHQUpEO0FBS0EsQ0FiRixXQWVPLFVBQVMsR0FBVCxFQUFjO0FBQ3BCLEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQkFBWixFQUErQixHQUEvQjtBQUNBLENBakJEO0FBbUJB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LENBQXdCLEdBQXhCO0FBQ0EsR0FGRDtBQUdBOztBQUVELElBQU0sT0FBTyxHQUFHLElBQUksYUFBSixFQUFoQjtlQUVlLE8iLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBTdG9yYWdlIGZyb20gJy4vc3RvcmFnZUhlbHBlcic7XHJcbmltcG9ydCBnZXRQcm9kdWN0cyBmcm9tICcuL2ZldGNoJztcclxuaW1wb3J0IHsgcmVuZGVyUHJvZHVjdHMsIHJlbmRlckNhcnQsIHJlbmRlclN1Y2Nlc3NNc2cgfSBmcm9tICcuL3JlbmRlcic7XHJcbmltcG9ydCB7IGdldENhcnRWYWx1ZSwgYWRkVG9DYXJ0SGFuZGxlciwgZ2V0Q2FydEl0ZW1zLCBjaGFuZ2VQcm9kdWN0UXVhbnRpdHksIHJlbW92ZVByb2R1Y3RGcm9tQ2FydCB9IGZyb20gJy4vY2FydCc7XHJcbmltcG9ydCB7IG1vZGFsT3BlbkhhbmRsZXIsIG1vZGFsQ2xvc2VIYW5kbGVyIH0gZnJvbSAnLi9tb2RhbCc7XHJcblxyXG5jb25zdCBwcm9kdWN0c1JlYWR5RXZlbnROYW1lID0gJ3Byb2R1Y3RzX3JlYWR5JztcclxubGV0IHByb2R1Y3RzUmVhZHlFdmVudCA9IG5ldyBFdmVudChwcm9kdWN0c1JlYWR5RXZlbnROYW1lKTtcclxuXHJcbmNvbnN0IGNhcnRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19mb3JtJyk7XHJcblxyXG5nZXRQcm9kdWN0cygnaHR0cHM6Ly9teS1qc29uLXNlcnZlci50eXBpY29kZS5jb20vdm9yb3RuaXF1ZS9mYWtlc2VydmVyL2RiJylcclxuLnRoZW4oXHJcblx0ZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtLiBTdGF0dXMgQ29kZTogJHtyZXNwb25zZS5zdGF0dXN9YCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXNwb25zZS5qc29uKClcclxuXHRcdC50aGVuKCh7cHJvZHVjdHN9KSA9PiB7XHJcblx0XHRcdFN0b3JhZ2Uuc2V0KCdwcm9kdWN0cycsIHByb2R1Y3RzKTtcclxuXHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChwcm9kdWN0c1JlYWR5RXZlbnQpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdClcclxuLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG5cdGNvbnNvbGUubG9nKCdGZXRjaCBFcnJvciA6LVMnLCBlcnIpO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcblx0Y29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG5cclxuXHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYWRkLXRvLWNhcnQnKSkge1xyXG5cdFx0YWRkVG9DYXJ0SGFuZGxlcih0YXJnZXQpO1xyXG5cdFx0cmVuZGVyU3VjY2Vzc01zZygpO1xyXG5cdH1cclxuXHJcblx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NhcnQnKSkge1xyXG5cdFx0bW9kYWxPcGVuSGFuZGxlcigpO1xyXG5cdFx0cmVuZGVyQ2FydChnZXRDYXJ0SXRlbXMoZ2V0Q2FydFZhbHVlKCksIFN0b3JhZ2UuZ2V0KCdwcm9kdWN0cycpKSk7XHJcblx0fVxyXG5cclxuXHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWxfX2Nsb3NlJykpIHtcclxuXHRcdG1vZGFsQ2xvc2VIYW5kbGVyKCk7XHJcblx0fVxyXG5cclxuXHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2xlYXItYnRuJykpIHtcclxuXHRcdFN0b3JhZ2Uuc2V0KCdjYXJ0Jywge30pO1xyXG5cdFx0cmVuZGVyQ2FydChbXSk7XHJcblx0XHRnZXRDYXJ0VmFsdWUoKTtcclxuXHR9XHJcblxyXG5cdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWJtaXQtYnRuJykpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0fVxyXG5cclxuXHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2FydC1saXN0X19pdGVtLXJlbW92ZScpKSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0cmVtb3ZlUHJvZHVjdEZyb21DYXJ0KHRhcmdldCk7XHJcblx0XHRyZW5kZXJDYXJ0KGdldENhcnRJdGVtcyhnZXRDYXJ0VmFsdWUoKSwgU3RvcmFnZS5nZXQoJ3Byb2R1Y3RzJykpKTtcclxuXHR9XHJcblxyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIocHJvZHVjdHNSZWFkeUV2ZW50TmFtZSwgKCkgPT4ge1xyXG5cdGNvbnN0IGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9wZWxsZXItbG9hZGVyJyk7XHJcblx0cmVuZGVyUHJvZHVjdHMoU3RvcmFnZS5nZXQoJ3Byb2R1Y3RzJykpO1xyXG5cdGdldENhcnRWYWx1ZSgpO1xyXG5cdGxvYWRlci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxufSk7XHJcblxyXG5jYXJ0Rm9ybS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcclxuXHRjaGFuZ2VQcm9kdWN0UXVhbnRpdHkoZXZlbnQudGFyZ2V0KTtcclxuXHRyZW5kZXJDYXJ0KGdldENhcnRJdGVtcyhnZXRDYXJ0VmFsdWUoKSwgU3RvcmFnZS5nZXQoJ3Byb2R1Y3RzJykpKTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICQoXCIub3dsLWNhcm91c2VsXCIpLm93bENhcm91c2VsKCk7XHJcbn0pOyIsImltcG9ydCBTdG9yYWdlIGZyb20gJy4vc3RvcmFnZUhlbHBlcic7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Q2FydFZhbHVlID0gKCkgPT4ge1xyXG5cdGNvbnN0IGxhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2xhYmVsJyk7XHJcblx0Y29uc3QgY2FydFZhbHVlID0gU3RvcmFnZS5nZXQoJ2NhcnQnKTtcclxuXHJcblx0aWYgKCFjYXJ0VmFsdWUgfHwgIU9iamVjdC5rZXlzKGNhcnRWYWx1ZSkubGVuZ3RoKSB7XHJcblx0XHRsYWJlbC5pbm5lclRleHQgPSAwO1xyXG5cdFx0cmV0dXJuIHt9O1xyXG5cdH1cclxuXHJcblx0bGFiZWwuaW5uZXJUZXh0ID0gT2JqZWN0LnZhbHVlcyhjYXJ0VmFsdWUpLnJlZHVjZSgoYWNjLCBjdXIpID0+ICthY2MgKyArY3VyKTtcclxuXHJcblx0cmV0dXJuIGNhcnRWYWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldENhcnRJdGVtcyA9IChjYXJ0VmFsdWUsIHByb2R1Y3RzKSA9PiB7XHJcblx0cmV0dXJuIE9iamVjdC5rZXlzKGNhcnRWYWx1ZSkubWFwKGlkID0+IHtcclxuXHRcdHJldHVybiBwcm9kdWN0cy5maWx0ZXIocHJvZHVjdCA9PiB7XHJcblx0XHRcdGlmIChwcm9kdWN0LmlkID09IGlkKSB7XHJcblx0XHRcdFx0cHJvZHVjdC50b3RhbCA9IGNhcnRWYWx1ZVtpZF07XHJcblx0XHRcdFx0cmV0dXJuIHByb2R1Y3Q7XHJcblx0XHRcdH1cclxuXHRcdH0pWzBdO1xyXG5cdH0pO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkVG9DYXJ0SGFuZGxlciA9ICh0YXJnZXQpID0+IHtcclxuXHRjb25zdCBjYXJ0ID0gZ2V0Q2FydFZhbHVlKCk7XHJcblx0Y29uc3QgcHJvZHVjdElkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xyXG5cdGNvbnN0IHByb2R1Y3RzTGlzdCA9IFN0b3JhZ2UuZ2V0KCdwcm9kdWN0cycpO1xyXG5cdGNvbnN0IGNob3NlblByb2R1Y3QgPSBwcm9kdWN0c0xpc3QuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudC5pZCA9PSBwcm9kdWN0SWQpWzBdO1xyXG5cclxuXHRpZiAoY2FydFtjaG9zZW5Qcm9kdWN0LmlkXSkge1xyXG5cdFx0Y2FydFtjaG9zZW5Qcm9kdWN0LmlkXSsrXHJcblx0fSBlbHNlIHtcclxuXHRcdGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0gPSAxO1xyXG5cdH1cclxuXHJcblx0U3RvcmFnZS5zZXQoJ2NhcnQnLCBjYXJ0KTtcclxuXHRnZXRDYXJ0VmFsdWUoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbW92ZUZyb21DYXJ0SGFuZGxlciA9ICh0YXJnZXQpID0+IHtcclxuXHRjb25zdCBjYXJ0ID0gZ2V0Q2FydFZhbHVlKCk7XHJcblx0Y29uc3QgcHJvZHVjdElkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xyXG5cdGNvbnN0IHByb2R1Y3RzTGlzdCA9IFN0b3JhZ2UuZ2V0KCdwcm9kdWN0cycpO1xyXG5cdGNvbnN0IGNob3NlblByb2R1Y3QgPSBwcm9kdWN0c0xpc3QuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudC5pZCA9PSBwcm9kdWN0SWQpWzBdO1xyXG5cclxuXHRpZiAoY2FydFtjaG9zZW5Qcm9kdWN0LmlkXSAmJiBjYXJ0W2Nob3NlblByb2R1Y3QuaWRdID4gMCkge1xyXG5cdFx0Y2FydFtjaG9zZW5Qcm9kdWN0LmlkXS0tXHJcblx0fSBlbHNlIHtcclxuXHRcdGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0gPSAwO1xyXG5cdH1cclxuXHJcblx0U3RvcmFnZS5zZXQoJ2NhcnQnLCBjYXJ0KTtcclxuXHRnZXRDYXJ0VmFsdWUoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNoYW5nZVByb2R1Y3RRdWFudGl0eSA9ICh0YXJnZXQpID0+IHtcclxuXHRjb25zdCBuZXdRdWFudGl0eSA9ICt0YXJnZXQudmFsdWUgPCAxID8gMSA6ICt0YXJnZXQudmFsdWU7XHJcblx0Y29uc3QgcHJvZHVjdElkID0gdGFyZ2V0LmF0dHJpYnV0ZXNbJ2RhdGEtaWQnXS52YWx1ZTtcclxuXHRjb25zdCBjYXJ0ID0gZ2V0Q2FydFZhbHVlKCk7XHJcblx0Y29uc3QgcHJvZHVjdHNMaXN0ID0gU3RvcmFnZS5nZXQoJ3Byb2R1Y3RzJyk7XHJcblx0Y29uc3QgY2hvc2VuUHJvZHVjdCA9IHByb2R1Y3RzTGlzdC5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmlkID09IHByb2R1Y3RJZClbMF07XHJcblxyXG5cdGlmIChjYXJ0W2Nob3NlblByb2R1Y3QuaWRdKSB7XHJcblx0XHRjYXJ0W2Nob3NlblByb2R1Y3QuaWRdID0gbmV3UXVhbnRpdHk7XHJcblx0fVxyXG5cclxuXHRTdG9yYWdlLnNldCgnY2FydCcsIGNhcnQpO1xyXG5cdGdldENhcnRWYWx1ZSgpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlUHJvZHVjdEZyb21DYXJ0ID0gKHRhcmdldCkgPT4ge1xyXG5cdGNvbnN0IGNhcnQgPSBnZXRDYXJ0VmFsdWUoKTtcclxuXHRjb25zdCBwcm9kdWN0SWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XHJcblxyXG5cdGRlbGV0ZSBjYXJ0W3Byb2R1Y3RJZF07XHJcblxyXG5cdFN0b3JhZ2Uuc2V0KCdjYXJ0JywgY2FydCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRUb3RhbFN1bSA9ICgpID0+IHtcclxuXHRyZXR1cm4gZ2V0Q2FydEl0ZW1zKGdldENhcnRWYWx1ZSgpLCBTdG9yYWdlLmdldCgncHJvZHVjdHMnKSlcclxuXHRcdFx0Lm1hcChwcm9kdWN0ID0+ICtwcm9kdWN0LnByaWNlICogK3Byb2R1Y3QudG90YWwpXHJcblx0XHRcdC5yZWR1Y2UoKGFjYywgY3VyKSA9PiBhY2MgKyBjdXIpO1xyXG59IiwiY29uc3QgZ2V0UHJvZHVjdHMgPSAodXJsKSA9PiB7XHJcblx0cmV0dXJuIGZldGNoKHVybCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldFByb2R1Y3RzOyIsImltcG9ydCB7IGdldENhcnRJdGVtcyB9IGZyb20gJy4vY2FydCc7XHJcblxyXG5jb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbCcpO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1vZGFsT3BlbkhhbmRsZXIgPSAoKSA9PiB7XHJcblx0bW9kYWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbW9kYWxDbG9zZUhhbmRsZXIgPSAoKSA9PiB7XHJcblx0bW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBnZXRUb3RhbFN1bSB9IGZyb20gJy4vY2FydCc7XHJcblxyXG5jb25zdCBnZW5lcmF0ZUVsZW1lbnQgPSAodGFnTmFtZSwgY2xhc3NOYW1lID0gJycpID0+IHtcclxuXHRjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XHJcblx0aWYgKGNsYXNzTmFtZSkge1xyXG5cdFx0ZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGVsO1xyXG59XHJcblxyXG5jb25zdCBpbnNlcnRFbGVtZW50SW50b1BhcmVudCA9IChlbGVtZW50cywgcGFyZW50RWxlbWVudCkgPT4ge1xyXG5cdGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcblx0XHRwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG5cdH0pXHJcbn1cclxuXHJcbmNvbnN0IGNyZWF0ZVByb2R1Y3RJdGVtID0gKHsgY3VycmVuY3ksIGRlc2NyaXB0aW9uLCBpZCwgaW1nX3VybCwgcHJpY2UsIHRpdGxlIH0pID0+IHtcclxuXHJcblx0Y29uc3QgY29sID0gZ2VuZXJhdGVFbGVtZW50KCdkaXYnLCAnY29sLTQnKTtcclxuXHRjb25zdCBwcm9kdWN0R3JpZCA9IGdlbmVyYXRlRWxlbWVudCgnZGl2JywgJ3Byb2R1Y3QtZ3JpZCcpO1xyXG5cdGNvbnN0IHByb2R1Y3RJbWFnZVdyYXAgPSBnZW5lcmF0ZUVsZW1lbnQoJ2RpdicsICdwcm9kdWN0LWltYWdlJyk7XHJcblx0Y29uc3QgaW1hZ2VXcmFwcGVyID0gZ2VuZXJhdGVFbGVtZW50KCdkaXYnLCAnaW1hZ2Utd3JhcHBlcicpO1xyXG5cdGNvbnN0IHByb2R1Y3RJbWFnZSA9IGdlbmVyYXRlRWxlbWVudCgnaW1nJywgJ3BpYy0xJyk7XHJcblx0Y29uc3QgcHJvZHVjdE5ld0xhYmVsID0gZ2VuZXJhdGVFbGVtZW50KCdzcGFuJywgJ3Byb2R1Y3QtbmV3LWxhYmVsJyk7XHJcblx0Y29uc3QgcHJvZHVjdERpc2NvdW50TGFiZWwgPSBnZW5lcmF0ZUVsZW1lbnQoJ3NwYW4nLCAncHJvZHVjdC1kaXNjb3VudC1sYWJlbCcpO1xyXG5cdGNvbnN0IHByb2R1Y3REZXNjcmlwdGlvbiA9IGdlbmVyYXRlRWxlbWVudCgncCcsICdwcm9kdWN0LWRlc2NyaXB0aW9uJyk7XHJcblx0Y29uc3QgcHJvZHVjdENvbnRlbnQgPSBnZW5lcmF0ZUVsZW1lbnQoJ2RpdicsICdwcm9kdWN0LWNvbnRlbnQnKTtcclxuXHRjb25zdCBwcm9kdWN0VGl0bGUgPSBnZW5lcmF0ZUVsZW1lbnQoJ2gzJywgJ3RpdGxlJyk7XHJcblx0Y29uc3QgcHJvZHVjdFByaWNlID0gZ2VuZXJhdGVFbGVtZW50KCdkaXYnLCAncHJpY2UnKTtcclxuXHRjb25zdCBhZGRUb0NhcnQgPSBnZW5lcmF0ZUVsZW1lbnQoJ2J1dHRvbicsICdhZGQtdG8tY2FydCcpO1xyXG5cclxuXHRwcm9kdWN0TmV3TGFiZWwuaW5uZXJUZXh0ID0gJ1NhbGUnO1xyXG5cdGFkZFRvQ2FydC5pbm5lclRleHQgPSAnKyBBZGQgVG8gQ2FydCc7XHJcblx0cHJvZHVjdERpc2NvdW50TGFiZWwuaW5uZXJUZXh0ID0gJ05FVyc7XHJcblxyXG5cdHByb2R1Y3RJbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGltZ191cmwpO1xyXG5cdGFkZFRvQ2FydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBpZCk7XHJcblx0YWRkVG9DYXJ0LmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xyXG5cdGFkZFRvQ2FydC5jbGFzc0xpc3QuYWRkKCdidG4tc3VjY2VzcycpO1xyXG5cdHByb2R1Y3RUaXRsZS5pbm5lclRleHQgPSB0aXRsZTtcclxuXHRwcm9kdWN0UHJpY2UuaW5uZXJUZXh0ID0gY3VycmVuY3kgKyBwcmljZTtcclxuXHJcblx0Y29sLmFwcGVuZENoaWxkKHByb2R1Y3RHcmlkKTtcclxuXHRpbWFnZVdyYXBwZXIuYXBwZW5kQ2hpbGQocHJvZHVjdEltYWdlKTtcclxuXHJcblx0Y29uc3Qgd3JhcHBlZEdyaWQgPSBbcHJvZHVjdEltYWdlV3JhcCwgcHJvZHVjdERlc2NyaXB0aW9uLCBwcm9kdWN0Q29udGVudF07XHJcblx0Y29uc3Qgd3JhcHBlZEltYWdlV3JhcCA9IFtpbWFnZVdyYXBwZXIsIHByb2R1Y3ROZXdMYWJlbCwgcHJvZHVjdERpc2NvdW50TGFiZWxdO1xyXG5cdGNvbnN0IHdyYXBwZWRDb250ZW50ID0gW3Byb2R1Y3RUaXRsZSwgcHJvZHVjdFByaWNlLCBhZGRUb0NhcnRdO1xyXG5cclxuXHRpbnNlcnRFbGVtZW50SW50b1BhcmVudCh3cmFwcGVkR3JpZCwgcHJvZHVjdEdyaWQpO1xyXG5cdGluc2VydEVsZW1lbnRJbnRvUGFyZW50KHdyYXBwZWRJbWFnZVdyYXAsIHByb2R1Y3RJbWFnZVdyYXApO1xyXG5cdGluc2VydEVsZW1lbnRJbnRvUGFyZW50KHdyYXBwZWRDb250ZW50LCBwcm9kdWN0Q29udGVudCk7XHJcblxyXG5cdHJldHVybiBjb2w7XHJcbn1cclxuXHJcbmNvbnN0IGNyZWF0ZUNhcnRJdGVtID0gKHsgaWQsIHRpdGxlLCBpbWdfdXJsLCBwcmljZSwgY3VycmVuY3ksIHRvdGFsIH0pID0+IHtcclxuXHJcblx0Y29uc3QgbGlzdEl0ZW0gPSBnZW5lcmF0ZUVsZW1lbnQoJ2xpJyk7XHJcblx0Y29uc3QgcHJvZHVjdEl0ZW0gPSBnZW5lcmF0ZUVsZW1lbnQoJ2RpdicsICdjYXJ0LWxpc3RfX2l0ZW0nKTtcclxuXHRjb25zdCBwcm9kdWN0QXJ0aWN1bCA9IGdlbmVyYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuXHRjb25zdCBpbWdXcmFwcGVyID0gZ2VuZXJhdGVFbGVtZW50KCdkaXYnLCAnY2FydC1saXN0X19pbWctd3JhcHBlcicpO1xyXG5cdGNvbnN0IHByb2R1Y3RJbWcgPSBnZW5lcmF0ZUVsZW1lbnQoJ2ltZycsICdjYXJ0LWxpc3RfX2l0ZW0taW1nJyk7XHJcblx0Y29uc3QgcHJvZHVjdFRpdGxlID0gZ2VuZXJhdGVFbGVtZW50KCdoNCcsICdjYXJ0LWxpc3RfX2l0ZW0tdGl0bGUnKTtcclxuXHRjb25zdCBwcm9kdWN0UHJpY2UgPSBnZW5lcmF0ZUVsZW1lbnQoJ3NwYW4nLCAnY2FydC1saXN0X19pdGVtLXByaWNlJyk7XHJcblx0Y29uc3QgcHJvZHVjdFF1YW50aXR5ID0gZ2VuZXJhdGVFbGVtZW50KCdpbnB1dCcsICdjYXJ0LWxpc3RfX2l0ZW0tcXVhbnRpdHknKTtcclxuXHRjb25zdCBwcm9kdWN0VG90YWxQcmljZSA9IGdlbmVyYXRlRWxlbWVudCgnc3BhbicsICdjYXJ0LWxpc3RfX2l0ZW0tdG90YWwnKTtcclxuXHRjb25zdCBwcm9kdWN0UmVtb3ZlID0gZ2VuZXJhdGVFbGVtZW50KCdidXR0b24nLCAnY2FydC1saXN0X19pdGVtLXJlbW92ZScpO1xyXG5cclxuXHRwcm9kdWN0QXJ0aWN1bC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaGlkZGVuJyk7XHJcblx0cHJvZHVjdEFydGljdWwuc2V0QXR0cmlidXRlKCduYW1lJywgJ2FydGljdWwnKTtcclxuXHRwcm9kdWN0QXJ0aWN1bC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgaWQpO1xyXG5cdHByb2R1Y3RJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCBpbWdfdXJsKTtcclxuXHRwcm9kdWN0UXVhbnRpdHkuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgaWQpO1xyXG5cdHByb2R1Y3RSZW1vdmUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgaWQpO1xyXG5cdHByb2R1Y3RRdWFudGl0eS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbnVtYmVyJyk7XHJcblx0cHJvZHVjdFF1YW50aXR5LnNldEF0dHJpYnV0ZSgnbmFtZScsICdxdWFudGl0eScpO1xyXG5cdHByb2R1Y3RRdWFudGl0eS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdG90YWwpO1xyXG5cclxuXHRwcm9kdWN0VGl0bGUuaW5uZXJUZXh0ID0gdGl0bGU7XHJcblx0cHJvZHVjdFByaWNlLmlubmVyVGV4dCA9IGN1cnJlbmN5ICsgcHJpY2U7XHJcblx0cHJvZHVjdFRvdGFsUHJpY2UuaW5uZXJUZXh0ID0gYCR7Y3VycmVuY3l9JHsrcHJpY2UgKiArdG90YWx9YDtcclxuXHRwcm9kdWN0UmVtb3ZlLmlubmVyVGV4dCA9ICctJztcclxuXHJcblx0Y29uc3Qgd3JhcHBlZFByb2R1Y3RJdGVtcyA9IFtwcm9kdWN0QXJ0aWN1bCwgaW1nV3JhcHBlciwgcHJvZHVjdFRpdGxlLCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RRdWFudGl0eSwgcHJvZHVjdFRvdGFsUHJpY2UsIHByb2R1Y3RSZW1vdmVdO1xyXG5cdGluc2VydEVsZW1lbnRJbnRvUGFyZW50KHdyYXBwZWRQcm9kdWN0SXRlbXMsIHByb2R1Y3RJdGVtKTtcclxuXHJcblx0aW1nV3JhcHBlci5hcHBlbmRDaGlsZChwcm9kdWN0SW1nKTtcclxuXHRsaXN0SXRlbS5hcHBlbmRDaGlsZChwcm9kdWN0SXRlbSk7XHJcblxyXG5cdHJldHVybiBsaXN0SXRlbTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlclByb2R1Y3RzID0gKHByb2R1Y3RzKSA9PiB7XHJcblx0Y29uc3QgZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9kdWN0c0dyaWQnKTtcclxuXHJcblx0cHJvZHVjdHMuZm9yRWFjaChwcm9kdWN0ID0+IHtcclxuXHRcdGdyaWQuYXBwZW5kQ2hpbGQoY3JlYXRlUHJvZHVjdEl0ZW0ocHJvZHVjdCkpO1xyXG5cdH0pXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJDYXJ0ID0gKHByb2R1Y3RzKSA9PiB7XHJcblx0Y29uc3QgZ3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0LWxpc3QnKTtcclxuXHRjb25zdCBlbXB0eU1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X19lbXB0eScpO1xyXG5cdGNvbnN0IHRvdGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX3RvdGFsJyk7XHJcblxyXG5cdHdoaWxlIChncmlkLmZpcnN0Q2hpbGQpIHtcclxuXHRcdGdyaWQucmVtb3ZlQ2hpbGQoZ3JpZC5maXJzdENoaWxkKTtcclxuXHR9XHJcblxyXG5cdGlmICghcHJvZHVjdHMubGVuZ3RoKSB7XHJcblx0XHRyZXR1cm4gZ3JpZC5jbGFzc0xpc3QuYWRkKCdlbXB0eS1saXN0Jyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGdyaWQuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHktbGlzdCcpO1xyXG5cdH1cclxuXHJcblx0bGV0IGN1cnJlbmN5O1xyXG5cclxuXHRwcm9kdWN0cy5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG5cdFx0Y3VycmVuY3kgPSBwcm9kdWN0LmN1cnJlbmN5O1xyXG5cdFx0Z3JpZC5hcHBlbmRDaGlsZChjcmVhdGVDYXJ0SXRlbShwcm9kdWN0KSk7XHJcblx0fSk7XHJcblxyXG5cdHRvdGFsLmlubmVyVGV4dCA9IGBUb3RhbDogJHtjdXJyZW5jeX0ke2dldFRvdGFsU3VtKCl9YDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlclN1Y2Nlc3NNc2cgPSAoKSA9PiB7XHJcblx0Y29uc3Qgc3BhbiA9IGdlbmVyYXRlRWxlbWVudCgnc3BhbicsICdzdWNjZXNzLW1zZycpO1xyXG5cdHNwYW4uY2xhc3NMaXN0LmFkZCgnYmFkZ2UnKTtcclxuXHRzcGFuLmNsYXNzTGlzdC5hZGQoJ2JhZGdlLXN1Y2Nlc3MnKTtcclxuXHRzcGFuLmlubmVyVGV4dCA9ICdBZGRlZCB0byBjYXJ0JztcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNwYW4pO1xyXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzcGFuKTtcclxuXHR9LCAyNTAwKTtcclxufSIsImZ1bmN0aW9uIFN0b3JhZ2VIZWxwZXIoKXtcclxuXHR0aGlzLnN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2U7XHJcblxyXG5cdHRoaXMuZ2V0ID0gKGtleSkgPT4ge1xyXG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcblx0fVxyXG5cdHRoaXMuc2V0ID0gKGtleSwgdmFsdWUpID0+IHtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuXHR9XHJcblx0dGhpcy5yZW1vdmUgPSAoa2V5KSA9PiB7XHJcblx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG5cdH1cclxufVxyXG5cclxuY29uc3QgU3RvcmFnZSA9IG5ldyBTdG9yYWdlSGVscGVyKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTdG9yYWdlOyJdLCJwcmVFeGlzdGluZ0NvbW1lbnQiOiIvLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENKd2NtOXFaV04wY3k5emRYQmxjbVJ5YjI1bEwzTnlZeTlxY3k5aGNIQXVhbk1pTENKd2NtOXFaV04wY3k5emRYQmxjbVJ5YjI1bEwzTnlZeTlxY3k5allYSjBMbXB6SWl3aWNISnZhbVZqZEhNdmMzVndaWEprY205dVpTOXpjbU12YW5NdlptVjBZMmd1YW5NaUxDSndjbTlxWldOMGN5OXpkWEJsY21SeWIyNWxMM055WXk5cWN5OXRiMlJoYkM1cWN5SXNJbkJ5YjJwbFkzUnpMM04xY0dWeVpISnZibVV2YzNKakwycHpMM0psYm1SbGNpNXFjeUlzSW5CeWIycGxZM1J6TDNOMWNHVnlaSEp2Ym1VdmMzSmpMMnB6TDNOMGIzSmhaMlZJWld4d1pYSXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN096dEJRMEZCT3p0QlFVTkJPenRCUVVOQk96dEJRVU5CT3p0QlFVTkJPenM3TzBGQlJVRXNTVUZCVFN4elFrRkJjMElzUjBGQlJ5eG5Ra0ZCTDBJN1FVRkRRU3hKUVVGSkxHdENRVUZyUWl4SFFVRkhMRWxCUVVrc1MwRkJTaXhEUVVGVkxITkNRVUZXTEVOQlFYcENPMEZCUlVFc1NVRkJUU3hSUVVGUkxFZEJRVWNzVVVGQlVTeERRVUZETEdGQlFWUXNRMEZCZFVJc1kwRkJka0lzUTBGQmFrSTdRVUZGUVN4MVFrRkJXU3c0UkVGQldpeEZRVU5ETEVsQlJFUXNRMEZGUXl4VlFVRlRMRkZCUVZRc1JVRkJiVUk3UVVGRGJFSXNUVUZCU1N4UlFVRlJMRU5CUVVNc1RVRkJWQ3hMUVVGdlFpeEhRVUY0UWl4RlFVRTJRanRCUVVNMVFpeEpRVUZCTEU5QlFVOHNRMEZCUXl4SFFVRlNMSGRFUVVFMFJDeFJRVUZSTEVOQlFVTXNUVUZCY2tVN1FVRkRRVHRCUVVOQk96dEJRVVZFTEVWQlFVRXNVVUZCVVN4RFFVRkRMRWxCUVZRc1IwRkRReXhKUVVSRUxFTkJRMDBzWjBKQlFXZENPMEZCUVVFc1VVRkJaQ3hSUVVGakxGRkJRV1FzVVVGQll6czdRVUZEY2tJc09FSkJRVkVzUjBGQlVpeERRVUZaTEZWQlFWb3NSVUZCZDBJc1VVRkJlRUk3TzBGQlEwRXNTVUZCUVN4UlFVRlJMRU5CUVVNc1lVRkJWQ3hEUVVGMVFpeHJRa0ZCZGtJN1FVRkRRU3hIUVVwRU8wRkJTMEVzUTBGaVJpeFhRV1ZQTEZWQlFWTXNSMEZCVkN4RlFVRmpPMEZCUTNCQ0xFVkJRVUVzVDBGQlR5eERRVUZETEVkQlFWSXNRMEZCV1N4cFFrRkJXaXhGUVVFclFpeEhRVUV2UWp0QlFVTkJMRU5CYWtKRU8wRkJiVUpCTEZGQlFWRXNRMEZCUXl4blFrRkJWQ3hEUVVFd1FpeFBRVUV4UWl4RlFVRnRReXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU0zUXl4TlFVRk5MRTFCUVUwc1IwRkJSeXhMUVVGTExFTkJRVU1zVFVGQmNrSTdPMEZCUlVFc1RVRkJTU3hOUVVGTkxFTkJRVU1zVTBGQlVDeERRVUZwUWl4UlFVRnFRaXhEUVVFd1FpeGhRVUV4UWl4RFFVRktMRVZCUVRoRE8wRkJRemRETEdkRFFVRnBRaXhOUVVGcVFqdEJRVU5CTzBGQlEwRTdPMEZCUlVRc1RVRkJTU3hOUVVGTkxFTkJRVU1zVTBGQlVDeERRVUZwUWl4UlFVRnFRaXhEUVVFd1FpeE5RVUV4UWl4RFFVRktMRVZCUVhWRE8wRkJRM1JETzBGQlEwRXNORUpCUVZjc2QwSkJRV0VzZVVKQlFXSXNSVUZCTmtJc01FSkJRVkVzUjBGQlVpeERRVUZaTEZWQlFWb3NRMEZCTjBJc1EwRkJXRHRCUVVOQk96dEJRVVZFTEUxQlFVa3NUVUZCVFN4RFFVRkRMRk5CUVZBc1EwRkJhVUlzVVVGQmFrSXNRMEZCTUVJc1kwRkJNVUlzUTBGQlNpeEZRVUVyUXp0QlFVTTVRenRCUVVOQk96dEJRVVZFTEUxQlFVa3NUVUZCVFN4RFFVRkRMRk5CUVZBc1EwRkJhVUlzVVVGQmFrSXNRMEZCTUVJc1YwRkJNVUlzUTBGQlNpeEZRVUUwUXp0QlFVTXpReXc0UWtGQlVTeEhRVUZTTEVOQlFWa3NUVUZCV2l4RlFVRnZRaXhGUVVGd1FqczdRVUZEUVN3MFFrRkJWeXhGUVVGWU8wRkJRMEU3UVVGRFFUczdRVUZGUkN4TlFVRkpMRTFCUVUwc1EwRkJReXhUUVVGUUxFTkJRV2xDTEZGQlFXcENMRU5CUVRCQ0xGbEJRVEZDTEVOQlFVb3NSVUZCTmtNN1FVRkROVU1zU1VGQlFTeExRVUZMTEVOQlFVTXNZMEZCVGp0QlFVTkJPenRCUVVWRUxFMUJRVWtzVFVGQlRTeERRVUZETEZOQlFWQXNRMEZCYVVJc1VVRkJha0lzUTBGQk1FSXNkMEpCUVRGQ0xFTkJRVW9zUlVGQmVVUTdRVUZEZUVRc1NVRkJRU3hMUVVGTExFTkJRVU1zWTBGQlRqdEJRVU5CTEhGRFFVRnpRaXhOUVVGMFFqdEJRVU5CTERSQ1FVRlhMSGRDUVVGaExIbENRVUZpTEVWQlFUWkNMREJDUVVGUkxFZEJRVklzUTBGQldTeFZRVUZhTEVOQlFUZENMRU5CUVZnN1FVRkRRVHRCUVVWRUxFTkJha05FTzBGQmJVTkJMRkZCUVZFc1EwRkJReXhuUWtGQlZDeERRVUV3UWl4elFrRkJNVUlzUlVGQmEwUXNXVUZCVFR0QlFVTjJSQ3hOUVVGTkxFMUJRVTBzUjBGQlJ5eFJRVUZSTEVOQlFVTXNZVUZCVkN4RFFVRjFRaXh0UWtGQmRrSXNRMEZCWmp0QlFVTkJMRGhDUVVGbExEQkNRVUZSTEVkQlFWSXNRMEZCV1N4VlFVRmFMRU5CUVdZN1FVRkRRVHRCUVVOQkxFVkJRVUVzVFVGQlRTeERRVUZETEZOQlFWQXNRMEZCYVVJc1IwRkJha0lzUTBGQmNVSXNVVUZCY2tJN1FVRkRRU3hEUVV4RU8wRkJUMEVzVVVGQlVTeERRVUZETEdkQ1FVRlVMRU5CUVRCQ0xGRkJRVEZDTEVWQlFXOURMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRemxETEcxRFFVRnpRaXhMUVVGTExFTkJRVU1zVFVGQk5VSTdRVUZEUVN3d1FrRkJWeXgzUWtGQllTeDVRa0ZCWWl4RlFVRTJRaXd3UWtGQlVTeEhRVUZTTEVOQlFWa3NWVUZCV2l4RFFVRTNRaXhEUVVGWU8wRkJRMEVzUTBGSVJEdEJRVXRCTEVOQlFVTXNRMEZCUXl4UlFVRkVMRU5CUVVRc1EwRkJXU3hMUVVGYUxFTkJRV3RDTEZsQlFWVTdRVUZETVVJc1JVRkJRU3hEUVVGRExFTkJRVU1zWlVGQlJDeERRVUZFTEVOQlFXMUNMRmRCUVc1Q08wRkJRMFFzUTBGR1JEczdPenM3T3pzN096dEJRemRGUVRzN096dEJRVVZQTEVsQlFVMHNXVUZCV1N4SFFVRkhMRk5CUVdZc1dVRkJaU3hIUVVGTk8wRkJRMnBETEUxQlFVMHNTMEZCU3l4SFFVRkhMRkZCUVZFc1EwRkJReXhoUVVGVUxFTkJRWFZDTEdOQlFYWkNMRU5CUVdRN08wRkJRMEVzVFVGQlRTeFRRVUZUTEVkQlFVY3NNRUpCUVZFc1IwRkJVaXhEUVVGWkxFMUJRVm9zUTBGQmJFSTdPMEZCUlVFc1RVRkJTU3hEUVVGRExGTkJRVVFzU1VGQll5eERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRlFMRU5CUVZrc1UwRkJXaXhGUVVGMVFpeE5RVUV4UXl4RlFVRnJSRHRCUVVOcVJDeEpRVUZCTEV0QlFVc3NRMEZCUXl4VFFVRk9MRWRCUVd0Q0xFTkJRV3hDTzBGQlEwRXNWMEZCVHl4RlFVRlFPMEZCUTBFN08wRkJSVVFzUlVGQlFTeExRVUZMTEVOQlFVTXNVMEZCVGl4SFFVRnJRaXhOUVVGTkxFTkJRVU1zVFVGQlVDeERRVUZqTEZOQlFXUXNSVUZCZVVJc1RVRkJla0lzUTBGQlowTXNWVUZCUXl4SFFVRkVMRVZCUVUwc1IwRkJUanRCUVVGQkxGZEJRV01zUTBGQlF5eEhRVUZFTEVkQlFVOHNRMEZCUXl4SFFVRjBRanRCUVVGQkxFZEJRV2hETEVOQlFXeENPMEZCUlVFc1UwRkJUeXhUUVVGUU8wRkJRMEVzUTBGYVRUczdPenRCUVdOQkxFbEJRVTBzV1VGQldTeEhRVUZITEZOQlFXWXNXVUZCWlN4RFFVRkRMRk5CUVVRc1JVRkJXU3hSUVVGYUxFVkJRWGxDTzBGQlEzQkVMRk5CUVU4c1RVRkJUU3hEUVVGRExFbEJRVkFzUTBGQldTeFRRVUZhTEVWQlFYVkNMRWRCUVhaQ0xFTkJRVEpDTEZWQlFVRXNSVUZCUlN4RlFVRkpPMEZCUTNaRExGZEJRVThzVVVGQlVTeERRVUZETEUxQlFWUXNRMEZCWjBJc1ZVRkJRU3hQUVVGUExFVkJRVWs3UVVGRGFrTXNWVUZCU1N4UFFVRlBMRU5CUVVNc1JVRkJVaXhKUVVGakxFVkJRV3hDTEVWQlFYTkNPMEZCUTNKQ0xGRkJRVUVzVDBGQlR5eERRVUZETEV0QlFWSXNSMEZCWjBJc1UwRkJVeXhEUVVGRExFVkJRVVFzUTBGQmVrSTdRVUZEUVN4bFFVRlBMRTlCUVZBN1FVRkRRVHRCUVVORUxFdEJURTBzUlVGTFNpeERRVXhKTEVOQlFWQTdRVUZOUVN4SFFWQk5MRU5CUVZBN1FVRlJRU3hEUVZSTk96czdPMEZCVjBFc1NVRkJUU3huUWtGQlowSXNSMEZCUnl4VFFVRnVRaXhuUWtGQmJVSXNRMEZCUXl4TlFVRkVMRVZCUVZrN1FVRkRNME1zVFVGQlRTeEpRVUZKTEVkQlFVY3NXVUZCV1N4RlFVRjZRanRCUVVOQkxFMUJRVTBzVTBGQlV5eEhRVUZITEUxQlFVMHNRMEZCUXl4WlFVRlFMRU5CUVc5Q0xGTkJRWEJDTEVOQlFXeENPenRCUVVOQkxFMUJRVTBzV1VGQldTeEhRVUZITERCQ1FVRlJMRWRCUVZJc1EwRkJXU3hWUVVGYUxFTkJRWEpDT3p0QlFVTkJMRTFCUVUwc1lVRkJZU3hIUVVGSExGbEJRVmtzUTBGQlF5eE5RVUZpTEVOQlFXOUNMRlZCUVVFc1QwRkJUenRCUVVGQkxGZEJRVWtzVDBGQlR5eERRVUZETEVWQlFWSXNTVUZCWXl4VFFVRnNRanRCUVVGQkxFZEJRVE5DTEVWQlFYZEVMRU5CUVhoRUxFTkJRWFJDT3p0QlFVVkJMRTFCUVVrc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eEZRVUZtTEVOQlFWSXNSVUZCTkVJN1FVRkRNMElzU1VGQlFTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRVZCUVdZc1EwRkJTanRCUVVOQkxFZEJSa1FzVFVGRlR6dEJRVU5PTEVsQlFVRXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhGUVVGbUxFTkJRVW9zUjBGQmVVSXNRMEZCZWtJN1FVRkRRVHM3UVVGRlJDdzBRa0ZCVVN4SFFVRlNMRU5CUVZrc1RVRkJXaXhGUVVGdlFpeEpRVUZ3UWpzN1FVRkRRU3hGUVVGQkxGbEJRVms3UVVGRFdpeERRV1JOT3pzN08wRkJaMEpCTEVsQlFVMHNjVUpCUVhGQ0xFZEJRVWNzVTBGQmVFSXNjVUpCUVhkQ0xFTkJRVU1zVFVGQlJDeEZRVUZaTzBGQlEyaEVMRTFCUVUwc1NVRkJTU3hIUVVGSExGbEJRVmtzUlVGQmVrSTdRVUZEUVN4TlFVRk5MRk5CUVZNc1IwRkJSeXhOUVVGTkxFTkJRVU1zV1VGQlVDeERRVUZ2UWl4VFFVRndRaXhEUVVGc1FqczdRVUZEUVN4TlFVRk5MRmxCUVZrc1IwRkJSeXd3UWtGQlVTeEhRVUZTTEVOQlFWa3NWVUZCV2l4RFFVRnlRanM3UVVGRFFTeE5RVUZOTEdGQlFXRXNSMEZCUnl4WlFVRlpMRU5CUVVNc1RVRkJZaXhEUVVGdlFpeFZRVUZCTEU5QlFVODdRVUZCUVN4WFFVRkpMRTlCUVU4c1EwRkJReXhGUVVGU0xFbEJRV01zVTBGQmJFSTdRVUZCUVN4SFFVRXpRaXhGUVVGM1JDeERRVUY0UkN4RFFVRjBRanM3UVVGRlFTeE5RVUZKTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1JVRkJaaXhEUVVGS0xFbEJRVEJDTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1JVRkJaaXhEUVVGS0xFZEJRWGxDTEVOQlFYWkVMRVZCUVRCRU8wRkJRM3BFTEVsQlFVRXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhGUVVGbUxFTkJRVW83UVVGRFFTeEhRVVpFTEUxQlJVODdRVUZEVGl4SlFVRkJMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUlVGQlppeERRVUZLTEVkQlFYbENMRU5CUVhwQ08wRkJRMEU3TzBGQlJVUXNORUpCUVZFc1IwRkJVaXhEUVVGWkxFMUJRVm9zUlVGQmIwSXNTVUZCY0VJN08wRkJRMEVzUlVGQlFTeFpRVUZaTzBGQlExb3NRMEZrVFRzN096dEJRV2RDUVN4SlFVRk5MSEZDUVVGeFFpeEhRVUZITEZOQlFYaENMSEZDUVVGM1FpeERRVUZETEUxQlFVUXNSVUZCV1R0QlFVTm9SQ3hOUVVGTkxGZEJRVmNzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRlNMRWRCUVdkQ0xFTkJRV2hDTEVkQlFXOUNMRU5CUVhCQ0xFZEJRWGRDTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVhCRU8wRkJRMEVzVFVGQlRTeFRRVUZUTEVkQlFVY3NUVUZCVFN4RFFVRkRMRlZCUVZBc1EwRkJhMElzVTBGQmJFSXNSVUZCTmtJc1MwRkJMME03UVVGRFFTeE5RVUZOTEVsQlFVa3NSMEZCUnl4WlFVRlpMRVZCUVhwQ096dEJRVU5CTEUxQlFVMHNXVUZCV1N4SFFVRkhMREJDUVVGUkxFZEJRVklzUTBGQldTeFZRVUZhTEVOQlFYSkNPenRCUVVOQkxFMUJRVTBzWVVGQllTeEhRVUZITEZsQlFWa3NRMEZCUXl4TlFVRmlMRU5CUVc5Q0xGVkJRVUVzVDBGQlR6dEJRVUZCTEZkQlFVa3NUMEZCVHl4RFFVRkRMRVZCUVZJc1NVRkJZeXhUUVVGc1FqdEJRVUZCTEVkQlFUTkNMRVZCUVhkRUxFTkJRWGhFTEVOQlFYUkNPenRCUVVWQkxFMUJRVWtzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4RlFVRm1MRU5CUVZJc1JVRkJORUk3UVVGRE0wSXNTVUZCUVN4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFVkJRV1lzUTBGQlNpeEhRVUY1UWl4WFFVRjZRanRCUVVOQk96dEJRVVZFTERSQ1FVRlJMRWRCUVZJc1EwRkJXU3hOUVVGYUxFVkJRVzlDTEVsQlFYQkNPenRCUVVOQkxFVkJRVUVzV1VGQldUdEJRVU5hTEVOQllrMDdPenM3UVVGbFFTeEpRVUZOTEhGQ1FVRnhRaXhIUVVGSExGTkJRWGhDTEhGQ1FVRjNRaXhEUVVGRExFMUJRVVFzUlVGQldUdEJRVU5vUkN4TlFVRk5MRWxCUVVrc1IwRkJSeXhaUVVGWkxFVkJRWHBDTzBGQlEwRXNUVUZCVFN4VFFVRlRMRWRCUVVjc1RVRkJUU3hEUVVGRExGbEJRVkFzUTBGQmIwSXNVMEZCY0VJc1EwRkJiRUk3UVVGRlFTeFRRVUZQTEVsQlFVa3NRMEZCUXl4VFFVRkVMRU5CUVZnN08wRkJSVUVzTkVKQlFWRXNSMEZCVWl4RFFVRlpMRTFCUVZvc1JVRkJiMElzU1VGQmNFSTdRVUZEUVN4RFFWQk5PenM3TzBGQlUwRXNTVUZCVFN4WFFVRlhMRWRCUVVjc1UwRkJaQ3hYUVVGakxFZEJRVTA3UVVGRGFFTXNVMEZCVHl4WlFVRlpMRU5CUVVNc1dVRkJXU3hGUVVGaUxFVkJRV2xDTERCQ1FVRlJMRWRCUVZJc1EwRkJXU3hWUVVGYUxFTkJRV3BDTEVOQlFWb3NRMEZEU2l4SFFVUkpMRU5CUTBFc1ZVRkJRU3hQUVVGUE8wRkJRVUVzVjBGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4TFFVRlVMRWRCUVdsQ0xFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFUbENPMEZCUVVFc1IwRkVVQ3hGUVVWS0xFMUJSa2tzUTBGRlJ5eFZRVUZETEVkQlFVUXNSVUZCVFN4SFFVRk9PMEZCUVVFc1YwRkJZeXhIUVVGSExFZEJRVWNzUjBGQmNFSTdRVUZCUVN4SFFVWklMRU5CUVZBN1FVRkhRU3hEUVVwTk96czdPenM3T3pzN096czdRVU51UmxBc1NVRkJUU3hYUVVGWExFZEJRVWNzVTBGQlpDeFhRVUZqTEVOQlFVTXNSMEZCUkN4RlFVRlRPMEZCUXpWQ0xGTkJRVThzUzBGQlN5eERRVUZETEVkQlFVUXNRMEZCV2p0QlFVTkJMRU5CUmtRN08yVkJTV1VzVnpzN096czdPenM3T3pzN1FVTktaanM3UVVGRlFTeEpRVUZOTEV0QlFVc3NSMEZCUnl4UlFVRlJMRU5CUVVNc1lVRkJWQ3hEUVVGMVFpeFJRVUYyUWl4RFFVRmtPenRCUVVWUExFbEJRVTBzWjBKQlFXZENMRWRCUVVjc1UwRkJia0lzWjBKQlFXMUNMRWRCUVUwN1FVRkRja01zUlVGQlFTeExRVUZMTEVOQlFVTXNVMEZCVGl4RFFVRm5RaXhIUVVGb1FpeERRVUZ2UWl4TlFVRndRanRCUVVOQkxFTkJSazA3T3pzN1FVRkpRU3hKUVVGTkxHbENRVUZwUWl4SFFVRkhMRk5CUVhCQ0xHbENRVUZ2UWl4SFFVRk5PMEZCUTNSRExFVkJRVUVzUzBGQlN5eERRVUZETEZOQlFVNHNRMEZCWjBJc1RVRkJhRUlzUTBGQmRVSXNUVUZCZGtJN1FVRkRRU3hEUVVaTk96czdPenM3T3pzN096czdRVU5TVURzN1FVRkZRU3hKUVVGTkxHVkJRV1VzUjBGQlJ5eFRRVUZzUWl4bFFVRnJRaXhEUVVGRExFOUJRVVFzUlVGQk5rSTdRVUZCUVN4TlFVRnVRaXhUUVVGdFFpeDFSVUZCVUN4RlFVRlBPMEZCUTNCRUxFMUJRVTBzUlVGQlJTeEhRVUZITEZGQlFWRXNRMEZCUXl4aFFVRlVMRU5CUVhWQ0xFOUJRWFpDTEVOQlFWZzdPMEZCUTBFc1RVRkJTU3hUUVVGS0xFVkJRV1U3UVVGRFpDeEpRVUZCTEVWQlFVVXNRMEZCUXl4VFFVRklMRU5CUVdFc1IwRkJZaXhEUVVGcFFpeFRRVUZxUWp0QlFVTkJPenRCUVVWRUxGTkJRVThzUlVGQlVEdEJRVU5CTEVOQlVFUTdPMEZCVTBFc1NVRkJUU3gxUWtGQmRVSXNSMEZCUnl4VFFVRXhRaXgxUWtGQk1FSXNRMEZCUXl4UlFVRkVMRVZCUVZjc1lVRkJXQ3hGUVVFMlFqdEJRVU0xUkN4RlFVRkJMRkZCUVZFc1EwRkJReXhQUVVGVUxFTkJRV2xDTEZWQlFVRXNUMEZCVHl4RlFVRkpPMEZCUXpOQ0xFbEJRVUVzWVVGQllTeERRVUZETEZkQlFXUXNRMEZCTUVJc1QwRkJNVUk3UVVGRFFTeEhRVVpFTzBGQlIwRXNRMEZLUkRzN1FVRk5RU3hKUVVGTkxHbENRVUZwUWl4SFFVRkhMRk5CUVhCQ0xHbENRVUZ2UWl4UFFVRXdSRHRCUVVGQkxFMUJRWFpFTEZGQlFYVkVMRkZCUVhaRUxGRkJRWFZFTzBGQlFVRXNUVUZCTjBNc1YwRkJOa01zVVVGQk4wTXNWMEZCTmtNN1FVRkJRU3hOUVVGb1F5eEZRVUZuUXl4UlFVRm9ReXhGUVVGblF6dEJRVUZCTEUxQlFUVkNMRTlCUVRSQ0xGRkJRVFZDTEU5QlFUUkNPMEZCUVVFc1RVRkJia0lzUzBGQmJVSXNVVUZCYmtJc1MwRkJiVUk3UVVGQlFTeE5RVUZhTEV0QlFWa3NVVUZCV2l4TFFVRlpPMEZCUlc1R0xFMUJRVTBzUjBGQlJ5eEhRVUZITEdWQlFXVXNRMEZCUXl4TFFVRkVMRVZCUVZFc1QwRkJVaXhEUVVFelFqdEJRVU5CTEUxQlFVMHNWMEZCVnl4SFFVRkhMR1ZCUVdVc1EwRkJReXhMUVVGRUxFVkJRVkVzWTBGQlVpeERRVUZ1UXp0QlFVTkJMRTFCUVUwc1owSkJRV2RDTEVkQlFVY3NaVUZCWlN4RFFVRkRMRXRCUVVRc1JVRkJVU3hsUVVGU0xFTkJRWGhETzBGQlEwRXNUVUZCVFN4WlFVRlpMRWRCUVVjc1pVRkJaU3hEUVVGRExFdEJRVVFzUlVGQlVTeGxRVUZTTEVOQlFYQkRPMEZCUTBFc1RVRkJUU3haUVVGWkxFZEJRVWNzWlVGQlpTeERRVUZETEV0QlFVUXNSVUZCVVN4UFFVRlNMRU5CUVhCRE8wRkJRMEVzVFVGQlRTeGxRVUZsTEVkQlFVY3NaVUZCWlN4RFFVRkRMRTFCUVVRc1JVRkJVeXh0UWtGQlZDeERRVUYyUXp0QlFVTkJMRTFCUVUwc2IwSkJRVzlDTEVkQlFVY3NaVUZCWlN4RFFVRkRMRTFCUVVRc1JVRkJVeXgzUWtGQlZDeERRVUUxUXp0QlFVTkJMRTFCUVUwc2EwSkJRV3RDTEVkQlFVY3NaVUZCWlN4RFFVRkRMRWRCUVVRc1JVRkJUU3h4UWtGQlRpeERRVUV4UXp0QlFVTkJMRTFCUVUwc1kwRkJZeXhIUVVGSExHVkJRV1VzUTBGQlF5eExRVUZFTEVWQlFWRXNhVUpCUVZJc1EwRkJkRU03UVVGRFFTeE5RVUZOTEZsQlFWa3NSMEZCUnl4bFFVRmxMRU5CUVVNc1NVRkJSQ3hGUVVGUExFOUJRVkFzUTBGQmNFTTdRVUZEUVN4TlFVRk5MRmxCUVZrc1IwRkJSeXhsUVVGbExFTkJRVU1zUzBGQlJDeEZRVUZSTEU5QlFWSXNRMEZCY0VNN1FVRkRRU3hOUVVGTkxGTkJRVk1zUjBGQlJ5eGxRVUZsTEVOQlFVTXNVVUZCUkN4RlFVRlhMR0ZCUVZnc1EwRkJha003UVVGRlFTeEZRVUZCTEdWQlFXVXNRMEZCUXl4VFFVRm9RaXhIUVVFMFFpeE5RVUUxUWp0QlFVTkJMRVZCUVVFc1UwRkJVeXhEUVVGRExGTkJRVllzUjBGQmMwSXNaVUZCZEVJN1FVRkRRU3hGUVVGQkxHOUNRVUZ2UWl4RFFVRkRMRk5CUVhKQ0xFZEJRV2xETEV0QlFXcERPMEZCUlVFc1JVRkJRU3haUVVGWkxFTkJRVU1zV1VGQllpeERRVUV3UWl4TFFVRXhRaXhGUVVGcFF5eFBRVUZxUXp0QlFVTkJMRVZCUVVFc1UwRkJVeXhEUVVGRExGbEJRVllzUTBGQmRVSXNVMEZCZGtJc1JVRkJhME1zUlVGQmJFTTdRVUZEUVN4RlFVRkJMRk5CUVZNc1EwRkJReXhUUVVGV0xFTkJRVzlDTEVkQlFYQkNMRU5CUVhkQ0xFdEJRWGhDTzBGQlEwRXNSVUZCUVN4VFFVRlRMRU5CUVVNc1UwRkJWaXhEUVVGdlFpeEhRVUZ3UWl4RFFVRjNRaXhoUVVGNFFqdEJRVU5CTEVWQlFVRXNXVUZCV1N4RFFVRkRMRk5CUVdJc1IwRkJlVUlzUzBGQmVrSTdRVUZEUVN4RlFVRkJMRmxCUVZrc1EwRkJReXhUUVVGaUxFZEJRWGxDTEZGQlFWRXNSMEZCUnl4TFFVRndRenRCUVVWQkxFVkJRVUVzUjBGQlJ5eERRVUZETEZkQlFVb3NRMEZCWjBJc1YwRkJhRUk3UVVGRFFTeEZRVUZCTEZsQlFWa3NRMEZCUXl4WFFVRmlMRU5CUVhsQ0xGbEJRWHBDTzBGQlJVRXNUVUZCVFN4WFFVRlhMRWRCUVVjc1EwRkJReXhuUWtGQlJDeEZRVUZ0UWl4clFrRkJia0lzUlVGQmRVTXNZMEZCZGtNc1EwRkJjRUk3UVVGRFFTeE5RVUZOTEdkQ1FVRm5RaXhIUVVGSExFTkJRVU1zV1VGQlJDeEZRVUZsTEdWQlFXWXNSVUZCWjBNc2IwSkJRV2hETEVOQlFYcENPMEZCUTBFc1RVRkJUU3hqUVVGakxFZEJRVWNzUTBGQlF5eFpRVUZFTEVWQlFXVXNXVUZCWml4RlFVRTJRaXhUUVVFM1FpeERRVUYyUWp0QlFVVkJMRVZCUVVFc2RVSkJRWFZDTEVOQlFVTXNWMEZCUkN4RlFVRmpMRmRCUVdRc1EwRkJka0k3UVVGRFFTeEZRVUZCTEhWQ1FVRjFRaXhEUVVGRExHZENRVUZFTEVWQlFXMUNMR2RDUVVGdVFpeERRVUYyUWp0QlFVTkJMRVZCUVVFc2RVSkJRWFZDTEVOQlFVTXNZMEZCUkN4RlFVRnBRaXhqUVVGcVFpeERRVUYyUWp0QlFVVkJMRk5CUVU4c1IwRkJVRHRCUVVOQkxFTkJkRU5FT3p0QlFYZERRU3hKUVVGTkxHTkJRV01zUjBGQlJ5eFRRVUZxUWl4alFVRnBRaXhSUVVGdlJEdEJRVUZCTEUxQlFXcEVMRVZCUVdsRUxGTkJRV3BFTEVWQlFXbEVPMEZCUVVFc1RVRkJOME1zUzBGQk5rTXNVMEZCTjBNc1MwRkJOa003UVVGQlFTeE5RVUYwUXl4UFFVRnpReXhUUVVGMFF5eFBRVUZ6UXp0QlFVRkJMRTFCUVRkQ0xFdEJRVFpDTEZOQlFUZENMRXRCUVRaQ08wRkJRVUVzVFVGQmRFSXNVVUZCYzBJc1UwRkJkRUlzVVVGQmMwSTdRVUZCUVN4TlFVRmFMRXRCUVZrc1UwRkJXaXhMUVVGWk8wRkJSVEZGTEUxQlFVMHNVVUZCVVN4SFFVRkhMR1ZCUVdVc1EwRkJReXhKUVVGRUxFTkJRV2hETzBGQlEwRXNUVUZCVFN4WFFVRlhMRWRCUVVjc1pVRkJaU3hEUVVGRExFdEJRVVFzUlVGQlVTeHBRa0ZCVWl4RFFVRnVRenRCUVVOQkxFMUJRVTBzWTBGQll5eEhRVUZITEdWQlFXVXNRMEZCUXl4UFFVRkVMRU5CUVhSRE8wRkJRMEVzVFVGQlRTeFZRVUZWTEVkQlFVY3NaVUZCWlN4RFFVRkRMRXRCUVVRc1JVRkJVU3gzUWtGQlVpeERRVUZzUXp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hIUVVGSExHVkJRV1VzUTBGQlF5eExRVUZFTEVWQlFWRXNjVUpCUVZJc1EwRkJiRU03UVVGRFFTeE5RVUZOTEZsQlFWa3NSMEZCUnl4bFFVRmxMRU5CUVVNc1NVRkJSQ3hGUVVGUExIVkNRVUZRTEVOQlFYQkRPMEZCUTBFc1RVRkJUU3haUVVGWkxFZEJRVWNzWlVGQlpTeERRVUZETEUxQlFVUXNSVUZCVXl4MVFrRkJWQ3hEUVVGd1F6dEJRVU5CTEUxQlFVMHNaVUZCWlN4SFFVRkhMR1ZCUVdVc1EwRkJReXhQUVVGRUxFVkJRVlVzTUVKQlFWWXNRMEZCZGtNN1FVRkRRU3hOUVVGTkxHbENRVUZwUWl4SFFVRkhMR1ZCUVdVc1EwRkJReXhOUVVGRUxFVkJRVk1zZFVKQlFWUXNRMEZCZWtNN1FVRkRRU3hOUVVGTkxHRkJRV0VzUjBGQlJ5eGxRVUZsTEVOQlFVTXNVVUZCUkN4RlFVRlhMSGRDUVVGWUxFTkJRWEpETzBGQlJVRXNSVUZCUVN4alFVRmpMRU5CUVVNc1dVRkJaaXhEUVVFMFFpeE5RVUUxUWl4RlFVRnZReXhSUVVGd1F6dEJRVU5CTEVWQlFVRXNZMEZCWXl4RFFVRkRMRmxCUVdZc1EwRkJORUlzVFVGQk5VSXNSVUZCYjBNc1UwRkJjRU03UVVGRFFTeEZRVUZCTEdOQlFXTXNRMEZCUXl4WlFVRm1MRU5CUVRSQ0xFOUJRVFZDTEVWQlFYRkRMRVZCUVhKRE8wRkJRMEVzUlVGQlFTeFZRVUZWTEVOQlFVTXNXVUZCV0N4RFFVRjNRaXhMUVVGNFFpeEZRVUVyUWl4UFFVRXZRanRCUVVOQkxFVkJRVUVzWlVGQlpTeERRVUZETEZsQlFXaENMRU5CUVRaQ0xGTkJRVGRDTEVWQlFYZERMRVZCUVhoRE8wRkJRMEVzUlVGQlFTeGhRVUZoTEVOQlFVTXNXVUZCWkN4RFFVRXlRaXhUUVVFelFpeEZRVUZ6UXl4RlFVRjBRenRCUVVOQkxFVkJRVUVzWlVGQlpTeERRVUZETEZsQlFXaENMRU5CUVRaQ0xFMUJRVGRDTEVWQlFYRkRMRkZCUVhKRE8wRkJRMEVzUlVGQlFTeGxRVUZsTEVOQlFVTXNXVUZCYUVJc1EwRkJOa0lzVFVGQk4wSXNSVUZCY1VNc1ZVRkJja003UVVGRFFTeEZRVUZCTEdWQlFXVXNRMEZCUXl4WlFVRm9RaXhEUVVFMlFpeFBRVUUzUWl4RlFVRnpReXhMUVVGMFF6dEJRVVZCTEVWQlFVRXNXVUZCV1N4RFFVRkRMRk5CUVdJc1IwRkJlVUlzUzBGQmVrSTdRVUZEUVN4RlFVRkJMRmxCUVZrc1EwRkJReXhUUVVGaUxFZEJRWGxDTEZGQlFWRXNSMEZCUnl4TFFVRndRenRCUVVOQkxFVkJRVUVzYVVKQlFXbENMRU5CUVVNc1UwRkJiRUlzWVVGQmFVTXNVVUZCYWtNc1UwRkJORU1zUTBGQlF5eExRVUZFTEVkQlFWTXNRMEZCUXl4TFFVRjBSRHRCUVVOQkxFVkJRVUVzWVVGQllTeERRVUZETEZOQlFXUXNSMEZCTUVJc1IwRkJNVUk3UVVGRlFTeE5RVUZOTEcxQ1FVRnRRaXhIUVVGSExFTkJRVU1zWTBGQlJDeEZRVUZwUWl4VlFVRnFRaXhGUVVFMlFpeFpRVUUzUWl4RlFVRXlReXhaUVVFelF5eEZRVUY1UkN4bFFVRjZSQ3hGUVVFd1JTeHBRa0ZCTVVVc1JVRkJOa1lzWVVGQk4wWXNRMEZCTlVJN1FVRkRRU3hGUVVGQkxIVkNRVUYxUWl4RFFVRkRMRzFDUVVGRUxFVkJRWE5DTEZkQlFYUkNMRU5CUVhaQ08wRkJSVUVzUlVGQlFTeFZRVUZWTEVOQlFVTXNWMEZCV0N4RFFVRjFRaXhWUVVGMlFqdEJRVU5CTEVWQlFVRXNVVUZCVVN4RFFVRkRMRmRCUVZRc1EwRkJjVUlzVjBGQmNrSTdRVUZGUVN4VFFVRlBMRkZCUVZBN1FVRkRRU3hEUVc1RFJEczdRVUZ4UTA4c1NVRkJUU3hqUVVGakxFZEJRVWNzVTBGQmFrSXNZMEZCYVVJc1EwRkJReXhSUVVGRUxFVkJRV003UVVGRE0wTXNUVUZCVFN4SlFVRkpMRWRCUVVjc1VVRkJVU3hEUVVGRExHTkJRVlFzUTBGQmQwSXNZMEZCZUVJc1EwRkJZanRCUVVWQkxFVkJRVUVzVVVGQlVTeERRVUZETEU5QlFWUXNRMEZCYVVJc1ZVRkJRU3hQUVVGUExFVkJRVWs3UVVGRE0wSXNTVUZCUVN4SlFVRkpMRU5CUVVNc1YwRkJUQ3hEUVVGcFFpeHBRa0ZCYVVJc1EwRkJReXhQUVVGRUxFTkJRV3hETzBGQlEwRXNSMEZHUkR0QlFVZEJMRU5CVGswN096czdRVUZSUVN4SlFVRk5MRlZCUVZVc1IwRkJSeXhUUVVGaUxGVkJRV0VzUTBGQlF5eFJRVUZFTEVWQlFXTTdRVUZEZGtNc1RVRkJUU3hKUVVGSkxFZEJRVWNzVVVGQlVTeERRVUZETEdGQlFWUXNRMEZCZFVJc1dVRkJka0lzUTBGQllqdEJRVU5CTEUxQlFVMHNVVUZCVVN4SFFVRkhMRkZCUVZFc1EwRkJReXhoUVVGVUxFTkJRWFZDTEdOQlFYWkNMRU5CUVdwQ08wRkJRMEVzVFVGQlRTeExRVUZMTEVkQlFVY3NVVUZCVVN4RFFVRkRMR0ZCUVZRc1EwRkJkVUlzWTBGQmRrSXNRMEZCWkRzN1FVRkZRU3hUUVVGUExFbEJRVWtzUTBGQlF5eFZRVUZhTEVWQlFYZENPMEZCUTNaQ0xFbEJRVUVzU1VGQlNTeERRVUZETEZkQlFVd3NRMEZCYVVJc1NVRkJTU3hEUVVGRExGVkJRWFJDTzBGQlEwRTdPMEZCUlVRc1RVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZrTEVWQlFYTkNPMEZCUTNKQ0xGZEJRVThzU1VGQlNTeERRVUZETEZOQlFVd3NRMEZCWlN4SFFVRm1MRU5CUVcxQ0xGbEJRVzVDTEVOQlFWQTdRVUZEUVN4SFFVWkVMRTFCUlU4N1FVRkRUaXhKUVVGQkxFbEJRVWtzUTBGQlF5eFRRVUZNTEVOQlFXVXNUVUZCWml4RFFVRnpRaXhaUVVGMFFqdEJRVU5CT3p0QlFVVkVMRTFCUVVrc1VVRkJTanRCUVVWQkxFVkJRVUVzVVVGQlVTeERRVUZETEU5QlFWUXNRMEZCYVVJc1ZVRkJRU3hQUVVGUExFVkJRVWs3UVVGRE0wSXNTVUZCUVN4UlFVRlJMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVzVDTzBGQlEwRXNTVUZCUVN4SlFVRkpMRU5CUVVNc1YwRkJUQ3hEUVVGcFFpeGpRVUZqTEVOQlFVTXNUMEZCUkN4RFFVRXZRanRCUVVOQkxFZEJTRVE3UVVGTFFTeEZRVUZCTEV0QlFVc3NRMEZCUXl4VFFVRk9MRzlDUVVFMFFpeFJRVUUxUWl4VFFVRjFReXgzUWtGQmRrTTdRVUZEUVN4RFFYWkNUVHM3T3p0QlFYbENRU3hKUVVGTkxHZENRVUZuUWl4SFFVRkhMRk5CUVc1Q0xHZENRVUZ0UWl4SFFVRk5PMEZCUTNKRExFMUJRVTBzU1VGQlNTeEhRVUZITEdWQlFXVXNRMEZCUXl4TlFVRkVMRVZCUVZNc1lVRkJWQ3hEUVVFMVFqdEJRVU5CTEVWQlFVRXNTVUZCU1N4RFFVRkRMRk5CUVV3c1EwRkJaU3hIUVVGbUxFTkJRVzFDTEU5QlFXNUNPMEZCUTBFc1JVRkJRU3hKUVVGSkxFTkJRVU1zVTBGQlRDeERRVUZsTEVkQlFXWXNRMEZCYlVJc1pVRkJia0k3UVVGRFFTeEZRVUZCTEVsQlFVa3NRMEZCUXl4VFFVRk1MRWRCUVdsQ0xHVkJRV3BDTzBGQlEwRXNSVUZCUVN4UlFVRlJMRU5CUVVNc1NVRkJWQ3hEUVVGakxGZEJRV1FzUTBGQk1FSXNTVUZCTVVJN1FVRkRRU3hGUVVGQkxGVkJRVlVzUTBGQlF5eFpRVUZOTzBGQlEyaENMRWxCUVVFc1VVRkJVU3hEUVVGRExFbEJRVlFzUTBGQll5eFhRVUZrTEVOQlFUQkNMRWxCUVRGQ08wRkJRMEVzUjBGR1V5eEZRVVZRTEVsQlJrOHNRMEZCVmp0QlFVZEJMRU5CVkUwN096czdPenM3T3pzN096dEJReTlJVUN4VFFVRlRMR0ZCUVZRc1IwRkJkMEk3UVVGRGRrSXNUMEZCU3l4UFFVRk1MRWRCUVdVc1dVRkJaanM3UVVGRlFTeFBRVUZMTEVkQlFVd3NSMEZCVnl4VlFVRkRMRWRCUVVRc1JVRkJVenRCUVVOdVFpeFhRVUZQTEVsQlFVa3NRMEZCUXl4TFFVRk1MRU5CUVZjc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNSMEZCY2tJc1EwRkJXQ3hEUVVGUU8wRkJRMEVzUjBGR1JEczdRVUZIUVN4UFFVRkxMRWRCUVV3c1IwRkJWeXhWUVVGRExFZEJRVVFzUlVGQlRTeExRVUZPTEVWQlFXZENPMEZCUXpGQ0xFbEJRVUVzV1VGQldTeERRVUZETEU5QlFXSXNRMEZCY1VJc1IwRkJja0lzUlVGQk1FSXNTVUZCU1N4RFFVRkRMRk5CUVV3c1EwRkJaU3hMUVVGbUxFTkJRVEZDTzBGQlEwRXNSMEZHUkRzN1FVRkhRU3hQUVVGTExFMUJRVXdzUjBGQll5eFZRVUZETEVkQlFVUXNSVUZCVXp0QlFVTjBRaXhKUVVGQkxGbEJRVmtzUTBGQlF5eFZRVUZpTEVOQlFYZENMRWRCUVhoQ08wRkJRMEVzUjBGR1JEdEJRVWRCT3p0QlFVVkVMRWxCUVUwc1QwRkJUeXhIUVVGSExFbEJRVWtzWVVGQlNpeEZRVUZvUWp0bFFVVmxMRThpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpaG1kVzVqZEdsdmJpZ3BlMloxYm1OMGFXOXVJSElvWlN4dUxIUXBlMloxYm1OMGFXOXVJRzhvYVN4bUtYdHBaaWdoYmx0cFhTbDdhV1lvSVdWYmFWMHBlM1poY2lCalBWd2lablZ1WTNScGIyNWNJajA5ZEhsd1pXOW1JSEpsY1hWcGNtVW1KbkpsY1hWcGNtVTdhV1lvSVdZbUptTXBjbVYwZFhKdUlHTW9hU3doTUNrN2FXWW9kU2x5WlhSMWNtNGdkU2hwTENFd0tUdDJZWElnWVQxdVpYY2dSWEp5YjNJb1hDSkRZVzV1YjNRZ1ptbHVaQ0J0YjJSMWJHVWdKMXdpSzJrclhDSW5YQ0lwTzNSb2NtOTNJR0V1WTI5a1pUMWNJazFQUkZWTVJWOU9UMVJmUms5VlRrUmNJaXhoZlhaaGNpQndQVzViYVYwOWUyVjRjRzl5ZEhNNmUzMTlPMlZiYVYxYk1GMHVZMkZzYkNod0xtVjRjRzl5ZEhNc1puVnVZM1JwYjI0b2NpbDdkbUZ5SUc0OVpWdHBYVnN4WFZ0eVhUdHlaWFIxY200Z2J5aHVmSHh5S1gwc2NDeHdMbVY0Y0c5eWRITXNjaXhsTEc0c2RDbDljbVYwZFhKdUlHNWJhVjB1Wlhod2IzSjBjMzFtYjNJb2RtRnlJSFU5WENKbWRXNWpkR2x2Ymx3aVBUMTBlWEJsYjJZZ2NtVnhkV2x5WlNZbWNtVnhkV2x5WlN4cFBUQTdhVHgwTG14bGJtZDBhRHRwS3lzcGJ5aDBXMmxkS1R0eVpYUjFjbTRnYjMxeVpYUjFjbTRnY24wcEtDa2lMQ0pwYlhCdmNuUWdVM1J2Y21GblpTQm1jbTl0SUNjdUwzTjBiM0poWjJWSVpXeHdaWEluTzF4eVhHNXBiWEJ2Y25RZ1oyVjBVSEp2WkhWamRITWdabkp2YlNBbkxpOW1aWFJqYUNjN1hISmNibWx0Y0c5eWRDQjdJSEpsYm1SbGNsQnliMlIxWTNSekxDQnlaVzVrWlhKRFlYSjBMQ0J5Wlc1a1pYSlRkV05qWlhOelRYTm5JSDBnWm5KdmJTQW5MaTl5Wlc1a1pYSW5PMXh5WEc1cGJYQnZjblFnZXlCblpYUkRZWEowVm1Gc2RXVXNJR0ZrWkZSdlEyRnlkRWhoYm1Sc1pYSXNJR2RsZEVOaGNuUkpkR1Z0Y3l3Z1kyaGhibWRsVUhKdlpIVmpkRkYxWVc1MGFYUjVMQ0J5WlcxdmRtVlFjbTlrZFdOMFJuSnZiVU5oY25RZ2ZTQm1jbTl0SUNjdUwyTmhjblFuTzF4eVhHNXBiWEJ2Y25RZ2V5QnRiMlJoYkU5d1pXNUlZVzVrYkdWeUxDQnRiMlJoYkVOc2IzTmxTR0Z1Wkd4bGNpQjlJR1p5YjIwZ0p5NHZiVzlrWVd3bk8xeHlYRzVjY2x4dVkyOXVjM1FnY0hKdlpIVmpkSE5TWldGa2VVVjJaVzUwVG1GdFpTQTlJQ2R3Y205a2RXTjBjMTl5WldGa2VTYzdYSEpjYm14bGRDQndjbTlrZFdOMGMxSmxZV1I1UlhabGJuUWdQU0J1WlhjZ1JYWmxiblFvY0hKdlpIVmpkSE5TWldGa2VVVjJaVzUwVG1GdFpTazdYSEpjYmx4eVhHNWpiMjV6ZENCallYSjBSbTl5YlNBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1dGIyUmhiRjlmWm05eWJTY3BPMXh5WEc1Y2NseHVaMlYwVUhKdlpIVmpkSE1vSjJoMGRIQnpPaTh2YlhrdGFuTnZiaTF6WlhKMlpYSXVkSGx3YVdOdlpHVXVZMjl0TDNadmNtOTBibWx4ZFdVdlptRnJaWE5sY25abGNpOWtZaWNwWEhKY2JpNTBhR1Z1S0Z4eVhHNWNkR1oxYm1OMGFXOXVLSEpsYzNCdmJuTmxLU0I3WEhKY2JseDBYSFJwWmlBb2NtVnpjRzl1YzJVdWMzUmhkSFZ6SUNFOVBTQXlNREFwSUh0Y2NseHVYSFJjZEZ4MFkyOXVjMjlzWlM1c2IyY29ZRXh2YjJ0eklHeHBhMlVnZEdobGNtVWdkMkZ6SUdFZ2NISnZZbXhsYlM0Z1UzUmhkSFZ6SUVOdlpHVTZJQ1I3Y21WemNHOXVjMlV1YzNSaGRIVnpmV0FwTzF4eVhHNWNkRngwWEhSeVpYUjFjbTQ3WEhKY2JseDBYSFI5WEhKY2JseHlYRzVjZEZ4MGNtVnpjRzl1YzJVdWFuTnZiaWdwWEhKY2JseDBYSFF1ZEdobGJpZ29lM0J5YjJSMVkzUnpmU2tnUFQ0Z2UxeHlYRzVjZEZ4MFhIUlRkRzl5WVdkbExuTmxkQ2duY0hKdlpIVmpkSE1uTENCd2NtOWtkV04wY3lrN1hISmNibHgwWEhSY2RHUnZZM1Z0Wlc1MExtUnBjM0JoZEdOb1JYWmxiblFvY0hKdlpIVmpkSE5TWldGa2VVVjJaVzUwS1R0Y2NseHVYSFJjZEgwcE8xeHlYRzVjZEgxY2NseHVYSFFwWEhKY2JpNWpZWFJqYUNobWRXNWpkR2x2YmlobGNuSXBJSHRjY2x4dVhIUmpiMjV6YjJ4bExteHZaeWduUm1WMFkyZ2dSWEp5YjNJZ09pMVRKeXdnWlhKeUtUdGNjbHh1ZlNrN1hISmNibHh5WEc1a2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUNobGRtVnVkQ2tnUFQ0Z2UxeHlYRzVjZEdOdmJuTjBJSFJoY21kbGRDQTlJR1YyWlc1MExuUmhjbWRsZER0Y2NseHVYSEpjYmx4MGFXWWdLSFJoY21kbGRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZrWkMxMGJ5MWpZWEowSnlrcElIdGNjbHh1WEhSY2RHRmtaRlJ2UTJGeWRFaGhibVJzWlhJb2RHRnlaMlYwS1R0Y2NseHVYSFJjZEhKbGJtUmxjbE4xWTJObGMzTk5jMmNvS1R0Y2NseHVYSFI5WEhKY2JseHlYRzVjZEdsbUlDaDBZWEpuWlhRdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGpZWEowSnlrcElIdGNjbHh1WEhSY2RHMXZaR0ZzVDNCbGJraGhibVJzWlhJb0tUdGNjbHh1WEhSY2RISmxibVJsY2tOaGNuUW9aMlYwUTJGeWRFbDBaVzF6S0dkbGRFTmhjblJXWVd4MVpTZ3BMQ0JUZEc5eVlXZGxMbWRsZENnbmNISnZaSFZqZEhNbktTa3BPMXh5WEc1Y2RIMWNjbHh1WEhKY2JseDBhV1lnS0hSaGNtZGxkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjIxdlpHRnNYMTlqYkc5elpTY3BLU0I3WEhKY2JseDBYSFJ0YjJSaGJFTnNiM05sU0dGdVpHeGxjaWdwTzF4eVhHNWNkSDFjY2x4dVhISmNibHgwYVdZZ0tIUmhjbWRsZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oyTnNaV0Z5TFdKMGJpY3BLU0I3WEhKY2JseDBYSFJUZEc5eVlXZGxMbk5sZENnblkyRnlkQ2NzSUh0OUtUdGNjbHh1WEhSY2RISmxibVJsY2tOaGNuUW9XMTBwTzF4eVhHNWNkRngwWjJWMFEyRnlkRlpoYkhWbEtDazdYSEpjYmx4MGZWeHlYRzVjY2x4dVhIUnBaaUFvZEdGeVoyVjBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzNWaWJXbDBMV0owYmljcEtTQjdYSEpjYmx4MFhIUmxkbVZ1ZEM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4eVhHNWNkSDFjY2x4dVhISmNibHgwYVdZZ0tIUmhjbWRsZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oyTmhjblF0YkdsemRGOWZhWFJsYlMxeVpXMXZkbVVuS1NrZ2UxeHlYRzVjZEZ4MFpYWmxiblF1Y0hKbGRtVnVkRVJsWm1GMWJIUW9LVHRjY2x4dVhIUmNkSEpsYlc5MlpWQnliMlIxWTNSR2NtOXRRMkZ5ZENoMFlYSm5aWFFwTzF4eVhHNWNkRngwY21WdVpHVnlRMkZ5ZENoblpYUkRZWEowU1hSbGJYTW9aMlYwUTJGeWRGWmhiSFZsS0Nrc0lGTjBiM0poWjJVdVoyVjBLQ2R3Y205a2RXTjBjeWNwS1NrN1hISmNibHgwZlZ4eVhHNWNjbHh1ZlNrN1hISmNibHh5WEc1a2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0hCeWIyUjFZM1J6VW1WaFpIbEZkbVZ1ZEU1aGJXVXNJQ2dwSUQwK0lIdGNjbHh1WEhSamIyNXpkQ0JzYjJGa1pYSWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY2pjSEp2Y0dWc2JHVnlMV3h2WVdSbGNpY3BPMXh5WEc1Y2RISmxibVJsY2xCeWIyUjFZM1J6S0ZOMGIzSmhaMlV1WjJWMEtDZHdjbTlrZFdOMGN5Y3BLVHRjY2x4dVhIUm5aWFJEWVhKMFZtRnNkV1VvS1R0Y2NseHVYSFJzYjJGa1pYSXVZMnhoYzNOTWFYTjBMbUZrWkNnbmFHbGtaR1Z1SnlrN1hISmNibjBwTzF4eVhHNWNjbHh1WTJGeWRFWnZjbTB1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJoaGJtZGxKeXdnS0dWMlpXNTBLU0E5UGlCN1hISmNibHgwWTJoaGJtZGxVSEp2WkhWamRGRjFZVzUwYVhSNUtHVjJaVzUwTG5SaGNtZGxkQ2s3WEhKY2JseDBjbVZ1WkdWeVEyRnlkQ2huWlhSRFlYSjBTWFJsYlhNb1oyVjBRMkZ5ZEZaaGJIVmxLQ2tzSUZOMGIzSmhaMlV1WjJWMEtDZHdjbTlrZFdOMGN5Y3BLU2s3WEhKY2JuMHBPMXh5WEc1Y2NseHVKQ2hrYjJOMWJXVnVkQ2t1Y21WaFpIa29ablZ1WTNScGIyNG9LWHRjY2x4dUlDQWtLRndpTG05M2JDMWpZWEp2ZFhObGJGd2lLUzV2ZDJ4RFlYSnZkWE5sYkNncE8xeHlYRzU5S1RzaUxDSnBiWEJ2Y25RZ1UzUnZjbUZuWlNCbWNtOXRJQ2N1TDNOMGIzSmhaMlZJWld4d1pYSW5PMXh5WEc1Y2NseHVaWGh3YjNKMElHTnZibk4wSUdkbGRFTmhjblJXWVd4MVpTQTlJQ2dwSUQwK0lIdGNjbHh1WEhSamIyNXpkQ0JzWVdKbGJDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWpZWEowWDE5c1lXSmxiQ2NwTzF4eVhHNWNkR052Ym5OMElHTmhjblJXWVd4MVpTQTlJRk4wYjNKaFoyVXVaMlYwS0NkallYSjBKeWs3WEhKY2JseHlYRzVjZEdsbUlDZ2hZMkZ5ZEZaaGJIVmxJSHg4SUNGUFltcGxZM1F1YTJWNWN5aGpZWEowVm1Gc2RXVXBMbXhsYm1kMGFDa2dlMXh5WEc1Y2RGeDBiR0ZpWld3dWFXNXVaWEpVWlhoMElEMGdNRHRjY2x4dVhIUmNkSEpsZEhWeWJpQjdmVHRjY2x4dVhIUjlYSEpjYmx4eVhHNWNkR3hoWW1Wc0xtbHVibVZ5VkdWNGRDQTlJRTlpYW1WamRDNTJZV3gxWlhNb1kyRnlkRlpoYkhWbEtTNXlaV1IxWTJVb0tHRmpZeXdnWTNWeUtTQTlQaUFyWVdOaklDc2dLMk4xY2lrN1hISmNibHh5WEc1Y2RISmxkSFZ5YmlCallYSjBWbUZzZFdVN1hISmNibjFjY2x4dVhISmNibVY0Y0c5eWRDQmpiMjV6ZENCblpYUkRZWEowU1hSbGJYTWdQU0FvWTJGeWRGWmhiSFZsTENCd2NtOWtkV04wY3lrZ1BUNGdlMXh5WEc1Y2RISmxkSFZ5YmlCUFltcGxZM1F1YTJWNWN5aGpZWEowVm1Gc2RXVXBMbTFoY0NocFpDQTlQaUI3WEhKY2JseDBYSFJ5WlhSMWNtNGdjSEp2WkhWamRITXVabWxzZEdWeUtIQnliMlIxWTNRZ1BUNGdlMXh5WEc1Y2RGeDBYSFJwWmlBb2NISnZaSFZqZEM1cFpDQTlQU0JwWkNrZ2UxeHlYRzVjZEZ4MFhIUmNkSEJ5YjJSMVkzUXVkRzkwWVd3Z1BTQmpZWEowVm1Gc2RXVmJhV1JkTzF4eVhHNWNkRngwWEhSY2RISmxkSFZ5YmlCd2NtOWtkV04wTzF4eVhHNWNkRngwWEhSOVhISmNibHgwWEhSOUtWc3dYVHRjY2x4dVhIUjlLVHRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdOdmJuTjBJR0ZrWkZSdlEyRnlkRWhoYm1Sc1pYSWdQU0FvZEdGeVoyVjBLU0E5UGlCN1hISmNibHgwWTI5dWMzUWdZMkZ5ZENBOUlHZGxkRU5oY25SV1lXeDFaU2dwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSSlpDQTlJSFJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRhV1FuS1R0Y2NseHVYSFJqYjI1emRDQndjbTlrZFdOMGMweHBjM1FnUFNCVGRHOXlZV2RsTG1kbGRDZ25jSEp2WkhWamRITW5LVHRjY2x4dVhIUmpiMjV6ZENCamFHOXpaVzVRY205a2RXTjBJRDBnY0hKdlpIVmpkSE5NYVhOMExtWnBiSFJsY2lobGJHVnRaVzUwSUQwK0lHVnNaVzFsYm5RdWFXUWdQVDBnY0hKdlpIVmpkRWxrS1Zzd1hUdGNjbHh1WEhKY2JseDBhV1lnS0dOaGNuUmJZMmh2YzJWdVVISnZaSFZqZEM1cFpGMHBJSHRjY2x4dVhIUmNkR05oY25SYlkyaHZjMlZ1VUhKdlpIVmpkQzVwWkYwcksxeHlYRzVjZEgwZ1pXeHpaU0I3WEhKY2JseDBYSFJqWVhKMFcyTm9iM05sYmxCeWIyUjFZM1F1YVdSZElEMGdNVHRjY2x4dVhIUjlYSEpjYmx4eVhHNWNkRk4wYjNKaFoyVXVjMlYwS0NkallYSjBKeXdnWTJGeWRDazdYSEpjYmx4MFoyVjBRMkZ5ZEZaaGJIVmxLQ2s3WEhKY2JuMWNjbHh1WEhKY2JtVjRjRzl5ZENCamIyNXpkQ0J5WlcxdmRtVkdjbTl0UTJGeWRFaGhibVJzWlhJZ1BTQW9kR0Z5WjJWMEtTQTlQaUI3WEhKY2JseDBZMjl1YzNRZ1kyRnlkQ0E5SUdkbGRFTmhjblJXWVd4MVpTZ3BPMXh5WEc1Y2RHTnZibk4wSUhCeWIyUjFZM1JKWkNBOUlIUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGFXUW5LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wYzB4cGMzUWdQU0JUZEc5eVlXZGxMbWRsZENnbmNISnZaSFZqZEhNbktUdGNjbHh1WEhSamIyNXpkQ0JqYUc5elpXNVFjbTlrZFdOMElEMGdjSEp2WkhWamRITk1hWE4wTG1acGJIUmxjaWhsYkdWdFpXNTBJRDArSUdWc1pXMWxiblF1YVdRZ1BUMGdjSEp2WkhWamRFbGtLVnN3WFR0Y2NseHVYSEpjYmx4MGFXWWdLR05oY25SYlkyaHZjMlZ1VUhKdlpIVmpkQzVwWkYwZ0ppWWdZMkZ5ZEZ0amFHOXpaVzVRY205a2RXTjBMbWxrWFNBK0lEQXBJSHRjY2x4dVhIUmNkR05oY25SYlkyaHZjMlZ1VUhKdlpIVmpkQzVwWkYwdExWeHlYRzVjZEgwZ1pXeHpaU0I3WEhKY2JseDBYSFJqWVhKMFcyTm9iM05sYmxCeWIyUjFZM1F1YVdSZElEMGdNRHRjY2x4dVhIUjlYSEpjYmx4eVhHNWNkRk4wYjNKaFoyVXVjMlYwS0NkallYSjBKeXdnWTJGeWRDazdYSEpjYmx4MFoyVjBRMkZ5ZEZaaGJIVmxLQ2s3WEhKY2JuMWNjbHh1WEhKY2JtVjRjRzl5ZENCamIyNXpkQ0JqYUdGdVoyVlFjbTlrZFdOMFVYVmhiblJwZEhrZ1BTQW9kR0Z5WjJWMEtTQTlQaUI3WEhKY2JseDBZMjl1YzNRZ2JtVjNVWFZoYm5ScGRIa2dQU0FyZEdGeVoyVjBMblpoYkhWbElEd2dNU0EvSURFZ09pQXJkR0Z5WjJWMExuWmhiSFZsTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSSlpDQTlJSFJoY21kbGRDNWhkSFJ5YVdKMWRHVnpXeWRrWVhSaExXbGtKMTB1ZG1Gc2RXVTdYSEpjYmx4MFkyOXVjM1FnWTJGeWRDQTlJR2RsZEVOaGNuUldZV3gxWlNncE8xeHlYRzVjZEdOdmJuTjBJSEJ5YjJSMVkzUnpUR2x6ZENBOUlGTjBiM0poWjJVdVoyVjBLQ2R3Y205a2RXTjBjeWNwTzF4eVhHNWNkR052Ym5OMElHTm9iM05sYmxCeWIyUjFZM1FnUFNCd2NtOWtkV04wYzB4cGMzUXVabWxzZEdWeUtHVnNaVzFsYm5RZ1BUNGdaV3hsYldWdWRDNXBaQ0E5UFNCd2NtOWtkV04wU1dRcFd6QmRPMXh5WEc1Y2NseHVYSFJwWmlBb1kyRnlkRnRqYUc5elpXNVFjbTlrZFdOMExtbGtYU2tnZTF4eVhHNWNkRngwWTJGeWRGdGphRzl6Wlc1UWNtOWtkV04wTG1sa1hTQTlJRzVsZDFGMVlXNTBhWFI1TzF4eVhHNWNkSDFjY2x4dVhISmNibHgwVTNSdmNtRm5aUzV6WlhRb0oyTmhjblFuTENCallYSjBLVHRjY2x4dVhIUm5aWFJEWVhKMFZtRnNkV1VvS1R0Y2NseHVmVnh5WEc1Y2NseHVaWGh3YjNKMElHTnZibk4wSUhKbGJXOTJaVkJ5YjJSMVkzUkdjbTl0UTJGeWRDQTlJQ2gwWVhKblpYUXBJRDArSUh0Y2NseHVYSFJqYjI1emRDQmpZWEowSUQwZ1oyVjBRMkZ5ZEZaaGJIVmxLQ2s3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEVsa0lEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXBaQ2NwTzF4eVhHNWNjbHh1WEhSa1pXeGxkR1VnWTJGeWRGdHdjbTlrZFdOMFNXUmRPMXh5WEc1Y2NseHVYSFJUZEc5eVlXZGxMbk5sZENnblkyRnlkQ2NzSUdOaGNuUXBPMXh5WEc1OVhISmNibHh5WEc1bGVIQnZjblFnWTI5dWMzUWdaMlYwVkc5MFlXeFRkVzBnUFNBb0tTQTlQaUI3WEhKY2JseDBjbVYwZFhKdUlHZGxkRU5oY25SSmRHVnRjeWhuWlhSRFlYSjBWbUZzZFdVb0tTd2dVM1J2Y21GblpTNW5aWFFvSjNCeWIyUjFZM1J6SnlrcFhISmNibHgwWEhSY2RDNXRZWEFvY0hKdlpIVmpkQ0E5UGlBcmNISnZaSFZqZEM1d2NtbGpaU0FxSUN0d2NtOWtkV04wTG5SdmRHRnNLVnh5WEc1Y2RGeDBYSFF1Y21Wa2RXTmxLQ2hoWTJNc0lHTjFjaWtnUFQ0Z1lXTmpJQ3NnWTNWeUtUdGNjbHh1ZlNJc0ltTnZibk4wSUdkbGRGQnliMlIxWTNSeklEMGdLSFZ5YkNrZ1BUNGdlMXh5WEc1Y2RISmxkSFZ5YmlCbVpYUmphQ2gxY213cE8xeHlYRzU5WEhKY2JseHlYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQm5aWFJRY205a2RXTjBjenNpTENKcGJYQnZjblFnZXlCblpYUkRZWEowU1hSbGJYTWdmU0JtY205dElDY3VMMk5oY25Rbk8xeHlYRzVjY2x4dVkyOXVjM1FnYlc5a1lXd2dQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3ViVzlrWVd3bktUdGNjbHh1WEhKY2JtVjRjRzl5ZENCamIyNXpkQ0J0YjJSaGJFOXdaVzVJWVc1a2JHVnlJRDBnS0NrZ1BUNGdlMXh5WEc1Y2RHMXZaR0ZzTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMjl3Wlc0bktUdGNjbHh1ZlZ4eVhHNWNjbHh1Wlhod2IzSjBJR052Ym5OMElHMXZaR0ZzUTJ4dmMyVklZVzVrYkdWeUlEMGdLQ2tnUFQ0Z2UxeHlYRzVjZEcxdlpHRnNMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMjl3Wlc0bktUdGNjbHh1ZlZ4eVhHNWNjbHh1SWl3aWFXMXdiM0owSUhzZ1oyVjBWRzkwWVd4VGRXMGdmU0JtY205dElDY3VMMk5oY25Rbk8xeHlYRzVjY2x4dVkyOXVjM1FnWjJWdVpYSmhkR1ZGYkdWdFpXNTBJRDBnS0hSaFowNWhiV1VzSUdOc1lYTnpUbUZ0WlNBOUlDY25LU0E5UGlCN1hISmNibHgwWTI5dWMzUWdaV3dnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLSFJoWjA1aGJXVXBPMXh5WEc1Y2RHbG1JQ2hqYkdGemMwNWhiV1VwSUh0Y2NseHVYSFJjZEdWc0xtTnNZWE56VEdsemRDNWhaR1FvWTJ4aGMzTk9ZVzFsS1R0Y2NseHVYSFI5WEhKY2JseHlYRzVjZEhKbGRIVnliaUJsYkR0Y2NseHVmVnh5WEc1Y2NseHVZMjl1YzNRZ2FXNXpaWEowUld4bGJXVnVkRWx1ZEc5UVlYSmxiblFnUFNBb1pXeGxiV1Z1ZEhNc0lIQmhjbVZ1ZEVWc1pXMWxiblFwSUQwK0lIdGNjbHh1WEhSbGJHVnRaVzUwY3k1bWIzSkZZV05vS0dWc1pXMWxiblFnUFQ0Z2UxeHlYRzVjZEZ4MGNHRnlaVzUwUld4bGJXVnVkQzVoY0hCbGJtUkRhR2xzWkNobGJHVnRaVzUwS1R0Y2NseHVYSFI5S1Z4eVhHNTlYSEpjYmx4eVhHNWpiMjV6ZENCamNtVmhkR1ZRY205a2RXTjBTWFJsYlNBOUlDaDdJR04xY25KbGJtTjVMQ0JrWlhOamNtbHdkR2x2Yml3Z2FXUXNJR2x0WjE5MWNtd3NJSEJ5YVdObExDQjBhWFJzWlNCOUtTQTlQaUI3WEhKY2JseHlYRzVjZEdOdmJuTjBJR052YkNBOUlHZGxibVZ5WVhSbFJXeGxiV1Z1ZENnblpHbDJKeXdnSjJOdmJDMDBKeWs3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEVkeWFXUWdQU0JuWlc1bGNtRjBaVVZzWlcxbGJuUW9KMlJwZGljc0lDZHdjbTlrZFdOMExXZHlhV1FuS1R0Y2NseHVYSFJqYjI1emRDQndjbTlrZFdOMFNXMWhaMlZYY21Gd0lEMGdaMlZ1WlhKaGRHVkZiR1Z0Wlc1MEtDZGthWFluTENBbmNISnZaSFZqZEMxcGJXRm5aU2NwTzF4eVhHNWNkR052Ym5OMElHbHRZV2RsVjNKaGNIQmxjaUE5SUdkbGJtVnlZWFJsUld4bGJXVnVkQ2duWkdsMkp5d2dKMmx0WVdkbExYZHlZWEJ3WlhJbktUdGNjbHh1WEhSamIyNXpkQ0J3Y205a2RXTjBTVzFoWjJVZ1BTQm5aVzVsY21GMFpVVnNaVzFsYm5Rb0oybHRaeWNzSUNkd2FXTXRNU2NwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNST1pYZE1ZV0psYkNBOUlHZGxibVZ5WVhSbFJXeGxiV1Z1ZENnbmMzQmhiaWNzSUNkd2NtOWtkV04wTFc1bGR5MXNZV0psYkNjcE8xeHlYRzVjZEdOdmJuTjBJSEJ5YjJSMVkzUkVhWE5qYjNWdWRFeGhZbVZzSUQwZ1oyVnVaWEpoZEdWRmJHVnRaVzUwS0NkemNHRnVKeXdnSjNCeWIyUjFZM1F0WkdselkyOTFiblF0YkdGaVpXd25LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wUkdWelkzSnBjSFJwYjI0Z1BTQm5aVzVsY21GMFpVVnNaVzFsYm5Rb0ozQW5MQ0FuY0hKdlpIVmpkQzFrWlhOamNtbHdkR2x2YmljcE8xeHlYRzVjZEdOdmJuTjBJSEJ5YjJSMVkzUkRiMjUwWlc1MElEMGdaMlZ1WlhKaGRHVkZiR1Z0Wlc1MEtDZGthWFluTENBbmNISnZaSFZqZEMxamIyNTBaVzUwSnlrN1hISmNibHgwWTI5dWMzUWdjSEp2WkhWamRGUnBkR3hsSUQwZ1oyVnVaWEpoZEdWRmJHVnRaVzUwS0Nkb015Y3NJQ2QwYVhSc1pTY3BPMXh5WEc1Y2RHTnZibk4wSUhCeWIyUjFZM1JRY21salpTQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25aR2wySnl3Z0ozQnlhV05sSnlrN1hISmNibHgwWTI5dWMzUWdZV1JrVkc5RFlYSjBJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2RpZFhSMGIyNG5MQ0FuWVdSa0xYUnZMV05oY25RbktUdGNjbHh1WEhKY2JseDBjSEp2WkhWamRFNWxkMHhoWW1Wc0xtbHVibVZ5VkdWNGRDQTlJQ2RUWVd4bEp6dGNjbHh1WEhSaFpHUlViME5oY25RdWFXNXVaWEpVWlhoMElEMGdKeXNnUVdSa0lGUnZJRU5oY25Rbk8xeHlYRzVjZEhCeWIyUjFZM1JFYVhOamIzVnVkRXhoWW1Wc0xtbHVibVZ5VkdWNGRDQTlJQ2RPUlZjbk8xeHlYRzVjY2x4dVhIUndjbTlrZFdOMFNXMWhaMlV1YzJWMFFYUjBjbWxpZFhSbEtDZHpjbU1uTENCcGJXZGZkWEpzS1R0Y2NseHVYSFJoWkdSVWIwTmhjblF1YzJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFdsa0p5d2dhV1FwTzF4eVhHNWNkR0ZrWkZSdlEyRnlkQzVqYkdGemMweHBjM1F1WVdSa0tDZGlkRzRuS1R0Y2NseHVYSFJoWkdSVWIwTmhjblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZblJ1TFhOMVkyTmxjM01uS1R0Y2NseHVYSFJ3Y205a2RXTjBWR2wwYkdVdWFXNXVaWEpVWlhoMElEMGdkR2wwYkdVN1hISmNibHgwY0hKdlpIVmpkRkJ5YVdObExtbHVibVZ5VkdWNGRDQTlJR04xY25KbGJtTjVJQ3NnY0hKcFkyVTdYSEpjYmx4eVhHNWNkR052YkM1aGNIQmxibVJEYUdsc1pDaHdjbTlrZFdOMFIzSnBaQ2s3WEhKY2JseDBhVzFoWjJWWGNtRndjR1Z5TG1Gd2NHVnVaRU5vYVd4a0tIQnliMlIxWTNSSmJXRm5aU2s3WEhKY2JseHlYRzVjZEdOdmJuTjBJSGR5WVhCd1pXUkhjbWxrSUQwZ1czQnliMlIxWTNSSmJXRm5aVmR5WVhBc0lIQnliMlIxWTNSRVpYTmpjbWx3ZEdsdmJpd2djSEp2WkhWamRFTnZiblJsYm5SZE8xeHlYRzVjZEdOdmJuTjBJSGR5WVhCd1pXUkpiV0ZuWlZkeVlYQWdQU0JiYVcxaFoyVlhjbUZ3Y0dWeUxDQndjbTlrZFdOMFRtVjNUR0ZpWld3c0lIQnliMlIxWTNSRWFYTmpiM1Z1ZEV4aFltVnNYVHRjY2x4dVhIUmpiMjV6ZENCM2NtRndjR1ZrUTI5dWRHVnVkQ0E5SUZ0d2NtOWtkV04wVkdsMGJHVXNJSEJ5YjJSMVkzUlFjbWxqWlN3Z1lXUmtWRzlEWVhKMFhUdGNjbHh1WEhKY2JseDBhVzV6WlhKMFJXeGxiV1Z1ZEVsdWRHOVFZWEpsYm5Rb2QzSmhjSEJsWkVkeWFXUXNJSEJ5YjJSMVkzUkhjbWxrS1R0Y2NseHVYSFJwYm5ObGNuUkZiR1Z0Wlc1MFNXNTBiMUJoY21WdWRDaDNjbUZ3Y0dWa1NXMWhaMlZYY21Gd0xDQndjbTlrZFdOMFNXMWhaMlZYY21Gd0tUdGNjbHh1WEhScGJuTmxjblJGYkdWdFpXNTBTVzUwYjFCaGNtVnVkQ2gzY21Gd2NHVmtRMjl1ZEdWdWRDd2djSEp2WkhWamRFTnZiblJsYm5RcE8xeHlYRzVjY2x4dVhIUnlaWFIxY200Z1kyOXNPMXh5WEc1OVhISmNibHh5WEc1amIyNXpkQ0JqY21WaGRHVkRZWEowU1hSbGJTQTlJQ2g3SUdsa0xDQjBhWFJzWlN3Z2FXMW5YM1Z5YkN3Z2NISnBZMlVzSUdOMWNuSmxibU41TENCMGIzUmhiQ0I5S1NBOVBpQjdYSEpjYmx4eVhHNWNkR052Ym5OMElHeHBjM1JKZEdWdElEMGdaMlZ1WlhKaGRHVkZiR1Z0Wlc1MEtDZHNhU2NwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSSmRHVnRJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbkxDQW5ZMkZ5ZEMxc2FYTjBYMTlwZEdWdEp5azdYSEpjYmx4MFkyOXVjM1FnY0hKdlpIVmpkRUZ5ZEdsamRXd2dQU0JuWlc1bGNtRjBaVVZzWlcxbGJuUW9KMmx1Y0hWMEp5azdYSEpjYmx4MFkyOXVjM1FnYVcxblYzSmhjSEJsY2lBOUlHZGxibVZ5WVhSbFJXeGxiV1Z1ZENnblpHbDJKeXdnSjJOaGNuUXRiR2x6ZEY5ZmFXMW5MWGR5WVhCd1pYSW5LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wU1cxbklEMGdaMlZ1WlhKaGRHVkZiR1Z0Wlc1MEtDZHBiV2NuTENBblkyRnlkQzFzYVhOMFgxOXBkR1Z0TFdsdFp5Y3BPMXh5WEc1Y2RHTnZibk4wSUhCeWIyUjFZM1JVYVhSc1pTQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25hRFFuTENBblkyRnlkQzFzYVhOMFgxOXBkR1Z0TFhScGRHeGxKeWs3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEZCeWFXTmxJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2R6Y0dGdUp5d2dKMk5oY25RdGJHbHpkRjlmYVhSbGJTMXdjbWxqWlNjcE8xeHlYRzVjZEdOdmJuTjBJSEJ5YjJSMVkzUlJkV0Z1ZEdsMGVTQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25hVzV3ZFhRbkxDQW5ZMkZ5ZEMxc2FYTjBYMTlwZEdWdExYRjFZVzUwYVhSNUp5azdYSEpjYmx4MFkyOXVjM1FnY0hKdlpIVmpkRlJ2ZEdGc1VISnBZMlVnUFNCblpXNWxjbUYwWlVWc1pXMWxiblFvSjNOd1lXNG5MQ0FuWTJGeWRDMXNhWE4wWDE5cGRHVnRMWFJ2ZEdGc0p5azdYSEpjYmx4MFkyOXVjM1FnY0hKdlpIVmpkRkpsYlc5MlpTQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25ZblYwZEc5dUp5d2dKMk5oY25RdGJHbHpkRjlmYVhSbGJTMXlaVzF2ZG1VbktUdGNjbHh1WEhKY2JseDBjSEp2WkhWamRFRnlkR2xqZFd3dWMyVjBRWFIwY21saWRYUmxLQ2QwZVhCbEp5d2dKMmhwWkdSbGJpY3BPMXh5WEc1Y2RIQnliMlIxWTNSQmNuUnBZM1ZzTG5ObGRFRjBkSEpwWW5WMFpTZ25ibUZ0WlNjc0lDZGhjblJwWTNWc0p5azdYSEpjYmx4MGNISnZaSFZqZEVGeWRHbGpkV3d1YzJWMFFYUjBjbWxpZFhSbEtDZDJZV3gxWlNjc0lHbGtLVHRjY2x4dVhIUndjbTlrZFdOMFNXMW5Mbk5sZEVGMGRISnBZblYwWlNnbmMzSmpKeXdnYVcxblgzVnliQ2s3WEhKY2JseDBjSEp2WkhWamRGRjFZVzUwYVhSNUxuTmxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXBaQ2NzSUdsa0tUdGNjbHh1WEhSd2NtOWtkV04wVW1WdGIzWmxMbk5sZEVGMGRISnBZblYwWlNnblpHRjBZUzFwWkNjc0lHbGtLVHRjY2x4dVhIUndjbTlrZFdOMFVYVmhiblJwZEhrdWMyVjBRWFIwY21saWRYUmxLQ2QwZVhCbEp5d2dKMjUxYldKbGNpY3BPMXh5WEc1Y2RIQnliMlIxWTNSUmRXRnVkR2wwZVM1elpYUkJkSFJ5YVdKMWRHVW9KMjVoYldVbkxDQW5jWFZoYm5ScGRIa25LVHRjY2x4dVhIUndjbTlrZFdOMFVYVmhiblJwZEhrdWMyVjBRWFIwY21saWRYUmxLQ2QyWVd4MVpTY3NJSFJ2ZEdGc0tUdGNjbHh1WEhKY2JseDBjSEp2WkhWamRGUnBkR3hsTG1sdWJtVnlWR1Y0ZENBOUlIUnBkR3hsTzF4eVhHNWNkSEJ5YjJSMVkzUlFjbWxqWlM1cGJtNWxjbFJsZUhRZ1BTQmpkWEp5Wlc1amVTQXJJSEJ5YVdObE8xeHlYRzVjZEhCeWIyUjFZM1JVYjNSaGJGQnlhV05sTG1sdWJtVnlWR1Y0ZENBOUlHQWtlMk4xY25KbGJtTjVmU1I3SzNCeWFXTmxJQ29nSzNSdmRHRnNmV0E3WEhKY2JseDBjSEp2WkhWamRGSmxiVzkyWlM1cGJtNWxjbFJsZUhRZ1BTQW5MU2M3WEhKY2JseHlYRzVjZEdOdmJuTjBJSGR5WVhCd1pXUlFjbTlrZFdOMFNYUmxiWE1nUFNCYmNISnZaSFZqZEVGeWRHbGpkV3dzSUdsdFoxZHlZWEJ3WlhJc0lIQnliMlIxWTNSVWFYUnNaU3dnY0hKdlpIVmpkRkJ5YVdObExDQndjbTlrZFdOMFVYVmhiblJwZEhrc0lIQnliMlIxWTNSVWIzUmhiRkJ5YVdObExDQndjbTlrZFdOMFVtVnRiM1psWFR0Y2NseHVYSFJwYm5ObGNuUkZiR1Z0Wlc1MFNXNTBiMUJoY21WdWRDaDNjbUZ3Y0dWa1VISnZaSFZqZEVsMFpXMXpMQ0J3Y205a2RXTjBTWFJsYlNrN1hISmNibHh5WEc1Y2RHbHRaMWR5WVhCd1pYSXVZWEJ3Wlc1a1EyaHBiR1FvY0hKdlpIVmpkRWx0WnlrN1hISmNibHgwYkdsemRFbDBaVzB1WVhCd1pXNWtRMmhwYkdRb2NISnZaSFZqZEVsMFpXMHBPMXh5WEc1Y2NseHVYSFJ5WlhSMWNtNGdiR2x6ZEVsMFpXMDdYSEpjYm4xY2NseHVYSEpjYm1WNGNHOXlkQ0JqYjI1emRDQnlaVzVrWlhKUWNtOWtkV04wY3lBOUlDaHdjbTlrZFdOMGN5a2dQVDRnZTF4eVhHNWNkR052Ym5OMElHZHlhV1FnUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2duY0hKdlpIVmpkSE5IY21sa0p5azdYSEpjYmx4eVhHNWNkSEJ5YjJSMVkzUnpMbVp2Y2tWaFkyZ29jSEp2WkhWamRDQTlQaUI3WEhKY2JseDBYSFJuY21sa0xtRndjR1Z1WkVOb2FXeGtLR055WldGMFpWQnliMlIxWTNSSmRHVnRLSEJ5YjJSMVkzUXBLVHRjY2x4dVhIUjlLVnh5WEc1OVhISmNibHh5WEc1bGVIQnZjblFnWTI5dWMzUWdjbVZ1WkdWeVEyRnlkQ0E5SUNod2NtOWtkV04wY3lrZ1BUNGdlMXh5WEc1Y2RHTnZibk4wSUdkeWFXUWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VZMkZ5ZEMxc2FYTjBKeWs3WEhKY2JseDBZMjl1YzNRZ1pXMXdkSGxOYzJjZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVkyRnlkRjlmWlcxd2RIa25LVHRjY2x4dVhIUmpiMjV6ZENCMGIzUmhiQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVqWVhKMFgxOTBiM1JoYkNjcE8xeHlYRzVjY2x4dVhIUjNhR2xzWlNBb1ozSnBaQzVtYVhKemRFTm9hV3hrS1NCN1hISmNibHgwWEhSbmNtbGtMbkpsYlc5MlpVTm9hV3hrS0dkeWFXUXVabWx5YzNSRGFHbHNaQ2s3WEhKY2JseDBmVnh5WEc1Y2NseHVYSFJwWmlBb0lYQnliMlIxWTNSekxteGxibWQwYUNrZ2UxeHlYRzVjZEZ4MGNtVjBkWEp1SUdkeWFXUXVZMnhoYzNOTWFYTjBMbUZrWkNnblpXMXdkSGt0YkdsemRDY3BPMXh5WEc1Y2RIMGdaV3h6WlNCN1hISmNibHgwWEhSbmNtbGtMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMlZ0Y0hSNUxXeHBjM1FuS1R0Y2NseHVYSFI5WEhKY2JseHlYRzVjZEd4bGRDQmpkWEp5Wlc1amVUdGNjbHh1WEhKY2JseDBjSEp2WkhWamRITXVabTl5UldGamFDaHdjbTlrZFdOMElEMCtJSHRjY2x4dVhIUmNkR04xY25KbGJtTjVJRDBnY0hKdlpIVmpkQzVqZFhKeVpXNWplVHRjY2x4dVhIUmNkR2R5YVdRdVlYQndaVzVrUTJocGJHUW9ZM0psWVhSbFEyRnlkRWwwWlcwb2NISnZaSFZqZENrcE8xeHlYRzVjZEgwcE8xeHlYRzVjY2x4dVhIUjBiM1JoYkM1cGJtNWxjbFJsZUhRZ1BTQmdWRzkwWVd3NklDUjdZM1Z5Y21WdVkzbDlKSHRuWlhSVWIzUmhiRk4xYlNncGZXQTdYSEpjYm4xY2NseHVYSEpjYm1WNGNHOXlkQ0JqYjI1emRDQnlaVzVrWlhKVGRXTmpaWE56VFhObklEMGdLQ2tnUFQ0Z2UxeHlYRzVjZEdOdmJuTjBJSE53WVc0Z1BTQm5aVzVsY21GMFpVVnNaVzFsYm5Rb0ozTndZVzRuTENBbmMzVmpZMlZ6Y3kxdGMyY25LVHRjY2x4dVhIUnpjR0Z1TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMkpoWkdkbEp5azdYSEpjYmx4MGMzQmhiaTVqYkdGemMweHBjM1F1WVdSa0tDZGlZV1JuWlMxemRXTmpaWE56SnlrN1hISmNibHgwYzNCaGJpNXBibTVsY2xSbGVIUWdQU0FuUVdSa1pXUWdkRzhnWTJGeWRDYzdYSEpjYmx4MFpHOWpkVzFsYm5RdVltOWtlUzVoY0hCbGJtUkRhR2xzWkNoemNHRnVLVHRjY2x4dVhIUnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNjbHh1WEhSY2RHUnZZM1Z0Wlc1MExtSnZaSGt1Y21WdGIzWmxRMmhwYkdRb2MzQmhiaWs3WEhKY2JseDBmU3dnTWpVd01DazdYSEpjYm4waUxDSm1kVzVqZEdsdmJpQlRkRzl5WVdkbFNHVnNjR1Z5S0NsN1hISmNibHgwZEdocGN5NXpkRzl5WVdkbElEMGdiRzlqWVd4VGRHOXlZV2RsTzF4eVhHNWNjbHh1WEhSMGFHbHpMbWRsZENBOUlDaHJaWGtwSUQwK0lIdGNjbHh1WEhSY2RISmxkSFZ5YmlCS1UwOU9MbkJoY25ObEtHeHZZMkZzVTNSdmNtRm5aUzVuWlhSSmRHVnRLR3RsZVNrcE8xeHlYRzVjZEgxY2NseHVYSFIwYUdsekxuTmxkQ0E5SUNoclpYa3NJSFpoYkhWbEtTQTlQaUI3WEhKY2JseDBYSFJzYjJOaGJGTjBiM0poWjJVdWMyVjBTWFJsYlNoclpYa3NJRXBUVDA0dWMzUnlhVzVuYVdaNUtIWmhiSFZsS1NrN1hISmNibHgwZlZ4eVhHNWNkSFJvYVhNdWNtVnRiM1psSUQwZ0tHdGxlU2tnUFQ0Z2UxeHlYRzVjZEZ4MGJHOWpZV3hUZEc5eVlXZGxMbkpsYlc5MlpVbDBaVzBvYTJWNUtUdGNjbHh1WEhSOVhISmNibjFjY2x4dVhISmNibU52Ym5OMElGTjBiM0poWjJVZ1BTQnVaWGNnVTNSdmNtRm5aVWhsYkhCbGNpZ3BPMXh5WEc1Y2NseHVaWGh3YjNKMElHUmxabUYxYkhRZ1UzUnZjbUZuWlRzaVhYMD0ifQ==
