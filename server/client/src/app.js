var ss = require('./secret_santa.js')
var dry_run = require('./dry_run.js')

window.init = () => {
    var dryrun_viz = new dry_run.Visualiser(document.getElementById("dry-run"))
    var app = new ss.SecretSantaApp(document.getElementById("ss-app"), dryrun_viz)
}
