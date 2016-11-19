var h = require('./helpers.js')
const MIN_PARTICIPANTS = 3

var PARTICIPANT_EMAIL_CHANGED = "PARTICIPANT_EMAIL_CHANGED"
var PARTICIPANT_NAME_CHANGED = "PARTICIPANT_NAME_CHANGED"
var PARTICIPANT_REMOVED = "PARTICIPANT_REMOVED"
var FPAIR_NAME_CHANGED = "FPAIR_NAME_CHANGED"
var FPAIR_REMOVED = "FPAIR_REMOVED"

var SSParticipantItem = (id, parent_dom, pubsub, participant, email_address, allow_delete) => {
    var dom_node
    var htmlNode = (participant, email_address) => {
        var html_fragment = document.createElement('li')
        html_fragment.innerHTML = `
            <span>Name: <input type="text" data-ss="participant" value="${participant}"/></span>
            <span>Email Address: <input data-ss="email-address" type="text" value="${email_address}"</span>`
        if (allow_delete) {
            html_fragment.innerHTML += `<span data-ss='participant-delete'>✗</span>`
        }
        dom_node = html_fragment;
        return html_fragment
    }
    var render = () => {
        //if you do innerHTML += ..., it removes the eventListeners the other elements in that container
        //http://stackoverflow.com/a/7327109/1010076
        parent_dom.appendChild(htmlNode(participant, email_address));
        //binding stuff here:
        var participant_dom = dom_node.querySelector("[data-ss='participant']")
        participant_dom.addEventListener("blur", (event) => {
            participant = participant_dom.value
            pubsub.pub(PARTICIPANT_NAME_CHANGED)
        })
        var email_dom = dom_node.querySelector("[data-ss='email-address']")
        email_dom.addEventListener("blur", (event) => {
            email_address = email_dom.value
            pubsub.pub(PARTICIPANT_EMAIL_CHANGED)
        })

        if (allow_delete) {
            var participant_delete = dom_node.querySelector("[data-ss='participant-delete']");
            participant_delete.onclick = () => {
                pubsub.pub(PARTICIPANT_REMOVED, id)
            }
        }
    }
    var remove = () => {
        parent_dom.removeChild(dom_node);
    }
    
    return {
        id,
        render,
        remove,
        getName: () => {
            return participant
        },
        getEmailAddress: () => {
            return email_address
        }
    }
}

var FPairItem = (id, parent_dom, pubsub, name1, name2) => {
    var dom_node
    var htmlNode = (name1, name2) => {
        var html_fragment = document.createElement('li')
        html_fragment.innerHTML = `
            <span>Gifter: <input type="text" data-ss="name1" value="${name1}"/></span>
            <span>Recipient: <input type="text" data-ss="name2" value="${name2}"</span>
            <span data-ss='fpair-delete'>✗</span>`
        dom_node = html_fragment
        return html_fragment

    }
    var render = () => {
        parent_dom.appendChild(htmlNode(name1, name2));
        //binding stuff here:
        var fpair_delete = dom_node.querySelector("[data-ss='fpair-delete']");
        fpair_delete.onclick = () => {
            pubsub.pub(FPAIR_REMOVED, id)
        }

        var name1_dom = dom_node.querySelector("[data-ss='name1']")
        name1_dom.addEventListener("blur", (event) => {
            name1 = name1_dom.value
            pubsub.pub(FPAIR_NAME_CHANGED, name1)
        })

        var name2_dom = dom_node.querySelector("[data-ss='name2']")
        name2_dom.addEventListener("blur", (event) => {
            name2 = name2_dom.value
            pubsub.pub(FPAIR_NAME_CHANGED, name2)
        })
    }
    var remove = () => {
        parent_dom.removeChild(dom_node);
    }
    return {
        id,
        render,
        remove,
        getGifter: () => {
            return name1
        },
        getRecipient: () => {
            return name2
        }
    }
}

var SSView = () => {
    // Let's roll our own 'virtual dom' here
    var rendered_participants = {}
    var renderParticipants = (participants) => {
        //window.updated_participants = participants.reduce((o, v, i) => {
        var updated_participants = participants.reduce((o, v, i) => {
            o[v.id] = v
            return o
        }, {})

        //removing
        Object.keys(rendered_participants).forEach(function (id) {
            let participant = rendered_participants[id]
            if (!(id in updated_participants)) {
                participant.remove()
                delete rendered_participants[id]
            }
        })
        //rendering
        Object.keys(updated_participants).forEach(function (id) {
            let participant = updated_participants[id]
            if (!(id in rendered_participants)) {
                participant.render()
                rendered_participants[id] = participant
            }
        })
    }

    var rendered_fpairs = {}
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

    var emails_warn;
    var renderValidateEmailsWarning = (to_display) => {
        if (!(emails_warn == to_display)) {
            let display_style = to_display? 'block' : 'none'
            validate_emails_dom.style.display = display_style
            emails_warn = to_display
        }
    }
    var participants_warn;
    var renderValidateParticipantsWarning = (to_display) => {
        if (!(participants_warn == to_display)) {
            let display_style = to_display? 'block' : 'none'
            validate_participants_dom.style.display = display_style
            participants_warn = to_display
        }
    }
    var fpairs_warn;
    var renderValidateFpairsWarning = (to_display) => {
        if (!(fpairs_warn == to_display)) {
            let display_style = to_display? 'block' : 'none'
            validate_fpairs_dom.style.display = display_style
            fpairs_warn = to_display
        }
    }

    var fpairs_dom;
    var participants_dom;
    var validate_emails_dom;
    var validate_participants_dom;
    var validate_fpairs_dom;
    var submit_btn_dom;

    return {
        renderParticipants,
        renderFpairs,
        renderValidateFpairsWarning,
        renderValidateEmailsWarning,
        renderValidateParticipantsWarning,
        getParticipantsDom: () => {
            return participants_dom
        },
        bindParticipants: (node) => {
            participants_dom = node
        },
        getFpairsDom: () => {
            return fpairs_dom
        },
        bindFpairs: (node) => {
            fpairs_dom = node
        },
        bindValidateEmails: (node) => {
            node.style.display = 'none'
            validate_emails_dom = node
        },
        bindValidateParticipants: (node) => {
            node.style.display = 'none'
            validate_participants_dom = node
        },
        bindValidateFpairs: (node) => {
            node.style.display = 'none'
            validate_fpairs_dom = node
        },
        bindSubmitBtn: (node) => {
            node.style.display = 'none'
            submit_btn_dom = node
        }
    }
}

var SSController = (model) => {
    var sampleParticipants = [
        ["George Bluth", "george@bluthcompany.com"],
        ["Lucille Bluth", "lucille@bluthcompany.com"],
        ["GOB Bluth", "gob@bluthcompany.com"],
        ["Lindsay Bluth Funke", "lindsay@bluthcompany.com"],
        ["Tobias Funke", "tobias@bluthcompany.com"],
        ["Buster Bluth", "buster@bluthcompany.com"],
        ["Michael Bluth", "michael@bluthcompany.com"]
    ];
    var sampleForbiddenPairs = [
        ["George Bluth", "Lucille Bluth"],
        ["Tobias Funke", "Lindsay Bluth Funke"]
    ];

    var sampleBtnClicked = () => {
        loadSampleParticipants()
    };
    var loadSampleParticipants = () => {
        model.removeAllParticipants()
        model.removeAllFpairs()
        for (let participant of sampleParticipants) {
            model.addParticipant(participant)
        }
        for (let pair of sampleForbiddenPairs) {
            model.addForbiddenPair(pair)
        }
    };
    var addParticipantBtnClicked = () => {
        model.addParticipant(['',''])
    }
    var addFpairBtnClicked = () => {
        model.addForbiddenPair(['',''])
    }
    
    var dryRunClicked = () => {
        //if (model.validateEmpties() && model.validateEntries()) {
            //TODO render stuff here
        //}
    }

    var initialiseApp = () => {
        model.addParticipant(['',''])
        model.addParticipant(['',''])
        model.addParticipant(['',''])
    }

    return {
        sampleBtnClicked,
        addParticipantBtnClicked,
        addFpairBtnClicked,
        dryRunClicked,
        initialiseApp
    }
}

var SSModel = (view) => {
    var participant_id = 0
    var generateParticipantId = () => {
        return participant_id++
    }
    var fpair_id = 0
    var generateForbiddenPairId = () => {
        return fpair_id++
    }
    var participants = [];
    var forbidden_pairs = [];
    //TODO: make this constant time
    var removeParticipant = (participant_id) => {
        for (let i = 0; i < participants.length; i++) {
              if (participant_id == participants[i].id) {
                  participants.splice(i, 1)
                  view.renderParticipants(participants)
              }
        }
    }
    var validateEmailAddresses = () => {
        var num_elems = participants.length
        var email_addresses = participants.map((participant_item) => {
            return participant_item.getEmailAddress()
        })
        var should_display = !h.areUniqueWithoutEmptyStrings(email_addresses) || !h.areEmailsValidWithoutEmptyStrings(email_addresses)
        view.renderValidateEmailsWarning(should_display)
    }
    var validateParticipantNames = () => {
        var names = participants.map((participant_item) => {
            return participant_item.getName()
        })
        var should_display = !h.areUniqueWithoutEmptyStrings(names)
        view.renderValidateParticipantsWarning(should_display)
    }
    var validateFPairName = (name) => {
        var participant_names = new Set(participants.map((participant_item) => {
            return participant_item.getName()
        }))
        var should_display = !participant_names.has(name)
        view.renderValidateFpairsWarning(should_display)
    }
    var validateFPairNames = () => {
        var participant_names = new Set(participants.map((participant_item) => {
            return participant_item.getName()
        }))
        for (let fpair of forbidden_pairs) {
            let gifter = fpair.getGifter()
            if (!participant_names.has(gifter)) {
                view.renderValidateFpairsWarning(true)
                break
            }
            let recipient = fpair.getRecipient()
            if (!participant_names.has(recipient)) {
                view.renderValidateFpairsWarning(true)
                break
            }
        }
        view.renderValidateFpairsWarning(false)
    }


    var addParticipant = (participant) => {
        var allow_delete = participants.length >= MIN_PARTICIPANTS
        participants.push(new SSParticipantItem(generateParticipantId(), view.getParticipantsDom(), pubsub, ...participant, allow_delete))
        view.renderParticipants(participants)
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

    var pubsub = new h.PubSub()
    pubsub.sub(FPAIR_NAME_CHANGED, validateFPairName)
    pubsub.sub(PARTICIPANT_NAME_CHANGED, validateParticipantNames)
    pubsub.sub(PARTICIPANT_EMAIL_CHANGED, validateEmailAddresses)
    pubsub.sub(PARTICIPANT_REMOVED, (id) => {
        removeParticipant(id)
        validateEmailAddresses()
        validateParticipantNames()
    })
    pubsub.sub(FPAIR_REMOVED, (id) => {
        removeForbiddenPair(id)
        validateFPairNames()
    })

    var addForbiddenPair = (fpair) => {
        forbidden_pairs.push(new FPairItem(generateForbiddenPairId(), view.getFpairsDom(), pubsub, ...fpair))
        view.renderFpairs(forbidden_pairs)
    }

    var removeAllParticipants = () => {
        participants = []
        view.renderParticipants(participants)
    }
    var removeAllFpairs = () => {
        forbidden_pairs = []
        view.renderFpairs(forbidden_pairs)
    }
    return {
        addParticipant,
        addForbiddenPair,
        removeAllParticipants,
        removeAllFpairs,
        participants,
        forbidden_pairs
    }
}

var applySSBindings = (model, view, controller, dom, visualiser) => {

    var getBindType = (attr) => {
        return attr.split(':')[0];
    };

    var bindTypes = {
        "load-sample": (elem) => {
            elem.onclick = controller.sampleBtnClicked
        },
        "add-participant": (elem) => {
            elem.onclick = controller.addParticipantBtnClicked
        },
        "add-fpair": (elem) => {
            elem.onclick = controller.addFpairBtnClicked
        },
        "dry-run": (elem) => {
            elem.onclick = controller.dryRunClicked
                //if (validateParticipants(model) && validateForbiddenPairs(model)) {
                    //visualiser.render(model.participants, model.forbidden_pairs)
                //} else {
                //}
        },
        "participants": (elem) => {
            view.bindParticipants(elem)
        },
        "forbidden-pairs": (elem) => {
            view.bindFpairs(elem)
        },
        "participants-validate-warning": (elem) => {
            view.bindValidateParticipants(elem)
        },
        "fpairs-validate-warning": (elem) => {
            view.bindValidateFpairs(elem)
        },
        "emails-validate-warning": (elem) => {
            view.bindValidateEmails(elem)
        },
        "submit": (elem) => {
            view.bindSubmitBtn(elem)
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
    controller.initialiseApp()
    controller.sampleBtnClicked()
    visualiser.render(model.participants, model.forbidden_pairs)
}

var SecretSantaApp = (dom, visualiser) => {
    var view = new SSView()
    var model = new SSModel(view)
    var controller = new SSController(model)
    applySSBindings(model, view, controller, dom, visualiser)
}

exports.SecretSantaApp = SecretSantaApp
