/**
 * 新旧节点是一样的, 更新它
 * @param elm
 * @param oldVnode
 * @param newVnode
 */
import updateChildren from "./updateChildren";
import createElement from "./createElement";

export default function patchVnode(oldVnode, newVnode) {
    // 新旧节点是一样的,
    // 这里需要更新一下 新虚拟节点的elm
    //      新旧节点是一样的, 都是div, 可是新虚拟节点的elm 初始值 是 undefined
    // debug 查看一下

    let elm = newVnode.elm = oldVnode.elm

    let newText = newVnode.text;
    let newCh = newVnode.children
    let oldText = oldVnode.text;
    let oldCh = oldVnode.children

    if (newText !== undefined){ // 如果 新 有tex 无children
        if (newText !== oldText){
            elm.textContent = ''
            elm.innerText = newText
        }
    }else if (newCh !== undefined){ // 如果新有children 无text
        // 情况一：旧有children 无text
        // 情况二：旧无children 有text
        if (oldCh !== undefined){
            // 新旧都有数组, 四命中查找 while if
            updateChildren(elm, oldCh, newCh)
        }else if (oldText !== undefined){
            // 旧无children 只有text
            console.log('旧只有text, 新只有children, 删除旧text, 添加新元素至DOM节点')
            // 步骤一：清空 旧text
            elm.textContent = ''
            // 步骤二：创建新元素
            // 步骤三：添加新元素到DOM节点
            addVnode(elm, newCh)
        }
    }

}

export function addVnode(elm, children) {
    for (let i = 0; i < children.length; i++) {
        let item = children[i];
        let newChild = createElement(item)
        elm.appendChild(newChild)
    }
}


























