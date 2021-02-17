#!/usr/bin/env node
const fs = require('fs');
const _ = require('lodash');
const args = process.argv.slice(2);

const paths = {
  components: './src/components',
};

const template = (name, js) => {
  const camel = _.camelCase(name);
  const pascal = _.upperFirst(camel);
  return `<div class="${pascal}" ${(js) ? `data-component="${pascal}"` : ''}></div>`;
};

const styleTemplate = (name) => {
  const camel = _.camelCase(name);
  const pascal = _.upperFirst(camel);
  return `.${pascal}{}`;
};

const indexTemplate = (name, js) => {
  if (js) {
    return `import './_${name}';
export { default } from "./${name}";
    `;
  } else {
    return `import './_${name}';`;
  }
};

const readmeTemplate = (name) => {
  const title = _.camelCase(name);
  return `# ${title}`;
};

const jsTemplate = (name) => {
  const camel = _.camelCase(name);
  const pascal = _.upperFirst(camel);
  return `export default class ${pascal} {
  constructor(component) {
    this.dom = {
      $component: component
    },
    this.state = {
    }
    this.mount();
  }

  mount() {
    console.log('${pascal} : mount', this);
  }

  unmount() {
    console.log('${pascal} : unmount', this);
  }

}`;
};

const componentify = (args) => {
  console.log(`generating component with name: ${args}`);
  const name = args[0];
  const js = (args.indexOf('js') !== -1);

  const componentsPathExists = fs.existsSync(`${paths.components}`) && fs.lstatSync(`${paths.components}`).isDirectory()
  if ( !componentsPathExists ) {
    fs.mkdirSync(`${paths.components}`, function (err) {
      if (err) {
        console.log('failed to create components directory', err);
      }
    });
  }

  fs.mkdir(`${paths.components}/${name}`, function (err) {
    if (err) {
      console.log('failed to create directory', err);
    } else {
      fs.writeFileSync(`${paths.components}/${name}/${name}.liquid`, template(name, js));
      fs.writeFileSync(`${paths.components}/${name}/_${name}.scss`, styleTemplate(name));
      fs.writeFileSync(`${paths.components}/${name}/index.js`, indexTemplate(name, js));
      // fs.writeFileSync(`${paths.components}/${name}/readme.md`, readmeTemplate(name));

      if (js) {
        fs.writeFileSync(`${paths.components}/${name}/${name}.js`, jsTemplate(name));
      }
    }
  });
}

componentify(args);
