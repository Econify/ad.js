const MagicString = require('magic-string');
const { walk } = require('estree-walker');
const fs = require('fs');

const errorFile = fs.createWriteStream('./docs/error.md')
errorFile.write(`# Common Errors
`);
errorFile.end();

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
              let mappedStatements = node.argument.arguments.reduce((acc, el) => {
                if (el.type === 'TemplateLiteral') {
                  console.log(el.quasis[0].value.cooked);
                  return acc + ' ' + el.quasis[0].value.cooked;
                } else if (el.type === 'TaggedTemplateExpression')  {
                  return acc + ' ' + el.quasi.quasis[0].value.cooked;
                } else {
                  return acc + ' ' + el.value;
                }
              }, '');

              fs.appendFile('./docs/error.md', mappedStatements, (err) => {
                if (err) throw err;
              });
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
