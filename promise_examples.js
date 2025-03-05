{
  const resultEl = document.querySelector("[data-result]");
  const buttonEl = document.querySelector("[data-button]");

  // It's important to wrap Promise with function
  // because code inside of it works instant
  const getPosition = (opts) =>
    new Promise((resolve, reject) => {
      console.log("Getting position...");
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          console.log("Got position");
          resolve(pos);
        },
        function (error) {
          reject(error.message);
        },
        opts
      );
    });

  // Everything inside Promise body works before '.then'
  const setTimer = (duration, posData) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log({ data: posData, text: "Done!" });
        resolve("Promise started");
      }, duration);
    });

  // buttonEl.addEventListener("click", () => {
  //   getPosition()
  //     .then((pos) => setTimer(300, pos)) //'.then' receives an argument in 'resolve' function inside Promise
  //     .then((data) => {
  //       console.log(data);
  //       return "some"; // For real this is: return new Promise((resolve) => resolve('some'));
  //     }) // Returning anything inside '.then' turns it into a new Promise, alas '.then' chain is limitless
  //     .then((some) => console.log(some))
  //     .catch((errMsg) => console.log(errMsg)); // '.catch' receives an argument in 'reject' function inside Promise
  // });
  buttonEl.addEventListener("click", () => {
    getPosition()
      .then((pos) => setTimer(300, pos))
      .then((data) => {
        console.log(data);
        return "some";
      })
      .catch((errMsg) => console.log(errMsg)) // if '.catch' inside of '.then' chain, then work chain doesn't stop after error
      .then((some) => console.log(some));
  });

  // In Promise.race in '.then' we get the result of fastest Promise fulfilled
  // Promise.race([setTimer(300, "123"), getPosition()]).then((result) =>
  //   console.log(result)
  // );

  // In Promise.all in '.then' we get the result of all combined Promises results as an array
  // If there is an error it stops and throws an error
  // Promise.all([setTimer(300, "123"), getPosition()]).then((result) =>
  //   console.log(result)
  // );

  // In Promise.allSettled in '.then' we get the result of all combined Promises results as an array
  // If there is an error it continues for all Promises to be settled
  // Promise.allSettled([setTimer(300, "123"), getPosition()]).then((result) =>
  //   console.log(result)
  // );

  // Promises queue separated by time

  const MINIMAL = 1000;
  const INTERVAL = 1000;

  function createPromise(num, timeout) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(num);
      }, timeout);
    });
  }

  function createPromisesArr(minimal, interval, ...actions) {
    let lastInterval = minimal;

    const promiseArr = actions.map(function (action, index) {
      if (index !== 0) lastInterval += interval;
      return action(++index, lastInterval);
    });

    return promiseArr;
  }

  const promisesArr = createPromisesArr(
    MINIMAL,
    INTERVAL,
    createPromise,
    createPromise,
    createPromise,
    createPromise,
    createPromise,
    createPromise
  );
  // promisesArr.forEach(function (promise) {
  //   promise.then(function (num) {
  //     console.log(num);
  //   });
  // });

  // Promises queue by resolving

  // Promise.resolve()
  //   .then(() =>
  //     setTimeout(() => {
  //       console.log("First");
  //     }, 4000)
  //   )
  //   .then((prom) => {
  //     return setTimeout(() => {
  //       console.log(prom);
  //       console.log("Second");
  //     }, 4000);
  //   })
  //   .then((prom) => {
  //     return setTimeout(() => {
  //       console.log(prom);
  //       console.log("Third");
  //     }, 4000);
  //   });

  // new Promise((resolve) => resolve())
  //   .then(() => {
  //     return setTimeout(() => console.log("First"), 3000);
  //   })
  //   .then(() => {
  //     return setTimeout(() => console.log("Second"), 3000);
  //   })
  //   .then(() => console.log("Third"));

  // Promises usage with generator

  function makePromise(name) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(name + 1), 2000);
    });
  }
  const promises = [
    makePromise("First"),
    makePromise("Second"),
    makePromise("Third"),
    makePromise("Fourth"),
    makePromise("Fifth"),
    makePromise("Sixth"),
  ];

  // Generator returns argument in Promise resolve parameter,
  // to use result you should invoke async syntax
  async function* resolvePromises(promsArr) {
    for (const prom of promsArr) {
      yield await prom;
    }
  }

  // Like this async function
  async function resolver() {
    for await (const gened of resolvePromises(promises)) {
      console.log({ gened });
    }
  }
  // resolver();

  // Like this promise then syntax
  // const resolved = resolvePromises(promises);
  // resolved.next().then((result) => console.log(result.value));
  // resolved.next().then((result) => console.log(result.value));
  // resolved.next().then((result) => console.log(result.value));

  // promises.reduce((prev, cur) => {
  //   return prev.then(cur);
  // }, new Promise((resolve) => resolve()));

  class PromiseQueue {
    constructor(tasks = [], concurrentCount = 2) {
      this.total = tasks.length;
      this.todo = tasks;
      this.running = [];
      this.complete = [];
      this.count = concurrentCount;
    }

    runNext() {
      return this.running.length < this.count && this.todo.length;
    }

    run() {
      while (this.runNext()) {
        const promise = this.todo.shift();
        this.running.push(promise);
        promise.then((name) => {
          console.log({ name });
          const finishedPromise = this.running.shift();
          this.complete.push(finishedPromise);
          this.run();
        });
      }
    }
  }

  // const taskQueue = new PromiseQueue(promises); //tasks = an array of async functions, 3 = number of tasks to run in parallel
  // taskQueue.run();

  let promise1 = new Promise((resolve, reject) => {
    resolve("Hello! ");
  });

  let promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("GeeksforGeeks");
    }, 1000);
  });

  const promiseExecution = async () => {
    for (let promise of [promise1, promise2]) {
      try {
        const message = await promise;
        console.log(message);
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  // promiseExecution();
}

// Event loop example

// Synchronious work first, then work asynchronious one after another,
// Promise objects work before timeout callbacks. Inside of "setTimeout"
// everything works same, synchronious first, then asynchronious, and if
// they don't have timeouts they work one after another. If one timeout
// is set to more then another, then this works later.
// Timeout's callbacks are fired according their calling order: first
// ones first, then ones after them and so on.

console.log("One");

new Promise((resolve) => {
  resolve("Four");

  new Promise(() => console.log("Twelve"));

  new Promise((resolve) => {
    resolve("Ten");
  }).then((val) => {
    setTimeout(function () {
      console.log(val);
    }, 0);
  });

  Promise.resolve("Seven").then((value) =>
    setTimeout(() => console.log(value), 0)
  );

  new Promise((resolve) => {
    setTimeout(function () {
      resolve("Nine");
    }, 0);
  }).then((val) => console.log(val));

  console.log("Eight");
}).then((val) => {
  setTimeout(function () {
    console.log(val);
  }, 0);
});

setTimeout(function () {
  console.log("Two");
}, 0);

Promise.resolve("Five")
  .then((val) => {
    console.log(val);
    return "Eleven";
  })
  .then((val) => console.log(val));

setTimeout(function () {
  console.log("Three");
}, 0);

console.log("Six");

// The order here is:

// "One" - synchronius task
// "Twelve" - inside nested Promise object synchronious task
// "Eight" - synchronius task inside of asynchronius task without timeout
// "Six" - synchronius task
// "Five" - asynchronius task without a timeout
// "Eleven" - asynchronius task without a timeout even though it's after another
// "then" call
// "Nine" - asynchronius task with a timeout called first (because inside of
// Promise object declaration everything works synchroniously with other scopes)
// "Two" - asynchronius task with a timeout called second
// "Three" - asynchronius task with a timeout called third
// "Ten" - asynchronius task with a timeout called fourth, because it's in "then"
// block and it works after all synchronious and higher asynchronios
// code was fired
// "Seven" - asynchronius task with a timeout called fifth, because it's in "then"
// block and it works after all synchronious and higher asynchronios
// code was fired
// "Four" - asynchronius task with a timeout called sixth, because it's in "then"
// block and it works after all synchronious and higher asynchronios
// code was fired

// Setinterval examples

const MAX = 10;

let num = 0;

const namsArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// const intlId = setInterval(() => {
//   console.log(namsArr[num]);
//   ++num;
//   if (num === namsArr.length) clearInterval(intlId);
// }, 1000);

// const intervalId = setInterval(() => {
//   ++num;
//   console.log({ num });
//   if (num === MAX) clearInterval(intervalId);
// }, 1000);

function createPromises(max = 5) {
  const promArr = [];

  for (let i = 0; i < max; i++) {
    const prom = new Promise((resolve) => resolve(i));

    promArr.push(prom);
  }

  return promArr;
}

const proms = createPromises();

// To resolve array of Promise objects with "setInterval"
// we should create a cursor which get current and then next
// resolving promise. Use it to get to needed promise to be
// resolved and, when it gets to max value we should use
// "clearInterval". To control queue of resolving we may use
// Promise objects. Everything in declaring Promise object
// will be fired, and, only after that, code in "then" will
// run.
function resolvePromisesArr(proms) {
  let promNum = 0;

  new Promise((resolve) => {
    proms[promNum].then((promVal) => {
      console.log({ promVal });
      ++promNum;
      resolve();
    });
  }).then(() => {
    const intId = setInterval(() => {
      proms[promNum]
        .then((promVal) => {
          console.log({ promVal });
          ++promNum;
          if (promNum === proms.length) {
            clearInterval(intId);
          }
        })
        .catch((err) => reject({ err }));
    }, 1000);
  });
}

// resolvePromisesArr(proms);

Promise.customAll = function (promArr) {
  const result = [];

  return new Promise((resolveAll, reject) => {
    if (promArr.length === 0) {
      resolveAll();
    } else {
      for (let i = 0; i < promArr.length; i++) {
        promArr[i]
          .then((promRes) => {
            result.push(promRes);
            if (i === promArr.length - 1) {
              resolveAll(result);
            }
          })
          .catch((err) => reject(err));
      }
    }
  });
};

// Promise.customAll(proms).then((result) =>
//   console.log(result ? { result } : "empty")
// );

