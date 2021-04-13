"use strict";

exports.__esModule = true;
exports.default = void 0;

var _OutputDocument = _interopRequireDefault(require("./OutputDocument"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OutputDocumentServer extends _OutputDocument.default {
  /**
   * @param {string} filename
   * @returns {Promise}
   */
  write(filename) {
    return new Promise((resolve, reject) => {
      this.getStream().then(stream => {
        stream.pipe(_fs.default.createWriteStream(filename));
        stream.on('end', () => {
          resolve();
        });
        stream.end();
      }, result => {
        reject(result);
      });
    });
  }

}

var _default = OutputDocumentServer;
exports.default = _default;