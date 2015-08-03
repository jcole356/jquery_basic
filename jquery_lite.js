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
        findChildren(el, children);
      }
    });

    return new DOMNodeCollection(children);
  };

  function findChildren(el, children) {
    if (el.children.length > 0) {
      var childrenArray = Array.prototype.slice.call(el.children);
      children = children.concat(childrenArray);
      childrenArray.forEach(function (child) {
        findChildren(child, children);
      });
    }
  }

  DOMNodeCollection.prototype.empty = function () {
    this.array.forEach(function (el) {
      el.innerHTML = "";
    });

    return this.array[0].innerHTML;
  };

  DOMNodeCollection.prototype.find = function (selector) {

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

  DOMNodeCollection.prototype.parent = function () {

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
