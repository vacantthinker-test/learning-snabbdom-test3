// snabbdom
// 第一步：vnode.js 使用vnode函数创建虚拟节点
//      h.js 给定3个参数, [封装一下vnode] 返回虚拟节点
// 第二步：比较新旧节点，更新页面
//      patch.js
//      createElement.js
//      patchVnode.js
//      updateChildren.js 新旧都有children [数组]


// 测试下 h.js
import h from "./mysnabbdom/h";
import patch from "./mysnabbdom/patch";

const box = document.getElementById('box')
// console.log('index.js box', box)

let vnode1 = h('ul', {}, [
    h('li', {key: 'B'}, 'B'),
    h('li', {key: 'A'}, 'A'),
    h('li', {key: 'C'}, 'C'),

])// console.log('index.js vnode1', vnode1)
patch(box, vnode1) // 第一次比较 真实DOM节点 虚拟节点

let vnode2 = h('ul', {}, [
    // h('li', {key: 'P'}, 'P1'),
    h('li', {key: 'M'}, 'M1'),
    h('li', {key: 'E'}, 'E1'),
    // h('li', {key: 'U'}, 'U1'),
    // h('li', {key: 'S'}, 'S1'),
    h('li', {key: 'A'}, 'A1'),
    // h('li', {key: 'E'}, 'E1'),
    h('li', {key: 'F'}, 'F1'),
])
setTimeout(() => {
    patch(vnode1, vnode2)
}, 300)











