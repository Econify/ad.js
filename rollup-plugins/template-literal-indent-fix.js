// To be removed from the ad.js repo and
// published under rollup-plugin-template-literal-indent-fix
// once tested and usable
const MagicString = require('magic-string');
const { walk } = require('estree-walker');
const orderBy = require('lodash.orderby');

function cleanText(str) {
  return convertSpacesToTabs(removeIndent(str));
}

// It doesn't make sense to convert all spaces to tabs as
// double spaces taking up the same amount of space as \t.
// However we can save 2 characters for every four spaces by converting them to
// tabs
function convertSpacesToTabs(str) {
  return str.replace(/^\s{4}/g, '\t');
}

function removeIndent(str) {
	// remove the shortest leading indentation from each line
	const match = str.match(/^[^\S\n]*(?=\S)/gm);
	const indent = match && Math.min(...match.map(el => el.length));
	if (indent) {
		const regexp = new RegExp(`^.{${indent}}`, 'gm');
		return str.replace(regexp, '');
	}
	return str;
}

function createNewNode(originalNode) {
  const newNode = {};

  const nodes = orderBy([
    ...originalNode.expressions,
    ...originalNode.quasis,
  ], ['start']);

  newNode.start = nodes[0].start;
  newNode.end = nodes[nodes.length - 1].end;

  const innerText = nodes.map((node) => {
    switch (node.type) {
      case 'TemplateElement':
        return node.value.raw;
      case 'Identifier':
        return '${' + node.name + '}';
      default:
        return node.value;
    }
  }).join('');

  newNode.value = cleanText(innerText);

  return newNode;
}

module.exports = function () {
  return {
    name: 'Template Literal Indentation Strip',
    transform(code, id) {
      const ast = this.parse(code, id);
      const s = new MagicString(code);

      walk(ast, {
        leave(node) {
          if (node.type === 'TemplateLiteral') {
            const { start, end, value } = createNewNode(node);

            if (start !== end) {
              s.overwrite(start, end, value);
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
