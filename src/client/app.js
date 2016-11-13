var d3 = require('d3')

var SSRecipientItem = (id, parent_dom, removeRecipient, name, email_address) => {
    var dom_node
    var htmlNode = (name, email_address) => {
        var html_fragment = document.createElement('li')
        html_fragment.innerHTML = `
            <span>Name: <input type="text" value="${name}"/></span>
            <span>Email Address: <input type="text" value="${email_address}"</span>
            <span data-ss='recipient-delete'>✗</span>`
        dom_node = html_fragment;
        return html_fragment
    }
    var render = () => {
        //interesting; if you do innerHTML += ..., it removes the eventListeners the other elements in that container
        //http://stackoverflow.com/a/7327109/1010076
        parent_dom.appendChild(htmlNode(name, email_address));
        var recipient_delete = dom_node.querySelector("[data-ss='recipient-delete']");
        recipient_delete.onclick = () => {
            removeRecipient(id)
        }
    }

    var remove = () => {
        parent_dom.removeChild(dom_node);
    }
    return {
        id,
        render,
        remove
    }
}

var FPairItem = (id, parent_dom, removeFpair, name1, name2) => {
    var dom_node
    var htmlNode = (name1, name2) => {
        var html_fragment = document.createElement('li')
        html_fragment.innerHTML = `
            <span>Name1: <input type="text" value="${name1}"/></span>
            <span>Name2: <input type="text" value="${name2}"</span>
            <span data-ss='fpair-delete'>✗</span>`
        dom_node = html_fragment
        return html_fragment

    }
    var render = () => {
        parent_dom.appendChild(htmlNode(name1, name2));
        var fpair_delete = dom_node.querySelector("[data-ss='fpair-delete']");
        fpair_delete.onclick = () => {
            removeFpair(id)
        }
    }
    var remove = () => {
        parent_dom.removeChild(dom_node);
    }
    return {
        id,
        render,
        remove
    }
}

var SSView = () => {
    // Let's roll our own 'virtual dom' here
    var rendered_recipients = {}
    var recipients_dom;
    var renderRecipients = (recipients) => {
        //window.updated_recipients = recipients.reduce((o, v, i) => {
        var updated_recipients = recipients.reduce((o, v, i) => {
            o[v.id] = v
            return o
        }, {})

        //removing
        Object.keys(rendered_recipients).forEach(function (id) {
            let recipient = rendered_recipients[id]
            if (!(id in updated_recipients)) {
                recipient.remove()
                delete rendered_recipients[id]
            }
        })
        //rendering
        Object.keys(updated_recipients).forEach(function (id) {
            let recipient = updated_recipients[id]
            if (!(id in rendered_recipients)) {
                recipient.render()
                rendered_recipients[id] = recipient
            }
        })
    }

    var rendered_fpairs = {}
    var fpairs_dom;
    var renderFpairs = (fpairs) => {
        var updated_fpairs = fpairs.reduce((o, v, i) => {
            o[v.id] = v
            return o
        }, {})

        //removing
        Object.keys(rendered_fpairs).forEach(function (id) {
            let fpair = rendered_fpairs[id]
            if (!(id in updated_fpairs)) {
                fpair.remove()
                delete rendered_fpairs[id]
            }
        })
        //rendering
        Object.keys(updated_fpairs).forEach(function (id) {
            let fpair = updated_fpairs[id]
            if (!(id in rendered_fpairs)) {
                fpair.render()
                rendered_fpairs[id] = fpair
            }
        })
    }

    return {
        renderRecipients,
        recipients_dom,
        renderFpairs,
        fpairs_dom
    }
}

var SSController = (model) => {
    var sampleRecipients = [
        ["George Bluth", "george@bluthcompany.com"],
        ["Lucille Bluth", "lucille@bluthcompany.com"],
        ["GOB Bluth", "gob@bluthcompany.com"],
        ["Lindsay Bluth Funke", "lindsay@bluthcompany.com"],
        ["Tobias Funke", "tobias@bluthcompany.com"],
        ["Buster Funke", "buster@bluthcompany.com"]
    ];
    var sampleForbiddenPairs = [
        ["George Bluth", "Lucille Bluth"]
    ];

    var sampleBtnClicked = () => {
        loadSampleRecipients()
    };
    var loadSampleRecipients = () => {
        model.clearRecipients()
        model.clearFpairs()
        for (let recipient of sampleRecipients) {
            model.addRecipient(recipient)
        }
        for (let pair of sampleForbiddenPairs) {
            model.addForbiddenPair(pair)
        }
    };
    var addRecipientBtnClicked = () => {
        model.addRecipient(['',''])
    }
    var addFpairBtnClicked = () => {
        model.addForbiddenPair(['',''])
    }

    return {
        sampleBtnClicked,
        addRecipientBtnClicked,
        addFpairBtnClicked
    }
}

var SSModel = (view) => {
    var recipient_id = 0
    var generateRecipientId = () => {
        return recipient_id++
    }
    var fpair_id = 0
    var generateForbiddenPairId = () => {
        return fpair_id++
    }
    var recipients = [];
    var forbidden_pairs = [];
    //TODO: make this constant time
    var removeRecipient = (recipient_id) => {
        for (let i = 0; i < recipients.length; i++) {
              if (recipient_id == recipients[i].id) {
                  recipients.splice(i, 1)
                  view.renderRecipients(recipients)
              }
        }
    }
    var addRecipient = (recipient) => {
        recipients.push(new SSRecipientItem(generateRecipientId(), view.recipients_dom, removeRecipient, ...recipient))
        view.renderRecipients(recipients)
    }

    //TODO: make this constant time
    var removeForbiddenPair = (fpair_id) => {
        for (let i = 0; i < forbidden_pairs.length; i++) {
              if (fpair_id == forbidden_pairs[i].id) {
                  forbidden_pairs.splice(i, 1)
                  view.renderFpairs(forbidden_pairs)
              }
        }
    }
    var addForbiddenPair = (fpair) => {
        forbidden_pairs.push(new FPairItem(generateForbiddenPairId(), view.fpairs_dom, removeForbiddenPair, ...fpair))
        view.renderFpairs(forbidden_pairs)
    }

    var clearRecipients = () => {
        recipients = []
        view.renderRecipients(recipients)
    }
    var clearFpairs = () => {
        forbidden_pairs = []
        view.renderFpairs(forbidden_pairs)
    }

    return {
        addRecipient,
        removeRecipient,
        addForbiddenPair,
        removeForbiddenPair,
        clearRecipients,
        clearFpairs
    }
}

var applySSBindings = (model, view, controller, dom) => {

    var getBindType = (attr) => {
        return attr.split(':')[0];
    };

    var bindTypes = {
        "load-sample": (elem) => {
            elem.onclick = controller.sampleBtnClicked
        },
        "add-recipient": (elem) => {
            elem.onclick = controller.addRecipientBtnClicked
        },
        "add-fpair": (elem) => {
            elem.onclick = controller.addFpairBtnClicked
        },
        "recipients": (elem) => {
            view.recipients_dom = elem
        },
        "forbidden-pairs": (elem) => {
            view.fpairs_dom = elem
        }
    }

    var databinds = dom.querySelectorAll('[data-ss]');
    for (let databind of databinds) {
        let databind_attr = databind.getAttribute('data-ss');
        let bind_type = getBindType(databind_attr);
        try {
            bindTypes[bind_type](databind);
        } catch(e) {
            console.error("couldn't bind to: ", bind_type);
        }
    }
}

window.init = () => {
    var view = new SSView()
    var model = new SSModel(view)
    var controller = new SSController(model)
    var ss_dom = document.getElementById("ss-app")
    applySSBindings(model, view, controller, ss_dom)
}
