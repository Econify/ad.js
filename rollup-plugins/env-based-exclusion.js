const MagicString = require('magic-string');
const { walk } = require('estree-walker');

module.exports = function () {
  return {
    name: 'Environment based pruning',
    transform(code, id) {
      const ast = this.parse(code, id);
      const s = new MagicString(code);

      walk(ast, {
        leave(node) {
          if (node.type === 'IfStatement' && node.test.value === '__DEV__') {
            if (node.alternate) {
              s.overwrite(node.start, node.alternate.start, '');
            } else {
              s.overwrite(node.start, node.end, '');
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
