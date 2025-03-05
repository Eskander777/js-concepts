(function () {
  class Person {
    constructor(name) {
      this.name = name;
    }
  }

  Person.prototype.sayHello = function () {
    return `Hello ${this.name}`;
  };

  const person = new Person("Alex");

  console.log(person.sayHello());
})();

