//•1•

let name = prompt('Введите Ваше имя:');
if (name != null) {
alert("Привет, " + name + "!");
} else {
  alert('Хоть бы представились для приличия…');
}

//•2•

let birthDate = prompt('Введите Ваш год рождения:');
const today = 2019;
let age = (today - birthDate);

if (isNaN(birthDate)) {
	alert ('Вы не ввели год рождения правильно');
} else {
	alert ("Вам " + age + " лет, либо исполнится " + age + " в этом году.");
}

//•3•

let squareSide = prompt('Укажите длину стороны квадрата:');
alert('Периметр квадрата равен ' .concat(squareSide * 4, '.'));

//•4•

let circleRadius = prompt('Укажите радиус окружности:');
let circleSquare = Math.PI * Math.pow(circleRadius, 2);
alert('Площадь круга равна ' .concat(circleSquare.toFixed(3)));

//•5•

let distance = prompt('Укажите расстояние в километрах между городами:', '');
let time = prompt('Укажите время на дорогу в часах:', '');

if (distance != null && time != null) {
  alert("Нужная скорость: ".concat((distance / time).toFixed(0), " км/ч"));
} else {
  alert('Неверный ввод');
}

//•6•

const rate = 0.9;
let dollar = prompt('Введите сумму в долларах');
let euro = dollar * rate;
alert('Сумма в евро: ' + euro.toFixed(2));

//•7•

const fileSize = 820;
const realByte = 1024;
const fakeByte = 953;
let amount = prompt('Укажите объём флэшки в ГБ:');
alert('В идеальном мире, где фактический объём совпадает с написанным на коробках, поместится ' + Math.floor(amount * realByte / 820) + ' файлов, а на самом деле - всего ' + Math.floor(amount * fakeByte / 820) + ' файлов.');

//•8•

let money = prompt('Какой суммой располагаете?');
let price = prompt('Почём нынче шоколадки?');
alert('Вам хватит на ' + Math.floor(money / price) + ' шоколадок, и останется ' + (money % price).toFixed(2) + ' сдачи.');

//•9•

let number = prompt('Введите трёхзначное число:');
if (number.length !== 3) {
	alert('Трёхзначное, говорю!');
} else {
	alert('Задом наперёд это число будет считаться как ' + number.split('').reverse().join(''));
}

//•10•

let deposit = prompt('Введите сумму вклада:');
const month = 2;
const percent = 0.05;
alert('Вам будет начислено ' + (deposit * month / 12 * percent).toFixed(2) + ' годовых.');