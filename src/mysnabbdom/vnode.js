/**
 * 创建虚拟节点
 * @param sel 选择器 例如：div, ul, li, section, ol...
 * @param data { class : { redText}, props: { href: '', title: '',}} ...
 * @param text 文本 [当前选择器的文本内容]
 * @param children 子代 例如：ul的子代 li, li, li ....
 * @param elm 元素 [虚拟节点对应的 DOM 元素]
 * @returns {{data, children, elm, sel, text, key: *}}
 */
export default function vnode(sel, data, text, children, elm) {
    let key = data !== undefined ? data.key : undefined
    return {sel, data, text, children, elm, key}
}