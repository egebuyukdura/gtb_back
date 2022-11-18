function threeDots(value) {
  let tempValue = value.toString().split(".");
  value = tempValue[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return value;
}

function sixDecimals(value) {
  let log10 = value ? Math.floor(Math.log10(value)) : 0;
  let div = log10 < 0 ? Math.pow(10, 5 - log10) : 10000;

  return Math.round(value * div) / div;
}

function greaterThanZero(value) {
  let tempValue;
  let log10 = value ? Math.floor(Math.log10(value)) : 0;
  if (log10 > 0) {
    tempValue = String(value).split(".");
    return tempValue[0];
  } else {
    return value;
  }
}

module.exports = { threeDots, sixDecimals, greaterThanZero };
