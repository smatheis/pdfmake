"use strict";

exports.__esModule = true;
exports.default = void 0;

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchUrl = url => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const h = parsedUrl.protocol === 'https:' ? _https.default : _http.default;
    h.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // redirect url
        fetchUrl(res.headers.location).then(buffer => {
          resolve(buffer);
        }, result => {
          reject(result);
        });
        return;
      }

      const ok = res.statusCode >= 200 && res.statusCode < 300;

      if (!ok) {
        reject(new TypeError(`Failed to fetch (status code: ${res.statusCode}, url: "${url}")`));
      }

      const chunks = [];
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('data', d => chunks.push(d));
    }).on('error', reject);
  });
};

class URLResolver {
  constructor(fs) {
    this.fs = fs;
    this.resolving = {};
  }

  resolve(url) {
    if (!this.resolving[url]) {
      this.resolving[url] = new Promise((resolve, reject) => {
        if (url.toLowerCase().indexOf('https://') === 0 || url.toLowerCase().indexOf('http://') === 0) {
          fetchUrl(url).then(buffer => {
            this.fs.writeFileSync(url, buffer);
            resolve();
          }, result => {
            reject(result);
          });
        } else {
          // cannot be resolved
          resolve();
        }
      });
    }

    return this.resolving[url];
  }

  resolved() {
    return new Promise((resolve, reject) => {
      Promise.all(Object.values(this.resolving)).then(() => {
        resolve();
      }, result => {
        reject(result);
      });
    });
  }

}

var _default = URLResolver;
exports.default = _default;