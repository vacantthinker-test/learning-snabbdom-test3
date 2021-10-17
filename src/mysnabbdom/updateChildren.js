/**
 *
 */
import {sameVnode} from "./patch";
import patchVnode from "./patchVnode";
import createElement from "./createElement";

export default function updateChildren(elm, oldCh, newCh) {
    // 四命中查找
    // 一：新前与旧前
    // 四个指针, 四个指针对应的虚拟节点
    let oldStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let newStartIdx = 0
    let newEndIdx = newCh.length - 1

    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldCh.length - 1]
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newCh.length - 1]

    let oldMap;
    let positionInOldMap;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {

        if (sameVnode(oldStartVnode, newStartVnode)) {
            // 一：新前与旧前
            // 如果 新前与旧前匹配
            // 步骤一：patchVnode 更新
            // 步骤二：移动指针 更新节点, 因为匹配了, 表示这两个元素处理过了.
            //          移动指针, 更新节点
            patchVnode(oldStartVnode, newStartVnode)
            // 当前示例：匹配 第一种命中查找：新前与旧前
            // old  A   B   C
            // new  A1  B1  C1
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            // 二：新后与旧后
            // 如果 新后与旧后 匹配
            // 当前示例：匹配 第二中查找：新后与旧后
            // old  A   B   C
            // new  E1  F1  A1  B1  C1
            patchVnode(oldEndVnode, newEndVnode)

            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
            // 三：新后与旧前
            patchVnode(oldStartVnode, newEndVnode)
            // 当前示例：匹配 第三种命中查找：新后与旧前
            // old  A   B   C
            // new  E1  F1  C1  B1  A1
            // 有匹配的元素, 更新元素, 然后 移动元素
            // 第一次匹配 A -- A1
            let lastElm = oldCh[oldEndIdx].elm;
            let refChild = lastElm.nextSibling;
            let newChild = oldCh[oldStartIdx].elm;
            // 移动A1 至 DOM 最后面
            elm.insertBefore(newChild, refChild)
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            // 四：新前与旧后
            // 匹配元素 更新元素 移动元素
            patchVnode(oldEndVnode, newStartVnode)

            // 当前示例：匹配 第四种查找：新前与旧后
            // old  E1  F1  C1  B1  A1
            // new  A   B   C
            // 第一次匹配 old.A1 -- new.A

            let refChild = oldCh[oldStartIdx].elm
            let newChild = oldCh[oldEndIdx].elm
            // 移动 newChild 在 DOM 最前面
            elm.insertBefore(newChild, refChild)

            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        } else {
            // 非四命中
            // 一：新前与旧前 二：新后与旧后 三：新后与旧前 四：新前与旧后 都不是
            // 乱序

            // 每次从 new 中 提取一个, 看看在不在 old 中 --> key
            //      在, 移动元素
            //      不在, 创建新元素, 添加新元素至DOM

            if (oldMap === undefined) {
                oldMap = createOldMap(oldCh)
            }
            positionInOldMap = oldMap[newStartVnode.key]


            if (positionInOldMap === undefined) {
                // console.log('非四命中 没找到对应的Key', newStartVnode.key)
                // 没有
                // 创建新元素
                // 添加新元素至DOM

                // M1 在 old 中么?
                // 不在
                let refChild = oldCh[oldStartIdx].elm
                let newChild = createElement(newStartVnode)
                elm.insertBefore(newChild, refChild)
            } else {
                // 有匹配的, old 中 有 new的 元素
                //      更新该元素
                // console.log('非四命中 找到了对应的Key', newStartVnode.key)
                patchVnode(oldCh[positionInOldMap], newStartVnode)

                //      移动该元素
                let refChild = oldCh[oldStartIdx].elm
                let newChild = oldCh[positionInOldMap].elm
                // 当前示例：匹配 非四命中
                // old  B   A   C
                // new  M1  E1  A1  F1
                // 注意 这里是三个数组
                // DOM children 也算一个
                //
                // while true 第一次非四命中 没有M          M1   B   A   C
                // while true 第二次非四命中 没有E          M1   E1  B   A  C
                // while true 第三次非四命中 有A 移动A       M1  E1   A1  B  C
                // while false
                // if 来处理剩余的
                elm.insertBefore(newChild, refChild)

                //      标记该元素已经处理过了, undefined
                oldCh[positionInOldMap] = undefined
            }
            newStartVnode = newCh[++newStartIdx]
            // end 非四命中
            // finished 完成.
        }
    }


    // 当前示例：匹配 第一种命中查找：新前与旧前
    // old  A   B   C
    // new  A1  B1  C1  D1
    // 多了一个, while 是两两对比, if 来处理剩余的
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) { // 3 > 2
            // console.log('if')
            // 创建新元素, 添加新元素
            let refChild = oldStartVnode !== undefined
                ? oldStartVnode.elm
                : null
            // let newChild = createElement(newStartVnode)
            // 当前示例：匹配 第一种命中查找：新前与旧前
            // old  A   B   C
            // new  A1  B1  C1  D1  E1
            // 多了两个个, while 是两两对比, if 来处理剩余的
            // refChild = null

            // 当前示例：匹配 第二中查找：新后与旧后
            // old  A   B   C
            // new  E1  F1  A1  B1  C1
            // refChild = A


            addVnode(elm, newCh, newStartIdx, newEndIdx, refChild)
        } else {
            // console.log('else')
            // 删除多余元素
            // 当前示例：匹配 第一种命中查找：新前与旧前
            // old  A   B   C
            // new  A1  B1
            // new 比 old 少了一个, while 处理了前两个, if来处理剩下的

            // 移除多余的
            // oldStartVnode.elm.remove() // 移除了一个
            // 当前示例：匹配 第一种命中查找：新前与旧前
            // old  A   B   C
            // new  A1
            // new 比 old 少了两个, while 处理了前两个, if来处理剩下的
            removeVnode(oldCh, oldStartIdx, oldEndIdx)

        }
    }
}

export function removeVnode(children, startIdx, endIdx) {
    for (; startIdx <= endIdx; startIdx++) {
        let item = children[startIdx];
        if (item !== undefined) {
            item.elm.remove()
        }
    }
}

export function addVnode(elm, children, startIdx, endIdx, refChild) {
    for (; startIdx <= endIdx; startIdx++) {
        let item = children[startIdx]
        let newChild = createElement(item)
        elm.insertBefore(newChild, refChild)
    }
}

function createOldMap(oldCh) {
    let map = {}
    for (let i = 0; i < oldCh.length; i++) {
        let item = oldCh[i]
        if (item !== undefined) {
            let key = item.key
            map[key] = i
        }
    }
    return map
}















