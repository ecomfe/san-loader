/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file example entry
 * @author clark-t
 */

// import App from './components/js/comp-global-store/index';
import App, {homepage} from './App';

const app = new App();
app.attach(document.body);
console.log('---- this is main index ---');
console.log('San Loader Homepage:', homepage)
