var ss = require('./secret_santa.js')
var dry_run = require('./dry_run.js')


var sample_data = {"participants":[["George Bluth","george@bluthcompany.com"],["Lucille Bluth","lucille@bluthcompany.com"],["GOB Bluth","gob@bluthcompany.com"],["Lindsay Bluth Funke","lindsay@bluthcompany.com"],["Tobias Funke","tobias@bluthcompany.com"],["Buster Bluth","buster@bluthcompany.com"],["Michael Bluth","michael@bluthcompany.com"]],"forbidden_pairs":[["Lucille Bluth","George Bluth"],["Lindsay Bluth Funke","Tobias Funke"]]};

window.init = () => {
    var dryrun_viz = new dry_run.Visualiser(document.getElementById("dry-run"))
    var app = new ss.SecretSantaApp(document.getElementById("ss-app"), dryrun_viz)
    dry_run
        .post("http://localhost:5000/api/v1/ss", sample_data)
        .then((response) => {
        console.log("response: ", response);
    })
        .catch((error) => {
        console.log("error: ", error);
    })
}
