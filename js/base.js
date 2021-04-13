"use strict";

exports.__esModule = true;
exports.default = void 0;

var _Printer = _interopRequireDefault(require("./Printer"));

var _virtualFs = _interopRequireDefault(require("./virtual-fs"));

var _tools = require("./helpers/tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class pdfmake {
  constructor() {
    this.virtualfs = _virtualFs.default;
    this.urlResolver = null;
  }
  /**
   * @param {object} docDefinition
   * @param {?object} options
   * @returns {object}
   */


  createPdf(docDefinition, options = {}) {
    options.progressCallback = this.progressCallback;
    options.tableLayouts = this.tableLayouts;
    let printer = new _Printer.default(this.fonts, this.virtualfs, this.urlResolver);
    const pdfDocumentPromise = printer.createPdfKitDocument(docDefinition, options);
    return this._transformToDocument(pdfDocumentPromise);
  }

  setProgressCallback(callback) {
    this.progressCallback = callback;
  }

  addTableLayouts(tableLayouts) {
    this.tableLayouts = (0, _tools.pack)(this.tableLayouts, tableLayouts);
  }

  setTableLayouts(tableLayouts) {
    this.tableLayouts = tableLayouts;
  }

  clearTableLayouts() {
    this.tableLayouts = {};
  }

  addFonts(fonts) {
    this.fonts = (0, _tools.pack)(this.fonts, fonts);
  }

  setFonts(fonts) {
    this.fonts = fonts;
  }

  clearFonts() {
    this.fonts = {};
  }

  _transformToDocument(doc) {
    return doc;
  }

}

var _default = pdfmake;
exports.default = _default;