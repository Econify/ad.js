const MagicString = require('magic-string');
const { walk } = require('estree-walker');
const orderBy = require('lodash.orderby');
const fs = require('fs');

const errorFile = fs.createWriteStream('./docs/error.md');
errorFile.write(`# Common Errors
`);
errorFile.end();

let errorCounter = 1;
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

      if (hasExample) {
        formattedLiteral = formattedLiteral + `\n \`\`\``;
      }

      statements = [...statements, ...el.quasis[0].value.raw.split('.')]
      return `${acc} ${formattedLiteral} \n`;
    }  else if (el.value) {
      statements = [...statements, ...el.value.split('.')]
      return `${acc} ${el.value} \n`;
    }
  }, '');

  return [formatted, statements];
}

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
                }
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
