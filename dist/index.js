"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dom = require("@testing-library/dom");

function wait(time) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), time);
  });
}

function findTagInParents(element, tagName) {
  if (element.parentNode == null) return undefined;
  if (element.parentNode.tagName === tagName) return element.parentNode;
  return findTagInParents(element.parentNode, tagName);
}

function clickLabel(label) {
  _dom.fireEvent.mouseOver(label);

  _dom.fireEvent.mouseMove(label);

  _dom.fireEvent.mouseDown(label);

  _dom.fireEvent.mouseUp(label);

  if (label.htmlFor) {
    const input = document.getElementById(label.htmlFor);
    input.focus();

    _dom.fireEvent.click(label);
  } else {
    const input = label.querySelector("input,textarea");
    input.focus();
    label.focus();

    _dom.fireEvent.click(label);
  }
}

function clickBooleanElement(element) {
  if (element.disabled) return;

  _dom.fireEvent.mouseOver(element);

  _dom.fireEvent.mouseMove(element);

  _dom.fireEvent.mouseDown(element);

  _dom.fireEvent.mouseUp(element);

  _dom.fireEvent.click(element);

  _dom.fireEvent.change(element);
}

function clickElement(element) {
  _dom.fireEvent.mouseOver(element);

  _dom.fireEvent.mouseMove(element);

  _dom.fireEvent.mouseDown(element);

  element.focus();

  _dom.fireEvent.mouseUp(element);

  _dom.fireEvent.click(element);

  const labelAncestor = findTagInParents(element, "LABEL");
  labelAncestor && clickLabel(labelAncestor);
}

function dblClickElement(element) {
  _dom.fireEvent.mouseOver(element);

  _dom.fireEvent.mouseMove(element);

  _dom.fireEvent.mouseDown(element);

  element.focus();

  _dom.fireEvent.mouseUp(element);

  _dom.fireEvent.click(element);

  _dom.fireEvent.mouseDown(element);

  _dom.fireEvent.mouseUp(element);

  _dom.fireEvent.click(element);

  _dom.fireEvent.dblClick(element);

  const labelAncestor = findTagInParents(element, "LABEL");
  labelAncestor && clickLabel(labelAncestor);
}

function dblClickCheckbox(checkbox) {
  _dom.fireEvent.mouseOver(checkbox);

  _dom.fireEvent.mouseMove(checkbox);

  _dom.fireEvent.mouseDown(checkbox);

  _dom.fireEvent.mouseUp(checkbox);

  _dom.fireEvent.click(checkbox);

  _dom.fireEvent.change(checkbox);

  _dom.fireEvent.mouseDown(checkbox);

  _dom.fireEvent.mouseUp(checkbox);

  _dom.fireEvent.click(checkbox);

  _dom.fireEvent.change(checkbox);
}

function selectOption(option) {
  _dom.fireEvent.mouseOver(option);

  _dom.fireEvent.mouseMove(option);

  _dom.fireEvent.mouseDown(option);

  _dom.fireEvent.focus(option);

  _dom.fireEvent.mouseUp(option);

  _dom.fireEvent.click(option);

  option.selected = true;
}

const userEvent = {
  click(element) {
    const focusedElement = document.activeElement;
    const wasAnotherElementFocused = focusedElement !== document.body && focusedElement !== element;

    if (wasAnotherElementFocused) {
      _dom.fireEvent.mouseMove(focusedElement);

      _dom.fireEvent.mouseLeave(focusedElement);
    }

    switch (element.tagName) {
      case "LABEL":
        clickLabel(element);
        break;

      case "INPUT":
        if (element.type === "checkbox" || element.type === "radio") {
          clickBooleanElement(element);
          break;
        }

      default:
        clickElement(element);
    }

    wasAnotherElementFocused && focusedElement.blur();
  },

  dblClick(element) {
    const focusedElement = document.activeElement;
    const wasAnotherElementFocused = focusedElement !== document.body && focusedElement !== element;

    if (wasAnotherElementFocused) {
      _dom.fireEvent.mouseMove(focusedElement);

      _dom.fireEvent.mouseLeave(focusedElement);
    }

    switch (element.tagName) {
      case "INPUT":
        if (element.type === "checkbox") {
          dblClickCheckbox(element);
          break;
        }

      default:
        dblClickElement(element);
    }

    wasAnotherElementFocused && focusedElement.blur();
  },

  selectOptions(element, values) {
    const focusedElement = document.activeElement;
    const wasAnotherElementFocused = focusedElement !== document.body && focusedElement !== element;

    if (wasAnotherElementFocused) {
      _dom.fireEvent.mouseMove(focusedElement);

      _dom.fireEvent.mouseLeave(focusedElement);
    }

    clickElement(element);
    const valArray = Array.isArray(values) ? values : [values];
    const selectedOptions = Array.from(element.children).filter(opt => opt.tagName === "OPTION" && valArray.includes(opt.value));

    if (selectedOptions.length > 0) {
      if (element.multiple) {
        selectedOptions.forEach(option => selectOption(option));
      } else {
        selectOption(selectedOptions[0]);
      }
    }

    wasAnotherElementFocused && focusedElement.blur();
  },

  async type(element, text, userOpts = {}) {
    const defaultOpts = {
      allAtOnce: false,
      delay: 0
    };
    const opts = Object.assign(defaultOpts, userOpts);

    if (opts.allAtOnce) {
      _dom.fireEvent.change(element, {
        target: {
          value: text
        }
      });
    } else {
      const typedCharacters = text.split("");
      let actuallyTyped = "";

      for (let index = 0; index < text.length; index++) {
        const char = text[index];
        const key = char; // TODO: check if this also valid for characters with diacritic markers e.g. úé etc

        const keyCode = char.charCodeAt(0);
        if (opts.delay > 0) await wait(opts.delay);

        const downEvent = _dom.fireEvent.keyDown(element, {
          key: key,
          keyCode: keyCode,
          which: keyCode
        });

        if (downEvent) {
          const pressEvent = _dom.fireEvent.keyPress(element, {
            key: key,
            keyCode,
            charCode: keyCode,
            keyCode: keyCode
          });

          if (pressEvent) {
            actuallyTyped += key;

            _dom.fireEvent.change(element, {
              target: {
                value: actuallyTyped
              },
              bubbles: true,
              cancelable: true
            });
          }
        }

        _dom.fireEvent.keyUp(element, {
          key: key,
          keyCode: keyCode,
          which: keyCode
        });
      }
    }
  }

};
var _default = userEvent;
exports.default = _default;