// 如下为一段代码，请完善sum函数，使得 sum(1,2,3,4,5,6) 函数返回值为 21 ,
// 需要在 sum 函数中调用 asyncAdd 函数，且不能修改asyncAdd函数

/**
 * 请在 sum函数中调用此函数，完成数值计算
 * @param {*} a 要相加的第一个值
 * @param {*} b 要相加的第二个值
 * @param {*} callback 相加之后的回调函数
 */
function asyncAdd(a,b,callback) {
    setTimeout(function(){
     callback(null, a+b)
    },1000)
  }
  
  /**
   * 请在此方法中调用asyncAdd方法，完成数值计算
   * @param  {...any} rest 传入的参数
   */
  async function sum(...rest) {
    // 请在此处完善代码
  }
  
  let start = window.performance.now()
  sum(1, 2, 3, 4, 5, 6).then(res => {
    // 请保证在调用sum方法之后，返回结果21
    console.log(res)
    console.log(`程序执行共耗时: ${window.performance.now() - start}`)
  })

// 本题根据程序输出时间不同,可以划分为三个难度等级

// 青铜难度， 输出时长大于6秒
// 白银难度， 输出时长大于3秒
// 王者难度， 输出时长大于1秒

// 青铜难度 一个一个相加
async function sum(...rest) {
    let ret = rest.shift();

    for (let num of rest) {
        ret = await new Promise(resolve => {
            asyncAdd(ret, num, (_, r) => {
                resolve(r)
            })
        })
    }

    return ret;
}

// 白银难度，批量相加
async function sum(...rest) {
    if (rest.length == 1) return rest[0];

    let promises = [];
    for (let i = 0; i < rest.length; i = i+2) {
        promises.push(
            new Promise(resolve => {
                asyncAdd((rest[i] || 0), (rest[i+1] || 0), (_, r) => {
                    resolve(r)
                })
            })
        );
    }

    let res = await Promise.all(promises);

    return sum(...res);
}

// 王者难度
async function sum(...rest) {
    let result = 0;
    let obj = {};
    obj.toString = function() {
        return result;
    }

    let promises = []
    for (let num of rest) {
        promises.push(new Promise(resolve => {
            asyncAdd(obj, num, (_, r) => {
                resolve();
                result = r;
            })
        }))
    }

    await Promise.all(promises);

    return result;
}

// 实现instanceof
// 例如 let a = {}
// a instanceof Object 返回true

function instance_of (obj, Cons) {
    let proto = obj.__proto__;
    while (proto) {
        if (proto === Cons.prototype) {
            return true;
        }
        proto = proto.__proto__
    }
    return false;
}

// new 实现
function myNew (Cons, ...rest) {
    let obj = Object.create(Cons.prototype);
    let res = Cons.apply(obj, rest);

    return typeof res === 'object' ? res : obj;
}




// 同步promise实现
// 该实现有误，先不要看了，后面在研究

// class myPromise {
//     constructor (executor) {
//         this.status = 'pending';

//         this.successVal = null;

//         this.failVal = null;

//         const resolve = (data) => {
//             if (this.status != 'pending') return;
//             this.successVal = data;
//             this.status = 'resolved';
//         };

//         const reject = (data) => {
//             if (this.status != 'pending') return;
//             this.successVal = data;
//             this.status = 'rejected';
//         };

//         try {
//             executor(resolve, reject);
//         } catch(err) {
//             reject(err);
//         }
//     }

//     then (resolveFun, rejectFun) {
//         let returnPromise;
//         if (this.status === 'resolved') {
//             returnPromise = new myPromise(resolveFun);
//         }

//         if (this.status === 'rejected') {
//             returnPromise = new myPromise(rejectFun);
//         }

//         return returnPromise;
//     }
// }


// compose 中间件
function compose(middlewares) {
    return function(ctx) {
        return dispatch(0);

        function dispatch(i) {
            let fn = middlewares[i];
            // 没有要执行的中间件了就resolve
            if (!fn) return Promise.resolve();

            // 返回一个promise
            // 返回的promise需要等它的参数resolve后才能resolve
            return Promise.resolve(
                fn(ctx, function next() {
                    return dispatch(i + 1);
                })
            )
        }
    }
}

function compose(middlewares) {
    let [first, ...rest] = middlewares.reverse();

    let ret = first;
    rest.forEach(fn => {
        let oldRet = ret;
        ret = () => fn(oldRet);
    })

    return ret;
}


// f1, f2, f3
f1(() => f2(f3))
  