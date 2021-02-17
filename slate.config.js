/* eslint-disable */

// Configuration file for all things Slate.
// For more information, visit https://github.com/Shopify/slate/wiki/Slate-Configuration

const path = require('path');
const CopyLiquidFilesPlugin = require('./webpack/CopyLiquidFilesPlugin');

module.exports = {
  'cssVarLoader.liquidPath': ['src/snippets/css-variables.liquid'],
  'webpack.extend': {
    plugins: [
      new CopyLiquidFilesPlugin({
        src: './src/components/**/*.liquid',
        dest: './src/snippets/',
        build: (process.env.NODE_ENV === 'production')
      })
    ]
  },
};
