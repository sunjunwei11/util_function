// 继承
// 参考链接：https://github.com/mqyqingfeng/Blog/issues/16
// 1、原型链继承
// 用子构造函数生成的实例对象继承父构造函数的属性以及父构造函数原型对象上的属性
function Parent () {
	this.name = 'parent';
	this.friends = ['aa', 'bb'];
}

Parent.prototype.sayName = function () {
	console.log(this.name);
};

function Child () {
	this.age = 18
}

Child.prototype = new Parent();

let child1 = new Child();

child1.sayName(); // parent
// 缺点
// 所有实例会共享父类实例的属性
let child2 = new Child();
child2.friends.push('cc');
let child3 = new Child();
console.log(child3.friends); // ["aa", "bb", "cc"]
// 在创建Child实例时，无法向Parent传参

// 2、借用构造函数继承
// 使用call或apply将父类构造函数引入子类构造函数
function Parent (name) {
	this.name = name;
	this.friends = ['aa', 'bb'];
}

function Child (name) {
	Parent.call(this, name);
	this.childType = 'any';
}

let child1 = new Child('jim');
let child2 = new Child('yin');
child1.name; // jim
child2.name; // yin
child1.friends.push('cc');
child2.friends; // ["aa", "bb"]
// 优点：避免了父类实例对象被所有子类共享，可以向parent传参，
// 缺点：每次创建实例都需要调用一次父类构造函数

// 3、组合继承
// 融合原型链继承和借用构造函数继承的优点
function Parent () {
	this.name = 'parent';
	this.friends = ['aa', 'bb'];
}

Parent.prototype.sayName = function () {
	console.log(this.name);
};

function Child (name, age) {
	Parent.call(this, name);
	this.age = age;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

// 4、原型式继承
function createObj(o) {
	function Fun() {}
	Fun.prototype = o;
	return new Fun();
}

