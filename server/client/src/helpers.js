//[x] → bool
var areUnique = (xs) => {
    var num_elems = xs.length
    var num_unique = (new Set(xs)).size
    return num_elems == num_unique
}

var validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//[email] → bool
var areEmailsValid = (emails) => {
    for (let email of emails) {
        if (!validateEmail(email)) {
            return false;
        }
    }
    return true;
}

var PubSub = () => {
    var channels = {}
    return {
        sub: (channel, fn) => {
            if (!(channel in channels)) {
                channels[channel] = []
            }
            channels[channel].push(fn)
        },
        pub: (channel, args) => {
            if (channel in channels) {
                let triggers = channels[channel]
                triggers.forEach((trigger) => {
                    trigger(args)
                })
            }
        }
    }
}

//[string] → bool
exports.areUniqueWithoutEmptyStrings = (xs) => {
    var elems_without_empty = xs.filter((x) => {
        return x !== ""
    })
    return areUnique(elems_without_empty)
}

//[email] → bool
exports.areEmailsValidWithoutEmptyStrings = (xs) => {
    var elems_without_empty = xs.filter((x) => {
        return x !== ""
    })
    return areEmailsValid(elems_without_empty)
}

exports.PubSub = PubSub
