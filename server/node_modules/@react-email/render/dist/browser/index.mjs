var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/shared/render.ts
import * as ReactDomServer from "react-dom/server";
import { convert } from "html-to-text";

// src/shared/utils/pretty.ts
import jsBeautify from "js-beautify";
var defaults = {
  unformatted: ["code", "pre", "em", "strong", "span"],
  indent_inner_html: true,
  indent_char: " ",
  indent_size: 2,
  sep: "\n"
};
var pretty = (str, options = {}) => {
  return jsBeautify.html(str, __spreadValues(__spreadValues({}, defaults), options));
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
  return convert(ReactDomServer.renderToStaticMarkup(component), __spreadValues({
    selectors: plainTextSelectors
  }, (options == null ? void 0 : options.plainText) === true ? options.htmlToTextOptions : {}));
};

// src/browser/render-async.ts
import { convert as convert2 } from "html-to-text";
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
    throw new Error(
      "For some reason, the Node version of `react-dom/server` has been imported instead of the browser one.",
      {
        cause: {
          stream
        }
      }
    );
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
    return convert2(html, __spreadValues({
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
export {
  plainTextSelectors,
  render,
  renderAsync
};
