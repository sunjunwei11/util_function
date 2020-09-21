/*
 * 手动实现call和apply方法
 **/
// 将要执行的函数，作为要绑定的对象的属性，然后用对象调用该函数，函数里面的this就指向了该对象
Function.prototype.call2 = function (context) {
	context.fn = this;
	context.fn();
	delete context.fn;
}

// 带参数的改良版本
Function.prototype.call2 = function (context) {
	context.fn = this;
	let args = []; // 保存传过来的参数，从第二位开始，第一位为上下文对象
	for (let i = 1; i < arguments.length; i ++) {
		args.push(arguments[i])
	}
	context.fn(...args);
	delete context.fn;
}

// apply版本
Function.prototype.apply2 = function (context) {
	context.fn = this;
	let args = arguments[1] || []; // 保存传过来的参数，从第二位开始，第一位为上下文对象
	context.fn(...args);
	delete context.fn;
}

/*
 * 手动实现bind方法
 **/
Function.prototype.bind2 = function () {
	let self = this; // 保存调用的函数
	let context = [].shift.call(arguments); // 保存bind需要绑定的上下文,shift返回数组第一个元素，并修改原数组，若数组为空则返回undefined
	let args = [].slice.call(arguments); // 剩余参数转化为数组
	return function () { // 返回一个新函数
		self.apply2(context, args.concat([].slice.call(arguments))); // 最终的参数为调bind方法时的参数concat调执行函数时的参数
	}
};

function testBind (arg1,arg2) {
	console.log(this.a);
	console.log(`arg1:${arg1},arg2:${arg2}`);
	console.log(arguments);
}
testBind = testBind.bind2({a: 22}, 6, 6);

let testBindObj = {a: '1', fun: testBind};
testBindObj.fun(2,3,4);

/*
 * 单例模式的实现 - 永远只返回1个实例
 **/
// 1、构造函数方法，将是否已经构造过的判断放在构造函数内部，缺点是可以从外部改变unique的值，可以用闭包解决
function Construct () {
	if (Construct.unique !== undefined) {
		return Construct.unique;
	}
	// 逻辑代码
	this.name = 111;

	// 将this赋值给unique
	Construct.unique = this;
}

let unique1 = new Construct();
let unique2 = new Construct();
console.log(unique1 === unique2);

// 2、用闭包
let single = (function () {
	let unique;
	function Construct() {
		//	...
	}

	unique = new Construct();
	return function () {
		return unique;
	}
})();

let unique3 = single();
let unique4 = single();
console.log(unique3 === unique4);

// 3、用闭包常规一点的写法
let single2 = (function () {
	let unique;
	function Construct() {
		// ...
	}
	
	function getInstance () {
		if (unique === undefined) {
			unique = new Construct()
		}

		return unique;
	}

	return { getInstance };
})();

let unique5 = single2.getInstance();
let unique6 = single2.getInstance();
console.log(unique5 === unique6);

/*
 * 数组扁平化
 **/
// 1、使用递归
let testArr = [1,['2',[3,4,'5']]];
function flatten1(arr) {
	let result = [];
	arr.forEach(item => {
		if (Array.isArray(item)) {
			result = result.concat(flatten1(item));
		} else {
			result.push(item);
		}
	});
	return result;
}
flatten1(testArr); // [1, "2", 3, 4, "5"]

// 2、如果数组都是数字或都是字符串可以使用toString和split方法
let testArr2 = ['a',['b',['c','d']]];
let testArr3 = [1,[2,[3,4]]];
testArr2.allItemisString = true;
testArr3.allItemisNum = true;
function flatten2(arr) {
	if (arr.allItemisString) { // 数组里每一项都是字符串
		return arr.toString().split(',');
	} else if (arr.allItemisNum) { // 数组里每一项都是数字
		return arr.toString().split(',').map(item => +item);
	}
}
flatten2(testArr2); // ["a", "b", "c", "d"]
flatten2(testArr3); // [1, 2, 3, 4]

//3、使用reduce简化递归代码
function flatten3(arr) {
	return arr.reduce((pre, next) => {
		return pre.concat(Array.isArray(next) ? flatten3(next) : next);
	}, []);
}
flatten3(testArr2); // ["a", "b", "c", "d"]

//4、使用...拓展符
let testArr4 = [1,[2,[3,4]],[5,[6]]];
console.log([].concat(...testArr4)); // [1,2,[3,4],5,[6]] 用这种方法每次可以扁平一层
// [].concat(...testArr4)实际等于 [].concat(1,[2,[3,4],[5,[6]]）
function flatten5(arr) {
	while (arr.some(item => Array.isArray(item))) {
		arr = [].concat(...arr);
	}
	return arr;
}
flatten5(testArr4); // [1, 2, 3, 4, 5, 6]

/*
 * 求最大值和最小值
 **/
// 1、使用Math.max和Math.min方法,会将参数转化为数字，不能转化为数字则结果为NaN
Math.max(1,3,'6',2); // 6
Math.min(1,3,'6',2); // 1

let arr = [2,1,6,3];
// 2、原始方法，循环一遍数组求出最大值
function getMax1(arr) {
	let max = arr[0];
	for (var i=1; i < arr.length; i++) {
		max = max > arr[i] ? max : arr[i];
	}
	return max;
}
getMax1(arr); // 6

// 3、对数组求出一个最终值，可以用reduce方法
function getMax2(arr) {
	return arr.reduce((pre, next) => {
		return pre > next ? pre : next;
	})
}
getMax2(arr) // 6

// 4、使用排序方法
function getMax3(arr) {
	arr.sort((a, b) => a-b);
	return arr[arr.length-1];
}
getMax3(arr); // 6

// 5、使用eval方法
// 原理是`Math.max(${arr})`会被转化为 `Math.max(2,1,3,6)`
function getMax4(arr) {
	return eval(`Math.max(${arr})`);
}
getMax4(arr); // 6

// 6、与方法5类似的还有是有apply和...拓展符方法，原理都是将数组转成参数传入函数
Math.max.apply(null, arr);
Math.max(...arr);

/*
 * 深浅拷贝
 **/
// 1、数组的浅拷贝可以使用slice、concat等方法
let arrForCopy = [1,2,{name:'sun'}];
// 以下两种方法都会得到arrForCopy的浅拷贝，拷贝后的引用类型会指向同一个对象
let newArr1 = arrForCopy.concat();
let newArr2 = arrForCopy.slice();
// 浅拷贝函数实现方法,直接用for in循环取出对象里的自身属性，赋值给新的对象就可以了
function shallowCopy(obj) {
	if (null == obj || typeof obj !== 'object') return obj;
	let result = Array.isArray(obj) ? [] : {};
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			result[i] = obj[i];
		}
	}
	return result;
}
// 深拷贝如果对象中只有数组、普通对象和值类型，可以使用JSON.parse和JSON.stringify
let newArr3 = JSON.parse(JSON.stringify(arrForCopy)); // 一行代码即可
// 深拷贝函数,兼容Date,Array和Object三种类型以及null和undefined
function deepCopy(obj) {
	let copy;
	if (null == obj || typeof obj != 'object') return obj;
	if (obj instanceof Date) {
		copy = new Date;
		copy.setTime(obj.getTime());
		return copy;
	}
	if (obj instanceof Array) {
		copy = [];
		for (let i = 0; i < obj.length; i++) {
			copy[i] = deepCopy(obj[i]);
		}
		return copy;
	}
	if (obj instanceof Object) {
		copy = {};
		for (let i in obj) {
			if (obj.hasOwnProperty(i)) {
				copy[i] = deepCopy(obj(i));
			}
		}
		return copy;
	}
	console.log('unable to copy obj,it`s type is not supported');
}

/*
 * 防抖函数
 * 防抖函数的作用是避免在短时间内频繁触发某一事件
 * 表现为在事件触发后一定会在n秒之后才执行，如果在n秒之内又触发了新事件，那么以新事件为准，n秒之后再执行
 **/
// 函数实现
function debounce (func, wait) {
	let timeout;
	return function () {
		clearTimeout(timeout);
		timeout = setTimeout(func, wait);
	}
}
// 加上this和传参功能，让this和参数指向和直接调用func一样
function debounce (func, wait) {
	let timeout;
	return function () {
		let context = this;
		let args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	}
}

/*
 * 节流函数
 * 作用是避免在短时间内频繁触发某一事件
 * 在一定事件间隔内只触发一次函数，可以使用时间戳方式或者setTimeout方式
 **/
// 使用时间戳方式
function throttle(func, wait) {
	let previous = 0;
	return function () {
		let context = this;
		let args = arguments;
		let nowTime = +new Date();
		if (nowTime - previous > wait) {
			previous = nowTime;
			return func.apply(context, args);
		}
	}
}
// 使用timeout方式
function throttle(func, wait) {
	let timeout;
	return function () {
		if (!timeout) {
			let context = this;
			let args =arguments;
			timeout = setTimeout(() => {
				timeout = null;
			}, wait);
			return func.apply(context, args);
		}
	}
}

/*
 * 数组去重
 **/
// 1、最原始的方式，两重循环
let array = [1, 1, '1', 1, '1'];
function unique(arr) {
	let res = [];
	for (let i = 0; i < arr.length; i++) {
		for (var j = 0; j < res.length; j++) {
			if (arr[i] === res[j]) {
				break;
			}
		}
		if (j === res.length) {
			res.push(arr[i]);
		}
	}
	return res;
}
console.log(unique(array)); // [1, '1']

// 2、使用indexOf的方式
function unique(arr) {
	let res = [];
	for (let i = 0; i < arr.length; i++) {
		if (res.indexOf(arr[i]) === -1) {
			res.push(arr[i]);
		}
	}
	return res;
}
console.log(unique(array)); // [1, '1']

// 3、使用排序后去重，排序后相同的元素会排在一起，直接调用sort方法排序不靠谱，这里自己需自己用函数得到排序后的数组
function unique(arr) {
	let res = [];
	arr = arr.concat().sort(); // concat是为了得到arr的拷贝，防止修改到原数组
	let last;
	for (let i = 0; i < arr.length; i++) {
		if (i === 0 || arr[i] !== last) {
			res.push(arr[i]);
		}
		last = arr[i];
	}
	return res;
}
console.log(unique(array)); // [1, "1", 1, "1"]

// 4、可以用filter来简化
function unique(arr) {
	return arr.filter((item, index, arr) => {
		return arr.indexOf(item) === index; // indexOf会返回第一个匹配到的元素的索引
	})
}
console.log(unique(array)); // [1, '1']

// 5、使用ES6的Set方法
function unique(arr) {
	return [...new Set(arr)];
}

/*
 * 函数柯里化
 * 柯里化是一种将使用多个参数的一个函数转化成使用一系列使用一个参数的函数的技术
 **/
// 1、柯里化常规实现
function curry(fn) {
	let args = [].slice.call(arguments, 1);
	return function () {
		return fn.apply(this, args.concat([].slice.call(arguments)));
	}
}
// 可以这样使用
function add(a, b) {
	return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry(); // 3

var addCurry = curry(add, 1);
addCurry(5); // 6

var addCurry = curry(add);
addCurry(2, 3); // 5

/*
 * 快速排序
 **/
// 1、普通排序，使用两个for循环
function sort(arr) {
	for (var i=0; i<arr.length-1; i++) {
		for (var j=i+1; j<arr.length; j++) {
			if (arr[i] > arr[j]) {
				var temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;
			}
		}
	}
	return arr;
}

sort([1,9,3,6,2]); // [1, 2, 3, 6, 9]

// 2、快速排序
// 找一个基准值大于它的放左边，小于的放右边，如此循环
// 参考链接 http://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html
function quicksort(arr) {
	if (arr.length <= 1) return arr;
	let middleIndex = Math.floor(arr.length/2);
	let middleValue = arr.splice(middleIndex, 1)[0];
	let left = [];
	let right = [];
	for (let i=0; i<arr.length; i++) {
		if (arr[i] < middleValue) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	return quicksort(left).concat([middleValue], quicksort(right));
}

quicksort([9,0,1,9,3,6,2,3,6]); // [0, 1, 2, 3, 3, 6, 6, 9, 9]

// 归并排序

function mergeSort (arr) {
	if (arr.length < 2) return arr;
	let middle = Math.floor(arr.length / 2);
	let left = arr.slice(0, middle);
	let right = arr.slice(middle);
	merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
	let result = [];
	while (left.length && right.length) {
		result.push(left[0] < right[0] ? left.shift() : right.shift());
	}

	result.concat(left, right);
}











// 2020.08.10 练习

// call实现
Function.prototype.call2 = function(context, ...res) {
	context = context || window;
	context.fn = this;

	let result = context.fn(...res);
	delete context.fn;
	return result;
}

// apply实现
Function.prototype.apply2 = function(context, res) {
	context = context || window;
	context.fn = this;

	let result = context.fn(...res);
	delete context.fn;
	return result;
}

// bind实现
Function.prototype.bind2 = function(context, ...args) {
	const self = this;
	return function (...args2) {
		return self.call(context, ...args, ...args2)
	}
}

// new实现
function newFun (construct, ...args) {
	const obj = new Object();
	obj.__proto__ = construct.prototype;

	let res = construct.apply(obj, args);

	return typeof res === 'object' ? res : obj;
}

// 防抖 - 一定要在n秒内没有触发新事件才执行
function debounce (fun, waiting) {
	let timeout;

	return function (...args) {
		clearTimeout(timeout);
		let self = this;

		timeout = setTimeout(() => {
			fun.apply(self, args);
		}, waiting)
	}
}

// 截流 - 一段时间只能执行一次
function throttle (func, wait) {
	let previous = 0;
	return function(...args) {
		let now = +new Date();
		if (now - previous > wait) {
			previous = now;
			return func.apply(this, args);
		}
	}
}

function throttle2 (func, wait) {
	let timeout;

	return function (...args) {
		if (timeout) return;
		func.apply(this, args)
		timeout = setTimeout(() => {
			timeout = null;
		}, wait);
	}
}

// 深拷贝
function deepCopy(target) {
	if (target == undefined || typeof target !== 'object') return target;

	const newObj = Array.isArray(target) ? [] : {};

	for (let key in target) {
		if (target.hasOwnProperty(key)) {
			newObj[key] = typeof target[key] === 'object' ? deepCopy(target[key]) : target[key];
		}
	}

	return newObj;
}

// compose - 组合函数
function a (next) {

	next(); // () => b()

function b (next) {
	next(); // c()
}

function c () {
	
}

a(
	() => b(
		c()
	)
)

let ret = 
() => a(
	() => b(
		c
	)
)

function compose(...args) {
	let [first, ...others] = args;

	let ret = first;

	others.forEach(fun => {
		ret = () => fun(ret)
	})

	return ret;
}

compose()()

// 尾递归
function factorial (n, res) {
	if (n < 2) return res;

	return factorial(n-1, n+res);
}

// 快速排序
function quicksort (arr) {
	if (arr.length <= 1) return arr;
	const middle = Math.floor(arr.length / 2);
	let middleValue = arr.splice(middle, 1)[0];

	let left = [];
	let right = [];

	arr.forEach(item => {
		item > middleValue ? right.push(item) : left.push(item)
	})

	return quicksort(left).concat(middleValue, quicksort(right))
}






