const MagicString = require('magic-string');
const { walk } = require('estree-walker');
const orderBy = require('lodash.orderby');
const fs = require('fs');

const errorFile = fs.createWriteStream('./docs/error.md');
errorFile.write('# Common Errors\n');
errorFile.end();

let errorCounter = 1;
let errors = [];

const stringifyTemplateLiteral = (node) => {
  if (node.expressions.length) {
    throw new Error('Not yet configured for embedded variables in TemplateLiterals');
  }

  return node.quasis.map(
    (item) => {
      return item.value.raw;
    }
  ).join('');
};

const formatMessage = (node) => {
  const args = node.argument.arguments;

  const formattedOutput = args.reduce((acc, el) => {
    switch (el.type) {
      case 'TemplateLiteral':
        const str = stringifyTemplateLiteral(el);
        return `${acc} ${stringifyTemplateLiteral(el)}`;
      case 'Literal':
        return `${acc} ${el.value}\n`
      default:
        throw new Error('Type not defined');
    }
  }, 'Description:');

  console.log(formattedOutput);
  return formattedOutput;
}

const createErrorDocumentation = (node) => {
  const errorMessage = formatMessage(node);
  const errorIndex = errors.push(errorMessage);

  const markdownOutput = `
## Error Code ${errorIndex}:

${errorMessage}
`;

  fs.appendFile('./docs/error.md', markdownOutput, (err) => {
    if (err) throw err;
  });

  return `Error-Code-${errorIndex}`;
}

const generateUrlFor = (node) => {
  const errorID = createErrorDocumentation(node);
  
  return `'https://www.adjs.dev/error?id=${errorID}'`
}

const createNewNode = (originalNode) => {
  const newNode = {};

  const nodes = orderBy(originalNode.argument.arguments, ['start']);

  newNode.start = nodes[0].start;
  newNode.end = nodes[nodes.length - 1].end;
  newNode.value = generateUrlFor(originalNode);

  return newNode;
}

module.exports = function () {
  return {
    name: 'Error Minifier',
    transform(code, id) {
      const ast = this.parse(code, id);
      const s = new MagicString(code);

      walk(ast, {
        leave(node) {
          if (node.type === 'ThrowStatement') {
            if (node.argument.arguments) {
              const args = node.argument.arguments;

              const { start, end, value } = createNewNode(node);

              if (start !== end) {
                s.overwrite(start, end, value);
              }
            }
          }
        }
      });

      return {
        code: s.toString(),
        map: s.generateMap(),
      };
    }
  };
}
