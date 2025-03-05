// Upper function returns lower function with
// arguments available to lower function passed
// to upper function

function upperFunc(...upperArgs) {
  return function (...lowerArgs) {
    console.log({ upperArgs });
    console.log({ lowerArgs });
  };
}

const firstCall = upperFunc("upper1", "upper2");
// firstCall("lower1", "lower2");

function firstFunc(one) {
  return function (two) {
    return one + two;
  };
}

const addition = firstFunc(1);
// console.log(addition(2));

/**
 * @param {number} n
 * @return {Function} counter
 */
var createCounter = function (n) {
  let counter = n;
  return function () {
    return counter++;
  };
};

const counter = createCounter(10);
counter(); // 10
counter(); // 11
counter(); // 12
console.log(counter());

