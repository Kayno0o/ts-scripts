function checkIfInstanceOf(obj, classFunction) {
  if (obj === null || obj === undefined || typeof classFunction !== 'function')
    return false

  return new Object(obj) instanceof classFunction
}

console.log(checkIfInstanceOf(new Date(), Date))

class Animal { }
class Dog extends Animal { }
console.log(checkIfInstanceOf(new Dog(), Animal))

console.log(checkIfInstanceOf(5, Number))

console.log(checkIfInstanceOf(null, null))
