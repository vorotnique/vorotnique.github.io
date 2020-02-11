// •1•
let ageBtn = document.querySelector('#age__button');
ageBtn.addEventListener('click', function () {
  let age = document.querySelector('#age').value;
  let ageName = age < 0 ? 'ещё не родились' : age < 20 ? 'зумер' : age < 40 ? 'миллениал' : age < 60 ? 'эксер' : 'бумер';
  document.querySelector('#age__out').textContent = "Вы - " + ageName + ".";
});
// •2•

let specialBtn = document.querySelector('#special__button');
specialBtn.addEventListener('click', function () {
  let specialNumber = document.querySelector('#special__number').value;
  let specialSymbol = '';

  switch (specialNumber) {
    case '0':
      specialSymbol = ')';
      break;

    case '1':
      specialSymbol = '!';
      break;

    case '2':
      specialSymbol = '@, либо "';
      break;

    case '3':
      specialSymbol = '#, либо №';
      break;

    case '4':
      specialSymbol = '$, либо ;';
      break;

    case '5':
      specialSymbol = '%';
      break;

    case '6':
      specialSymbol = '^, либо :';
      break;

    case '7':
      specialSymbol = '&, либо ?';
      break;

    case '8':
      specialSymbol = '*';
      break;

    case '9':
      specialSymbol = '(';
      break;

    default:
      specialSymbol = 'Введите одну цифру';
  }

  document.querySelector('#special__out').textContent = "Этой цифре на клавиатуре отвечает следующий спецсимвол - " + specialSymbol;
});
// •3•

let tripleBtn = document.querySelector('#triple__button');
tripleBtn.addEventListener('click', function () {
  let tripleNumber = document.querySelector('#triple__number').value;

  for (let i = 0; i < tripleNumber.length; i++) {
    if (tripleNumber.indexOf(tripleNumber[i]) !== tripleNumber.lastIndexOf(tripleNumber[i])) {
      document.querySelector('#triple__out').textContent = 'Есть повторяющиеся цифры';
      break;
    } else {
      document.querySelector('#triple__out').textContent = 'Повторяющиеся цифры отсутствут';
    }
  }
});
// •4•

let yearBtn = document.querySelector('#year__button');
yearBtn.addEventListener('click', function () {
  let year = document.querySelector('#year').value;

  if (year % 400 == 0 || year % 4 == 0 && year % 100 !== 0) {
    document.querySelector('#year__out').textContent = 'Високосный год';
  } else {
    document.querySelector('#year__out').textContent = 'Невисокосный год';
  }
});
// •5•

let palindromBtn = document.querySelector('#palindrom__button');
palindromBtn.addEventListener('click', function () {
  let palindrom = document.querySelector('#palindrom').value;
  let reverse = palindrom.split('').reverse().join('');

  if (palindrom === reverse) {
    document.querySelector('#palindrom__out').textContent = 'Число является палиндромом';
  } else {
    document.querySelector('#palindrom__out').textContent = 'Число является не палиндромом';
  }
});
// •6•

let moneyBtn = document.querySelector('#money__button');
moneyBtn.addEventListener('click', function () {
  let exchangeRate = 1;
  let moneySum = document.querySelector('#moneySum').value;
  let radioBtn = document.getElementsByName('money');
  let currency = '';

  for (let i = 0; i < radioBtn.length; i++) {
    if (radioBtn[i].checked) {
      exchangeRate = radioBtn[i].value;
      currency = radioBtn[i].id;
    }
  }

  document.querySelector('#money__out').textContent = "Результат: ".concat((moneySum * exchangeRate) + " " + currency);
});
// •7•

let sumBtn = document.querySelector('#sum__button');
sumBtn.addEventListener('click', function () {
  let sum = document.querySelector('#sum').value;
  let discount = sum < 200 ? 0 : sum <= 300 ? 3 : sum <= 500 ? 5 : 7;
  document.querySelector('#discount__out').textContent = "Ваша скидка: ".concat(discount, " %.");
  document.querySelector('#sum__out').textContent = "Сумма к оплате: ".concat((sum * ((100 - discount) / 100)).toFixed(2), " грн.");
});
// •8•

let figureBtn = document.querySelector('#figure__button');
figureBtn.addEventListener('click', function () {
  let circleLength = document.querySelector('#circleLength').value;
  let squarePer = document.querySelector('#squarePer').value;
  let circleDiametr = (circleLength / Math.PI).toFixed(2);

  if (circleDiametr <= squarePer / 4) {
    document.querySelector('#figure__out').textContent = "Окружность поместится в данный квадрат.";
  } else {
    document.querySelector('#figure__out').textContent = "Окружность слишком большая.";
  }
});
// •9•

let questionBtn = document.querySelector('#question__button');
questionBtn.addEventListener('click', function () {
  let question1 = document.getElementsByName('question1');
  let question2 = document.getElementsByName('question2');
  let question3 = document.getElementsByName('question3');
  let questionResult = 0;

  for (let i = 0; i < question1.length; i++) {
    if (question1[i].checked && question1[i].value == 4) {
      questionResult += 2;
    }
  }

  for (let j = 0; j < question2.length; j++) {
    if (question2[j].checked && question2[j].value == 'Washington') {
      questionResult += 2;
    }
  }

  for (let k = 0; k < question3.length; k++) {
    if (question3[k].checked && question3[k].value == 'zloty') {
      questionResult += 2;
    }
  }

  document.querySelector('#question__out').textContent = "Оценка: ".concat(questionResult, " балла.");
});
// •10•

let dateBtn = document.querySelector('#date__button');
dateBtn.addEventListener('click', function () {
  let date1 = new Date(document.querySelector('#date1').value);
  date1.setDate(date1.getDate() + 1);
  let curr_date = date1.getDate();
  let curr_month = date1.getMonth() + 1;
  let curr_year = date1.getFullYear();
  document.querySelector('#date__out').textContent = "Следующая дата: ".concat(curr_date, " / ").concat(curr_month, " / ").concat(curr_year, ".");
});