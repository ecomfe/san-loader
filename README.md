# san-loader 

[![Build Status](https://circleci.com/gh/ecomfe/san-loader/tree/master.svg?style=shield)](https://circleci.com/gh/ecomfe/san-loader/tree/master) [![npm package](https://img.shields.io/npm/v/san-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/san-loader) [![Dependencies](http://img.shields.io/david/ecomfe/san-loader.svg)](https://david-dm.org/ecomfe/san-loader)

> San component loader for [Webpack](http://webpack.github.io).


It allows you to write your components in this format:

```
<template>
    <div class="hello">hello {{msg}}</div>
</template>
<script>
    export default {
        data: {
            msg: 'world'
        }
    }
</script>
<style>
    .hello {
        color: blue;
    }
</style>
```

## Usage

```
{
    module: {
        loaders: [
            {
                test: /\.san$/,
                loader: 'san-loader'
            }
        ]
    }
}

```

## Thanks

* [vue-loader](https://github.com/vuejs/vue-loader)

## License

[MIT](http://opensource.org/licenses/MIT)
