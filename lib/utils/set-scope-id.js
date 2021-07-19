/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file set-scope-id
 * @author wangjinghao <wangjinghao@baidu.com>
 */

const selectorParser = require('postcss-selector-parser');

module.exports = scopeId => {
    const keyframes = {};

    // 处理选择器
    const rewriteSelector = node => {
        if (!node.selector) {
            if (node.type === 'atrule') {
                // 媒体查询 https://astexplorer.net/#/2uBU1BLuJ1
                if (node.name === 'media') {
                    node.each(rewriteSelector);
                } else if (/-?keyframes$/.test(node.name)) {
                    keyframes[node.params] = node.params = node.params + '-' + scopeId;
                }
            }
            return;
        }
        node.selector = selectorParser(selectors => {
            selectors.each(s => {
                const attrNode = selectorParser.attribute({
                    attribute: scopeId
                });
                s.append(attrNode);
            });
        }).processSync(node.selector);
    };

    // 处理动画名称
    const rewriteAnimation = decl => {
        if (/^(-\w+-)?animation-name$/.test(decl.prop)) {
            decl.value = decl.value
                .split(',')
                .map(v => keyframes[v.trim()] || v.trim())
                .join(',');
        }
        if (/^(-\w+-)?animation$/.test(decl.prop)) {
            decl.value = decl.value
                .split(',')
                .map(v => {
                    const vals = v.trim().split(/\s+/);
                    // eslint-disable-next-line max-nested-callbacks
                    const i = vals.findIndex(val => keyframes[val]);
                    if (i !== -1) {
                        vals.splice(i, 1, keyframes[vals[i]]);
                        return vals.join(' ');
                    }
                    return v;
                })
                .join(',');
        }
    };

    return {
        postcssPlugin: 'set-scope-id',
        Once(root) {
            // step1
            root.each(node => rewriteSelector(node));
            // step2
            if (Object.keys(keyframes).length) {
                root.walkDecls(decl => rewriteAnimation(decl));
            }
        }
    };
};

module.exports.postcss = true;
