const input = document.querySelector("[data-input]");
const defValue = document.querySelector("[data-def]");
const debounceValue = document.querySelector("[data-debounce]");

function updateDebounceText(callBack, delay) {
  return debounce(callBack, delay)();
}

function debounce(cb, delay = 1000) {
  let timeout;

  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      cb();
    }, delay);
  };
}

input.addEventListener("input", function ({ target }) {
  defValue.textContent = target.value;

  updateDebounceText(function () {
    return (debounceValue.textContent = target.value);
  });
});

