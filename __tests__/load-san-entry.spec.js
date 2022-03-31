/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @author harttle
 */

const loader = require('../lib/loader');
const webpackContext = require('./webpack-context.stub');

describe('.san 文件的产出', () => {
    test('整体框架', () => {
        const source = `
            <template>
                <span class="{{$style.red}}">Author: harttle</span>
            </template>
            <style module>.red { color: red }</style>
            <style module="styleButton">.button { color: red }</style>
            <script>
                export default class CompComponent extends Component {
                    attached() { console.log('attached') }
                }
            </script>
        `;
        let ctx = webpackContext({resourcePath: '/foo.san'}).runLoader(loader, source);
        expect(ctx.code).toContain('var normalize = require');
        expect(ctx.code).toContain('var template = require');
        expect(ctx.code).toContain('var script = require');
        expect(ctx.code).toContain('var style0 = require');
        expect(ctx.code).toContain('var styleButton = require');
        expect(ctx.code).toContain('module.exports = require');
        expect(ctx.code).toContain('module.exports.default = normalize(script, template, injectStyles)');
        ctx = webpackContext({resourcePath: '/foo.san', query: {esModule: true}}).runLoader(loader, source);
        expect(ctx.code).toContain('import normalize from');
        expect(ctx.code).toContain('import template from');
        expect(ctx.code).toContain('import script from');
        expect(ctx.code).toContain('import style0 from');
        expect(ctx.code).toContain('import styleButton from');
        expect(ctx.code).toContain('export * from');
        expect(ctx.code).toContain('export default normalize(script, template, injectStyles)');

        // eslint-disable-next-line
        expect(ctx.code).toContain('var injectStyles = [{exportAs: undefined, style: style0}, {exportAs: \'styleButton\', style: styleButton}]');
    });

    test('导入 <template> 部分', () => {
        const source = '<template><span>Author: harttle</span></template>';
        let ctx = webpackContext({resourcePath: '/foo.san'}).runLoader(loader, source);
        expect(ctx.code).toContain('var template = require(\'/foo.san?lang=html&san=&type=template');
        ctx = webpackContext({resourcePath: '/foo.san', query: {esModule: true}}).runLoader(loader, source);
        expect(ctx.code).toContain('import template from \'/foo.san?lang=html&san=&type=template');
    });

    test('导入 <style> 部分', () => {
        const source = '<style>p {color: black}</style>';
        let ctx = webpackContext({resourcePath: '/foo.san'}).runLoader(loader, source);
        expect(ctx.code).toContain('require(\'/foo.san?lang=css&san=&type=style&index=0');
        ctx = webpackContext({resourcePath: '/foo.san', query: {esModule: true}}).runLoader(loader, source);
        expect(ctx.code).toContain('import \'/foo.san?lang=css&san=&type=style&index=0');
    });

    test('导入 <style module>', () => {
        const source = `
            <style module>p {color: black}</style>
            <style module="styleButton">.button {color: black}</style>
        `;
        let ctx = webpackContext({resourcePath: '/foo.san'}).runLoader(loader, source);
        expect(ctx.code).toContain('var style0 = require(\'/foo.san?lang=css&module=&san=&type=style&index=0');
        // eslint-disable-next-line
        expect(ctx.code).toContain('var styleButton = require(\'/foo.san?lang=css&module=styleButton&san=&type=style&index=1');
        ctx = webpackContext({resourcePath: '/foo.san', query: {esModule: true}}).runLoader(loader, source);
        expect(ctx.code).toContain('import style0 from \'/foo.san?lang=css&module=&san=&type=style&index=0');
        // eslint-disable-next-line
        expect(ctx.code).toContain('import styleButton from \'/foo.san?lang=css&module=styleButton&san=&type=style&index=1');
    });

    test('导入 <style module src="./s.less">', () => {
        const source = `
            <style module src="./s.less"></style>
            <style module="styleButton" src="./s.less"></style>
        `;
        let ctx = webpackContext({resourcePath: '/foo.san'}).runLoader(loader, source);
        expect(ctx.code).toContain('var style0 = require(\'./s.less?module=\'');
        expect(ctx.code).toContain('var styleButton = require(\'./s.less?module=styleButton\'');
        ctx = webpackContext({resourcePath: '/foo.san', query: {esModule: true}}).runLoader(loader, source);
        expect(ctx.code).toContain('import style0 from \'./s.less?module=\'');
        expect(ctx.code).toContain('import styleButton from \'./s.less?module=styleButton\'');
    });

    test('导入 <script> 部分', () => {
        const source = '<script>console.log(1)</script>';
        let ctx = webpackContext({resourcePath: '/foo.san'}).runLoader(loader, source);
        expect(ctx.code).toContain('var script = require(\'/foo.san?lang=js&san=&type=script');
        ctx = webpackContext({resourcePath: '/foo.san', query: {esModule: true}}).runLoader(loader, source);
        expect(ctx.code).toContain('import script from \'/foo.san?lang=js&san=&type=script');
    });
});
