Function.prototype.call2 = function (self, ...params) {
	self.func = this;
	self.func(...params);
};

Function.prototype.apply2 = function (self, paramsArr) {
	self.func = this;
	self.func(...(paramsArr || []));
};

Function.prototype.bind2 = function (self, ...params) {
	let func = this;
	return function (...params2) {
		func.call(self, ...params, ...params2);
	}
};

function Construct() {
	if (Construct.unique) return Construct.unique;
	this.a = 111;
	Construct.unique = this;
}

let Construct = (function () {
	let unique;
	return function () {
		if (unique) return unique;
		this.a = 111;
		unique = this;
	}
})();

let single = (function () {
	let unique;
	function Construct() {

	}
	unique = new Construct();
	return function () {
		return unique;
	}
})();

function flattern (arr) {
	let result = [];
	arr.forEach(item => {
		result = result.concat(Array.isArray(item) ? flattern(item) : item);
	});
	return result;
}

function flattern2 (arr) {
	return arr.reduce(function (prev, next) {
		return prev.concat(Array.isArray(next) ? flattern2(next) : next);
	}, []);
}

function getMax (arr) {
	return arr.reduce((prev, next) => {
		return (next > prev) ? next : prev;
	})
}

function shallowCopy (obj) {
	if (!obj || typeof obj !== 'object') return obj;
	let result = Array.isArray(obj) ? [] : {};
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) result[key] = obj[key]
	}
	return result;
}

function deepCopy (obj) {
	if (!obj || typeof obj !== 'object') return obj;
	let result;
	if (obj instanceof Date) {
		result = new Date();
		result.setTime(obj.getTime());
		return result;
	}
	if (obj instanceof Array) {
		result = [];
		for (let i = 0; i < obj.length; i ++) {
			result[i] = deepCopy(obj[i]);
		}
		return result;
	}
	if (obj instanceof Object) {
		result = {};
		for (let i in obj) {
			if (obj.hasOwnProperty(i)) result[i] = deepCopy(obj[i]);
		}
		return result;
	}
}

function throttle (func, wait) {
	let prevTime = 0;
	return function (...params) {
		if (new Date() - prevTime > wait) {
			prevTime = new Date();
			func.call(this, ...params);
		}
	}
}

function throttle2 (func, wait) {
	let timeOut;
	return function (...params) {
		if (timeOut) return;
		timeOut = setTimeout(() => {
			timeOut = null;
			return func.call(this, ...params);
		}, wait);
	}
}

function dobounce (func, wait) {
	let timeOut;
	return function (...params) {
		clearTimeout(timeOut);
		timeOut = setTimeout(() => {
			return func.call(this, ...params);
		}, wait);
	}
}

Function.prototype.call2 = function () {
	let [obj, ...args] = [].slice.call(arguments);
	obj.fn = this;
	let result = obj.fn(...args);
	delete  obj.fn;
	return result;
};

Function.prototype.apply2 = function () {
	let [obj, args] = [].slice.call(arguments);
	obj.fn = this;
	let result = obj.fn(...args);
	delete  obj.fn;
	return result;
};

Function.prototype.bind2 = function (self, ...params) {
	let func = this;
	return function (...params2) {
		return func.call(self, ...params, ...params2);
	}
};

// 实现new
function factory (func, ...params) {
	let obj = Object.create(func.prototype);
	let result = func.apply(obj, params);
	return typeof result === 'object' ? result: obj;
};

// 防抖
function debounce (fun, wait) {
	let timeOut;
	return function (...args) {
		clearTimeout(timeOut);
		timeOut = setTimeout(() => fun.apply(this, args), wait);
	};
}

// 节流
function throttle(func, wait) {
	let previous = 0;
	return function (...args) {
		let now = +new Date();
		if (now - previous < wait) return;
		previous = now;
		return func.apply(this, args);
	}
}

function throttle2 (func, wait) {
	let timeOut;
	return function (...args) {
		if (!timeOut) {
			timeOut = setTimeout(() => {
				timeOut = null;
				return func.apply(this, args);
			}, wait);
		}
	}
}

// 去重
function unique (arr) {
	return [...new Set(arr)];
}

// 浅拷贝
function shallowCopy(obj) {
	if (typeof obj !== 'object') return obj;
}

// 快排
function quicksort (arr) {
	if (arr.length <= 1) return arr;
	let middleIndex = Math.floor(arr.length / 2);
	let middleValue = arr.splice(middleIndex, 1)[0];
	let left = [];
	let right = [];
	arr.forEach(item => {
		item > middleValue ? right.push(item) : left.push(item);
	});
	return quicksort(left).concat([middleValue], quicksort(right));
}

function Parent () {
	this.p = 1;
}

Parent.prototype.add = function () {

};

function Child () {
	Parent.call(this);
	this.childParam = 3;
}

Child.prototype = Object.create(Parent.prototype);

Child.prototype.constructor = Child;


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

function shallowCopy (obj) {
	if (null == obj || typeof obj !== 'object') return obj;
	let copy = obj instanceof Array ? [] : {};
	Object.keys(obj).forEach(key => copy[key] = obj[key]);
	return copy;
}

function deepCopy (obj) {
	if (null == obj || typeof obj !== 'object') return obj;
	let copy;
	if (obj instanceof Date) {
		copy = new Date();
		return copy.setTime(obj.getTime());
	}
	copy = obj instanceof Array ? [] : {};
	Object.keys(obj).forEach(key => {
		copy[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
	});
	return copy;
}

























































