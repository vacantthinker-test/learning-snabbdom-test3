import vnode from "./vnode";

/**
 * 简单版本：text和children只能存在一种
 * 处理三种情况
 * 第三个参数是文本
 * 情况一：h('div', {}, 'text')
 *
 * 第三个参数是数组
 * 情况二：('div', {}, [
 *          h('span', {}, 'ssss'),
 *          h('span', {}, 'ssss'),
 *          h('span', {}, 'ssss'),
 *       ])
 *
 * 第三个参数是单个h 函数
 * 情况三：h('div', {},
 *          h('span', {}, 'span111')
 *          )
 *
 * @param sel
 * @param data
 * @param c
 * @returns {{data, children, elm, sel, text, key: *}|*}
 */
export default function h(sel, data, c) {
    let text
    let children
    let elm = undefined
    if (typeof c === 'string'){ // 如果c 类型是string
        text = c
    }else if (Array.isArray(c)){ // 如果c 是Array
        children = c
    }else if (c && c.sel !== undefined){ // 如果c 是单个h 函数
        children = [c]
    }

    return vnode(sel, data, text, children, elm)
}
