const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chokidar = require('chokidar');

class CopyLiquidFilesPlugin {

  constructor(options) {
    this.options = options;
  }

  copy(filePath) {
    const {
      options
    } = this;

    const fileName = path.basename(filePath);
    fs.copyFile(`${filePath}`, `${options.dest}${fileName}`, (err) => {
      if (err) throw err;
      console.log(`${fileName} was copied from ${filePath} to ${options.dest}${fileName}`);
    });
  }

  delete(filePath) {
    const {
      options
    } = this;
    try {
      fs.unlinkSync(filePath)
    } catch(err) {
      console.error(err)
    }
  }

  apply(compiler) {
    const {
      options
    } = this;

    // copy & watch
    compiler.hooks.afterEnvironment.tap('CopyLiquidFilesPlugin', (compiler, callback) => {

      // copy build
      if (options.build) {
        console.log('CopyLiquidFilesPlugin : afterEnvironment : copying');
        const files = glob(options.src, '', (er, files) => {
          try {
            files.forEach((file) => this.copy(file));
          } catch(err) {
            console.error(err)
          }
        });
      }

      // watch dev
      if (!options.build) {
        console.log('CopyLiquidFilesPlugin : afterEnvironment : watching');
        const watcher = chokidar.watch(options.src);
        watcher
          .on('add', path => this.copy(path))
          .on('change', path => this.copy(path))
          .on('unlink', path => this.delete(path));
      }
    });

    compiler.hooks.done.tap('CopyLiquidFilesPlugin', (stats) => {
      console.log('CopyLiquidFilesPlugin : done : clean snippets directory');
      const destination_glob = `${options.dest}*.liquid`;
      const files = glob(destination_glob, '', (er, files) => {
        try {
          files.forEach((file) => this.delete(file));
        } catch(err) {
          console.error(err)
        }
      });
    });
  }
}

module.exports = CopyLiquidFilesPlugin;
