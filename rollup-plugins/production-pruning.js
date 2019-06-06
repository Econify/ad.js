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
  };

  let containsCodeBlock = false;

  let stringified = node.quasis.map(
    (item) => {
      return item.value.raw;
    }
  ).join('');

  let formatted = stringified.split(" ").map(word => {
    if (word.includes("Example:")) {
      containsCodeBlock = true;
      return word + "\n ``` \n";
    } else {
      return word;
    }
  }).join(" ");

  return containsCodeBlock ? formatted + "\n ```" : formatted;
};

const formatMessage = (node) => {
  const args = node.arguments;

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

  return formattedOutput;
}

const createErrorDocumentation = (node) => {
  const errorMessage = formatMessage(node);
  let errorIndex = errors.indexOf(errorMessage);

  if (errorIndex > -1) {
    return `Error-Code-${errorIndex + 1}`;
  } else {
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
}

const generateUrlFor = (node) => {
  const errorID = createErrorDocumentation(node);

  return `'https://www.adjs.dev/error?id=${errorID}'`
}

const createNewNode = (originalNode) => {
  const newNode = {};

  const nodes = orderBy(originalNode.arguments, ['start']);

  newNode.start = nodes[0].start;
  newNode.end = nodes[nodes.length - 1].end;
  newNode.value = generateUrlFor(originalNode);

  return newNode;
}

module.exports = function () {
  return {
    name: 'Production Pruning',
    transform(code, id) {
      const ast = this.parse(code, id);
      const s = new MagicString(code);

      walk(ast, {
        leave(node) {

          /*
            Remove all string from errors and replace with urls
            for the Ad.Js documentation for reference / lookup.
          */
          if (node.type === 'NewExpression' && node.callee.name === "Error") {
            if (node.arguments && !node.arguments[0].left) {
              const { start, end, value } = createNewNode(node);

              if (start !== end) {
                s.overwrite(start, end, value);
              }
            }
          }

          /*
              Remove all code wrapped in if ('__DEV__') {}
              Currently, only the DeveloperTools Plugin is using this.
          */
          if (node.type === 'IfStatement' && node.test.value === '__DEV__') {
            s.overwrite(node.start, node.alternate ? node.alternate.start : node.end, '');
          }

          if (node.callee && node.callee.name === "dispatchEvent") {
            s.remove(node.start, node.end);
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
