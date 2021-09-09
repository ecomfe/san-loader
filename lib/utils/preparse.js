/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file preparse.js
 * @author wangjinghao <wangjinghao@baidu.com>
 */

const hash = require('hash-sum');
const postcss = require('postcss').default;
const render = require('dom-serializer').default;

const {getAST} = require('./helper');
const postcssPlugin = require('./set-scope-id');

const addId = (node, id) => {
    if (!node.attribs) {
        node.attribs = {};
    }
    node.attribs[`data-s-${id}`] = '';
    if (node.children) {
        node.children.map(c => addId(c, id));
    }
    return node;
};

/**
 * 预处理template增加属性，读出设置scoped的style模块重写选择器
 *
 * @param {string} source .san代码文本
 * @param {string} resourcePath 资源路径 for preparse
 * @return {string} 转换完的代码文本
 */
module.exports = function(source, resourcePath) {
    const id = hash(resourcePath);
    let ast = getAST(source);

    let hasScope = false;
    let noScript = true;

    for (let node of ast) {
        if (node.name === 'style' && node.attribs && Reflect.has(node.attribs, 'scoped')) {
            hasScope = true;
            if (node.children && node.children.length) {
                node.children[0].data = postcss([postcssPlugin(`data-s-${id}`)]).process(node.children[0].data).css;
            }
        }
    }

    for (let node of ast) {
        if (node.name === 'script') {
            noScript = false;
        }
        if (hasScope && node.name === 'template' && node.children && node.children.length) {
            for (let tag of node.children) {
                tag.type === 'tag' && addId(tag, id);
            }
        }
    }

    // 有时候一个简单的组件只需写template，那这里要补全script
    if (noScript) {
        ast.push({
            type: 'tag',
            name: 'script',
            children: [{
                type: 'text',
                data: 'export default {};'
            }]
        });
    }

    return render(ast, {
        decodeEntities: false
    });
};
