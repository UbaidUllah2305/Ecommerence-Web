"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/node/index.ts
var node_exports = {};
__export(node_exports, {
  plainTextSelectors: () => plainTextSelectors,
  render: () => render,
  renderAsync: () => renderAsync
});
module.exports = __toCommonJS(node_exports);

// src/shared/render.ts
var ReactDomServer = __toESM(require("react-dom/server"));
var import_html_to_text = require("html-to-text");

// src/shared/utils/pretty.ts
var import_js_beautify = __toESM(require("js-beautify"));
var defaults = {
  unformatted: ["code", "pre", "em", "strong", "span"],
  indent_inner_html: true,
  indent_char: " ",
  indent_size: 2,
  sep: "\n"
};
var pretty = (str, options = {}) => {
  return import_js_beautify.default.html(str, __spreadValues(__spreadValues({}, defaults), options));
};

// src/shared/plain-text-selectors.ts
var plainTextSelectors = [
  { selector: "img", format: "skip" },
  { selector: "#__react-email-preview", format: "skip" },
  {
    selector: "a",
    options: { linkBrackets: false }
  }
];

// src/shared/render.ts
var render = (component, options) => {
  if (options == null ? void 0 : options.plainText) {
    return renderAsPlainText(component, options);
  }
  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const markup = ReactDomServer.renderToStaticMarkup(component);
  const document = `${doctype}${markup}`;
  if (options && options.pretty) {
    return pretty(document);
  }
  return document;
};
var renderAsPlainText = (component, options) => {
  return (0, import_html_to_text.convert)(ReactDomServer.renderToStaticMarkup(component), __spreadValues({
    selectors: plainTextSelectors
  }, (options == null ? void 0 : options.plainText) === true ? options.htmlToTextOptions : {}));
};

// src/node/render-async.ts
var import_node_stream = require("stream");
var import_html_to_text2 = require("html-to-text");
var decoder = new TextDecoder("utf-8");
var readStream = (stream) => __async(void 0, null, function* () {
  let result = "";
  if ("pipeTo" in stream) {
    const writableStream = new WritableStream({
      write(chunk) {
        result += decoder.decode(chunk);
      }
    });
    yield stream.pipeTo(writableStream);
  } else {
    const writable = new import_node_stream.Writable({
      write(chunk, _encoding, callback) {
        result += decoder.decode(chunk);
        callback();
      }
    });
    stream.pipe(writable);
    return new Promise((resolve, reject) => {
      writable.on("error", reject);
      writable.on("close", () => {
        resolve(result);
      });
    });
  }
  return result;
});
var renderAsync = (component, options) => __async(void 0, null, function* () {
  const { default: reactDOMServer } = yield import("react-dom/server");
  let html;
  if (Object.hasOwn(reactDOMServer, "renderToReadableStream")) {
    html = yield readStream(
      yield reactDOMServer.renderToReadableStream(component)
    );
  } else {
    yield new Promise((resolve, reject) => {
      const stream = reactDOMServer.renderToPipeableStream(component, {
        onAllReady() {
          return __async(this, null, function* () {
            html = yield readStream(stream);
            resolve();
          });
        },
        onError(error) {
          reject(error);
        }
      });
    });
  }
  if (options == null ? void 0 : options.plainText) {
    return (0, import_html_to_text2.convert)(html, __spreadValues({
      selectors: plainTextSelectors
    }, options.htmlToTextOptions));
  }
  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, "")}`;
  if (options == null ? void 0 : options.pretty) {
    return pretty(document);
  }
  return document;
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  plainTextSelectors,
  render,
  renderAsync
});
