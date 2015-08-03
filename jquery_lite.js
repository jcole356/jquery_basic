(function () {
  if (typeof $l === "undefined") {
    window.$l = {};
  }

  // Seems to be working fine.
  $l = function (arg) {
    var array = [];
    if (arg instanceof HTMLElement) {
      array.push(arg);
      return new DOMNodeCollection(array);
    }
    var list = document.querySelectorAll(arg);
    array = Array.prototype.slice.call(list);
    return new DOMNodeCollection(array);
  };

  var DOMNodeCollection = $l.DOMNodeCollection = function (array) {
    this.array = array;
  };

  // Check this again later, but I'm pretty sure this is ok
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

  // Need to call all children recursively
  // I can't figure this out and it should be super simple
  // This may actually not need recursion, it may just be a while
  // loop that keeps checking for children like the next largest problem
  // for binary search trees.
  DOMNodeCollection.prototype.children = function () {

  };

  // Dominated this one.
  DOMNodeCollection.prototype.empty = function () {
    this.array.forEach(function (el) {
      el.innerHTML = "";
    });

    return this.array[0].innerHTML;
  };

  DOMNodeCollection.prototype.find = function (selector) {

  };

  // Dominated this one.
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
