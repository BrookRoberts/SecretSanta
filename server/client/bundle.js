(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//var d3 = require('d3')

var SSRecipientItem = function SSRecipientItem(id, parent_dom, removeRecipient, name, email_address, allow_delete) {
    var dom_node;
    var htmlNode = function htmlNode(name, email_address) {
        var html_fragment = document.createElement('li');
        html_fragment.innerHTML = '\n            <span>Name: <input type="text" value="' + name + '"/></span>\n            <span>Email Address: <input type="text" value="' + email_address + '"</span>';
        if (allow_delete) {
            html_fragment.innerHTML += '<span data-ss=\'recipient-delete\'>\u2717</span>';
        }
        dom_node = html_fragment;
        return html_fragment;
    };
    var render = function render() {
        //interesting; if you do innerHTML += ..., it removes the eventListeners the other elements in that container
        //http://stackoverflow.com/a/7327109/1010076
        parent_dom.appendChild(htmlNode(name, email_address));
        //binding stuff here:
        if (allow_delete) {
            var recipient_delete = dom_node.querySelector("[data-ss='recipient-delete']");
            recipient_delete.onclick = function () {
                removeRecipient(id);
            };
        }
    };

    var remove = function remove() {
        parent_dom.removeChild(dom_node);
    };
    return {
        id: id,
        render: render,
        remove: remove
    };
};

var FPairItem = function FPairItem(id, parent_dom, removeFpair, name1, name2) {
    var dom_node;
    var htmlNode = function htmlNode(name1, name2) {
        var html_fragment = document.createElement('li');
        html_fragment.innerHTML = '\n            <span>Name1: <input type="text" value="' + name1 + '"/></span>\n            <span>Name2: <input type="text" value="' + name2 + '"</span>\n            <span data-ss=\'fpair-delete\'>\u2717</span>';
        dom_node = html_fragment;
        return html_fragment;
    };
    var render = function render() {
        parent_dom.appendChild(htmlNode(name1, name2));
        //binding stuff here:
        var fpair_delete = dom_node.querySelector("[data-ss='fpair-delete']");
        fpair_delete.onclick = function () {
            removeFpair(id);
        };
    };
    var remove = function remove() {
        parent_dom.removeChild(dom_node);
    };
    return {
        id: id,
        render: render,
        remove: remove
    };
};

var SSView = function SSView() {
    // Let's roll our own 'virtual dom' here
    var rendered_recipients = {};
    var recipients_dom;
    var renderRecipients = function renderRecipients(recipients) {
        //window.updated_recipients = recipients.reduce((o, v, i) => {
        var updated_recipients = recipients.reduce(function (o, v, i) {
            o[v.id] = v;
            return o;
        }, {});

        //removing
        Object.keys(rendered_recipients).forEach(function (id) {
            var recipient = rendered_recipients[id];
            if (!(id in updated_recipients)) {
                recipient.remove();
                delete rendered_recipients[id];
            }
        });
        //rendering
        Object.keys(updated_recipients).forEach(function (id) {
            var recipient = updated_recipients[id];
            if (!(id in rendered_recipients)) {
                recipient.render();
                rendered_recipients[id] = recipient;
            }
        });
    };

    var rendered_fpairs = {};
    var fpairs_dom;
    var renderFpairs = function renderFpairs(fpairs) {
        var updated_fpairs = fpairs.reduce(function (o, v, i) {
            o[v.id] = v;
            return o;
        }, {});

        //removing
        Object.keys(rendered_fpairs).forEach(function (id) {
            var fpair = rendered_fpairs[id];
            if (!(id in updated_fpairs)) {
                fpair.remove();
                delete rendered_fpairs[id];
            }
        });
        //rendering
        Object.keys(updated_fpairs).forEach(function (id) {
            var fpair = updated_fpairs[id];
            if (!(id in rendered_fpairs)) {
                fpair.render();
                rendered_fpairs[id] = fpair;
            }
        });
    };

    return {
        renderRecipients: renderRecipients,
        recipients_dom: recipients_dom,
        renderFpairs: renderFpairs,
        fpairs_dom: fpairs_dom
    };
};

var SSController = function SSController(model) {
    var sampleRecipients = [["George Bluth", "george@bluthcompany.com"], ["Lucille Bluth", "lucille@bluthcompany.com"], ["GOB Bluth", "gob@bluthcompany.com"], ["Lindsay Bluth Funke", "lindsay@bluthcompany.com"], ["Tobias Funke", "tobias@bluthcompany.com"], ["Buster Funke", "buster@bluthcompany.com"]];
    var sampleForbiddenPairs = [["George Bluth", "Lucille Bluth"]];

    var sampleBtnClicked = function sampleBtnClicked() {
        loadSampleRecipients();
    };
    var loadSampleRecipients = function loadSampleRecipients() {
        model.removeAllRecipients();
        model.removeAllFpairs();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = sampleRecipients[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var recipient = _step.value;

                model.addRecipient(recipient);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = sampleForbiddenPairs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var pair = _step2.value;

                model.addForbiddenPair(pair);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    };
    var addRecipientBtnClicked = function addRecipientBtnClicked() {
        model.addRecipient(['', '']);
    };
    var addFpairBtnClicked = function addFpairBtnClicked() {
        model.addForbiddenPair(['', '']);
    };

    var initialiseApp = function initialiseApp() {
        model.addRecipient(['', '']);
        model.addRecipient(['', '']);
        model.addRecipient(['', '']);
    };

    return {
        sampleBtnClicked: sampleBtnClicked,
        addRecipientBtnClicked: addRecipientBtnClicked,
        addFpairBtnClicked: addFpairBtnClicked,
        initialiseApp: initialiseApp
    };
};

var SSModel = function SSModel(view) {
    var recipient_id = 0;
    var generateRecipientId = function generateRecipientId() {
        return recipient_id++;
    };
    var fpair_id = 0;
    var generateForbiddenPairId = function generateForbiddenPairId() {
        return fpair_id++;
    };
    var recipients = [];
    var forbidden_pairs = [];
    //TODO: make this constant time
    var removeRecipient = function removeRecipient(recipient_id) {
        for (var i = 0; i < recipients.length; i++) {
            if (recipient_id == recipients[i].id) {
                recipients.splice(i, 1);
                view.renderRecipients(recipients);
            }
        }
    };
    var addRecipient = function addRecipient(recipient) {
        var allow_delete = recipients.length >= 3;
        recipients.push(new (Function.prototype.bind.apply(SSRecipientItem, [null].concat([generateRecipientId(), view.recipients_dom, removeRecipient], _toConsumableArray(recipient), [allow_delete])))());
        view.renderRecipients(recipients);
    };

    //TODO: make this constant time
    var removeForbiddenPair = function removeForbiddenPair(fpair_id) {
        for (var i = 0; i < forbidden_pairs.length; i++) {
            if (fpair_id == forbidden_pairs[i].id) {
                forbidden_pairs.splice(i, 1);
                view.renderFpairs(forbidden_pairs);
            }
        }
    };
    var addForbiddenPair = function addForbiddenPair(fpair) {
        forbidden_pairs.push(new (Function.prototype.bind.apply(FPairItem, [null].concat([generateForbiddenPairId(), view.fpairs_dom, removeForbiddenPair], _toConsumableArray(fpair))))());
        view.renderFpairs(forbidden_pairs);
    };

    var removeAllRecipients = function removeAllRecipients() {
        recipients = [];
        view.renderRecipients(recipients);
    };
    var removeAllFpairs = function removeAllFpairs() {
        forbidden_pairs = [];
        view.renderFpairs(forbidden_pairs);
    };

    return {
        addRecipient: addRecipient,
        removeRecipient: removeRecipient,
        addForbiddenPair: addForbiddenPair,
        removeForbiddenPair: removeForbiddenPair,
        removeAllRecipients: removeAllRecipients,
        removeAllFpairs: removeAllFpairs
    };
};

var applySSBindings = function applySSBindings(model, view, controller, dom) {

    var getBindType = function getBindType(attr) {
        return attr.split(':')[0];
    };

    var bindTypes = {
        "load-sample": function loadSample(elem) {
            elem.onclick = controller.sampleBtnClicked;
        },
        "add-recipient": function addRecipient(elem) {
            elem.onclick = controller.addRecipientBtnClicked;
        },
        "add-fpair": function addFpair(elem) {
            elem.onclick = controller.addFpairBtnClicked;
        },
        "recipients": function recipients(elem) {
            view.recipients_dom = elem;
        },
        "forbidden-pairs": function forbiddenPairs(elem) {
            view.fpairs_dom = elem;
        }
    };

    var databinds = dom.querySelectorAll('[data-ss]');
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = databinds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var databind = _step3.value;

            var databind_attr = databind.getAttribute('data-ss');
            var bind_type = getBindType(databind_attr);
            try {
                bindTypes[bind_type](databind);
            } catch (e) {
                console.error("couldn't bind to: ", bind_type);
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    controller.initialiseApp();
};

window.init = function () {
    var view = new SSView();
    var model = new SSModel(view);
    var controller = new SSController(model);
    var ss_dom = document.getElementById("ss-app");
    applySSBindings(model, view, controller, ss_dom);
};

},{}]},{},[1]);
