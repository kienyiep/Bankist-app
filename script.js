'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Kien Yiep',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-07-11T16:33:06.386Z',
    '2021-07-13T14:43:26.374Z',
    '2021-07-17T18:49:59.371Z',
    '2021-07-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(date, new Date());
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // else {
  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // // console.log(typeof date.getDate()); // number
  // const day = `${date.getDate()}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;
  return Intl.DateTimeFormat(locale).format(date);
  // }
};

const formattedCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // console.log(typeof acc.movements.slice()); // object

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const displayDates = formatMovementDate(date, acc.locale);
    console.log(displayDates);
    const formattedMov = formattedCur(mov, acc.locale, acc.currency);
    console.log(formattedMov);
    //  new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);
    // the currency itself is us dollar, however the number itelf here is of course still formatted in the Portuguese way, which is the current locale of the current user. Hence, the currency is completely independant from the locale itself.
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDates}</div>
        <div class="movements__value">${formattedMov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formattedCur(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formattedCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formattedCur(
    interest,
    acc.locale,
    acc.currency
  );
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE always login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting API
const now3 = new Date();
console.log(now3);
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  // month: '2-digit', // 07
  month: 'long', // july
  // month: 'numeric', // 07
  // year: 'numeric',
  year: '2-digit',
  weekday: 'long',
};
// it would be better to not define the locale manually, but simpy get it from the user's browser.
const locale = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat('en-GB', options).format(now3);
// also feel free to read the documentation on MDN, to find all kind of different functions

// ('en-GB') to get these different codes, ket's just google ISO language code table.
// const sec = now2.getSeconds();
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    const now2 = new Date();
    const year = now2.getFullYear();
    const month = `${now2.getMonth() + 1}`.padStart(2, 0);
    const date = `${now2.getDate()}`.padStart(2, 0);
    // const day = now2.getDay();
    const hour = `${now2.getHours()}`.padStart(2, 0);
    const min = `${now2.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    // Update UI
    updateUI(currentAccount);

    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);

    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  // console.log(sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// in javascript, all numbers are presented internally as floating point numbers. So basically, always as decimals, no matter if we actually write them as integers or as decimals. Which also a reason why we only have one data type for all numbers. Also numbers are represented internally in a 64 base 2 format. Which also means that numbers are stored in the binary format. So basically, they are only composed of zeros and ones. Now, in this binary form, it is very hard to represent some fractions, that are very easy to represent in the base 10 system that we are used to. Base 10 is basically the number from 0 to 9. While binary is base 2, and so that is the number 0 and 1.
console.log(23 === 23.0);

// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 0.333333333...
// Binary base 2 - 0 1. 1/10 = 0.11111111...

// As just mention, there are certain numbers that are very difficult to represent in base 2. And one example of that is the fraction 0.1

console.log(0.1 + 0.2);
// here we will get a weird result, which is 0.30000000000000004, because the result should be 0.3.
// The javascript simply has no better way of representing this number.
// In some cases, javascript does some rounding behind the scene to try its best to hide these problems.
// but some operation, such as (0.1+0.2), simply cannot mask the fact that behind the scene, they cannot represent certain fractions.
// so just be aware that you cannot do like really precise scientific or fincancial calculation in javascript.
// because eventually, you will run into a problem lke the line below, which will result in false, but it should be true.
console.log(0.1 + 0.2 === 0.3);

//conversion
console.log(Number('23'));
// this works because when java script sees the plus operator. It will do type coercion, so it will automatically convert all the operands to numbers.
console.log(+'23');

//Parsing
// the string can even include some symbols, and javascript will then automatically try to figure out that number that is in the string, which will give us a result 30.
// In order to make this work, the string need to start with a number.
// if we start withe e23, it is not gonna work, and we will get not a number(NaN) value.
console.log(Number.parseInt('30px', 10)); // 30
console.log(Number.parseInt('e23', 10)); // NaN
// so this is like little type of coeercion, but even more advanced, because it will try to get rid of unnecessary symbols that are not numbers.

// the parseInt function actually accepts a second argument, which is so called regex. And the regex is the base of the numeral system, which we are using. So here we are simply using base 10 numbers, so numbers from 0 to 9.
// but if we were working with the binary, then we would write 2, and then the result would be completely different.
console.log(Number.parseInt(' 2.5rem '));
console.log(Number.parseFloat(' 2.5rem '));
// console.log(parseFloat(' 2.5rem '));

// check if value is NaN
console.log(Number.isNaN(20)); //false
//here we will also gte false, because this also isn't not a number, it is just a regular value.
console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(+'20')); // false
console.log(Number.isNaN(+'20X')); // true
console.log(Number.isNaN(23 / 0)); // false, infinity is also not a NaN

// checking if value is a number
console.log(Number.isFinite(20)); //true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite(+'20')); // true
console.log(Number.isFinite(+'20X')); // false

console.log(Number.isInteger(23)); // TRUE
console.log(Number.isInteger('23')); // FALSE
console.log(Number.isInteger(23.0)); //true
console.log(Number.isInteger(23 / 0)); // false

//Math and rounding

console.log(Math.sqrt(25));
// exponentiation operator.
console.log(25 ** (1 / 2)); // the two is the square, 1/2 need to be put inside the parenthesis
console.log(8 ** (1 / 3));
//max
console.log(Math.max(5, 18, 23, 11, 2)); // the maximum value gets returned to us.
console.log(Math.max(5, 18, '23', 11, 2)); // this max function here actually does type of coercion.
console.log(Math.max(5, 18, '23px', 11, 2)); // however it does not parsing. if we try 23px then we will get NaN.
//min
console.log(Math.min(5, 18, 23, 11, 2)); // however it does not parsing. if we try 23px then we will get NaN.
// calculte the area of the circle
console.log(Math.PI * Number.parseFloat('10px') ** 2);
// random function
// Math.random() will basically give us the result between 0 and 1, which include lots of decimals.
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max-min) -> min...(max-min+min) -> min...max
console.log(randomInt(10, 20));

// rounding integer
console.log(Math.trunc(23.3));

console.log(Math.round(23.3)); //23
console.log(Math.round(23.9)); //24

// will always be rounded up
console.log(Math.ceil(23.3)); //24
console.log(Math.ceil(23.9)); //24

// will always be rounded down
console.log(Math.floor(23.3)); //23
console.log(Math.floor('23.9')); //23, it will also do type coercion.

// both trunc and floor methods work the same if we are dealing with the positive number.
// However, if we are dealing with the negative number, it doesn't work this way.
console.log(Math.trunc(23.8)); // 23
console.log(Math.trunc(-23.3)); //-23
console.log(Math.floor(-23.3)); // -24, with negative number, rounding works the other way around.
// hence floor is little better than trunc, because it works on all situations, no matter if we are dealing with the positive or negative numbers.

// rounding decimals
// this 2.7 is a number, so it is a primitive, however primitive dont actually have methods. And so behind the scene, javascipt will do boxing. And boxing is to basically transform this to a number object, then call the method on that object. Once the operation is finished, it will convert back to a primitive.
console.log((2.7).toFixed(0)); // 3 (string), toFixed will always return a string but not a number
console.log((2.7).toFixed(3)); // 2.7, and it adds zero until it has exactly three decimal points.
console.log(+(2.345).toFixed(2)); // 2.35

console.log(5 % 2); // 1
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3); // 2
console.log(8 / 3); // 8 = 2 * 3 +2

// it is even number if the remainder is 0.
console.log(6 % 2); // 0
console.log(6 / 2); // 6 = 3 * 2 + 0

// it is odd number if the remainder is 1.
console.log(7 % 2); // 1
console.log(7 / 2); // 7 = 3 * 2 + 1

const isEven = n => n % 2 == 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));
// console.log([...document.querySelectorAll('.movements__row')]);
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0,2,4,6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    //0,3,6,9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

console.log(2 ** 53 - 1); //9007199254740991
console.log(Number.MAX_SAFE_INTEGER); //9007199254740991
console.log(2 ** 53 + 1); //9007199254740992( this is incorrect as it only added one number, which it should have been added 2) If we write 2 ** 53 + 0, we will still get the exact same result (9007199254740992). If we keep adding the number, they are always the same. This means that javascript will simply not represent these numbers accurately. So if we do calculation with number bigger than 9007199254740991, then we might lose precision.

// for some numbers, it does actually work. This is because, the javascript behind the scene uses some tricks to still represent some of the unsafe numbers. Sometimes it works, sometimes it does not, so that is why we call these unsafe numbers. So this can be a problem sometime because in some situations, we might need really, really big numbers, way bigger than this 9007199254740991. For example, for database ID, or when interacting with real 60 bit numbers, and these numbers are actually used in other languages. And so we might, for example, from some API, get a number that is larger than this, and then we have no way of storing that in javascript.
// Hence there is a solution introduced in ES2020, a new premitive was added, which is called BigInt, stand for big integer, and it can be used to store the numbers as large as we want.

console.log(9007199254740991121243343544756867969634); // this probably does not have precision because of course it is larger than 9007199254740991.
// But if we use the n, then this will be a BigInt.
// this n here bascially transforms a regular number into a BigInt number.
console.log(9007199254740991121243343544756867969634n);
console.log(BigInt(900719925474099)); // it mention that the js will first still have to represent this number here internally before it can then transform it into a BigInt. This is the reason why here from a certain point on this second number is different. Hence this construction function should probably only be used with small numbers.

// operations
console.log(10000n + 10000n);
console.log(35354657668679870764534242323n * 10000000n); // this is possible.

const huge = 2323423566756867896796564n;
// console.log(Math.sqrt(16n)); // this will return error, cannot convert a BigInt value into a number.
const num = 23;
// console.log(huge * num); // it is not possible to mix BigInt with regular number, we will get error( cannot mix BigInt with other type)
console.log(huge * BigInt(num));

// exception
console.log(20n > 15); // true
console.log(20n == 20); // true
console.log(20n === 20); // false, this make sense because js when we use the triple operator. It does not do type coercion. And in fact these two values, they have a different primitive type.
console.log(typeof 20n);
console.log(20n == '20'); // true, because js will do the type coercion. And so then it will coerce the 20n to a regular number. And then they are both the same.
console.log(huge + ' is REALLY big!!!'); // the number will be converted to string.

// Divisions
console.log(11n / 3n);
console.log(10 / 3);

// create a Date
const now = new Date();
console.log(now);

console.log(new Date('Jul 15 2021 19:45:57')); // parse the date from a date string.
console.log(new Date('December 24, 2015'));
console.log(new Date('2015, 24 December ')); // this will work as well, and we will even get the day of the week, which show that js is pretty smart in parsing out the string.
console.log(new Date(account1.movementsDates[0]));
console.log(new Date('2019-12-23T07:42:02.383Z'));

console.log(new Date(2037, 10, 19, 15, 23, 5));
// Thu Nov 19 2037 15:23:05 GMT+0800 (Singapore Standard Time), here we will get nov, but nov is actually the month 11, that means that the month here in javvascript is 0 based.
console.log(new Date(2037, 10, 31));
// here we will try nov 31, but as we know that the nov only has 30 days. Hence the result will show that the date will then autocorrect right to the next day which is Dec 01. If we try 11 33, then it will be Dec 03.

// finally we can also pass into the date constructor function, the amount of milliseconds passed since the beginning of the unix time, which is Janaury 1, 1970.
console.log(new Date(0)); // so 0 millisecond after that initial Unix time, then indeed we get January 1st 1970.
// here we will create a date that is 3 days after this.
// 3( three days ) * 24( hours ) * 60( minutes ) * 60( second ) * 1000 (millisecond).
console.log(3 * 24 * 60 * 60 * 1000); // the result will show January 4, which is exactly 3 days later.
// 3 * 24 * 60 * 60 * 1000, this number that we calculated here, is known as timestrap, which is the timestrap of the day number 3.
// the date which is created here is infact another special type of object, so therefore they have their own method, just like array or map or string. We can use these methods to get or to set components of a date.

// working with dates.
const future = new Date(2037, 10, 19, 15, 23);
// Thu Nov 19 2037 15:23:00 GMT+0800 (Singapore Standard Time)
console.log(future);
console.log(future.getFullYear()); // 2037
console.log(future.getMonth()); // rmb this is 0 based, so 10 is actually the month number 11.
console.log(future.getDate()); // 19
console.log(future.getDay()); // 4
console.log(future.getHours()); // 15
console.log(future.getMinutes()); //23
console.log(future.getSeconds()); //0
console.log(future.toISOString()); // 2037-11-19T07:23:00.000Z, which follows kind of international standard. And you will notice this is actually similiar to the string that we used before coming from account 1. Hence, it is one of the very useful cases is when you want to convert a particular date object into a string, that you can then store somewhere.
console.log(future.getTime()); // remember that the timestamp is the milliseconds, which has passed since Jan 1, 1970. (2142228180000)
console.log(new Date(2142228180000));
// Thu Nov 19 2037:23:00 GMT+0800 (Singapore Standard Time)
// the method to get t 15he timestamp for right now.
console.log(Date.now());

future.setFullYear(2040);
console.log(future); // there also exist setMonth, setDate, setDay, and other.

const future2 = new Date(2037, 10, 19, 15, 23);
console.log(+future2);
// the result will be 2142228180000, which is in milliseconds, that's mean we can now do the operations with it.
// So if we subtract one date from another. The result is going to be a number like this. So a timestamp in milliseconds. And then we can simply convert this millisecond back to days or to hours or to other.

// devide by 1000 so this will convert the millisecond to second, then multiply 60 to convert it to minutes then multiply 60 to convert it to hour, and then multiply 24 to convert it back to days.

const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

const days1 = calcDaysPassed(
  new Date(2037, 3, 4, 8, 20),
  new Date(2037, 3, 4, 8, 15)
);
console.log(days1);
console.log(new Date(2037, 3, 14) - new Date(2037, 3, 4));
console.log(+new Date(2037, 3, 14));
console.log(+new Date(2037, 3, 4));

// if we need really precise calculation. For e.g, including time changes due to daylight saving changes, and other weird edge cases like that, then we should use the date library like moment.js, this library is available for free for all the javaScript developers.

const num2 = 3884764.23;

const options2 = {
  // style: 'unit',
  // style: 'percent',
  style: 'currency',
  // unit: 'mile-per-hour',
  // unit: 'celsius',
  currency: 'EUR', // it is important to set the currency here, because the currency is not determined by the locale. So it is not defined by the country here. Because it is possible to show for example euro in the US.
  useGrouping: false, // the result will show the number is printed as it is without the seperators.
};
// And again if you are interested in even more properties, which you can set here in the options. Then just check out the documentation on the MDN.

console.log(
  'US:        ',
  new Intl.NumberFormat('en-US', options2).format(num2)
);
console.log(
  'Germany:   ',
  new Intl.NumberFormat('de-DE', options2).format(num2)
);
console.log(
  'Syria:     ',
  new Intl.NumberFormat('ar-SY', options2).format(num2)
);
console.log(
  'Syria:     ',
  new Intl.NumberFormat('ar-SY', options2).format(num2)
);
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options2).format(num2)
);

// Timers: setTimeout and setInterval
// setTimeout
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),

  3000,
  // indeed now the third argument that we passed in has become the first argument/ parameter of our function here. And then the forth argument became this second one. And if we passed in even more, we can then get access to them here in this callback function.
  ...ingredients
);
console.log('Waiting...');
// we schedule this function call for 3 seconds later.
// All right so when the execution of the code reaches this point, it will simply call the setTimeout function. it will simply basically keep counting the time in the background and  then essentially register this callback function to be called after that time elapsed. And then emmediately the js will move on to the next line, which is the line 604. This mechanism is called Asynchronous js.

// if we need to pass some arguments in this function here. It is not that simple, because we are not calling this function ourselves. // so we are not using the parenthesis () like this. And therefore, we cannot pass in any arguments into the function.

// However, the setTimeout function here actually has a solution for that. So basically, all the argument here that we pass after the delay, will be the arguments to the function.

// we can also cancelled the timer before the 3 seconds passed
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer); // here we will need to pass in the name of the timer, so we can basically assign the timer to a variable. // So here we basically stored the result of the setTimeout function inside the variable, and then we use that variable to clear the timeOut, and then we can use that variable to basically delete the timer. And for that we use the clearTimeout.

// setInterval
// Now what if we want to run a function over and over again, like every 5 seconds or every 10 minutes.

setInterval(function () {
  const now = new Date();
  const second = now.getSeconds();
  const minute = now.getMinutes();
  const hour = now.getHours();
  console.log(`${hour}:${minute}:${second}`);
}, 1000);

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds, stop the timer and log out user.
    if (time === 0) {
      // here we use the clearInterval to stop the setInterval function.
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };
  // set time to 5 min.
  let time = 120;
  // call the timer every second
  tick(); // call this function immediately
  const timer = setInterval(tick, 1000);
  // to use the clearInterval function, we need the timer variable.
  return timer;
};
// the callback function that we passed into setInterval function is not called immediately. It will only get called the first time after one second. But infact we want to call this function also immediately.
// The trick of doing that is to export this into a seperate function, then call it emmediately, and then also start calling it every second using the serInterval function.
