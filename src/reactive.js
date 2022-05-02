let currentObserver = null;

function debounce(callback) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this);
    }, 0);
  };
}

export const observe = (fn) => {
  currentObserver = debounce(fn);
  fn();
  currentObserver = null;
};

export function observable(obj) {
  Object.keys(obj).forEach((key) => {
    let _value = obj[key];
    const observers = new Set();

    Object.defineProperty(obj, key, {
      get() {
        if (currentObserver) observers.add(currentObserver);
        return _value;
      },
      set(value) {
        if (_value === value) return;
        if (JSON.stringify(_value) === JSON.stringify(value)) return;
        _value = value;
        observers.forEach((fn) => fn());
      },
    });
  });
  return obj;
}
