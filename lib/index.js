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

var sortType = function sortType(type) {
  if (type['kind'] === 'OBJECT') {
    return sortObject(type);
  } else if (type['kind'] === 'INTERFACE') {
    return sortInterface(type);
  } else if (type['kind'] === 'ENUM') {
    return sortEnum(type);
  } else if (type['kind'] === 'INPUT_OBJECT') {
    return sortInputObject(type);
  } else if (type['kind'] === 'UNION') {
    return type;
  } else if (type.kind === 'SCALAR') {
    return type;
  }

  throw new Error("Unknown kind");
};

var sortObject = function sortObject(type) {
  type.interfaces = type.interfaces.sort(function (int1, int2) {
    return int1.name.localeCompare(int2.name);
  });
  type.fields = type.fields.sort(function (field1, field2) {
    return field1.name.localeCompare(field2.name);
  }).map(sortArgs);
  return type;
};

var sortInterface = function sortInterface(type) {
  type.fields = type.fields.sort(function (field1, field2) {
    return field1.name.localeCompare(field2.name);
  });
  return type;
};

var sortEnum = function sortEnum(type) {
  type.enumValues = type.enumValues.sort(function (value1, value2) {
    return value1.name.localeCompare(value2.name);
  });
  return type;
};

var sortInputObject = function sortInputObject(type) {
  type.inputFields = type.inputFields.sort(function (field1, field2) {
    return field1.name.localeCompare(field2.name);
  });
  return type;
};

var sortArgs = function sortArgs(field) {
  field.args = field.args.sort(function (arg1, arg2) {
    return arg1.name.localeCompare(arg2.name);
  });
  return field;
};

exports.default = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var pathPrefix, res, schema, types, files;
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

            if (options.sort) {
              types = schema.data.__schema.types.map(sortType);

              schema.data.__schema.types = types;
            }

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

            _context.next = 14;
            return _promise2.default.all(files.map(writeFile));

          case 14:
            return _context.abrupt('return', files);

          case 15:
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