const tokenizeArray = (inputArr) => {
  const combos = [];
  const keys = Object.keys(inputArr);

  const recursiveFunction = (arr, thisKey, keys, combination) => {
    if (thisKey === keys.length) {
      combos.push(combination.slice());
      return;
    }
    const currentOuterObject = arr[keys[thisKey]];
    for (let currentInnerObject of currentOuterObject) {
      const currentKeys = Object.keys(currentInnerObject);
      for (let currentKey of currentKeys) {
        combination.push(currentKey);
        if (thisKey < 2) {
          combination.push(currentInnerObject[currentKey]);
        }
        recursiveFunction(inputArr, thisKey + 1, keys, combination);
        combination.pop();
        if (thisKey < 2) {
          combination.pop();
        }
      }
    }
  };

  recursiveFunction(inputArr, 0, keys, []);
  return combos;
};

module.exports = tokenizeArray;
