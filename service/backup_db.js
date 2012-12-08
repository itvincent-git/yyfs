var util = require('util'),
    exec = require('child_process').exec,
    child,
    interval = process.argv[4] || 24 * 3600 * 1000;

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format))
        format=format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,  RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

setInterval(function(){
    var dateStr = new Date().format("yyyy-MM-dd-hh-mm-ss")
    child = exec(process.argv[2] + dateStr,  {cwd:process.argv[3]},
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }

        }
    );
}, interval);

