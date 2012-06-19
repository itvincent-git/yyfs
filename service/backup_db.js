var util = require('util'),
    exec = require('child_process').exec,
    child,
    interval = process.argv[4] || 24 * 3600 * 1000;

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

setInterval(function(){
    child = exec(process.argv[2] + new Date().getTime(), {cwd:process.argv[3]},
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }

        }
    );
}, interval);

