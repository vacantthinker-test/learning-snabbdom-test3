/**
 * 比较新旧虚拟节点, 然后更新成新的
 *
 * @param oldVnode 旧虚拟节点
 * @param newVnode 新虚拟节点
 */
import vnode from "./vnode";
import createElement from "./createElement";
import patchVnode from "./patchVnode";

export default function patch(oldVnode, newVnode) {
    // 第一次比较 oldVnode不是虚拟节点
    // 转化一下
    if (oldVnode.sel === undefined) { // 如果 oldVnode 没有sel属性
        // oldVnode 是 真实节点
        let sel = oldVnode.tagName.toLowerCase()
        let text = oldVnode.innerText
        oldVnode = vnode(sel, {}, text, undefined, oldVnode)
    }
    // --------------------------------------------------------------------

    // 现在新旧都是虚拟节点了, 如何判断新旧节点是一样的节点? key && sel
    // let elm = oldVnode.elm

    if (sameVnode(oldVnode, newVnode)) {
        // console.log('patch.js --- 新旧节点是一样的')
        patchVnode( oldVnode, newVnode)
    }else {
        // console.log('patch.js --- 新旧节点不一样')
        // 新旧节点不一样
        // 步骤一：创建新元素
        let refChild = oldVnode.elm
        let newChild = createElement(newVnode) // span新元素 h('span', {}, 'c is text')
        // 步骤二：添加新元素
        let elm = oldVnode.elm // div#box
        // div#box 和 span新元素 是同一级别的
        let bodyElement = elm.parentElement; // div#box父元素 为 body元素
        // 插入 span新元素 到 dib#box 的前一个位置
        bodyElement.insertBefore(newChild, refChild)
        // 步骤三：删除旧元素
        elm.remove()
    }
}

/**
 * 如果key 一样, 并且 sel 一样, 那么vnode1 和 vnode2 是相同的节点. 返回true
 * @param vnode1
 * @param vnode2
 * @returns {boolean}
 */
export function sameVnode(vnode1, vnode2) {
    let sameKey = vnode1.key === vnode2.key;
    let sameSel = vnode1.sel === vnode2.sel;
    return sameKey && sameSel
}










