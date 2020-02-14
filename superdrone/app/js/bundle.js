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
    autoplay: true,
    autoplaySpeed: 3000,
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9hcHAuanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9jYXJ0LmpzIiwicHJvamVjdHMvc3VwZXJkcm9uZS9zcmMvanMvZmV0Y2guanMiLCJwcm9qZWN0cy9zdXBlcmRyb25lL3NyYy9qcy9tb2RhbC5qcyIsInByb2plY3RzL3N1cGVyZHJvbmUvc3JjL2pzL3JlbmRlci5qcyIsInByb2plY3RzL3N1cGVyZHJvbmUvc3JjL2pzL3N0b3JhZ2VIZWxwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTSxzQkFBc0IsR0FBRyxnQkFBL0I7QUFDQSxJQUFJLGtCQUFrQixHQUFHLElBQUksS0FBSixDQUFVLHNCQUFWLENBQXpCO0FBRUEsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBakI7QUFFQSx1QkFBWSw4REFBWixFQUNDLElBREQsQ0FFQyxVQUFTLFFBQVQsRUFBbUI7QUFDbEIsTUFBSSxRQUFRLENBQUMsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUM1QixJQUFBLE9BQU8sQ0FBQyxHQUFSLHdEQUE0RCxRQUFRLENBQUMsTUFBckU7QUFDQTtBQUNBOztBQUVELEVBQUEsUUFBUSxDQUFDLElBQVQsR0FDQyxJQURELENBQ00sZ0JBQWdCO0FBQUEsUUFBZCxRQUFjLFFBQWQsUUFBYzs7QUFDckIsOEJBQVEsR0FBUixDQUFZLFVBQVosRUFBd0IsUUFBeEI7O0FBQ0EsSUFBQSxRQUFRLENBQUMsYUFBVCxDQUF1QixrQkFBdkI7QUFDQSxHQUpEO0FBS0EsQ0FiRixXQWVPLFVBQVMsR0FBVCxFQUFjO0FBQ3BCLEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQkFBWixFQUErQixHQUEvQjtBQUNBLENBakJEO0FBbUJB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QUssTUFBTCxHQUFjLFVBQUMsR0FBRCxFQUFTO0FBQ3RCLElBQUEsWUFBWSxDQUFDLFVBQWIsQ0FBd0IsR0FBeEI7QUFDQSxHQUZEO0FBR0E7O0FBRUQsSUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFKLEVBQWhCO2VBRWUsTyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi9zdG9yYWdlSGVscGVyJztcclxuaW1wb3J0IGdldFByb2R1Y3RzIGZyb20gJy4vZmV0Y2gnO1xyXG5pbXBvcnQgeyByZW5kZXJQcm9kdWN0cywgcmVuZGVyQ2FydCwgcmVuZGVyU3VjY2Vzc01zZyB9IGZyb20gJy4vcmVuZGVyJztcclxuaW1wb3J0IHsgZ2V0Q2FydFZhbHVlLCBhZGRUb0NhcnRIYW5kbGVyLCBnZXRDYXJ0SXRlbXMsIGNoYW5nZVByb2R1Y3RRdWFudGl0eSwgcmVtb3ZlUHJvZHVjdEZyb21DYXJ0IH0gZnJvbSAnLi9jYXJ0JztcclxuaW1wb3J0IHsgbW9kYWxPcGVuSGFuZGxlciwgbW9kYWxDbG9zZUhhbmRsZXIgfSBmcm9tICcuL21vZGFsJztcclxuXHJcbmNvbnN0IHByb2R1Y3RzUmVhZHlFdmVudE5hbWUgPSAncHJvZHVjdHNfcmVhZHknO1xyXG5sZXQgcHJvZHVjdHNSZWFkeUV2ZW50ID0gbmV3IEV2ZW50KHByb2R1Y3RzUmVhZHlFdmVudE5hbWUpO1xyXG5cclxuY29uc3QgY2FydEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2Zvcm0nKTtcclxuXHJcbmdldFByb2R1Y3RzKCdodHRwczovL215LWpzb24tc2VydmVyLnR5cGljb2RlLmNvbS92b3JvdG5pcXVlL2Zha2VzZXJ2ZXIvZGInKVxyXG4udGhlbihcclxuXHRmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0uIFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlc3BvbnNlLmpzb24oKVxyXG5cdFx0LnRoZW4oKHtwcm9kdWN0c30pID0+IHtcclxuXHRcdFx0U3RvcmFnZS5zZXQoJ3Byb2R1Y3RzJywgcHJvZHVjdHMpO1xyXG5cdFx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHByb2R1Y3RzUmVhZHlFdmVudCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0KVxyXG4uY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcblx0Y29uc29sZS5sb2coJ0ZldGNoIEVycm9yIDotUycsIGVycik7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcclxuXHRjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcblxyXG5cdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhZGQtdG8tY2FydCcpKSB7XHJcblx0XHRhZGRUb0NhcnRIYW5kbGVyKHRhcmdldCk7XHJcblx0XHRyZW5kZXJTdWNjZXNzTXNnKCk7XHJcblx0fVxyXG5cclxuXHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2FydCcpKSB7XHJcblx0XHRtb2RhbE9wZW5IYW5kbGVyKCk7XHJcblx0XHRyZW5kZXJDYXJ0KGdldENhcnRJdGVtcyhnZXRDYXJ0VmFsdWUoKSwgU3RvcmFnZS5nZXQoJ3Byb2R1Y3RzJykpKTtcclxuXHR9XHJcblxyXG5cdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbF9fY2xvc2UnKSkge1xyXG5cdFx0bW9kYWxDbG9zZUhhbmRsZXIoKTtcclxuXHR9XHJcblxyXG5cdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbGVhci1idG4nKSkge1xyXG5cdFx0U3RvcmFnZS5zZXQoJ2NhcnQnLCB7fSk7XHJcblx0XHRyZW5kZXJDYXJ0KFtdKTtcclxuXHRcdGdldENhcnRWYWx1ZSgpO1xyXG5cdH1cclxuXHJcblx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Ym1pdC1idG4nKSkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHR9XHJcblxyXG5cdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJ0LWxpc3RfX2l0ZW0tcmVtb3ZlJykpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRyZW1vdmVQcm9kdWN0RnJvbUNhcnQodGFyZ2V0KTtcclxuXHRcdHJlbmRlckNhcnQoZ2V0Q2FydEl0ZW1zKGdldENhcnRWYWx1ZSgpLCBTdG9yYWdlLmdldCgncHJvZHVjdHMnKSkpO1xyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihwcm9kdWN0c1JlYWR5RXZlbnROYW1lLCAoKSA9PiB7XHJcblx0Y29uc3QgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb3BlbGxlci1sb2FkZXInKTtcclxuXHRyZW5kZXJQcm9kdWN0cyhTdG9yYWdlLmdldCgncHJvZHVjdHMnKSk7XHJcblx0Z2V0Q2FydFZhbHVlKCk7XHJcblx0bG9hZGVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG59KTtcclxuXHJcbmNhcnRGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xyXG5cdGNoYW5nZVByb2R1Y3RRdWFudGl0eShldmVudC50YXJnZXQpO1xyXG5cdHJlbmRlckNhcnQoZ2V0Q2FydEl0ZW1zKGdldENhcnRWYWx1ZSgpLCBTdG9yYWdlLmdldCgncHJvZHVjdHMnKSkpO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblxyXG5cdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcclxuXHRcdGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gMTAwKSB7XHJcblx0XHRcdCQoJy5zY3JvbGx1cCcpLmZhZGVJbigpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLnNjcm9sbHVwJykuZmFkZU91dCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKCcuc2Nyb2xsdXAnKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCA2MDApO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0pO1xyXG5cclxufSk7XHJcblxyXG4vLyAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4vLyAgICQoXCIub3dsLWNhcm91c2VsXCIpLm93bENhcm91c2VsKCk7XHJcbi8vIH0pO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHQkKCcuY2Fyb3VzZWwnKS5zbGljayh7XHJcblx0XHRjZW50ZXJNb2RlOiB0cnVlLFxyXG5cdFx0Y2VudGVyUGFkZGluZzogJzYwcHgnLFxyXG5cdFx0c2xpZGVzVG9TaG93OiAzLFxyXG5cdFx0YXV0b3BsYXk6IHRydWUsXHJcblx0XHRhdXRvcGxheVNwZWVkOiAzMDAwLFxyXG5cdFx0cmVzcG9uc2l2ZTogW1xyXG5cdFx0e1xyXG5cdFx0XHRicmVha3BvaW50OiA3NjgsXHJcblx0XHRcdHNldHRpbmdzOiB7XHJcblx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcclxuXHRcdFx0XHRjZW50ZXJNb2RlOiB0cnVlLFxyXG5cdFx0XHRcdGNlbnRlclBhZGRpbmc6ICc0MHB4JyxcclxuXHRcdFx0XHRzbGlkZXNUb1Nob3c6IDNcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0YnJlYWtwb2ludDogNDgwLFxyXG5cdFx0XHRzZXR0aW5nczoge1xyXG5cdFx0XHRcdGFycm93czogZmFsc2UsXHJcblx0XHRcdFx0Y2VudGVyTW9kZTogdHJ1ZSxcclxuXHRcdFx0XHRjZW50ZXJQYWRkaW5nOiAnNDBweCcsXHJcblx0XHRcdFx0c2xpZGVzVG9TaG93OiAxXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdF1cclxuXHR9KTtcclxufSk7IiwiaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi9zdG9yYWdlSGVscGVyJztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDYXJ0VmFsdWUgPSAoKSA9PiB7XHJcblx0Y29uc3QgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fbGFiZWwnKTtcclxuXHRjb25zdCBjYXJ0VmFsdWUgPSBTdG9yYWdlLmdldCgnY2FydCcpO1xyXG5cclxuXHRpZiAoIWNhcnRWYWx1ZSB8fCAhT2JqZWN0LmtleXMoY2FydFZhbHVlKS5sZW5ndGgpIHtcclxuXHRcdGxhYmVsLmlubmVyVGV4dCA9IDA7XHJcblx0XHRyZXR1cm4ge307XHJcblx0fVxyXG5cclxuXHRsYWJlbC5pbm5lclRleHQgPSBPYmplY3QudmFsdWVzKGNhcnRWYWx1ZSkucmVkdWNlKChhY2MsIGN1cikgPT4gK2FjYyArICtjdXIpO1xyXG5cclxuXHRyZXR1cm4gY2FydFZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Q2FydEl0ZW1zID0gKGNhcnRWYWx1ZSwgcHJvZHVjdHMpID0+IHtcclxuXHRyZXR1cm4gT2JqZWN0LmtleXMoY2FydFZhbHVlKS5tYXAoaWQgPT4ge1xyXG5cdFx0cmV0dXJuIHByb2R1Y3RzLmZpbHRlcihwcm9kdWN0ID0+IHtcclxuXHRcdFx0aWYgKHByb2R1Y3QuaWQgPT0gaWQpIHtcclxuXHRcdFx0XHRwcm9kdWN0LnRvdGFsID0gY2FydFZhbHVlW2lkXTtcclxuXHRcdFx0XHRyZXR1cm4gcHJvZHVjdDtcclxuXHRcdFx0fVxyXG5cdFx0fSlbMF07XHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhZGRUb0NhcnRIYW5kbGVyID0gKHRhcmdldCkgPT4ge1xyXG5cdGNvbnN0IGNhcnQgPSBnZXRDYXJ0VmFsdWUoKTtcclxuXHRjb25zdCBwcm9kdWN0SWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XHJcblx0Y29uc3QgcHJvZHVjdHNMaXN0ID0gU3RvcmFnZS5nZXQoJ3Byb2R1Y3RzJyk7XHJcblx0Y29uc3QgY2hvc2VuUHJvZHVjdCA9IHByb2R1Y3RzTGlzdC5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmlkID09IHByb2R1Y3RJZClbMF07XHJcblxyXG5cdGlmIChjYXJ0W2Nob3NlblByb2R1Y3QuaWRdKSB7XHJcblx0XHRjYXJ0W2Nob3NlblByb2R1Y3QuaWRdKytcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y2FydFtjaG9zZW5Qcm9kdWN0LmlkXSA9IDE7XHJcblx0fVxyXG5cclxuXHRTdG9yYWdlLnNldCgnY2FydCcsIGNhcnQpO1xyXG5cdGdldENhcnRWYWx1ZSgpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVtb3ZlRnJvbUNhcnRIYW5kbGVyID0gKHRhcmdldCkgPT4ge1xyXG5cdGNvbnN0IGNhcnQgPSBnZXRDYXJ0VmFsdWUoKTtcclxuXHRjb25zdCBwcm9kdWN0SWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XHJcblx0Y29uc3QgcHJvZHVjdHNMaXN0ID0gU3RvcmFnZS5nZXQoJ3Byb2R1Y3RzJyk7XHJcblx0Y29uc3QgY2hvc2VuUHJvZHVjdCA9IHByb2R1Y3RzTGlzdC5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmlkID09IHByb2R1Y3RJZClbMF07XHJcblxyXG5cdGlmIChjYXJ0W2Nob3NlblByb2R1Y3QuaWRdICYmIGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0gPiAwKSB7XHJcblx0XHRjYXJ0W2Nob3NlblByb2R1Y3QuaWRdLS1cclxuXHR9IGVsc2Uge1xyXG5cdFx0Y2FydFtjaG9zZW5Qcm9kdWN0LmlkXSA9IDA7XHJcblx0fVxyXG5cclxuXHRTdG9yYWdlLnNldCgnY2FydCcsIGNhcnQpO1xyXG5cdGdldENhcnRWYWx1ZSgpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2hhbmdlUHJvZHVjdFF1YW50aXR5ID0gKHRhcmdldCkgPT4ge1xyXG5cdGNvbnN0IG5ld1F1YW50aXR5ID0gK3RhcmdldC52YWx1ZSA8IDEgPyAxIDogK3RhcmdldC52YWx1ZTtcclxuXHRjb25zdCBwcm9kdWN0SWQgPSB0YXJnZXQuYXR0cmlidXRlc1snZGF0YS1pZCddLnZhbHVlO1xyXG5cdGNvbnN0IGNhcnQgPSBnZXRDYXJ0VmFsdWUoKTtcclxuXHRjb25zdCBwcm9kdWN0c0xpc3QgPSBTdG9yYWdlLmdldCgncHJvZHVjdHMnKTtcclxuXHRjb25zdCBjaG9zZW5Qcm9kdWN0ID0gcHJvZHVjdHNMaXN0LmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQuaWQgPT0gcHJvZHVjdElkKVswXTtcclxuXHJcblx0aWYgKGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0pIHtcclxuXHRcdGNhcnRbY2hvc2VuUHJvZHVjdC5pZF0gPSBuZXdRdWFudGl0eTtcclxuXHR9XHJcblxyXG5cdFN0b3JhZ2Uuc2V0KCdjYXJ0JywgY2FydCk7XHJcblx0Z2V0Q2FydFZhbHVlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVQcm9kdWN0RnJvbUNhcnQgPSAodGFyZ2V0KSA9PiB7XHJcblx0Y29uc3QgY2FydCA9IGdldENhcnRWYWx1ZSgpO1xyXG5cdGNvbnN0IHByb2R1Y3RJZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcclxuXHJcblx0ZGVsZXRlIGNhcnRbcHJvZHVjdElkXTtcclxuXHJcblx0U3RvcmFnZS5zZXQoJ2NhcnQnLCBjYXJ0KTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFRvdGFsU3VtID0gKCkgPT4ge1xyXG5cdHJldHVybiBnZXRDYXJ0SXRlbXMoZ2V0Q2FydFZhbHVlKCksIFN0b3JhZ2UuZ2V0KCdwcm9kdWN0cycpKVxyXG5cdFx0XHQubWFwKHByb2R1Y3QgPT4gK3Byb2R1Y3QucHJpY2UgKiArcHJvZHVjdC50b3RhbClcclxuXHRcdFx0LnJlZHVjZSgoYWNjLCBjdXIpID0+IGFjYyArIGN1cik7XHJcbn0iLCJjb25zdCBnZXRQcm9kdWN0cyA9ICh1cmwpID0+IHtcclxuXHRyZXR1cm4gZmV0Y2godXJsKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJvZHVjdHM7IiwiaW1wb3J0IHsgZ2V0Q2FydEl0ZW1zIH0gZnJvbSAnLi9jYXJ0JztcclxuXHJcbmNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJyk7XHJcblxyXG5leHBvcnQgY29uc3QgbW9kYWxPcGVuSGFuZGxlciA9ICgpID0+IHtcclxuXHRtb2RhbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtb2RhbENsb3NlSGFuZGxlciA9ICgpID0+IHtcclxuXHRtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGdldFRvdGFsU3VtIH0gZnJvbSAnLi9jYXJ0JztcclxuXHJcbmNvbnN0IGdlbmVyYXRlRWxlbWVudCA9ICh0YWdOYW1lLCBjbGFzc05hbWUgPSAnJykgPT4ge1xyXG5cdGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcclxuXHRpZiAoY2xhc3NOYW1lKSB7XHJcblx0XHRlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZWw7XHJcbn1cclxuXHJcbmNvbnN0IGluc2VydEVsZW1lbnRJbnRvUGFyZW50ID0gKGVsZW1lbnRzLCBwYXJlbnRFbGVtZW50KSA9PiB7XHJcblx0ZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRcdHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblx0fSlcclxufVxyXG5cclxuY29uc3QgY3JlYXRlUHJvZHVjdEl0ZW0gPSAoeyBjdXJyZW5jeSwgZGVzY3JpcHRpb24sIGlkLCBpbWdfdXJsLCBwcmljZSwgdGl0bGUgfSkgPT4ge1xyXG5cclxuXHRjb25zdCBjb2wgPSBnZW5lcmF0ZUVsZW1lbnQoJ2RpdicsICdjb2wtbWQtNCcpO1xyXG5cdGNvbnN0IHByb2R1Y3RHcmlkID0gZ2VuZXJhdGVFbGVtZW50KCdkaXYnLCAncHJvZHVjdC1ncmlkJyk7XHJcblx0Y29uc3QgcHJvZHVjdEltYWdlV3JhcCA9IGdlbmVyYXRlRWxlbWVudCgnZGl2JywgJ3Byb2R1Y3QtaW1hZ2UnKTtcclxuXHRjb25zdCBpbWFnZVdyYXBwZXIgPSBnZW5lcmF0ZUVsZW1lbnQoJ2RpdicsICdpbWFnZS13cmFwcGVyJyk7XHJcblx0Y29uc3QgcHJvZHVjdEltYWdlID0gZ2VuZXJhdGVFbGVtZW50KCdpbWcnLCAncGljLTEnKTtcclxuXHRjb25zdCBwcm9kdWN0TmV3TGFiZWwgPSBnZW5lcmF0ZUVsZW1lbnQoJ3NwYW4nLCAncHJvZHVjdC1uZXctbGFiZWwnKTtcclxuXHRjb25zdCBwcm9kdWN0RGlzY291bnRMYWJlbCA9IGdlbmVyYXRlRWxlbWVudCgnc3BhbicsICdwcm9kdWN0LWRpc2NvdW50LWxhYmVsJyk7XHJcblx0Y29uc3QgcHJvZHVjdERlc2NyaXB0aW9uID0gZ2VuZXJhdGVFbGVtZW50KCdwJywgJ3Byb2R1Y3QtZGVzY3JpcHRpb24nKTtcclxuXHRjb25zdCBwcm9kdWN0Q29udGVudCA9IGdlbmVyYXRlRWxlbWVudCgnZGl2JywgJ3Byb2R1Y3QtY29udGVudCcpO1xyXG5cdGNvbnN0IHByb2R1Y3RUaXRsZSA9IGdlbmVyYXRlRWxlbWVudCgnaDMnLCAndGl0bGUnKTtcclxuXHRjb25zdCBwcm9kdWN0UHJpY2UgPSBnZW5lcmF0ZUVsZW1lbnQoJ2RpdicsICdwcmljZScpO1xyXG5cdGNvbnN0IGFkZFRvQ2FydCA9IGdlbmVyYXRlRWxlbWVudCgnYnV0dG9uJywgJ2FkZC10by1jYXJ0Jyk7XHJcblxyXG5cdHByb2R1Y3ROZXdMYWJlbC5pbm5lclRleHQgPSAnU2FsZSc7XHJcblx0YWRkVG9DYXJ0LmlubmVyVGV4dCA9ICcrIEFkZCBUbyBDYXJ0JztcclxuXHRwcm9kdWN0RGlzY291bnRMYWJlbC5pbm5lclRleHQgPSAnTkVXJztcclxuXHJcblx0cHJvZHVjdEltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgaW1nX3VybCk7XHJcblx0YWRkVG9DYXJ0LnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIGlkKTtcclxuXHRhZGRUb0NhcnQuY2xhc3NMaXN0LmFkZCgnYnRuJyk7XHJcblx0YWRkVG9DYXJ0LmNsYXNzTGlzdC5hZGQoJ2J0bi1zdWNjZXNzJyk7XHJcblx0cHJvZHVjdFRpdGxlLmlubmVyVGV4dCA9IHRpdGxlO1xyXG5cdHByb2R1Y3RQcmljZS5pbm5lclRleHQgPSBjdXJyZW5jeSArIHByaWNlO1xyXG5cclxuXHRjb2wuYXBwZW5kQ2hpbGQocHJvZHVjdEdyaWQpO1xyXG5cdGltYWdlV3JhcHBlci5hcHBlbmRDaGlsZChwcm9kdWN0SW1hZ2UpO1xyXG5cclxuXHRjb25zdCB3cmFwcGVkR3JpZCA9IFtwcm9kdWN0SW1hZ2VXcmFwLCBwcm9kdWN0RGVzY3JpcHRpb24sIHByb2R1Y3RDb250ZW50XTtcclxuXHRjb25zdCB3cmFwcGVkSW1hZ2VXcmFwID0gW2ltYWdlV3JhcHBlciwgcHJvZHVjdE5ld0xhYmVsLCBwcm9kdWN0RGlzY291bnRMYWJlbF07XHJcblx0Y29uc3Qgd3JhcHBlZENvbnRlbnQgPSBbcHJvZHVjdFRpdGxlLCBwcm9kdWN0UHJpY2UsIGFkZFRvQ2FydF07XHJcblxyXG5cdGluc2VydEVsZW1lbnRJbnRvUGFyZW50KHdyYXBwZWRHcmlkLCBwcm9kdWN0R3JpZCk7XHJcblx0aW5zZXJ0RWxlbWVudEludG9QYXJlbnQod3JhcHBlZEltYWdlV3JhcCwgcHJvZHVjdEltYWdlV3JhcCk7XHJcblx0aW5zZXJ0RWxlbWVudEludG9QYXJlbnQod3JhcHBlZENvbnRlbnQsIHByb2R1Y3RDb250ZW50KTtcclxuXHJcblx0cmV0dXJuIGNvbDtcclxufVxyXG5cclxuY29uc3QgY3JlYXRlQ2FydEl0ZW0gPSAoeyBpZCwgdGl0bGUsIGltZ191cmwsIHByaWNlLCBjdXJyZW5jeSwgdG90YWwgfSkgPT4ge1xyXG5cclxuXHRjb25zdCBsaXN0SXRlbSA9IGdlbmVyYXRlRWxlbWVudCgnbGknKTtcclxuXHRjb25zdCBwcm9kdWN0SXRlbSA9IGdlbmVyYXRlRWxlbWVudCgnZGl2JywgJ2NhcnQtbGlzdF9faXRlbScpO1xyXG5cdGNvbnN0IHByb2R1Y3RBcnRpY3VsID0gZ2VuZXJhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG5cdGNvbnN0IGltZ1dyYXBwZXIgPSBnZW5lcmF0ZUVsZW1lbnQoJ2RpdicsICdjYXJ0LWxpc3RfX2ltZy13cmFwcGVyJyk7XHJcblx0Y29uc3QgcHJvZHVjdEltZyA9IGdlbmVyYXRlRWxlbWVudCgnaW1nJywgJ2NhcnQtbGlzdF9faXRlbS1pbWcnKTtcclxuXHRjb25zdCBwcm9kdWN0VGl0bGUgPSBnZW5lcmF0ZUVsZW1lbnQoJ2g0JywgJ2NhcnQtbGlzdF9faXRlbS10aXRsZScpO1xyXG5cdGNvbnN0IHByb2R1Y3RQcmljZSA9IGdlbmVyYXRlRWxlbWVudCgnc3BhbicsICdjYXJ0LWxpc3RfX2l0ZW0tcHJpY2UnKTtcclxuXHRjb25zdCBwcm9kdWN0UXVhbnRpdHkgPSBnZW5lcmF0ZUVsZW1lbnQoJ2lucHV0JywgJ2NhcnQtbGlzdF9faXRlbS1xdWFudGl0eScpO1xyXG5cdGNvbnN0IHByb2R1Y3RUb3RhbFByaWNlID0gZ2VuZXJhdGVFbGVtZW50KCdzcGFuJywgJ2NhcnQtbGlzdF9faXRlbS10b3RhbCcpO1xyXG5cdGNvbnN0IHByb2R1Y3RSZW1vdmUgPSBnZW5lcmF0ZUVsZW1lbnQoJ2J1dHRvbicsICdjYXJ0LWxpc3RfX2l0ZW0tcmVtb3ZlJyk7XHJcblxyXG5cdHByb2R1Y3RBcnRpY3VsLnNldEF0dHJpYnV0ZSgndHlwZScsICdoaWRkZW4nKTtcclxuXHRwcm9kdWN0QXJ0aWN1bC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnYXJ0aWN1bCcpO1xyXG5cdHByb2R1Y3RBcnRpY3VsLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBpZCk7XHJcblx0cHJvZHVjdEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIGltZ191cmwpO1xyXG5cdHByb2R1Y3RRdWFudGl0eS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBpZCk7XHJcblx0cHJvZHVjdFJlbW92ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBpZCk7XHJcblx0cHJvZHVjdFF1YW50aXR5LnNldEF0dHJpYnV0ZSgndHlwZScsICdudW1iZXInKTtcclxuXHRwcm9kdWN0UXVhbnRpdHkuc2V0QXR0cmlidXRlKCduYW1lJywgJ3F1YW50aXR5Jyk7XHJcblx0cHJvZHVjdFF1YW50aXR5LnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0b3RhbCk7XHJcblxyXG5cdHByb2R1Y3RUaXRsZS5pbm5lclRleHQgPSB0aXRsZTtcclxuXHRwcm9kdWN0UHJpY2UuaW5uZXJUZXh0ID0gY3VycmVuY3kgKyBwcmljZTtcclxuXHRwcm9kdWN0VG90YWxQcmljZS5pbm5lclRleHQgPSBgJHtjdXJyZW5jeX0keytwcmljZSAqICt0b3RhbH1gO1xyXG5cdHByb2R1Y3RSZW1vdmUuaW5uZXJUZXh0ID0gJy0nO1xyXG5cclxuXHRjb25zdCB3cmFwcGVkUHJvZHVjdEl0ZW1zID0gW3Byb2R1Y3RBcnRpY3VsLCBpbWdXcmFwcGVyLCBwcm9kdWN0VGl0bGUsIHByb2R1Y3RQcmljZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0VG90YWxQcmljZSwgcHJvZHVjdFJlbW92ZV07XHJcblx0aW5zZXJ0RWxlbWVudEludG9QYXJlbnQod3JhcHBlZFByb2R1Y3RJdGVtcywgcHJvZHVjdEl0ZW0pO1xyXG5cclxuXHRpbWdXcmFwcGVyLmFwcGVuZENoaWxkKHByb2R1Y3RJbWcpO1xyXG5cdGxpc3RJdGVtLmFwcGVuZENoaWxkKHByb2R1Y3RJdGVtKTtcclxuXHJcblx0cmV0dXJuIGxpc3RJdGVtO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVuZGVyUHJvZHVjdHMgPSAocHJvZHVjdHMpID0+IHtcclxuXHRjb25zdCBncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2R1Y3RzR3JpZCcpO1xyXG5cclxuXHRwcm9kdWN0cy5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG5cdFx0Z3JpZC5hcHBlbmRDaGlsZChjcmVhdGVQcm9kdWN0SXRlbShwcm9kdWN0KSk7XHJcblx0fSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlckNhcnQgPSAocHJvZHVjdHMpID0+IHtcclxuXHRjb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQtbGlzdCcpO1xyXG5cdGNvbnN0IGVtcHR5TXNnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2VtcHR5Jyk7XHJcblx0Y29uc3QgdG90YWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fdG90YWwnKTtcclxuXHJcblx0d2hpbGUgKGdyaWQuZmlyc3RDaGlsZCkge1xyXG5cdFx0Z3JpZC5yZW1vdmVDaGlsZChncmlkLmZpcnN0Q2hpbGQpO1xyXG5cdH1cclxuXHJcblx0aWYgKCFwcm9kdWN0cy5sZW5ndGgpIHtcclxuXHRcdHJldHVybiBncmlkLmNsYXNzTGlzdC5hZGQoJ2VtcHR5LWxpc3QnKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Z3JpZC5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eS1saXN0Jyk7XHJcblx0fVxyXG5cclxuXHRsZXQgY3VycmVuY3k7XHJcblxyXG5cdHByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XHJcblx0XHRjdXJyZW5jeSA9IHByb2R1Y3QuY3VycmVuY3k7XHJcblx0XHRncmlkLmFwcGVuZENoaWxkKGNyZWF0ZUNhcnRJdGVtKHByb2R1Y3QpKTtcclxuXHR9KTtcclxuXHJcblx0dG90YWwuaW5uZXJUZXh0ID0gYFRvdGFsOiAke2N1cnJlbmN5fSR7Z2V0VG90YWxTdW0oKX1gO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVuZGVyU3VjY2Vzc01zZyA9ICgpID0+IHtcclxuXHRjb25zdCBzcGFuID0gZ2VuZXJhdGVFbGVtZW50KCdzcGFuJywgJ3N1Y2Nlc3MtbXNnJyk7XHJcblx0c3Bhbi5jbGFzc0xpc3QuYWRkKCdiYWRnZScpO1xyXG5cdHNwYW4uY2xhc3NMaXN0LmFkZCgnYmFkZ2Utc3VjY2VzcycpO1xyXG5cdHNwYW4uaW5uZXJUZXh0ID0gJ0FkZGVkIHRvIGNhcnQnO1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcblx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNwYW4pO1xyXG5cdH0sIDI1MDApO1xyXG59IiwiZnVuY3Rpb24gU3RvcmFnZUhlbHBlcigpe1xyXG5cdHRoaXMuc3RvcmFnZSA9IGxvY2FsU3RvcmFnZTtcclxuXHJcblx0dGhpcy5nZXQgPSAoa2V5KSA9PiB7XHJcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuXHR9XHJcblx0dGhpcy5zZXQgPSAoa2V5LCB2YWx1ZSkgPT4ge1xyXG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG5cdH1cclxuXHR0aGlzLnJlbW92ZSA9IChrZXkpID0+IHtcclxuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBTdG9yYWdlID0gbmV3IFN0b3JhZ2VIZWxwZXIoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFN0b3JhZ2U7Il0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p3Y205cVpXTjBjeTl6ZFhCbGNtUnliMjVsTDNOeVl5OXFjeTloY0hBdWFuTWlMQ0p3Y205cVpXTjBjeTl6ZFhCbGNtUnliMjVsTDNOeVl5OXFjeTlqWVhKMExtcHpJaXdpY0hKdmFtVmpkSE12YzNWd1pYSmtjbTl1WlM5emNtTXZhbk12Wm1WMFkyZ3Vhbk1pTENKd2NtOXFaV04wY3k5emRYQmxjbVJ5YjI1bEwzTnlZeTlxY3k5dGIyUmhiQzVxY3lJc0luQnliMnBsWTNSekwzTjFjR1Z5WkhKdmJtVXZjM0pqTDJwekwzSmxibVJsY2k1cWN5SXNJbkJ5YjJwbFkzUnpMM04xY0dWeVpISnZibVV2YzNKakwycHpMM04wYjNKaFoyVklaV3h3WlhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3T3p0QlEwRkJPenRCUVVOQk96dEJRVU5CT3p0QlFVTkJPenRCUVVOQk96czdPMEZCUlVFc1NVRkJUU3h6UWtGQmMwSXNSMEZCUnl4blFrRkJMMEk3UVVGRFFTeEpRVUZKTEd0Q1FVRnJRaXhIUVVGSExFbEJRVWtzUzBGQlNpeERRVUZWTEhOQ1FVRldMRU5CUVhwQ08wRkJSVUVzU1VGQlRTeFJRVUZSTEVkQlFVY3NVVUZCVVN4RFFVRkRMR0ZCUVZRc1EwRkJkVUlzWTBGQmRrSXNRMEZCYWtJN1FVRkZRU3gxUWtGQldTdzRSRUZCV2l4RlFVTkRMRWxCUkVRc1EwRkZReXhWUVVGVExGRkJRVlFzUlVGQmJVSTdRVUZEYkVJc1RVRkJTU3hSUVVGUkxFTkJRVU1zVFVGQlZDeExRVUZ2UWl4SFFVRjRRaXhGUVVFMlFqdEJRVU0xUWl4SlFVRkJMRTlCUVU4c1EwRkJReXhIUVVGU0xIZEVRVUUwUkN4UlFVRlJMRU5CUVVNc1RVRkJja1U3UVVGRFFUdEJRVU5CT3p0QlFVVkVMRVZCUVVFc1VVRkJVU3hEUVVGRExFbEJRVlFzUjBGRFF5eEpRVVJFTEVOQlEwMHNaMEpCUVdkQ08wRkJRVUVzVVVGQlpDeFJRVUZqTEZGQlFXUXNVVUZCWXpzN1FVRkRja0lzT0VKQlFWRXNSMEZCVWl4RFFVRlpMRlZCUVZvc1JVRkJkMElzVVVGQmVFSTdPMEZCUTBFc1NVRkJRU3hSUVVGUkxFTkJRVU1zWVVGQlZDeERRVUYxUWl4clFrRkJka0k3UVVGRFFTeEhRVXBFTzBGQlMwRXNRMEZpUml4WFFXVlBMRlZCUVZNc1IwRkJWQ3hGUVVGak8wRkJRM0JDTEVWQlFVRXNUMEZCVHl4RFFVRkRMRWRCUVZJc1EwRkJXU3hwUWtGQldpeEZRVUVyUWl4SFFVRXZRanRCUVVOQkxFTkJha0pFTzBGQmJVSkJMRkZCUVZFc1EwRkJReXhuUWtGQlZDeERRVUV3UWl4UFFVRXhRaXhGUVVGdFF5eFZRVUZETEV0QlFVUXNSVUZCVnp0QlFVTTNReXhOUVVGTkxFMUJRVTBzUjBGQlJ5eExRVUZMTEVOQlFVTXNUVUZCY2tJN08wRkJSVUVzVFVGQlNTeE5RVUZOTEVOQlFVTXNVMEZCVUN4RFFVRnBRaXhSUVVGcVFpeERRVUV3UWl4aFFVRXhRaXhEUVVGS0xFVkJRVGhETzBGQlF6ZERMR2REUVVGcFFpeE5RVUZxUWp0QlFVTkJPMEZCUTBFN08wRkJSVVFzVFVGQlNTeE5RVUZOTEVOQlFVTXNVMEZCVUN4RFFVRnBRaXhSUVVGcVFpeERRVUV3UWl4TlFVRXhRaXhEUVVGS0xFVkJRWFZETzBGQlEzUkRPMEZCUTBFc05FSkJRVmNzZDBKQlFXRXNlVUpCUVdJc1JVRkJOa0lzTUVKQlFWRXNSMEZCVWl4RFFVRlpMRlZCUVZvc1EwRkJOMElzUTBGQldEdEJRVU5CT3p0QlFVVkVMRTFCUVVrc1RVRkJUU3hEUVVGRExGTkJRVkFzUTBGQmFVSXNVVUZCYWtJc1EwRkJNRUlzWTBGQk1VSXNRMEZCU2l4RlFVRXJRenRCUVVNNVF6dEJRVU5CT3p0QlFVVkVMRTFCUVVrc1RVRkJUU3hEUVVGRExGTkJRVkFzUTBGQmFVSXNVVUZCYWtJc1EwRkJNRUlzVjBGQk1VSXNRMEZCU2l4RlFVRTBRenRCUVVNelF5dzRRa0ZCVVN4SFFVRlNMRU5CUVZrc1RVRkJXaXhGUVVGdlFpeEZRVUZ3UWpzN1FVRkRRU3cwUWtGQlZ5eEZRVUZZTzBGQlEwRTdRVUZEUVRzN1FVRkZSQ3hOUVVGSkxFMUJRVTBzUTBGQlF5eFRRVUZRTEVOQlFXbENMRkZCUVdwQ0xFTkJRVEJDTEZsQlFURkNMRU5CUVVvc1JVRkJOa003UVVGRE5VTXNTVUZCUVN4TFFVRkxMRU5CUVVNc1kwRkJUanRCUVVOQk96dEJRVVZFTEUxQlFVa3NUVUZCVFN4RFFVRkRMRk5CUVZBc1EwRkJhVUlzVVVGQmFrSXNRMEZCTUVJc2QwSkJRVEZDTEVOQlFVb3NSVUZCZVVRN1FVRkRlRVFzU1VGQlFTeExRVUZMTEVOQlFVTXNZMEZCVGp0QlFVTkJMSEZEUVVGelFpeE5RVUYwUWp0QlFVTkJMRFJDUVVGWExIZENRVUZoTEhsQ1FVRmlMRVZCUVRaQ0xEQkNRVUZSTEVkQlFWSXNRMEZCV1N4VlFVRmFMRU5CUVRkQ0xFTkJRVmc3UVVGRFFUdEJRVVZFTEVOQmFrTkVPMEZCYlVOQkxGRkJRVkVzUTBGQlF5eG5Ra0ZCVkN4RFFVRXdRaXh6UWtGQk1VSXNSVUZCYTBRc1dVRkJUVHRCUVVOMlJDeE5RVUZOTEUxQlFVMHNSMEZCUnl4UlFVRlJMRU5CUVVNc1lVRkJWQ3hEUVVGMVFpeHRRa0ZCZGtJc1EwRkJaanRCUVVOQkxEaENRVUZsTERCQ1FVRlJMRWRCUVZJc1EwRkJXU3hWUVVGYUxFTkJRV1k3UVVGRFFUdEJRVU5CTEVWQlFVRXNUVUZCVFN4RFFVRkRMRk5CUVZBc1EwRkJhVUlzUjBGQmFrSXNRMEZCY1VJc1VVRkJja0k3UVVGRFFTeERRVXhFTzBGQlQwRXNVVUZCVVN4RFFVRkRMR2RDUVVGVUxFTkJRVEJDTEZGQlFURkNMRVZCUVc5RExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlF6bERMRzFEUVVGelFpeExRVUZMTEVOQlFVTXNUVUZCTlVJN1FVRkRRU3d3UWtGQlZ5eDNRa0ZCWVN4NVFrRkJZaXhGUVVFMlFpd3dRa0ZCVVN4SFFVRlNMRU5CUVZrc1ZVRkJXaXhEUVVFM1FpeERRVUZZTzBGQlEwRXNRMEZJUkR0QlFVdEJMRU5CUVVNc1EwRkJReXhSUVVGRUxFTkJRVVFzUTBGQldTeExRVUZhTEVOQlFXdENMRmxCUVZVN1FVRkZNMElzUlVGQlFTeERRVUZETEVOQlFVTXNUVUZCUkN4RFFVRkVMRU5CUVZVc1RVRkJWaXhEUVVGcFFpeFpRVUZWTzBGQlF6RkNMRkZCUVVrc1EwRkJReXhEUVVGRExFbEJRVVFzUTBGQlJDeERRVUZSTEZOQlFWSXNTMEZCYzBJc1IwRkJNVUlzUlVGQkswSTdRVUZET1VJc1RVRkJRU3hEUVVGRExFTkJRVU1zVjBGQlJDeERRVUZFTEVOQlFXVXNUVUZCWmp0QlFVTkJMRXRCUmtRc1RVRkZUenRCUVVOT0xFMUJRVUVzUTBGQlF5eERRVUZETEZkQlFVUXNRMEZCUkN4RFFVRmxMRTlCUVdZN1FVRkRRVHRCUVVORUxFZEJUa1E3UVVGUlFTeEZRVUZCTEVOQlFVTXNRMEZCUXl4WFFVRkVMRU5CUVVRc1EwRkJaU3hMUVVGbUxFTkJRWEZDTEZsQlFWVTdRVUZET1VJc1NVRkJRU3hEUVVGRExFTkJRVU1zV1VGQlJDeERRVUZFTEVOQlFXZENMRTlCUVdoQ0xFTkJRWGRDTzBGQlFVVXNUVUZCUVN4VFFVRlRMRVZCUVVVN1FVRkJZaXhMUVVGNFFpeEZRVUV3UXl4SFFVRXhRenRCUVVOQkxGZEJRVThzUzBGQlVEdEJRVU5CTEVkQlNFUTdRVUZMUVN4RFFXWkVMRVVzUTBGcFFrRTdRVUZEUVR0QlFVTkJPenRCUVVWQkxFTkJRVU1zUTBGQlF5eFJRVUZFTEVOQlFVUXNRMEZCV1N4TFFVRmFMRU5CUVd0Q0xGbEJRVlU3UVVGRE0wSXNSVUZCUVN4RFFVRkRMRU5CUVVNc1YwRkJSQ3hEUVVGRUxFTkJRV1VzUzBGQlppeERRVUZ4UWp0QlFVTndRaXhKUVVGQkxGVkJRVlVzUlVGQlJTeEpRVVJSTzBGQlJYQkNMRWxCUVVFc1lVRkJZU3hGUVVGRkxFMUJSa3M3UVVGSGNFSXNTVUZCUVN4WlFVRlpMRVZCUVVVc1EwRklUVHRCUVVsd1FpeEpRVUZCTEZGQlFWRXNSVUZCUlN4SlFVcFZPMEZCUzNCQ0xFbEJRVUVzWVVGQllTeEZRVUZGTEVsQlRFczdRVUZOY0VJc1NVRkJRU3hWUVVGVkxFVkJRVVVzUTBGRFdqdEJRVU5ETEUxQlFVRXNWVUZCVlN4RlFVRkZMRWRCUkdJN1FVRkZReXhOUVVGQkxGRkJRVkVzUlVGQlJUdEJRVU5VTEZGQlFVRXNUVUZCVFN4RlFVRkZMRXRCUkVNN1FVRkZWQ3hSUVVGQkxGVkJRVlVzUlVGQlJTeEpRVVpJTzBGQlIxUXNVVUZCUVN4aFFVRmhMRVZCUVVVc1RVRklUanRCUVVsVUxGRkJRVUVzV1VGQldTeEZRVUZGTzBGQlNrdzdRVUZHV0N4TFFVUlpMRVZCVlZvN1FVRkRReXhOUVVGQkxGVkJRVlVzUlVGQlJTeEhRVVJpTzBGQlJVTXNUVUZCUVN4UlFVRlJMRVZCUVVVN1FVRkRWQ3hSUVVGQkxFMUJRVTBzUlVGQlJTeExRVVJETzBGQlJWUXNVVUZCUVN4VlFVRlZMRVZCUVVVc1NVRkdTRHRCUVVkVUxGRkJRVUVzWVVGQllTeEZRVUZGTEUxQlNFNDdRVUZKVkN4UlFVRkJMRmxCUVZrc1JVRkJSVHRCUVVwTU8wRkJSbGdzUzBGV1dUdEJRVTVSTEVkQlFYSkNPMEZCTWtKQkxFTkJOVUpFT3pzN096czdPenM3TzBGRGJFZEJPenM3TzBGQlJVOHNTVUZCVFN4WlFVRlpMRWRCUVVjc1UwRkJaaXhaUVVGbExFZEJRVTA3UVVGRGFrTXNUVUZCVFN4TFFVRkxMRWRCUVVjc1VVRkJVU3hEUVVGRExHRkJRVlFzUTBGQmRVSXNZMEZCZGtJc1EwRkJaRHM3UVVGRFFTeE5RVUZOTEZOQlFWTXNSMEZCUnl3d1FrRkJVU3hIUVVGU0xFTkJRVmtzVFVGQldpeERRVUZzUWpzN1FVRkZRU3hOUVVGSkxFTkJRVU1zVTBGQlJDeEpRVUZqTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hUUVVGYUxFVkJRWFZDTEUxQlFURkRMRVZCUVd0RU8wRkJRMnBFTEVsQlFVRXNTMEZCU3l4RFFVRkRMRk5CUVU0c1IwRkJhMElzUTBGQmJFSTdRVUZEUVN4WFFVRlBMRVZCUVZBN1FVRkRRVHM3UVVGRlJDeEZRVUZCTEV0QlFVc3NRMEZCUXl4VFFVRk9MRWRCUVd0Q0xFMUJRVTBzUTBGQlF5eE5RVUZRTEVOQlFXTXNVMEZCWkN4RlFVRjVRaXhOUVVGNlFpeERRVUZuUXl4VlFVRkRMRWRCUVVRc1JVRkJUU3hIUVVGT08wRkJRVUVzVjBGQll5eERRVUZETEVkQlFVUXNSMEZCVHl4RFFVRkRMRWRCUVhSQ08wRkJRVUVzUjBGQmFFTXNRMEZCYkVJN1FVRkZRU3hUUVVGUExGTkJRVkE3UVVGRFFTeERRVnBOT3pzN08wRkJZMEVzU1VGQlRTeFpRVUZaTEVkQlFVY3NVMEZCWml4WlFVRmxMRU5CUVVNc1UwRkJSQ3hGUVVGWkxGRkJRVm9zUlVGQmVVSTdRVUZEY0VRc1UwRkJUeXhOUVVGTkxFTkJRVU1zU1VGQlVDeERRVUZaTEZOQlFWb3NSVUZCZFVJc1IwRkJka0lzUTBGQk1rSXNWVUZCUVN4RlFVRkZMRVZCUVVrN1FVRkRka01zVjBGQlR5eFJRVUZSTEVOQlFVTXNUVUZCVkN4RFFVRm5RaXhWUVVGQkxFOUJRVThzUlVGQlNUdEJRVU5xUXl4VlFVRkpMRTlCUVU4c1EwRkJReXhGUVVGU0xFbEJRV01zUlVGQmJFSXNSVUZCYzBJN1FVRkRja0lzVVVGQlFTeFBRVUZQTEVOQlFVTXNTMEZCVWl4SFFVRm5RaXhUUVVGVExFTkJRVU1zUlVGQlJDeERRVUY2UWp0QlFVTkJMR1ZCUVU4c1QwRkJVRHRCUVVOQk8wRkJRMFFzUzBGTVRTeEZRVXRLTEVOQlRFa3NRMEZCVUR0QlFVMUJMRWRCVUUwc1EwRkJVRHRCUVZGQkxFTkJWRTA3T3pzN1FVRlhRU3hKUVVGTkxHZENRVUZuUWl4SFFVRkhMRk5CUVc1Q0xHZENRVUZ0UWl4RFFVRkRMRTFCUVVRc1JVRkJXVHRCUVVNelF5eE5RVUZOTEVsQlFVa3NSMEZCUnl4WlFVRlpMRVZCUVhwQ08wRkJRMEVzVFVGQlRTeFRRVUZUTEVkQlFVY3NUVUZCVFN4RFFVRkRMRmxCUVZBc1EwRkJiMElzVTBGQmNFSXNRMEZCYkVJN08wRkJRMEVzVFVGQlRTeFpRVUZaTEVkQlFVY3NNRUpCUVZFc1IwRkJVaXhEUVVGWkxGVkJRVm9zUTBGQmNrSTdPMEZCUTBFc1RVRkJUU3hoUVVGaExFZEJRVWNzV1VGQldTeERRVUZETEUxQlFXSXNRMEZCYjBJc1ZVRkJRU3hQUVVGUE8wRkJRVUVzVjBGQlNTeFBRVUZQTEVOQlFVTXNSVUZCVWl4SlFVRmpMRk5CUVd4Q08wRkJRVUVzUjBGQk0wSXNSVUZCZDBRc1EwRkJlRVFzUTBGQmRFSTdPMEZCUlVFc1RVRkJTU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEVWQlFXWXNRMEZCVWl4RlFVRTBRanRCUVVNelFpeEpRVUZCTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc1JVRkJaaXhEUVVGS08wRkJRMEVzUjBGR1JDeE5RVVZQTzBGQlEwNHNTVUZCUVN4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFVkJRV1lzUTBGQlNpeEhRVUY1UWl4RFFVRjZRanRCUVVOQk96dEJRVVZFTERSQ1FVRlJMRWRCUVZJc1EwRkJXU3hOUVVGYUxFVkJRVzlDTEVsQlFYQkNPenRCUVVOQkxFVkJRVUVzV1VGQldUdEJRVU5hTEVOQlpFMDdPenM3UVVGblFrRXNTVUZCVFN4eFFrRkJjVUlzUjBGQlJ5eFRRVUY0UWl4eFFrRkJkMElzUTBGQlF5eE5RVUZFTEVWQlFWazdRVUZEYUVRc1RVRkJUU3hKUVVGSkxFZEJRVWNzV1VGQldTeEZRVUY2UWp0QlFVTkJMRTFCUVUwc1UwRkJVeXhIUVVGSExFMUJRVTBzUTBGQlF5eFpRVUZRTEVOQlFXOUNMRk5CUVhCQ0xFTkJRV3hDT3p0QlFVTkJMRTFCUVUwc1dVRkJXU3hIUVVGSExEQkNRVUZSTEVkQlFWSXNRMEZCV1N4VlFVRmFMRU5CUVhKQ096dEJRVU5CTEUxQlFVMHNZVUZCWVN4SFFVRkhMRmxCUVZrc1EwRkJReXhOUVVGaUxFTkJRVzlDTEZWQlFVRXNUMEZCVHp0QlFVRkJMRmRCUVVrc1QwRkJUeXhEUVVGRExFVkJRVklzU1VGQll5eFRRVUZzUWp0QlFVRkJMRWRCUVROQ0xFVkJRWGRFTEVOQlFYaEVMRU5CUVhSQ096dEJRVVZCTEUxQlFVa3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhGUVVGbUxFTkJRVW9zU1VGQk1FSXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhGUVVGbUxFTkJRVW9zUjBGQmVVSXNRMEZCZGtRc1JVRkJNRVE3UVVGRGVrUXNTVUZCUVN4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFVkJRV1lzUTBGQlNqdEJRVU5CTEVkQlJrUXNUVUZGVHp0QlFVTk9MRWxCUVVFc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eEZRVUZtTEVOQlFVb3NSMEZCZVVJc1EwRkJla0k3UVVGRFFUczdRVUZGUkN3MFFrRkJVU3hIUVVGU0xFTkJRVmtzVFVGQldpeEZRVUZ2UWl4SlFVRndRanM3UVVGRFFTeEZRVUZCTEZsQlFWazdRVUZEV2l4RFFXUk5PenM3TzBGQlowSkJMRWxCUVUwc2NVSkJRWEZDTEVkQlFVY3NVMEZCZUVJc2NVSkJRWGRDTEVOQlFVTXNUVUZCUkN4RlFVRlpPMEZCUTJoRUxFMUJRVTBzVjBGQlZ5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVZJc1IwRkJaMElzUTBGQmFFSXNSMEZCYjBJc1EwRkJjRUlzUjBGQmQwSXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJjRVE3UVVGRFFTeE5RVUZOTEZOQlFWTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1ZVRkJVQ3hEUVVGclFpeFRRVUZzUWl4RlFVRTJRaXhMUVVFdlF6dEJRVU5CTEUxQlFVMHNTVUZCU1N4SFFVRkhMRmxCUVZrc1JVRkJla0k3TzBGQlEwRXNUVUZCVFN4WlFVRlpMRWRCUVVjc01FSkJRVkVzUjBGQlVpeERRVUZaTEZWQlFWb3NRMEZCY2tJN08wRkJRMEVzVFVGQlRTeGhRVUZoTEVkQlFVY3NXVUZCV1N4RFFVRkRMRTFCUVdJc1EwRkJiMElzVlVGQlFTeFBRVUZQTzBGQlFVRXNWMEZCU1N4UFFVRlBMRU5CUVVNc1JVRkJVaXhKUVVGakxGTkJRV3hDTzBGQlFVRXNSMEZCTTBJc1JVRkJkMFFzUTBGQmVFUXNRMEZCZEVJN08wRkJSVUVzVFVGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRVZCUVdZc1EwRkJVaXhGUVVFMFFqdEJRVU16UWl4SlFVRkJMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUlVGQlppeERRVUZLTEVkQlFYbENMRmRCUVhwQ08wRkJRMEU3TzBGQlJVUXNORUpCUVZFc1IwRkJVaXhEUVVGWkxFMUJRVm9zUlVGQmIwSXNTVUZCY0VJN08wRkJRMEVzUlVGQlFTeFpRVUZaTzBGQlExb3NRMEZpVFRzN096dEJRV1ZCTEVsQlFVMHNjVUpCUVhGQ0xFZEJRVWNzVTBGQmVFSXNjVUpCUVhkQ0xFTkJRVU1zVFVGQlJDeEZRVUZaTzBGQlEyaEVMRTFCUVUwc1NVRkJTU3hIUVVGSExGbEJRVmtzUlVGQmVrSTdRVUZEUVN4TlFVRk5MRk5CUVZNc1IwRkJSeXhOUVVGTkxFTkJRVU1zV1VGQlVDeERRVUZ2UWl4VFFVRndRaXhEUVVGc1FqdEJRVVZCTEZOQlFVOHNTVUZCU1N4RFFVRkRMRk5CUVVRc1EwRkJXRHM3UVVGRlFTdzBRa0ZCVVN4SFFVRlNMRU5CUVZrc1RVRkJXaXhGUVVGdlFpeEpRVUZ3UWp0QlFVTkJMRU5CVUUwN096czdRVUZUUVN4SlFVRk5MRmRCUVZjc1IwRkJSeXhUUVVGa0xGZEJRV01zUjBGQlRUdEJRVU5vUXl4VFFVRlBMRmxCUVZrc1EwRkJReXhaUVVGWkxFVkJRV0lzUlVGQmFVSXNNRUpCUVZFc1IwRkJVaXhEUVVGWkxGVkJRVm9zUTBGQmFrSXNRMEZCV2l4RFFVTktMRWRCUkVrc1EwRkRRU3hWUVVGQkxFOUJRVTg3UVVGQlFTeFhRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVZRc1IwRkJhVUlzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCT1VJN1FVRkJRU3hIUVVSUUxFVkJSVW9zVFVGR1NTeERRVVZITEZWQlFVTXNSMEZCUkN4RlFVRk5MRWRCUVU0N1FVRkJRU3hYUVVGakxFZEJRVWNzUjBGQlJ5eEhRVUZ3UWp0QlFVRkJMRWRCUmtnc1EwRkJVRHRCUVVkQkxFTkJTazA3T3pzN096czdPenM3T3p0QlEyNUdVQ3hKUVVGTkxGZEJRVmNzUjBGQlJ5eFRRVUZrTEZkQlFXTXNRMEZCUXl4SFFVRkVMRVZCUVZNN1FVRkROVUlzVTBGQlR5eExRVUZMTEVOQlFVTXNSMEZCUkN4RFFVRmFPMEZCUTBFc1EwRkdSRHM3WlVGSlpTeFhPenM3T3pzN096czdPenRCUTBwbU96dEJRVVZCTEVsQlFVMHNTMEZCU3l4SFFVRkhMRkZCUVZFc1EwRkJReXhoUVVGVUxFTkJRWFZDTEZGQlFYWkNMRU5CUVdRN08wRkJSVThzU1VGQlRTeG5Ra0ZCWjBJc1IwRkJSeXhUUVVGdVFpeG5Ra0ZCYlVJc1IwRkJUVHRCUVVOeVF5eEZRVUZCTEV0QlFVc3NRMEZCUXl4VFFVRk9MRU5CUVdkQ0xFZEJRV2hDTEVOQlFXOUNMRTFCUVhCQ08wRkJRMEVzUTBGR1RUczdPenRCUVVsQkxFbEJRVTBzYVVKQlFXbENMRWRCUVVjc1UwRkJjRUlzYVVKQlFXOUNMRWRCUVUwN1FVRkRkRU1zUlVGQlFTeExRVUZMTEVOQlFVTXNVMEZCVGl4RFFVRm5RaXhOUVVGb1FpeERRVUYxUWl4TlFVRjJRanRCUVVOQkxFTkJSazA3T3pzN096czdPenM3T3p0QlExSlFPenRCUVVWQkxFbEJRVTBzWlVGQlpTeEhRVUZITEZOQlFXeENMR1ZCUVd0Q0xFTkJRVU1zVDBGQlJDeEZRVUUyUWp0QlFVRkJMRTFCUVc1Q0xGTkJRVzFDTEhWRlFVRlFMRVZCUVU4N1FVRkRjRVFzVFVGQlRTeEZRVUZGTEVkQlFVY3NVVUZCVVN4RFFVRkRMR0ZCUVZRc1EwRkJkVUlzVDBGQmRrSXNRMEZCV0RzN1FVRkRRU3hOUVVGSkxGTkJRVW9zUlVGQlpUdEJRVU5rTEVsQlFVRXNSVUZCUlN4RFFVRkRMRk5CUVVnc1EwRkJZU3hIUVVGaUxFTkJRV2xDTEZOQlFXcENPMEZCUTBFN08wRkJSVVFzVTBGQlR5eEZRVUZRTzBGQlEwRXNRMEZRUkRzN1FVRlRRU3hKUVVGTkxIVkNRVUYxUWl4SFFVRkhMRk5CUVRGQ0xIVkNRVUV3UWl4RFFVRkRMRkZCUVVRc1JVRkJWeXhoUVVGWUxFVkJRVFpDTzBGQlF6VkVMRVZCUVVFc1VVRkJVU3hEUVVGRExFOUJRVlFzUTBGQmFVSXNWVUZCUVN4UFFVRlBMRVZCUVVrN1FVRkRNMElzU1VGQlFTeGhRVUZoTEVOQlFVTXNWMEZCWkN4RFFVRXdRaXhQUVVFeFFqdEJRVU5CTEVkQlJrUTdRVUZIUVN4RFFVcEVPenRCUVUxQkxFbEJRVTBzYVVKQlFXbENMRWRCUVVjc1UwRkJjRUlzYVVKQlFXOUNMRTlCUVRCRU8wRkJRVUVzVFVGQmRrUXNVVUZCZFVRc1VVRkJka1FzVVVGQmRVUTdRVUZCUVN4TlFVRTNReXhYUVVFMlF5eFJRVUUzUXl4WFFVRTJRenRCUVVGQkxFMUJRV2hETEVWQlFXZERMRkZCUVdoRExFVkJRV2RETzBGQlFVRXNUVUZCTlVJc1QwRkJORUlzVVVGQk5VSXNUMEZCTkVJN1FVRkJRU3hOUVVGdVFpeExRVUZ0UWl4UlFVRnVRaXhMUVVGdFFqdEJRVUZCTEUxQlFWb3NTMEZCV1N4UlFVRmFMRXRCUVZrN1FVRkZia1lzVFVGQlRTeEhRVUZITEVkQlFVY3NaVUZCWlN4RFFVRkRMRXRCUVVRc1JVRkJVU3hWUVVGU0xFTkJRVE5DTzBGQlEwRXNUVUZCVFN4WFFVRlhMRWRCUVVjc1pVRkJaU3hEUVVGRExFdEJRVVFzUlVGQlVTeGpRVUZTTEVOQlFXNURPMEZCUTBFc1RVRkJUU3huUWtGQlowSXNSMEZCUnl4bFFVRmxMRU5CUVVNc1MwRkJSQ3hGUVVGUkxHVkJRVklzUTBGQmVFTTdRVUZEUVN4TlFVRk5MRmxCUVZrc1IwRkJSeXhsUVVGbExFTkJRVU1zUzBGQlJDeEZRVUZSTEdWQlFWSXNRMEZCY0VNN1FVRkRRU3hOUVVGTkxGbEJRVmtzUjBGQlJ5eGxRVUZsTEVOQlFVTXNTMEZCUkN4RlFVRlJMRTlCUVZJc1EwRkJjRU03UVVGRFFTeE5RVUZOTEdWQlFXVXNSMEZCUnl4bFFVRmxMRU5CUVVNc1RVRkJSQ3hGUVVGVExHMUNRVUZVTEVOQlFYWkRPMEZCUTBFc1RVRkJUU3h2UWtGQmIwSXNSMEZCUnl4bFFVRmxMRU5CUVVNc1RVRkJSQ3hGUVVGVExIZENRVUZVTEVOQlFUVkRPMEZCUTBFc1RVRkJUU3hyUWtGQmEwSXNSMEZCUnl4bFFVRmxMRU5CUVVNc1IwRkJSQ3hGUVVGTkxIRkNRVUZPTEVOQlFURkRPMEZCUTBFc1RVRkJUU3hqUVVGakxFZEJRVWNzWlVGQlpTeERRVUZETEV0QlFVUXNSVUZCVVN4cFFrRkJVaXhEUVVGMFF6dEJRVU5CTEUxQlFVMHNXVUZCV1N4SFFVRkhMR1ZCUVdVc1EwRkJReXhKUVVGRUxFVkJRVThzVDBGQlVDeERRVUZ3UXp0QlFVTkJMRTFCUVUwc1dVRkJXU3hIUVVGSExHVkJRV1VzUTBGQlF5eExRVUZFTEVWQlFWRXNUMEZCVWl4RFFVRndRenRCUVVOQkxFMUJRVTBzVTBGQlV5eEhRVUZITEdWQlFXVXNRMEZCUXl4UlFVRkVMRVZCUVZjc1lVRkJXQ3hEUVVGcVF6dEJRVVZCTEVWQlFVRXNaVUZCWlN4RFFVRkRMRk5CUVdoQ0xFZEJRVFJDTEUxQlFUVkNPMEZCUTBFc1JVRkJRU3hUUVVGVExFTkJRVU1zVTBGQlZpeEhRVUZ6UWl4bFFVRjBRanRCUVVOQkxFVkJRVUVzYjBKQlFXOUNMRU5CUVVNc1UwRkJja0lzUjBGQmFVTXNTMEZCYWtNN1FVRkZRU3hGUVVGQkxGbEJRVmtzUTBGQlF5eFpRVUZpTEVOQlFUQkNMRXRCUVRGQ0xFVkJRV2xETEU5QlFXcERPMEZCUTBFc1JVRkJRU3hUUVVGVExFTkJRVU1zV1VGQlZpeERRVUYxUWl4VFFVRjJRaXhGUVVGclF5eEZRVUZzUXp0QlFVTkJMRVZCUVVFc1UwRkJVeXhEUVVGRExGTkJRVllzUTBGQmIwSXNSMEZCY0VJc1EwRkJkMElzUzBGQmVFSTdRVUZEUVN4RlFVRkJMRk5CUVZNc1EwRkJReXhUUVVGV0xFTkJRVzlDTEVkQlFYQkNMRU5CUVhkQ0xHRkJRWGhDTzBGQlEwRXNSVUZCUVN4WlFVRlpMRU5CUVVNc1UwRkJZaXhIUVVGNVFpeExRVUY2UWp0QlFVTkJMRVZCUVVFc1dVRkJXU3hEUVVGRExGTkJRV0lzUjBGQmVVSXNVVUZCVVN4SFFVRkhMRXRCUVhCRE8wRkJSVUVzUlVGQlFTeEhRVUZITEVOQlFVTXNWMEZCU2l4RFFVRm5RaXhYUVVGb1FqdEJRVU5CTEVWQlFVRXNXVUZCV1N4RFFVRkRMRmRCUVdJc1EwRkJlVUlzV1VGQmVrSTdRVUZGUVN4TlFVRk5MRmRCUVZjc1IwRkJSeXhEUVVGRExHZENRVUZFTEVWQlFXMUNMR3RDUVVGdVFpeEZRVUYxUXl4alFVRjJReXhEUVVGd1FqdEJRVU5CTEUxQlFVMHNaMEpCUVdkQ0xFZEJRVWNzUTBGQlF5eFpRVUZFTEVWQlFXVXNaVUZCWml4RlFVRm5ReXh2UWtGQmFFTXNRMEZCZWtJN1FVRkRRU3hOUVVGTkxHTkJRV01zUjBGQlJ5eERRVUZETEZsQlFVUXNSVUZCWlN4WlFVRm1MRVZCUVRaQ0xGTkJRVGRDTEVOQlFYWkNPMEZCUlVFc1JVRkJRU3gxUWtGQmRVSXNRMEZCUXl4WFFVRkVMRVZCUVdNc1YwRkJaQ3hEUVVGMlFqdEJRVU5CTEVWQlFVRXNkVUpCUVhWQ0xFTkJRVU1zWjBKQlFVUXNSVUZCYlVJc1owSkJRVzVDTEVOQlFYWkNPMEZCUTBFc1JVRkJRU3gxUWtGQmRVSXNRMEZCUXl4alFVRkVMRVZCUVdsQ0xHTkJRV3BDTEVOQlFYWkNPMEZCUlVFc1UwRkJUeXhIUVVGUU8wRkJRMEVzUTBGMFEwUTdPMEZCZDBOQkxFbEJRVTBzWTBGQll5eEhRVUZITEZOQlFXcENMR05CUVdsQ0xGRkJRVzlFTzBGQlFVRXNUVUZCYWtRc1JVRkJhVVFzVTBGQmFrUXNSVUZCYVVRN1FVRkJRU3hOUVVFM1F5eExRVUUyUXl4VFFVRTNReXhMUVVFMlF6dEJRVUZCTEUxQlFYUkRMRTlCUVhORExGTkJRWFJETEU5QlFYTkRPMEZCUVVFc1RVRkJOMElzUzBGQk5rSXNVMEZCTjBJc1MwRkJOa0k3UVVGQlFTeE5RVUYwUWl4UlFVRnpRaXhUUVVGMFFpeFJRVUZ6UWp0QlFVRkJMRTFCUVZvc1MwRkJXU3hUUVVGYUxFdEJRVms3UVVGRk1VVXNUVUZCVFN4UlFVRlJMRWRCUVVjc1pVRkJaU3hEUVVGRExFbEJRVVFzUTBGQmFFTTdRVUZEUVN4TlFVRk5MRmRCUVZjc1IwRkJSeXhsUVVGbExFTkJRVU1zUzBGQlJDeEZRVUZSTEdsQ1FVRlNMRU5CUVc1RE8wRkJRMEVzVFVGQlRTeGpRVUZqTEVkQlFVY3NaVUZCWlN4RFFVRkRMRTlCUVVRc1EwRkJkRU03UVVGRFFTeE5RVUZOTEZWQlFWVXNSMEZCUnl4bFFVRmxMRU5CUVVNc1MwRkJSQ3hGUVVGUkxIZENRVUZTTEVOQlFXeERPMEZCUTBFc1RVRkJUU3hWUVVGVkxFZEJRVWNzWlVGQlpTeERRVUZETEV0QlFVUXNSVUZCVVN4eFFrRkJVaXhEUVVGc1F6dEJRVU5CTEUxQlFVMHNXVUZCV1N4SFFVRkhMR1ZCUVdVc1EwRkJReXhKUVVGRUxFVkJRVThzZFVKQlFWQXNRMEZCY0VNN1FVRkRRU3hOUVVGTkxGbEJRVmtzUjBGQlJ5eGxRVUZsTEVOQlFVTXNUVUZCUkN4RlFVRlRMSFZDUVVGVUxFTkJRWEJETzBGQlEwRXNUVUZCVFN4bFFVRmxMRWRCUVVjc1pVRkJaU3hEUVVGRExFOUJRVVFzUlVGQlZTd3dRa0ZCVml4RFFVRjJRenRCUVVOQkxFMUJRVTBzYVVKQlFXbENMRWRCUVVjc1pVRkJaU3hEUVVGRExFMUJRVVFzUlVGQlV5eDFRa0ZCVkN4RFFVRjZRenRCUVVOQkxFMUJRVTBzWVVGQllTeEhRVUZITEdWQlFXVXNRMEZCUXl4UlFVRkVMRVZCUVZjc2QwSkJRVmdzUTBGQmNrTTdRVUZGUVN4RlFVRkJMR05CUVdNc1EwRkJReXhaUVVGbUxFTkJRVFJDTEUxQlFUVkNMRVZCUVc5RExGRkJRWEJETzBGQlEwRXNSVUZCUVN4alFVRmpMRU5CUVVNc1dVRkJaaXhEUVVFMFFpeE5RVUUxUWl4RlFVRnZReXhUUVVGd1F6dEJRVU5CTEVWQlFVRXNZMEZCWXl4RFFVRkRMRmxCUVdZc1EwRkJORUlzVDBGQk5VSXNSVUZCY1VNc1JVRkJja003UVVGRFFTeEZRVUZCTEZWQlFWVXNRMEZCUXl4WlFVRllMRU5CUVhkQ0xFdEJRWGhDTEVWQlFTdENMRTlCUVM5Q08wRkJRMEVzUlVGQlFTeGxRVUZsTEVOQlFVTXNXVUZCYUVJc1EwRkJOa0lzVTBGQk4wSXNSVUZCZDBNc1JVRkJlRU03UVVGRFFTeEZRVUZCTEdGQlFXRXNRMEZCUXl4WlFVRmtMRU5CUVRKQ0xGTkJRVE5DTEVWQlFYTkRMRVZCUVhSRE8wRkJRMEVzUlVGQlFTeGxRVUZsTEVOQlFVTXNXVUZCYUVJc1EwRkJOa0lzVFVGQk4wSXNSVUZCY1VNc1VVRkJja003UVVGRFFTeEZRVUZCTEdWQlFXVXNRMEZCUXl4WlFVRm9RaXhEUVVFMlFpeE5RVUUzUWl4RlFVRnhReXhWUVVGeVF6dEJRVU5CTEVWQlFVRXNaVUZCWlN4RFFVRkRMRmxCUVdoQ0xFTkJRVFpDTEU5QlFUZENMRVZCUVhORExFdEJRWFJETzBGQlJVRXNSVUZCUVN4WlFVRlpMRU5CUVVNc1UwRkJZaXhIUVVGNVFpeExRVUY2UWp0QlFVTkJMRVZCUVVFc1dVRkJXU3hEUVVGRExGTkJRV0lzUjBGQmVVSXNVVUZCVVN4SFFVRkhMRXRCUVhCRE8wRkJRMEVzUlVGQlFTeHBRa0ZCYVVJc1EwRkJReXhUUVVGc1FpeGhRVUZwUXl4UlFVRnFReXhUUVVFMFF5eERRVUZETEV0QlFVUXNSMEZCVXl4RFFVRkRMRXRCUVhSRU8wRkJRMEVzUlVGQlFTeGhRVUZoTEVOQlFVTXNVMEZCWkN4SFFVRXdRaXhIUVVFeFFqdEJRVVZCTEUxQlFVMHNiVUpCUVcxQ0xFZEJRVWNzUTBGQlF5eGpRVUZFTEVWQlFXbENMRlZCUVdwQ0xFVkJRVFpDTEZsQlFUZENMRVZCUVRKRExGbEJRVE5ETEVWQlFYbEVMR1ZCUVhwRUxFVkJRVEJGTEdsQ1FVRXhSU3hGUVVFMlJpeGhRVUUzUml4RFFVRTFRanRCUVVOQkxFVkJRVUVzZFVKQlFYVkNMRU5CUVVNc2JVSkJRVVFzUlVGQmMwSXNWMEZCZEVJc1EwRkJka0k3UVVGRlFTeEZRVUZCTEZWQlFWVXNRMEZCUXl4WFFVRllMRU5CUVhWQ0xGVkJRWFpDTzBGQlEwRXNSVUZCUVN4UlFVRlJMRU5CUVVNc1YwRkJWQ3hEUVVGeFFpeFhRVUZ5UWp0QlFVVkJMRk5CUVU4c1VVRkJVRHRCUVVOQkxFTkJia05FT3p0QlFYRkRUeXhKUVVGTkxHTkJRV01zUjBGQlJ5eFRRVUZxUWl4alFVRnBRaXhEUVVGRExGRkJRVVFzUlVGQll6dEJRVU16UXl4TlFVRk5MRWxCUVVrc1IwRkJSeXhSUVVGUkxFTkJRVU1zWTBGQlZDeERRVUYzUWl4alFVRjRRaXhEUVVGaU8wRkJSVUVzUlVGQlFTeFJRVUZSTEVOQlFVTXNUMEZCVkN4RFFVRnBRaXhWUVVGQkxFOUJRVThzUlVGQlNUdEJRVU16UWl4SlFVRkJMRWxCUVVrc1EwRkJReXhYUVVGTUxFTkJRV2xDTEdsQ1FVRnBRaXhEUVVGRExFOUJRVVFzUTBGQmJFTTdRVUZEUVN4SFFVWkVPMEZCUjBFc1EwRk9UVHM3T3p0QlFWRkJMRWxCUVUwc1ZVRkJWU3hIUVVGSExGTkJRV0lzVlVGQllTeERRVUZETEZGQlFVUXNSVUZCWXp0QlFVTjJReXhOUVVGTkxFbEJRVWtzUjBGQlJ5eFJRVUZSTEVOQlFVTXNZVUZCVkN4RFFVRjFRaXhaUVVGMlFpeERRVUZpTzBGQlEwRXNUVUZCVFN4UlFVRlJMRWRCUVVjc1VVRkJVU3hEUVVGRExHRkJRVlFzUTBGQmRVSXNZMEZCZGtJc1EwRkJha0k3UVVGRFFTeE5RVUZOTEV0QlFVc3NSMEZCUnl4UlFVRlJMRU5CUVVNc1lVRkJWQ3hEUVVGMVFpeGpRVUYyUWl4RFFVRmtPenRCUVVWQkxGTkJRVThzU1VGQlNTeERRVUZETEZWQlFWb3NSVUZCZDBJN1FVRkRka0lzU1VGQlFTeEpRVUZKTEVOQlFVTXNWMEZCVEN4RFFVRnBRaXhKUVVGSkxFTkJRVU1zVlVGQmRFSTdRVUZEUVRzN1FVRkZSQ3hOUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFXUXNSVUZCYzBJN1FVRkRja0lzVjBGQlR5eEpRVUZKTEVOQlFVTXNVMEZCVEN4RFFVRmxMRWRCUVdZc1EwRkJiVUlzV1VGQmJrSXNRMEZCVUR0QlFVTkJMRWRCUmtRc1RVRkZUenRCUVVOT0xFbEJRVUVzU1VGQlNTeERRVUZETEZOQlFVd3NRMEZCWlN4TlFVRm1MRU5CUVhOQ0xGbEJRWFJDTzBGQlEwRTdPMEZCUlVRc1RVRkJTU3hSUVVGS08wRkJSVUVzUlVGQlFTeFJRVUZSTEVOQlFVTXNUMEZCVkN4RFFVRnBRaXhWUVVGQkxFOUJRVThzUlVGQlNUdEJRVU16UWl4SlFVRkJMRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zVVVGQmJrSTdRVUZEUVN4SlFVRkJMRWxCUVVrc1EwRkJReXhYUVVGTUxFTkJRV2xDTEdOQlFXTXNRMEZCUXl4UFFVRkVMRU5CUVM5Q08wRkJRMEVzUjBGSVJEdEJRVXRCTEVWQlFVRXNTMEZCU3l4RFFVRkRMRk5CUVU0c2IwSkJRVFJDTEZGQlFUVkNMRk5CUVhWRExIZENRVUYyUXp0QlFVTkJMRU5CZGtKTk96czdPMEZCZVVKQkxFbEJRVTBzWjBKQlFXZENMRWRCUVVjc1UwRkJia0lzWjBKQlFXMUNMRWRCUVUwN1FVRkRja01zVFVGQlRTeEpRVUZKTEVkQlFVY3NaVUZCWlN4RFFVRkRMRTFCUVVRc1JVRkJVeXhoUVVGVUxFTkJRVFZDTzBGQlEwRXNSVUZCUVN4SlFVRkpMRU5CUVVNc1UwRkJUQ3hEUVVGbExFZEJRV1lzUTBGQmJVSXNUMEZCYmtJN1FVRkRRU3hGUVVGQkxFbEJRVWtzUTBGQlF5eFRRVUZNTEVOQlFXVXNSMEZCWml4RFFVRnRRaXhsUVVGdVFqdEJRVU5CTEVWQlFVRXNTVUZCU1N4RFFVRkRMRk5CUVV3c1IwRkJhVUlzWlVGQmFrSTdRVUZEUVN4RlFVRkJMRkZCUVZFc1EwRkJReXhKUVVGVUxFTkJRV01zVjBGQlpDeERRVUV3UWl4SlFVRXhRanRCUVVOQkxFVkJRVUVzVlVGQlZTeERRVUZETEZsQlFVMDdRVUZEYUVJc1NVRkJRU3hSUVVGUkxFTkJRVU1zU1VGQlZDeERRVUZqTEZkQlFXUXNRMEZCTUVJc1NVRkJNVUk3UVVGRFFTeEhRVVpUTEVWQlJWQXNTVUZHVHl4RFFVRldPMEZCUjBFc1EwRlVUVHM3T3pzN096czdPenM3TzBGREwwaFFMRk5CUVZNc1lVRkJWQ3hIUVVGM1FqdEJRVU4yUWl4UFFVRkxMRTlCUVV3c1IwRkJaU3haUVVGbU96dEJRVVZCTEU5QlFVc3NSMEZCVEN4SFFVRlhMRlZCUVVNc1IwRkJSQ3hGUVVGVE8wRkJRMjVDTEZkQlFVOHNTVUZCU1N4RFFVRkRMRXRCUVV3c1EwRkJWeXhaUVVGWkxFTkJRVU1zVDBGQllpeERRVUZ4UWl4SFFVRnlRaXhEUVVGWUxFTkJRVkE3UVVGRFFTeEhRVVpFT3p0QlFVZEJMRTlCUVVzc1IwRkJUQ3hIUVVGWExGVkJRVU1zUjBGQlJDeEZRVUZOTEV0QlFVNHNSVUZCWjBJN1FVRkRNVUlzU1VGQlFTeFpRVUZaTEVOQlFVTXNUMEZCWWl4RFFVRnhRaXhIUVVGeVFpeEZRVUV3UWl4SlFVRkpMRU5CUVVNc1UwRkJUQ3hEUVVGbExFdEJRV1lzUTBGQk1VSTdRVUZEUVN4SFFVWkVPenRCUVVkQkxFOUJRVXNzVFVGQlRDeEhRVUZqTEZWQlFVTXNSMEZCUkN4RlFVRlRPMEZCUTNSQ0xFbEJRVUVzV1VGQldTeERRVUZETEZWQlFXSXNRMEZCZDBJc1IwRkJlRUk3UVVGRFFTeEhRVVpFTzBGQlIwRTdPMEZCUlVRc1NVRkJUU3hQUVVGUExFZEJRVWNzU1VGQlNTeGhRVUZLTEVWQlFXaENPMlZCUldVc1R5SXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpS0daMWJtTjBhVzl1S0NsN1puVnVZM1JwYjI0Z2NpaGxMRzRzZENsN1puVnVZM1JwYjI0Z2J5aHBMR1lwZTJsbUtDRnVXMmxkS1h0cFppZ2haVnRwWFNsN2RtRnlJR005WENKbWRXNWpkR2x2Ymx3aVBUMTBlWEJsYjJZZ2NtVnhkV2x5WlNZbWNtVnhkV2x5WlR0cFppZ2haaVltWXlseVpYUjFjbTRnWXlocExDRXdLVHRwWmloMUtYSmxkSFZ5YmlCMUtHa3NJVEFwTzNaaGNpQmhQVzVsZHlCRmNuSnZjaWhjSWtOaGJtNXZkQ0JtYVc1a0lHMXZaSFZzWlNBblhDSXJhU3RjSWlkY0lpazdkR2h5YjNjZ1lTNWpiMlJsUFZ3aVRVOUVWVXhGWDA1UFZGOUdUMVZPUkZ3aUxHRjlkbUZ5SUhBOWJsdHBYVDE3Wlhod2IzSjBjenA3ZlgwN1pWdHBYVnN3WFM1allXeHNLSEF1Wlhod2IzSjBjeXhtZFc1amRHbHZiaWh5S1h0MllYSWdiajFsVzJsZFd6RmRXM0pkTzNKbGRIVnliaUJ2S0c1OGZISXBmU3h3TEhBdVpYaHdiM0owY3l4eUxHVXNiaXgwS1gxeVpYUjFjbTRnYmx0cFhTNWxlSEJ2Y25SemZXWnZjaWgyWVhJZ2RUMWNJbVoxYm1OMGFXOXVYQ0k5UFhSNWNHVnZaaUJ5WlhGMWFYSmxKaVp5WlhGMWFYSmxMR2s5TUR0cFBIUXViR1Z1WjNSb08ya3JLeWx2S0hSYmFWMHBPM0psZEhWeWJpQnZmWEpsZEhWeWJpQnlmU2tvS1NJc0ltbHRjRzl5ZENCVGRHOXlZV2RsSUdaeWIyMGdKeTR2YzNSdmNtRm5aVWhsYkhCbGNpYzdYSEpjYm1sdGNHOXlkQ0JuWlhSUWNtOWtkV04wY3lCbWNtOXRJQ2N1TDJabGRHTm9KenRjY2x4dWFXMXdiM0owSUhzZ2NtVnVaR1Z5VUhKdlpIVmpkSE1zSUhKbGJtUmxja05oY25Rc0lISmxibVJsY2xOMVkyTmxjM05OYzJjZ2ZTQm1jbTl0SUNjdUwzSmxibVJsY2ljN1hISmNibWx0Y0c5eWRDQjdJR2RsZEVOaGNuUldZV3gxWlN3Z1lXUmtWRzlEWVhKMFNHRnVaR3hsY2l3Z1oyVjBRMkZ5ZEVsMFpXMXpMQ0JqYUdGdVoyVlFjbTlrZFdOMFVYVmhiblJwZEhrc0lISmxiVzkyWlZCeWIyUjFZM1JHY205dFEyRnlkQ0I5SUdaeWIyMGdKeTR2WTJGeWRDYzdYSEpjYm1sdGNHOXlkQ0I3SUcxdlpHRnNUM0JsYmtoaGJtUnNaWElzSUcxdlpHRnNRMnh2YzJWSVlXNWtiR1Z5SUgwZ1puSnZiU0FuTGk5dGIyUmhiQ2M3WEhKY2JseHlYRzVqYjI1emRDQndjbTlrZFdOMGMxSmxZV1I1UlhabGJuUk9ZVzFsSUQwZ0ozQnliMlIxWTNSelgzSmxZV1I1Snp0Y2NseHViR1YwSUhCeWIyUjFZM1J6VW1WaFpIbEZkbVZ1ZENBOUlHNWxkeUJGZG1WdWRDaHdjbTlrZFdOMGMxSmxZV1I1UlhabGJuUk9ZVzFsS1R0Y2NseHVYSEpjYm1OdmJuTjBJR05oY25SR2IzSnRJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbTF2WkdGc1gxOW1iM0p0SnlrN1hISmNibHh5WEc1blpYUlFjbTlrZFdOMGN5Z25hSFIwY0hNNkx5OXRlUzFxYzI5dUxYTmxjblpsY2k1MGVYQnBZMjlrWlM1amIyMHZkbTl5YjNSdWFYRjFaUzltWVd0bGMyVnlkbVZ5TDJSaUp5bGNjbHh1TG5Sb1pXNG9YSEpjYmx4MFpuVnVZM1JwYjI0b2NtVnpjRzl1YzJVcElIdGNjbHh1WEhSY2RHbG1JQ2h5WlhOd2IyNXpaUzV6ZEdGMGRYTWdJVDA5SURJd01Da2dlMXh5WEc1Y2RGeDBYSFJqYjI1emIyeGxMbXh2WnloZ1RHOXZhM01nYkdsclpTQjBhR1Z5WlNCM1lYTWdZU0J3Y205aWJHVnRMaUJUZEdGMGRYTWdRMjlrWlRvZ0pIdHlaWE53YjI1elpTNXpkR0YwZFhOOVlDazdYSEpjYmx4MFhIUmNkSEpsZEhWeWJqdGNjbHh1WEhSY2RIMWNjbHh1WEhKY2JseDBYSFJ5WlhOd2IyNXpaUzVxYzI5dUtDbGNjbHh1WEhSY2RDNTBhR1Z1S0NoN2NISnZaSFZqZEhOOUtTQTlQaUI3WEhKY2JseDBYSFJjZEZOMGIzSmhaMlV1YzJWMEtDZHdjbTlrZFdOMGN5Y3NJSEJ5YjJSMVkzUnpLVHRjY2x4dVhIUmNkRngwWkc5amRXMWxiblF1WkdsemNHRjBZMmhGZG1WdWRDaHdjbTlrZFdOMGMxSmxZV1I1UlhabGJuUXBPMXh5WEc1Y2RGeDBmU2s3WEhKY2JseDBmVnh5WEc1Y2RDbGNjbHh1TG1OaGRHTm9LR1oxYm1OMGFXOXVLR1Z5Y2lrZ2UxeHlYRzVjZEdOdmJuTnZiR1V1Ykc5bktDZEdaWFJqYUNCRmNuSnZjaUE2TFZNbkxDQmxjbklwTzF4eVhHNTlLVHRjY2x4dVhISmNibVJ2WTNWdFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2dLR1YyWlc1MEtTQTlQaUI3WEhKY2JseDBZMjl1YzNRZ2RHRnlaMlYwSUQwZ1pYWmxiblF1ZEdGeVoyVjBPMXh5WEc1Y2NseHVYSFJwWmlBb2RHRnlaMlYwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbllXUmtMWFJ2TFdOaGNuUW5LU2tnZTF4eVhHNWNkRngwWVdSa1ZHOURZWEowU0dGdVpHeGxjaWgwWVhKblpYUXBPMXh5WEc1Y2RGeDBjbVZ1WkdWeVUzVmpZMlZ6YzAxelp5Z3BPMXh5WEc1Y2RIMWNjbHh1WEhKY2JseDBhV1lnS0hSaGNtZGxkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJOaGNuUW5LU2tnZTF4eVhHNWNkRngwYlc5a1lXeFBjR1Z1U0dGdVpHeGxjaWdwTzF4eVhHNWNkRngwY21WdVpHVnlRMkZ5ZENoblpYUkRZWEowU1hSbGJYTW9aMlYwUTJGeWRGWmhiSFZsS0Nrc0lGTjBiM0poWjJVdVoyVjBLQ2R3Y205a2RXTjBjeWNwS1NrN1hISmNibHgwZlZ4eVhHNWNjbHh1WEhScFppQW9kR0Z5WjJWMExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25iVzlrWVd4ZlgyTnNiM05sSnlrcElIdGNjbHh1WEhSY2RHMXZaR0ZzUTJ4dmMyVklZVzVrYkdWeUtDazdYSEpjYmx4MGZWeHlYRzVjY2x4dVhIUnBaaUFvZEdGeVoyVjBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWTJ4bFlYSXRZblJ1SnlrcElIdGNjbHh1WEhSY2RGTjBiM0poWjJVdWMyVjBLQ2RqWVhKMEp5d2dlMzBwTzF4eVhHNWNkRngwY21WdVpHVnlRMkZ5ZENoYlhTazdYSEpjYmx4MFhIUm5aWFJEWVhKMFZtRnNkV1VvS1R0Y2NseHVYSFI5WEhKY2JseHlYRzVjZEdsbUlDaDBZWEpuWlhRdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHpkV0p0YVhRdFluUnVKeWtwSUh0Y2NseHVYSFJjZEdWMlpXNTBMbkJ5WlhabGJuUkVaV1poZFd4MEtDazdYSEpjYmx4MGZWeHlYRzVjY2x4dVhIUnBaaUFvZEdGeVoyVjBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWTJGeWRDMXNhWE4wWDE5cGRHVnRMWEpsYlc5MlpTY3BLU0I3WEhKY2JseDBYSFJsZG1WdWRDNXdjbVYyWlc1MFJHVm1ZWFZzZENncE8xeHlYRzVjZEZ4MGNtVnRiM1psVUhKdlpIVmpkRVp5YjIxRFlYSjBLSFJoY21kbGRDazdYSEpjYmx4MFhIUnlaVzVrWlhKRFlYSjBLR2RsZEVOaGNuUkpkR1Z0Y3loblpYUkRZWEowVm1Gc2RXVW9LU3dnVTNSdmNtRm5aUzVuWlhRb0ozQnliMlIxWTNSekp5a3BLVHRjY2x4dVhIUjlYSEpjYmx4eVhHNTlLVHRjY2x4dVhISmNibVJ2WTNWdFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9jSEp2WkhWamRITlNaV0ZrZVVWMlpXNTBUbUZ0WlN3Z0tDa2dQVDRnZTF4eVhHNWNkR052Ym5OMElHeHZZV1JsY2lBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnlOd2NtOXdaV3hzWlhJdGJHOWhaR1Z5SnlrN1hISmNibHgwY21WdVpHVnlVSEp2WkhWamRITW9VM1J2Y21GblpTNW5aWFFvSjNCeWIyUjFZM1J6SnlrcE8xeHlYRzVjZEdkbGRFTmhjblJXWVd4MVpTZ3BPMXh5WEc1Y2RHeHZZV1JsY2k1amJHRnpjMHhwYzNRdVlXUmtLQ2RvYVdSa1pXNG5LVHRjY2x4dWZTazdYSEpjYmx4eVhHNWpZWEowUm05eWJTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGphR0Z1WjJVbkxDQW9aWFpsYm5RcElEMCtJSHRjY2x4dVhIUmphR0Z1WjJWUWNtOWtkV04wVVhWaGJuUnBkSGtvWlhabGJuUXVkR0Z5WjJWMEtUdGNjbHh1WEhSeVpXNWtaWEpEWVhKMEtHZGxkRU5oY25SSmRHVnRjeWhuWlhSRFlYSjBWbUZzZFdVb0tTd2dVM1J2Y21GblpTNW5aWFFvSjNCeWIyUjFZM1J6SnlrcEtUdGNjbHh1ZlNrN1hISmNibHh5WEc0a0tHUnZZM1Z0Wlc1MEtTNXlaV0ZrZVNobWRXNWpkR2x2YmlncGUxeHlYRzVjY2x4dVhIUWtLSGRwYm1SdmR5a3VjMk55YjJ4c0tHWjFibU4wYVc5dUtDbDdYSEpjYmx4MFhIUnBaaUFvSkNoMGFHbHpLUzV6WTNKdmJHeFViM0FvS1NBK0lERXdNQ2tnZTF4eVhHNWNkRngwWEhRa0tDY3VjMk55YjJ4c2RYQW5LUzVtWVdSbFNXNG9LVHRjY2x4dVhIUmNkSDBnWld4elpTQjdYSEpjYmx4MFhIUmNkQ1FvSnk1elkzSnZiR3gxY0NjcExtWmhaR1ZQZFhRb0tUdGNjbHh1WEhSY2RIMWNjbHh1WEhSOUtUdGNjbHh1WEhKY2JseDBKQ2duTG5OamNtOXNiSFZ3SnlrdVkyeHBZMnNvWm5WdVkzUnBiMjRvS1h0Y2NseHVYSFJjZENRb1hDSm9kRzFzTENCaWIyUjVYQ0lwTG1GdWFXMWhkR1VvZXlCelkzSnZiR3hVYjNBNklEQWdmU3dnTmpBd0tUdGNjbHh1WEhSY2RISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dVhIUjlLVHRjY2x4dVhISmNibjBwTzF4eVhHNWNjbHh1THk4Z0pDaGtiMk4xYldWdWRDa3VjbVZoWkhrb1puVnVZM1JwYjI0b0tYdGNjbHh1THk4Z0lDQWtLRndpTG05M2JDMWpZWEp2ZFhObGJGd2lLUzV2ZDJ4RFlYSnZkWE5sYkNncE8xeHlYRzR2THlCOUtUdGNjbHh1WEhKY2JpUW9aRzlqZFcxbGJuUXBMbkpsWVdSNUtHWjFibU4wYVc5dUtDbDdYSEpjYmx4MEpDZ25MbU5oY205MWMyVnNKeWt1YzJ4cFkyc29lMXh5WEc1Y2RGeDBZMlZ1ZEdWeVRXOWtaVG9nZEhKMVpTeGNjbHh1WEhSY2RHTmxiblJsY2xCaFpHUnBibWM2SUNjMk1IQjRKeXhjY2x4dVhIUmNkSE5zYVdSbGMxUnZVMmh2ZHpvZ015eGNjbHh1WEhSY2RHRjFkRzl3YkdGNU9pQjBjblZsTEZ4eVhHNWNkRngwWVhWMGIzQnNZWGxUY0dWbFpEb2dNekF3TUN4Y2NseHVYSFJjZEhKbGMzQnZibk5wZG1VNklGdGNjbHh1WEhSY2RIdGNjbHh1WEhSY2RGeDBZbkpsWVd0d2IybHVkRG9nTnpZNExGeHlYRzVjZEZ4MFhIUnpaWFIwYVc1bmN6b2dlMXh5WEc1Y2RGeDBYSFJjZEdGeWNtOTNjem9nWm1Gc2MyVXNYSEpjYmx4MFhIUmNkRngwWTJWdWRHVnlUVzlrWlRvZ2RISjFaU3hjY2x4dVhIUmNkRngwWEhSalpXNTBaWEpRWVdSa2FXNW5PaUFuTkRCd2VDY3NYSEpjYmx4MFhIUmNkRngwYzJ4cFpHVnpWRzlUYUc5M09pQXpYSEpjYmx4MFhIUmNkSDFjY2x4dVhIUmNkSDBzWEhKY2JseDBYSFI3WEhKY2JseDBYSFJjZEdKeVpXRnJjRzlwYm5RNklEUTRNQ3hjY2x4dVhIUmNkRngwYzJWMGRHbHVaM002SUh0Y2NseHVYSFJjZEZ4MFhIUmhjbkp2ZDNNNklHWmhiSE5sTEZ4eVhHNWNkRngwWEhSY2RHTmxiblJsY2sxdlpHVTZJSFJ5ZFdVc1hISmNibHgwWEhSY2RGeDBZMlZ1ZEdWeVVHRmtaR2x1WnpvZ0p6UXdjSGduTEZ4eVhHNWNkRngwWEhSY2RITnNhV1JsYzFSdlUyaHZkem9nTVZ4eVhHNWNkRngwWEhSOVhISmNibHgwWEhSOVhISmNibHgwWEhSZFhISmNibHgwZlNrN1hISmNibjBwT3lJc0ltbHRjRzl5ZENCVGRHOXlZV2RsSUdaeWIyMGdKeTR2YzNSdmNtRm5aVWhsYkhCbGNpYzdYSEpjYmx4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnWjJWMFEyRnlkRlpoYkhWbElEMGdLQ2tnUFQ0Z2UxeHlYRzVjZEdOdmJuTjBJR3hoWW1Wc0lEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxtTmhjblJmWDJ4aFltVnNKeWs3WEhKY2JseDBZMjl1YzNRZ1kyRnlkRlpoYkhWbElEMGdVM1J2Y21GblpTNW5aWFFvSjJOaGNuUW5LVHRjY2x4dVhISmNibHgwYVdZZ0tDRmpZWEowVm1Gc2RXVWdmSHdnSVU5aWFtVmpkQzVyWlhsektHTmhjblJXWVd4MVpTa3ViR1Z1WjNSb0tTQjdYSEpjYmx4MFhIUnNZV0psYkM1cGJtNWxjbFJsZUhRZ1BTQXdPMXh5WEc1Y2RGeDBjbVYwZFhKdUlIdDlPMXh5WEc1Y2RIMWNjbHh1WEhKY2JseDBiR0ZpWld3dWFXNXVaWEpVWlhoMElEMGdUMkpxWldOMExuWmhiSFZsY3loallYSjBWbUZzZFdVcExuSmxaSFZqWlNnb1lXTmpMQ0JqZFhJcElEMCtJQ3RoWTJNZ0t5QXJZM1Z5S1R0Y2NseHVYSEpjYmx4MGNtVjBkWEp1SUdOaGNuUldZV3gxWlR0Y2NseHVmVnh5WEc1Y2NseHVaWGh3YjNKMElHTnZibk4wSUdkbGRFTmhjblJKZEdWdGN5QTlJQ2hqWVhKMFZtRnNkV1VzSUhCeWIyUjFZM1J6S1NBOVBpQjdYSEpjYmx4MGNtVjBkWEp1SUU5aWFtVmpkQzVyWlhsektHTmhjblJXWVd4MVpTa3ViV0Z3S0dsa0lEMCtJSHRjY2x4dVhIUmNkSEpsZEhWeWJpQndjbTlrZFdOMGN5NW1hV3gwWlhJb2NISnZaSFZqZENBOVBpQjdYSEpjYmx4MFhIUmNkR2xtSUNod2NtOWtkV04wTG1sa0lEMDlJR2xrS1NCN1hISmNibHgwWEhSY2RGeDBjSEp2WkhWamRDNTBiM1JoYkNBOUlHTmhjblJXWVd4MVpWdHBaRjA3WEhKY2JseDBYSFJjZEZ4MGNtVjBkWEp1SUhCeWIyUjFZM1E3WEhKY2JseDBYSFJjZEgxY2NseHVYSFJjZEgwcFd6QmRPMXh5WEc1Y2RIMHBPMXh5WEc1OVhISmNibHh5WEc1bGVIQnZjblFnWTI5dWMzUWdZV1JrVkc5RFlYSjBTR0Z1Wkd4bGNpQTlJQ2gwWVhKblpYUXBJRDArSUh0Y2NseHVYSFJqYjI1emRDQmpZWEowSUQwZ1oyVjBRMkZ5ZEZaaGJIVmxLQ2s3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEVsa0lEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXBaQ2NwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSelRHbHpkQ0E5SUZOMGIzSmhaMlV1WjJWMEtDZHdjbTlrZFdOMGN5Y3BPMXh5WEc1Y2RHTnZibk4wSUdOb2IzTmxibEJ5YjJSMVkzUWdQU0J3Y205a2RXTjBjMHhwYzNRdVptbHNkR1Z5S0dWc1pXMWxiblFnUFQ0Z1pXeGxiV1Z1ZEM1cFpDQTlQU0J3Y205a2RXTjBTV1FwV3pCZE8xeHlYRzVjY2x4dVhIUnBaaUFvWTJGeWRGdGphRzl6Wlc1UWNtOWtkV04wTG1sa1hTa2dlMXh5WEc1Y2RGeDBZMkZ5ZEZ0amFHOXpaVzVRY205a2RXTjBMbWxrWFNzclhISmNibHgwZlNCbGJITmxJSHRjY2x4dVhIUmNkR05oY25SYlkyaHZjMlZ1VUhKdlpIVmpkQzVwWkYwZ1BTQXhPMXh5WEc1Y2RIMWNjbHh1WEhKY2JseDBVM1J2Y21GblpTNXpaWFFvSjJOaGNuUW5MQ0JqWVhKMEtUdGNjbHh1WEhSblpYUkRZWEowVm1Gc2RXVW9LVHRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdOdmJuTjBJSEpsYlc5MlpVWnliMjFEWVhKMFNHRnVaR3hsY2lBOUlDaDBZWEpuWlhRcElEMCtJSHRjY2x4dVhIUmpiMjV6ZENCallYSjBJRDBnWjJWMFEyRnlkRlpoYkhWbEtDazdYSEpjYmx4MFkyOXVjM1FnY0hKdlpIVmpkRWxrSUQwZ2RHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxcFpDY3BPMXh5WEc1Y2RHTnZibk4wSUhCeWIyUjFZM1J6VEdsemRDQTlJRk4wYjNKaFoyVXVaMlYwS0Nkd2NtOWtkV04wY3ljcE8xeHlYRzVjZEdOdmJuTjBJR05vYjNObGJsQnliMlIxWTNRZ1BTQndjbTlrZFdOMGMweHBjM1F1Wm1sc2RHVnlLR1ZzWlcxbGJuUWdQVDRnWld4bGJXVnVkQzVwWkNBOVBTQndjbTlrZFdOMFNXUXBXekJkTzF4eVhHNWNjbHh1WEhScFppQW9ZMkZ5ZEZ0amFHOXpaVzVRY205a2RXTjBMbWxrWFNBbUppQmpZWEowVzJOb2IzTmxibEJ5YjJSMVkzUXVhV1JkSUQ0Z01Da2dlMXh5WEc1Y2RGeDBZMkZ5ZEZ0amFHOXpaVzVRY205a2RXTjBMbWxrWFMwdFhISmNibHgwZlNCbGJITmxJSHRjY2x4dVhIUmNkR05oY25SYlkyaHZjMlZ1VUhKdlpIVmpkQzVwWkYwZ1BTQXdPMXh5WEc1Y2RIMWNjbHh1WEhKY2JseDBVM1J2Y21GblpTNXpaWFFvSjJOaGNuUW5MQ0JqWVhKMEtUdGNjbHh1WEhSblpYUkRZWEowVm1Gc2RXVW9LVHRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdOdmJuTjBJR05vWVc1blpWQnliMlIxWTNSUmRXRnVkR2wwZVNBOUlDaDBZWEpuWlhRcElEMCtJSHRjY2x4dVhIUmpiMjV6ZENCdVpYZFJkV0Z1ZEdsMGVTQTlJQ3QwWVhKblpYUXVkbUZzZFdVZ1BDQXhJRDhnTVNBNklDdDBZWEpuWlhRdWRtRnNkV1U3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEVsa0lEMGdkR0Z5WjJWMExtRjBkSEpwWW5WMFpYTmJKMlJoZEdFdGFXUW5YUzUyWVd4MVpUdGNjbHh1WEhSamIyNXpkQ0JqWVhKMElEMGdaMlYwUTJGeWRGWmhiSFZsS0NrN1hISmNibHgwWTI5dWMzUWdjSEp2WkhWamRITk1hWE4wSUQwZ1UzUnZjbUZuWlM1blpYUW9KM0J5YjJSMVkzUnpKeWs3WEhKY2JseDBZMjl1YzNRZ1kyaHZjMlZ1VUhKdlpIVmpkQ0E5SUhCeWIyUjFZM1J6VEdsemRDNW1hV3gwWlhJb1pXeGxiV1Z1ZENBOVBpQmxiR1Z0Wlc1MExtbGtJRDA5SUhCeWIyUjFZM1JKWkNsYk1GMDdYSEpjYmx4eVhHNWNkR2xtSUNoallYSjBXMk5vYjNObGJsQnliMlIxWTNRdWFXUmRLU0I3WEhKY2JseDBYSFJqWVhKMFcyTm9iM05sYmxCeWIyUjFZM1F1YVdSZElEMGdibVYzVVhWaGJuUnBkSGs3WEhKY2JseDBmVnh5WEc1Y2NseHVYSFJUZEc5eVlXZGxMbk5sZENnblkyRnlkQ2NzSUdOaGNuUXBPMXh5WEc1Y2RHZGxkRU5oY25SV1lXeDFaU2dwTzF4eVhHNTlYSEpjYmx4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnY21WdGIzWmxVSEp2WkhWamRFWnliMjFEWVhKMElEMGdLSFJoY21kbGRDa2dQVDRnZTF4eVhHNWNkR052Ym5OMElHTmhjblFnUFNCblpYUkRZWEowVm1Gc2RXVW9LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wU1dRZ1BTQjBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXbGtKeWs3WEhKY2JseHlYRzVjZEdSbGJHVjBaU0JqWVhKMFczQnliMlIxWTNSSlpGMDdYSEpjYmx4eVhHNWNkRk4wYjNKaFoyVXVjMlYwS0NkallYSjBKeXdnWTJGeWRDazdYSEpjYm4xY2NseHVYSEpjYm1WNGNHOXlkQ0JqYjI1emRDQm5aWFJVYjNSaGJGTjFiU0E5SUNncElEMCtJSHRjY2x4dVhIUnlaWFIxY200Z1oyVjBRMkZ5ZEVsMFpXMXpLR2RsZEVOaGNuUldZV3gxWlNncExDQlRkRzl5WVdkbExtZGxkQ2duY0hKdlpIVmpkSE1uS1NsY2NseHVYSFJjZEZ4MExtMWhjQ2h3Y205a2RXTjBJRDArSUN0d2NtOWtkV04wTG5CeWFXTmxJQ29nSzNCeWIyUjFZM1F1ZEc5MFlXd3BYSEpjYmx4MFhIUmNkQzV5WldSMVkyVW9LR0ZqWXl3Z1kzVnlLU0E5UGlCaFkyTWdLeUJqZFhJcE8xeHlYRzU5SWl3aVkyOXVjM1FnWjJWMFVISnZaSFZqZEhNZ1BTQW9kWEpzS1NBOVBpQjdYSEpjYmx4MGNtVjBkWEp1SUdabGRHTm9LSFZ5YkNrN1hISmNibjFjY2x4dVhISmNibVY0Y0c5eWRDQmtaV1poZFd4MElHZGxkRkJ5YjJSMVkzUnpPeUlzSW1sdGNHOXlkQ0I3SUdkbGRFTmhjblJKZEdWdGN5QjlJR1p5YjIwZ0p5NHZZMkZ5ZENjN1hISmNibHh5WEc1amIyNXpkQ0J0YjJSaGJDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NXRiMlJoYkNjcE8xeHlYRzVjY2x4dVpYaHdiM0owSUdOdmJuTjBJRzF2WkdGc1QzQmxia2hoYm1Sc1pYSWdQU0FvS1NBOVBpQjdYSEpjYmx4MGJXOWtZV3d1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25iM0JsYmljcE8xeHlYRzU5WEhKY2JseHlYRzVsZUhCdmNuUWdZMjl1YzNRZ2JXOWtZV3hEYkc5elpVaGhibVJzWlhJZ1BTQW9LU0E5UGlCN1hISmNibHgwYlc5a1lXd3VZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25iM0JsYmljcE8xeHlYRzU5WEhKY2JseHlYRzRpTENKcGJYQnZjblFnZXlCblpYUlViM1JoYkZOMWJTQjlJR1p5YjIwZ0p5NHZZMkZ5ZENjN1hISmNibHh5WEc1amIyNXpkQ0JuWlc1bGNtRjBaVVZzWlcxbGJuUWdQU0FvZEdGblRtRnRaU3dnWTJ4aGMzTk9ZVzFsSUQwZ0p5Y3BJRDArSUh0Y2NseHVYSFJqYjI1emRDQmxiQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9kR0ZuVG1GdFpTazdYSEpjYmx4MGFXWWdLR05zWVhOelRtRnRaU2tnZTF4eVhHNWNkRngwWld3dVkyeGhjM05NYVhOMExtRmtaQ2hqYkdGemMwNWhiV1VwTzF4eVhHNWNkSDFjY2x4dVhISmNibHgwY21WMGRYSnVJR1ZzTzF4eVhHNTlYSEpjYmx4eVhHNWpiMjV6ZENCcGJuTmxjblJGYkdWdFpXNTBTVzUwYjFCaGNtVnVkQ0E5SUNobGJHVnRaVzUwY3l3Z2NHRnlaVzUwUld4bGJXVnVkQ2tnUFQ0Z2UxeHlYRzVjZEdWc1pXMWxiblJ6TG1admNrVmhZMmdvWld4bGJXVnVkQ0E5UGlCN1hISmNibHgwWEhSd1lYSmxiblJGYkdWdFpXNTBMbUZ3Y0dWdVpFTm9hV3hrS0dWc1pXMWxiblFwTzF4eVhHNWNkSDBwWEhKY2JuMWNjbHh1WEhKY2JtTnZibk4wSUdOeVpXRjBaVkJ5YjJSMVkzUkpkR1Z0SUQwZ0tIc2dZM1Z5Y21WdVkza3NJR1JsYzJOeWFYQjBhVzl1TENCcFpDd2dhVzFuWDNWeWJDd2djSEpwWTJVc0lIUnBkR3hsSUgwcElEMCtJSHRjY2x4dVhISmNibHgwWTI5dWMzUWdZMjlzSUQwZ1oyVnVaWEpoZEdWRmJHVnRaVzUwS0Nka2FYWW5MQ0FuWTI5c0xXMWtMVFFuS1R0Y2NseHVYSFJqYjI1emRDQndjbTlrZFdOMFIzSnBaQ0E5SUdkbGJtVnlZWFJsUld4bGJXVnVkQ2duWkdsMkp5d2dKM0J5YjJSMVkzUXRaM0pwWkNjcE8xeHlYRzVjZEdOdmJuTjBJSEJ5YjJSMVkzUkpiV0ZuWlZkeVlYQWdQU0JuWlc1bGNtRjBaVVZzWlcxbGJuUW9KMlJwZGljc0lDZHdjbTlrZFdOMExXbHRZV2RsSnlrN1hISmNibHgwWTI5dWMzUWdhVzFoWjJWWGNtRndjR1Z5SUQwZ1oyVnVaWEpoZEdWRmJHVnRaVzUwS0Nka2FYWW5MQ0FuYVcxaFoyVXRkM0poY0hCbGNpY3BPMXh5WEc1Y2RHTnZibk4wSUhCeWIyUjFZM1JKYldGblpTQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25hVzFuSnl3Z0ozQnBZeTB4SnlrN1hISmNibHgwWTI5dWMzUWdjSEp2WkhWamRFNWxkMHhoWW1Wc0lEMGdaMlZ1WlhKaGRHVkZiR1Z0Wlc1MEtDZHpjR0Z1Snl3Z0ozQnliMlIxWTNRdGJtVjNMV3hoWW1Wc0p5azdYSEpjYmx4MFkyOXVjM1FnY0hKdlpIVmpkRVJwYzJOdmRXNTBUR0ZpWld3Z1BTQm5aVzVsY21GMFpVVnNaVzFsYm5Rb0ozTndZVzRuTENBbmNISnZaSFZqZEMxa2FYTmpiM1Z1ZEMxc1lXSmxiQ2NwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSRVpYTmpjbWx3ZEdsdmJpQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25jQ2NzSUNkd2NtOWtkV04wTFdSbGMyTnlhWEIwYVc5dUp5azdYSEpjYmx4MFkyOXVjM1FnY0hKdlpIVmpkRU52Ym5SbGJuUWdQU0JuWlc1bGNtRjBaVVZzWlcxbGJuUW9KMlJwZGljc0lDZHdjbTlrZFdOMExXTnZiblJsYm5RbktUdGNjbHh1WEhSamIyNXpkQ0J3Y205a2RXTjBWR2wwYkdVZ1BTQm5aVzVsY21GMFpVVnNaVzFsYm5Rb0oyZ3pKeXdnSjNScGRHeGxKeWs3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEZCeWFXTmxJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbkxDQW5jSEpwWTJVbktUdGNjbHh1WEhSamIyNXpkQ0JoWkdSVWIwTmhjblFnUFNCblpXNWxjbUYwWlVWc1pXMWxiblFvSjJKMWRIUnZiaWNzSUNkaFpHUXRkRzh0WTJGeWRDY3BPMXh5WEc1Y2NseHVYSFJ3Y205a2RXTjBUbVYzVEdGaVpXd3VhVzV1WlhKVVpYaDBJRDBnSjFOaGJHVW5PMXh5WEc1Y2RHRmtaRlJ2UTJGeWRDNXBibTVsY2xSbGVIUWdQU0FuS3lCQlpHUWdWRzhnUTJGeWRDYzdYSEpjYmx4MGNISnZaSFZqZEVScGMyTnZkVzUwVEdGaVpXd3VhVzV1WlhKVVpYaDBJRDBnSjA1RlZ5YzdYSEpjYmx4eVhHNWNkSEJ5YjJSMVkzUkpiV0ZuWlM1elpYUkJkSFJ5YVdKMWRHVW9KM055WXljc0lHbHRaMTkxY213cE8xeHlYRzVjZEdGa1pGUnZRMkZ5ZEM1elpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGFXUW5MQ0JwWkNrN1hISmNibHgwWVdSa1ZHOURZWEowTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMkowYmljcE8xeHlYRzVjZEdGa1pGUnZRMkZ5ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RpZEc0dGMzVmpZMlZ6Y3ljcE8xeHlYRzVjZEhCeWIyUjFZM1JVYVhSc1pTNXBibTVsY2xSbGVIUWdQU0IwYVhSc1pUdGNjbHh1WEhSd2NtOWtkV04wVUhKcFkyVXVhVzV1WlhKVVpYaDBJRDBnWTNWeWNtVnVZM2tnS3lCd2NtbGpaVHRjY2x4dVhISmNibHgwWTI5c0xtRndjR1Z1WkVOb2FXeGtLSEJ5YjJSMVkzUkhjbWxrS1R0Y2NseHVYSFJwYldGblpWZHlZWEJ3WlhJdVlYQndaVzVrUTJocGJHUW9jSEp2WkhWamRFbHRZV2RsS1R0Y2NseHVYSEpjYmx4MFkyOXVjM1FnZDNKaGNIQmxaRWR5YVdRZ1BTQmJjSEp2WkhWamRFbHRZV2RsVjNKaGNDd2djSEp2WkhWamRFUmxjMk55YVhCMGFXOXVMQ0J3Y205a2RXTjBRMjl1ZEdWdWRGMDdYSEpjYmx4MFkyOXVjM1FnZDNKaGNIQmxaRWx0WVdkbFYzSmhjQ0E5SUZ0cGJXRm5aVmR5WVhCd1pYSXNJSEJ5YjJSMVkzUk9aWGRNWVdKbGJDd2djSEp2WkhWamRFUnBjMk52ZFc1MFRHRmlaV3hkTzF4eVhHNWNkR052Ym5OMElIZHlZWEJ3WldSRGIyNTBaVzUwSUQwZ1czQnliMlIxWTNSVWFYUnNaU3dnY0hKdlpIVmpkRkJ5YVdObExDQmhaR1JVYjBOaGNuUmRPMXh5WEc1Y2NseHVYSFJwYm5ObGNuUkZiR1Z0Wlc1MFNXNTBiMUJoY21WdWRDaDNjbUZ3Y0dWa1IzSnBaQ3dnY0hKdlpIVmpkRWR5YVdRcE8xeHlYRzVjZEdsdWMyVnlkRVZzWlcxbGJuUkpiblJ2VUdGeVpXNTBLSGR5WVhCd1pXUkpiV0ZuWlZkeVlYQXNJSEJ5YjJSMVkzUkpiV0ZuWlZkeVlYQXBPMXh5WEc1Y2RHbHVjMlZ5ZEVWc1pXMWxiblJKYm5SdlVHRnlaVzUwS0hkeVlYQndaV1JEYjI1MFpXNTBMQ0J3Y205a2RXTjBRMjl1ZEdWdWRDazdYSEpjYmx4eVhHNWNkSEpsZEhWeWJpQmpiMnc3WEhKY2JuMWNjbHh1WEhKY2JtTnZibk4wSUdOeVpXRjBaVU5oY25SSmRHVnRJRDBnS0hzZ2FXUXNJSFJwZEd4bExDQnBiV2RmZFhKc0xDQndjbWxqWlN3Z1kzVnljbVZ1WTNrc0lIUnZkR0ZzSUgwcElEMCtJSHRjY2x4dVhISmNibHgwWTI5dWMzUWdiR2x6ZEVsMFpXMGdQU0JuWlc1bGNtRjBaVVZzWlcxbGJuUW9KMnhwSnlrN1hISmNibHgwWTI5dWMzUWdjSEp2WkhWamRFbDBaVzBnUFNCblpXNWxjbUYwWlVWc1pXMWxiblFvSjJScGRpY3NJQ2RqWVhKMExXeHBjM1JmWDJsMFpXMG5LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wUVhKMGFXTjFiQ0E5SUdkbGJtVnlZWFJsUld4bGJXVnVkQ2duYVc1d2RYUW5LVHRjY2x4dVhIUmpiMjV6ZENCcGJXZFhjbUZ3Y0dWeUlEMGdaMlZ1WlhKaGRHVkZiR1Z0Wlc1MEtDZGthWFluTENBblkyRnlkQzFzYVhOMFgxOXBiV2N0ZDNKaGNIQmxjaWNwTzF4eVhHNWNkR052Ym5OMElIQnliMlIxWTNSSmJXY2dQU0JuWlc1bGNtRjBaVVZzWlcxbGJuUW9KMmx0Wnljc0lDZGpZWEowTFd4cGMzUmZYMmwwWlcwdGFXMW5KeWs3WEhKY2JseDBZMjl1YzNRZ2NISnZaSFZqZEZScGRHeGxJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2RvTkNjc0lDZGpZWEowTFd4cGMzUmZYMmwwWlcwdGRHbDBiR1VuS1R0Y2NseHVYSFJqYjI1emRDQndjbTlrZFdOMFVISnBZMlVnUFNCblpXNWxjbUYwWlVWc1pXMWxiblFvSjNOd1lXNG5MQ0FuWTJGeWRDMXNhWE4wWDE5cGRHVnRMWEJ5YVdObEp5azdYSEpjYmx4MFkyOXVjM1FnY0hKdlpIVmpkRkYxWVc1MGFYUjVJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2RwYm5CMWRDY3NJQ2RqWVhKMExXeHBjM1JmWDJsMFpXMHRjWFZoYm5ScGRIa25LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wVkc5MFlXeFFjbWxqWlNBOUlHZGxibVZ5WVhSbFJXeGxiV1Z1ZENnbmMzQmhiaWNzSUNkallYSjBMV3hwYzNSZlgybDBaVzB0ZEc5MFlXd25LVHRjY2x4dVhIUmpiMjV6ZENCd2NtOWtkV04wVW1WdGIzWmxJRDBnWjJWdVpYSmhkR1ZGYkdWdFpXNTBLQ2RpZFhSMGIyNG5MQ0FuWTJGeWRDMXNhWE4wWDE5cGRHVnRMWEpsYlc5MlpTY3BPMXh5WEc1Y2NseHVYSFJ3Y205a2RXTjBRWEowYVdOMWJDNXpaWFJCZEhSeWFXSjFkR1VvSjNSNWNHVW5MQ0FuYUdsa1pHVnVKeWs3WEhKY2JseDBjSEp2WkhWamRFRnlkR2xqZFd3dWMyVjBRWFIwY21saWRYUmxLQ2R1WVcxbEp5d2dKMkZ5ZEdsamRXd25LVHRjY2x4dVhIUndjbTlrZFdOMFFYSjBhV04xYkM1elpYUkJkSFJ5YVdKMWRHVW9KM1poYkhWbEp5d2dhV1FwTzF4eVhHNWNkSEJ5YjJSMVkzUkpiV2N1YzJWMFFYUjBjbWxpZFhSbEtDZHpjbU1uTENCcGJXZGZkWEpzS1R0Y2NseHVYSFJ3Y205a2RXTjBVWFZoYm5ScGRIa3VjMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMV2xrSnl3Z2FXUXBPMXh5WEc1Y2RIQnliMlIxWTNSU1pXMXZkbVV1YzJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFdsa0p5d2dhV1FwTzF4eVhHNWNkSEJ5YjJSMVkzUlJkV0Z1ZEdsMGVTNXpaWFJCZEhSeWFXSjFkR1VvSjNSNWNHVW5MQ0FuYm5WdFltVnlKeWs3WEhKY2JseDBjSEp2WkhWamRGRjFZVzUwYVhSNUxuTmxkRUYwZEhKcFluVjBaU2duYm1GdFpTY3NJQ2R4ZFdGdWRHbDBlU2NwTzF4eVhHNWNkSEJ5YjJSMVkzUlJkV0Z1ZEdsMGVTNXpaWFJCZEhSeWFXSjFkR1VvSjNaaGJIVmxKeXdnZEc5MFlXd3BPMXh5WEc1Y2NseHVYSFJ3Y205a2RXTjBWR2wwYkdVdWFXNXVaWEpVWlhoMElEMGdkR2wwYkdVN1hISmNibHgwY0hKdlpIVmpkRkJ5YVdObExtbHVibVZ5VkdWNGRDQTlJR04xY25KbGJtTjVJQ3NnY0hKcFkyVTdYSEpjYmx4MGNISnZaSFZqZEZSdmRHRnNVSEpwWTJVdWFXNXVaWEpVWlhoMElEMGdZQ1I3WTNWeWNtVnVZM2w5SkhzcmNISnBZMlVnS2lBcmRHOTBZV3g5WUR0Y2NseHVYSFJ3Y205a2RXTjBVbVZ0YjNabExtbHVibVZ5VkdWNGRDQTlJQ2N0Snp0Y2NseHVYSEpjYmx4MFkyOXVjM1FnZDNKaGNIQmxaRkJ5YjJSMVkzUkpkR1Z0Y3lBOUlGdHdjbTlrZFdOMFFYSjBhV04xYkN3Z2FXMW5WM0poY0hCbGNpd2djSEp2WkhWamRGUnBkR3hsTENCd2NtOWtkV04wVUhKcFkyVXNJSEJ5YjJSMVkzUlJkV0Z1ZEdsMGVTd2djSEp2WkhWamRGUnZkR0ZzVUhKcFkyVXNJSEJ5YjJSMVkzUlNaVzF2ZG1WZE8xeHlYRzVjZEdsdWMyVnlkRVZzWlcxbGJuUkpiblJ2VUdGeVpXNTBLSGR5WVhCd1pXUlFjbTlrZFdOMFNYUmxiWE1zSUhCeWIyUjFZM1JKZEdWdEtUdGNjbHh1WEhKY2JseDBhVzFuVjNKaGNIQmxjaTVoY0hCbGJtUkRhR2xzWkNod2NtOWtkV04wU1cxbktUdGNjbHh1WEhSc2FYTjBTWFJsYlM1aGNIQmxibVJEYUdsc1pDaHdjbTlrZFdOMFNYUmxiU2s3WEhKY2JseHlYRzVjZEhKbGRIVnliaUJzYVhOMFNYUmxiVHRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdOdmJuTjBJSEpsYm1SbGNsQnliMlIxWTNSeklEMGdLSEJ5YjJSMVkzUnpLU0E5UGlCN1hISmNibHgwWTI5dWMzUWdaM0pwWkNBOUlHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0Nkd2NtOWtkV04wYzBkeWFXUW5LVHRjY2x4dVhISmNibHgwY0hKdlpIVmpkSE11Wm05eVJXRmphQ2h3Y205a2RXTjBJRDArSUh0Y2NseHVYSFJjZEdkeWFXUXVZWEJ3Wlc1a1EyaHBiR1FvWTNKbFlYUmxVSEp2WkhWamRFbDBaVzBvY0hKdlpIVmpkQ2twTzF4eVhHNWNkSDBwWEhKY2JuMWNjbHh1WEhKY2JtVjRjRzl5ZENCamIyNXpkQ0J5Wlc1a1pYSkRZWEowSUQwZ0tIQnliMlIxWTNSektTQTlQaUI3WEhKY2JseDBZMjl1YzNRZ1ozSnBaQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVqWVhKMExXeHBjM1FuS1R0Y2NseHVYSFJqYjI1emRDQmxiWEIwZVUxelp5QTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWpZWEowWDE5bGJYQjBlU2NwTzF4eVhHNWNkR052Ym5OMElIUnZkR0ZzSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1OaGNuUmZYM1J2ZEdGc0p5azdYSEpjYmx4eVhHNWNkSGRvYVd4bElDaG5jbWxrTG1acGNuTjBRMmhwYkdRcElIdGNjbHh1WEhSY2RHZHlhV1F1Y21WdGIzWmxRMmhwYkdRb1ozSnBaQzVtYVhKemRFTm9hV3hrS1R0Y2NseHVYSFI5WEhKY2JseHlYRzVjZEdsbUlDZ2hjSEp2WkhWamRITXViR1Z1WjNSb0tTQjdYSEpjYmx4MFhIUnlaWFIxY200Z1ozSnBaQzVqYkdGemMweHBjM1F1WVdSa0tDZGxiWEIwZVMxc2FYTjBKeWs3WEhKY2JseDBmU0JsYkhObElIdGNjbHh1WEhSY2RHZHlhV1F1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duWlcxd2RIa3RiR2x6ZENjcE8xeHlYRzVjZEgxY2NseHVYSEpjYmx4MGJHVjBJR04xY25KbGJtTjVPMXh5WEc1Y2NseHVYSFJ3Y205a2RXTjBjeTVtYjNKRllXTm9LSEJ5YjJSMVkzUWdQVDRnZTF4eVhHNWNkRngwWTNWeWNtVnVZM2tnUFNCd2NtOWtkV04wTG1OMWNuSmxibU41TzF4eVhHNWNkRngwWjNKcFpDNWhjSEJsYm1SRGFHbHNaQ2hqY21WaGRHVkRZWEowU1hSbGJTaHdjbTlrZFdOMEtTazdYSEpjYmx4MGZTazdYSEpjYmx4eVhHNWNkSFJ2ZEdGc0xtbHVibVZ5VkdWNGRDQTlJR0JVYjNSaGJEb2dKSHRqZFhKeVpXNWplWDBrZTJkbGRGUnZkR0ZzVTNWdEtDbDlZRHRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdOdmJuTjBJSEpsYm1SbGNsTjFZMk5sYzNOTmMyY2dQU0FvS1NBOVBpQjdYSEpjYmx4MFkyOXVjM1FnYzNCaGJpQTlJR2RsYm1WeVlYUmxSV3hsYldWdWRDZ25jM0JoYmljc0lDZHpkV05qWlhOekxXMXpaeWNwTzF4eVhHNWNkSE53WVc0dVkyeGhjM05NYVhOMExtRmtaQ2duWW1Ga1oyVW5LVHRjY2x4dVhIUnpjR0Z1TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMkpoWkdkbExYTjFZMk5sYzNNbktUdGNjbHh1WEhSemNHRnVMbWx1Ym1WeVZHVjRkQ0E5SUNkQlpHUmxaQ0IwYnlCallYSjBKenRjY2x4dVhIUmtiMk4xYldWdWRDNWliMlI1TG1Gd2NHVnVaRU5vYVd4a0tITndZVzRwTzF4eVhHNWNkSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh5WEc1Y2RGeDBaRzlqZFcxbGJuUXVZbTlrZVM1eVpXMXZkbVZEYUdsc1pDaHpjR0Z1S1R0Y2NseHVYSFI5TENBeU5UQXdLVHRjY2x4dWZTSXNJbVoxYm1OMGFXOXVJRk4wYjNKaFoyVklaV3h3WlhJb0tYdGNjbHh1WEhSMGFHbHpMbk4wYjNKaFoyVWdQU0JzYjJOaGJGTjBiM0poWjJVN1hISmNibHh5WEc1Y2RIUm9hWE11WjJWMElEMGdLR3RsZVNrZ1BUNGdlMXh5WEc1Y2RGeDBjbVYwZFhKdUlFcFRUMDR1Y0dGeWMyVW9iRzlqWVd4VGRHOXlZV2RsTG1kbGRFbDBaVzBvYTJWNUtTazdYSEpjYmx4MGZWeHlYRzVjZEhSb2FYTXVjMlYwSUQwZ0tHdGxlU3dnZG1Gc2RXVXBJRDArSUh0Y2NseHVYSFJjZEd4dlkyRnNVM1J2Y21GblpTNXpaWFJKZEdWdEtHdGxlU3dnU2xOUFRpNXpkSEpwYm1kcFpua29kbUZzZFdVcEtUdGNjbHh1WEhSOVhISmNibHgwZEdocGN5NXlaVzF2ZG1VZ1BTQW9hMlY1S1NBOVBpQjdYSEpjYmx4MFhIUnNiMk5oYkZOMGIzSmhaMlV1Y21WdGIzWmxTWFJsYlNoclpYa3BPMXh5WEc1Y2RIMWNjbHh1ZlZ4eVhHNWNjbHh1WTI5dWMzUWdVM1J2Y21GblpTQTlJRzVsZHlCVGRHOXlZV2RsU0dWc2NHVnlLQ2s3WEhKY2JseHlYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlRkRzl5WVdkbE95SmRmUT09In0=
