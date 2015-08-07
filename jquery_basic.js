(function () {
  if (typeof $l === "undefined") {
    window.$l = {};
  }

  $l = function (arg) {
    var array = [];
    var functionArray = [];
    if (arg instanceof HTMLElement) {
      array.push(arg);
      return new DOMNodeCollection(array);
    } else if (arg instanceof Function) {
      functionArray.push(arg);
      document.addEventListener("DOMContentLoaded", function () {
        functionArray.forEach(function (fn) {
          fn();
        });
      });
    } else {
      var list = document.querySelectorAll(arg);
      array = Array.prototype.slice.call(list);
      return new DOMNodeCollection(array);
    }
  };

  var ajax = $l.ajax = function (options) {
    var defaults = {
      success: function () {console.log("Well done!");},
      error: function () {console.log("Nope!");},
      url: "",
      method: "GET",
      data: "",
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    if (options) {
      defaults = extend(defaults, options);
      if (defaults.data) {
        defaults.url += defaults.data;
      }
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.status === 200 && request.readyState === 4) {
        defaults.success(request);
      } else if (request.status === 404) {
        defaults.error(request);
      }
    };
    request.open(defaults.method, defaults.url);
    request.send(defaults.contentType);
    return request;
  };

  var extend = $l.extend = function () {
    if (arguments.length < 2) {
      throw "Must have at least two objects to use extend!";
    }
    var newObj = {};
    var args = Array.prototype.slice.call(arguments);
    args.forEach(function (obj) {
      var keys = Object.keys(obj);
      keys.forEach(function (key) {
        newObj[key] = obj[key];
      });
    });

    return newObj;
  };

  var DOMNodeCollection = $l.DOMNodeCollection = function (array) {
    this.array = array;
  };

  DOMNodeCollection.prototype.append = function (arg) {
    if (arg instanceof DOMNodeCollection) {
      arg.array.forEach(function (innerEl) {
        this.array.forEach(function (el) {
          el.appendChild(innerEl);
        }, this);
      }, this);
    } else if (arg instanceof HTMLElement) {
      this.array.forEach(function (el) {
        el.appendChild(arg);
      });
    } else if (typeof arg === "string") {
      this.array.forEach(function (el) {
        el.innerHTML += arg;
      });
    }

    return this.array[0].innerHTML;
  };

  DOMNodeCollection.prototype.addClass = function (string) {
    this.array.forEach(function (el) {
      if (el.hasAttribute("class")) {
        var currentClass = el.getAttribute("class");
        currentClass += " " + string;
        el.setAttribute("class", currentClass);
        return string;
      } else {
        el.setAttribute("class", string);
        return string;
      }
    });
  };

  DOMNodeCollection.prototype.attr = function (attribute, value) {
    var firstEl = this.array[0];
    if (firstEl.hasAttribute(attribute)) {
      return firstEl.getAttribute(attribute);
    } else if (value){
      firstEl.setAttribute(attribute, value);
      return value;
    }

    return null;
  };

  DOMNodeCollection.prototype.children = function () {
    var children = [];
    this.array.forEach(function (el) {
      if (el.children.length > 0) {
        children = children.concat(Array.prototype.slice.call(el.children));
      }
    });

    return new DOMNodeCollection(children);
  };

  DOMNodeCollection.prototype.parent = function () {
    var parents = [];
    this.array.forEach(function (el) {
      if (el.parentNode && parents.indexOf(el.parentNode) === -1) {
        parents.push(el.parentNode);
      }
    });

    return new DOMNodeCollection(parents);
  };

  DOMNodeCollection.prototype.empty = function () {
    this.array.forEach(function (el) {
      el.innerHTML = "";
    });

    return this.array[0].innerHTML;
  };

  // I think this is working now...
  DOMNodeCollection.prototype.find = function (selector) {
    var results = [];
    var subResults;
    this.array.forEach(function (el) {
      subResults = Array.prototype.slice.call(el.querySelectorAll(selector));
      results = results.concat(subResults);
    });

    return new DOMNodeCollection(results);
  };

  DOMNodeCollection.prototype.html = function (string) {
    if (string) {
      this.array.forEach(function (el) {
        el.innerHTML = string;
      });
    }

    return this.array[0].innerHTML;
  };

  DOMNodeCollection.prototype.on = function (string, listener) {
    this.array.forEach(function (el) {
      el.addEventListener(string, listener);
    });
  };

  DOMNodeCollection.prototype.off = function (string, listener) {
    this.array.forEach(function (el) {
      el.removeEventListener(string, listener);
    });
  };


  DOMNodeCollection.prototype.remove = function () {
    this.array.forEach(function (el) {
      el.remove();
    });

    return null;
  };

  DOMNodeCollection.prototype.removeClass = function (string) {
    this.array.forEach(function (el) {
      if (el.hasAttribute("class")) {
        var currentClass = el.getAttribute("class");
        var re = new RegExp('\\s*' + string);
        var newClass = currentClass.replace(re, "");
        el.setAttribute("class", newClass);
      }
    });

    return null;
  };
})();
