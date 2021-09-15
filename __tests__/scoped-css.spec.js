/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @author vanishcode <vanishcode@outlook.com>
 */

const hash = require('hash-sum');
const loader = require('../lib/loader');
const preparse = require('../lib/utils/preparse');
const webpackContext = require('./webpack-context.stub');

describe('test preparse function', () => {
    // eslint-disable-next-line jest/expect-expect
    test('add scopedid with tag selector', () => {
        const source = '<template><span>sanjs</span></template><style scoped>span{color:pink}</style>';
        const resourcePath = '/path/to/test.san';
        const id = hash(resourcePath);

        expect(preparse(source, resourcePath, true)).toEqual(
            '<template><span data-s-'
                + id
                + '>sanjs</span></template><style scoped>span[data-s-'
                + id
                + ']{color:pink}</style>'
                + '<script>export default {};</script>'
        );
    });

    test('add scopedid with class selector', () => {
        const source = '<template><span class="red">sanjs</span></template><style scoped>.red{color:pink}</style>';
        const resourcePath = '/path/to/test.san';
        const id = hash(resourcePath);

        expect(preparse(source, resourcePath, true)).toEqual(
            '<template><span class="red" data-s-'
                + id
                + '>sanjs</span></template><style scoped>.red[data-s-'
                + id
                + ']{color:pink}</style>'
                + '<script>export default {};</script>'
        );
    });

    test('hash', () => {
        const source = '<template><span>sanjs</span></template><style scoped>span{color:pink}</style>';
        const scope = {
            query: {
                compileTemplate: 'aPack'
            },
            resourcePath: '/foo.san?lang=html&san=&type=template',
            resourceQuery: '?lang=html&san=&type=template'
        };
        const ctx = webpackContext(scope).runLoader(loader, source);
        expect(JSON.stringify(ctx.code)).toContain(hash(scope.resourcePath));
    });

    test('in loader,really', () => {
        const source = '<template><span>sanjs</span></template><style scoped>span{color:pink}</style>';
        const scope = {
            query: {
                compileTemplate: 'aPack'
            },
            resourcePath: '/foo.san?lang=html&san=&type=template',
            resourceQuery: '?lang=html&san=&type=template'
        };
        const ctx = webpackContext(scope).runLoader(loader, source);
        expect(ctx.code).toEqual([
            1,
            'span',
            2,
            33,
            'data-s-' + hash(scope.resourcePath),
            3,
            '',
            undefined,
            3,
            'sanjs'
        ]);
    });
});
