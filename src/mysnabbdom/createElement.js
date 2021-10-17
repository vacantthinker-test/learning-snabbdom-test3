/**
 * 创建DOM元素, 根据给定的vnode 虚拟节点
 *      记得挂载DOM元素在vnode上
 * @param vnode
 * @returns {*}
 */
export default function createElement(vnode) {
    let sel = vnode.sel
    let text = vnode.text
    let children = vnode.children
    let domNode = document.createElement(sel)
    if (text){
        domNode.innerText = text
    }else if (children) {
        // h('ul', {}, [
        //      h('li', {}, 'li1'),
        //      h('li', {}, 'li2'),
        //      h('li', {}, 'li3'),
        // ])
        for (let i = 0; i < children.length; i++) {
            let item = children[i]
            let newChild = createElement(item)
            domNode.appendChild(newChild)
        }
    }
    // 挂载domNode到虚拟节点 vnode 上
    vnode.elm = domNode

    return domNode
}