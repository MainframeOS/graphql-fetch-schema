'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _utilities = require('graphql/utilities');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeFile = function writeFile(_ref) {
  var filePath = _ref.filePath,
      contents = _ref.contents;

  return new _promise2.default(function (resolve, reject) {
    _fs2.default.writeFile(filePath, contents, function (err) {
      if (err) reject(err);else resolve();
    });
  });
};

exports.default = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var pathPrefix, res, schema, files;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // If no option is set, consider it's all
            if (!options.graphql && !options.json) {
              options.graphql = true;
              options.json = true;
            }
            pathPrefix = options.outputPath || './';
            _context.next = 4;
            return (0, _nodeFetch2.default)(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: (0, _stringify2.default)({
                query: _utilities.introspectionQuery
              })
            });

          case 4:
            res = _context.sent;
            _context.next = 7;
            return res.json();

          case 7:
            schema = _context.sent;
            files = [];

            if (options.graphql) {
              files.push({
                filePath: _path2.default.resolve(pathPrefix, 'schema.graphql'),
                contents: (0, _utilities.printSchema)((0, _utilities.buildClientSchema)(schema.data))
              });
            }
            if (options.json) {
              files.push({
                filePath: _path2.default.resolve(pathPrefix, 'schema.json'),
                contents: (0, _stringify2.default)(schema, null, 2)
              });
            }

            _context.next = 13;
            return _promise2.default.all(files.map(writeFile));

          case 13:
            return _context.abrupt('return', files);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();