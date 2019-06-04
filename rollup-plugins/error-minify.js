const MagicString = require('magic-string');
const { walk } = require('estree-walker');
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> remove adjserror, finish implementing plugin (except bug)
const orderBy = require('lodash.orderby');
const fs = require('fs');

const errorFile = fs.createWriteStream('./docs/error.md');
errorFile.write('# Common Errors\n');
errorFile.end();

let errorCounter = 1;
<<<<<<< HEAD
let errors = [];

const stringifyTemplateLiteral = (node) => {
  if (node.expressions.length) {
    throw new Error('Not yet configured for embedded variables in TemplateLiterals');
  };
=======
let errors = {};

const formatArgs = (args) => {
  // take the arguments of an error and format it in two ways:
  // first, a formatted string literal to add to our markdown file
  // second, an array to keep track of error subject lines so we don't repeat
  // ourselves
  let statements = [];

  let formatted = args.reduce((acc, el) => {
    if (el.type === 'TemplateLiteral' && el.quasis[0].value.raw) {
      let hasExample = false;
      let hasIndent = false;

      let formattedLiteral = el.quasis[0].value.raw.split(" ").map((word) => {
        if (word.includes("Example:")) {
          hasExample = true;
          return `${word} \n \`\`\` \n`;
        } else if (word.includes(".") && !hasIndent)  {
          hasIndent = true;
          return `${word} \n`
        } else {
          return word
        }
      }).join(" ");
>>>>>>> remove adjserror, finish implementing plugin (except bug)

  let containsCodeBlock = false;

<<<<<<< HEAD
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
=======
      statements = [...statements, ...el.quasis[0].value.raw.split('.')]
      return `${acc} ${formattedLiteral} \n`;
    }  else if (el.value) {
      statements = [...statements, ...el.value.split('.')]
      return `${acc} ${el.value} \n`;
>>>>>>> remove adjserror, finish implementing plugin (except bug)
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

<<<<<<< HEAD
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

=======
const fs = require('fs');

const errorFile = fs.createWriteStream('./docs/error.md')
errorFile.write(`# Common Errors
`);
errorFile.end();

>>>>>>> add build script
=======
const pushToErrs = (statements) => {
  fs.appendFile('./docs/error.md', statements, (err) => {
    if (err) throw err;
  });
}

const generateUrl = (string) => {
  let urlString = string.split(" ").join("-")
  return `https://www.adjs.dev/error?id=${urlString}`
}

const createNewNode = (originalNode, newText) => {
  const newNode = {};

  const nodes = orderBy([
    ...originalNode.argument.arguments
  ], ['start']);

  newNode.start = nodes[0].start;
  newNode.end = nodes[nodes.length - 1].end;
  newNode.value = generateUrl(newText)

  return newNode
}

>>>>>>> remove adjserror, finish implementing plugin (except bug)
module.exports = function () {
  return {
    name: 'Error Minifier',
    transform(code, id) {
      const ast = this.parse(code, id);
      const s = new MagicString(code);
<<<<<<< HEAD

      walk(ast, {
        leave(node) {
          if (node.type === 'NewExpression' && node.callee.name === "Error") {
            if (node.arguments && !node.arguments[0].left) {
              const args = node.arguments;

              const { start, end, value } = createNewNode(node);

              if (start !== end) {
                s.overwrite(start, end, value);
              }
=======
      walk(ast, {
        leave(node) {
          if (node.type === 'ThrowStatement') {
            if (node.argument.arguments) {
<<<<<<< HEAD
              let mappedStatements = node.argument.arguments.reduce((acc, el) => {
                if (el.type === 'TemplateLiteral') {
                  console.log(el.quasis[0].value.cooked);
                  return acc + ' ' + el.quasis[0].value.cooked;
                } else if (el.type === 'TaggedTemplateExpression')  {
                  return acc + ' ' + el.quasi.quasis[0].value.cooked;
                } else {
                  return acc + ' ' + el.value;
=======
              let isRollupError = false;
              const arguments = node.argument.arguments;
              const formatted = formatArgs(arguments);

              const formattedStatements = formatted[0];
              const splitStatements = formatted[1];

              console.log("FORMATTED STATEMENTS", formattedStatements)

              if (formattedStatements) {
                const { start, end, value } = createNewNode(node, splitStatements[0]);

                console.log(start, end, value)

                if (start !== end) {
                  s.overwrite(start, end, value);
                }

                if (!errors[splitStatements[0]]) {
                  pushToErrs(`### ${errorCounter}: ${formattedStatements}`)
                  node.argument.arguments[0].value = [generateUrl(`${errorCounter}: ${splitStatements[0]}`)]
                  errors[splitStatements[0]] = [...splitStatements.slice(1)]
                  errorCounter++
                } else if (!errors[splitStatements[0]].includes(splitStatements[1])) {
                  pushToErrs(`### ${errorCounter}: ${formattedStatements}`)
                  node.argument.arguments[0].value = [generateUrl(`${errorCounter}: ${splitStatements[0]}`)]
                  errors[splitStatements[0]] = [...errors[splitStatements[0]], splitStatements[1]]
                  errorCounter++
>>>>>>> remove adjserror, finish implementing plugin (except bug)
                }
              }, '');

              fs.appendFile('./docs/error.md', mappedStatements, (err) => {
                if (err) throw err;
              });
>>>>>>> add build script
            }
          }
        }
      });

<<<<<<< HEAD
=======


>>>>>>> add build script
      return {
        code: s.toString(),
        map: s.generateMap(),
      };
    }
  };
}
