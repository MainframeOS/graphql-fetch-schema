'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var run = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, options) {
    var files;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _index2.default)(url, options);

          case 3:
            files = _context.sent;

            files.forEach(function (file) {
              console.log(file.filePath);
            });
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            console.error(_context.t0);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }));

  return function run(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

_commander2.default.version('0.4.0').usage('<url> [options]').option('-g, --graphql', 'write schema.graphql file').option('-j, --json', 'write schema.json file').option('-o, --output <directory>', 'write to specified directory').option('-s, --sort', 'sort field keys').parse(process.argv);

run(_commander2.default.args[0], {
  graphql: !!_commander2.default.graphql,
  json: !!_commander2.default.json,
  outputPath: _commander2.default.output,
  sort: !!_commander2.default.sort
});