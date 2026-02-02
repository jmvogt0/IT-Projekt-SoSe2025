/*
 Cookie Management is used for the Result Page in the end
These Functions are in the jquermin File !!!!
 */


function write_cookie(my_cookie,value) {
    document.cookie = my_cookie+"="+value+"; path=/";
}

function set_cookie(value) {
    write_cookie(value,3); //Correct = 1 ; Incorrect = 2 ; Not Done = 3
    if(document.getElementById("msg").innerHTML == "Das ist richtig!") {
        write_cookie(value,1); //Correct = 1 ; Incorrect = 2 ; Not Done = 3
    }
    if(document.getElementById("msg").innerHTML == "Leider falsch!") {
        write_cookie(value,2); //Correct = 1 ; Incorrect = 2 ; Not Done = 3
    }
}

function read_cookie(my_cookie) {
    var my_cookie_eq = my_cookie + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i< ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(my_cookie_eq) == 0) {
            return c.substring(my_cookie_eq.length,c.length);
        }
    }
    return null
}

function delall_cookie(inanz) {
    for (var anz = 1; anz<=inanz; anz++) {
        write_cookie("quiz"+anz.toString(),0);
    }
}

function calc_score(inanz) {
    var correct = 0; //Set Var to 0
    var wrong = 0; //Set Var to 0
    var notdone = 0;//Set Var to 0
    var score = 0;//Set Var to 0
    //Read all Cookie Data...
    for (var anz = 1; anz<=inanz; anz++) {
        if(read_cookie("quiz"+anz.toString()) == 1 ) { correct++};
        if(read_cookie("quiz"+anz.toString()) == 2 ) { wrong++};
        if(read_cookie("quiz"+anz.toString()) == 3 ) { notdone++};
        if(read_cookie("quiz"+anz.toString()) == 0 ) { notdone++};
    }
    score =parseInt( (100 / inanz) * correct ); // 15.5 => 15
    document.getElementById('correct.text').innerHTML = correct.toString();
    document.getElementById('wrong.text').innerHTML = wrong.toString();
    document.getElementById('notdone.text').innerHTML = notdone.toString();
    document.getElementById('score.text').innerHTML = score.toString();

}
