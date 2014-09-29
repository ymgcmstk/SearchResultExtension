$(function() {
    if (document.getElementById('lst-ib') == null) {
        var inputID = 'gbqfq';
        var inputElement = document.getElementById(inputID);
    } else {
        var inputID = 'lst-ib';
        var inputElement = document.getElementById(inputID);
        //var inputElement = document.getElementsByClassName('gsfi')[0]
    }
    
    //check first input value
    try{
        var firstInputValue = inputElement.value;
    }catch(e){
        var firstInputValue = "";
    }

    //get next google search result page's link (if null, false)
    try{
        var nextLink = document.getElementById('pnnext').getAttribute('href');
    }catch(e){
        var nextLink = false;
    }

    //get previous google search result page's link (if null, false)
    try{
        var prevLink = document.getElementById('pnprev').getAttribute('href');
    }catch(e){
        var prevLink = false;
    }

    //get google suggest word's search result page's link (if null, false)
    try{
        var suggestedLink = document.getElementsByClassName('ssp card-section')[0].getAttribute('href');
    }catch(e){
        var suggestedLink = false;
    }

    //get each result page's link and title and set each character in the result page
    var pageResults = document.evaluate(
        "//div[@class='rc']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 
        null
    );

    var counter = 1;
    var TCounter = 0;

    var pageLinks = new Array( );
    var alphabet = 'abcdefghijklmnopqrstuwuvxyz';
    for (var i = 0; i < pageResults.snapshotLength; ++i) {
        var result = pageResults.snapshotItem(i);
        if (!result.getElementsByTagName("a")[0]){
            TCounter++;
            continue;
        }
        try{
            pageLinks.push(result.getElementsByTagName("a")[0].getAttribute('href'));
        }catch(e){
            continue;
        }
        var newspan = document.createElement('span');
        var title = result.getElementsByClassName('action-menu ab_ctl')[0];
        try{
            if (title.getAttribute('class')=='action-menu ab_ctl') {
                newspan.appendChild(document.createTextNode('' + alphabet[counter++-1]));
                title.insertBefore(newspan,title.firstChild.nextSibling);
            }
        }catch(e){
            console.log(e);
            console.log(title);
        }
    }

    //get each relative keyword's search result page's link and title and set each number in the result page
    var relativeKeywords = document.evaluate(
        "//p[@class='_e4b']",
        document, 
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 
        null
    );
    var PBCounter = 1;
    var keywordLinks = new Array();
    for (var i = 0; i < relativeKeywords.snapshotLength; ++i) {
        var result = relativeKeywords.snapshotItem(i);
        var keyword = relativeKeywords.snapshotItem(i);
        var newspan = document.createElement('span');
        keywordLinks.push(result.getElementsByTagName("a")[0].getAttribute('href'));
        newspan.appendChild(document.createTextNode(' ' + PBCounter++%10));
        newspan.setAttribute("style", "color:silver; font-size: 14px;");
        keyword.insertBefore(newspan,keyword.firstChild.nextSibling);
    }

    var shortcuts = {};
    var sc = shortcuts;

    //set key information
    sc.keyinfo = function(e) {
        var key = {};
        key.keyCode = e.which;
        key.keyChar = String.fromCharCode(key.keyCode).toUpperCase();
        console.log("keyCode="+key.keyCode+", keyChar="+key.keyChar);
        return key;
    };

    //set keybinds
    sc.bind = function() {
        $('body').bind('keypress', function(e){
            if (document.activeElement.id != inputID){
                var key = sc.keyinfo(e);
                if (key.keyCode>=49&&key.keyCode<=48+PBCounter&&key.keyCode<=57){
                    //from 1 to 9
                    sc.jumpKeyword(key.keyCode-49);
                } else if (key.keyCode == 48 && PBCounter == 11){
                    //0
                    sc.jumpKeyword(9);
                } else if (key.keyCode>=97&&key.keyCode<=95+counter){
                    //alphabet
                    sc.jumpPage(key.keyCode-97);
                }else if((key.keyCode==92 || key.keyCode==47) && nextLink){
                    // slash and back slash
                    sc.nextPage();
                }else if((key.keyCode==64 || key.keyCode==91) && prevLink){
                    // atmark and bracket
                    sc.prevPage();
                }else if(key.keyCode==114){
                    //r (the first letter of "Remove")
                    sc.inputFocus(1);
                }else if(key.keyCode==117){
                    //u (the first letter of "Undo")
                    sc.inputFocus(2);
                }else if(key.keyCode==119){
                    //u (the first letter of "Undo")
                    sc.inputFocus(3);
                }else if(key.keyCode==112){
                    //p (the first letter of "Picture")
                    sc.imagePage();
                }else if(key.keyCode==32){
                    //mosikasite
                    sc.suggestedPage();
                }else if(key.keyCode>=107&&key.keyCode<=122){
                    //the other keys
                    sc.inputFocus(0);
                }
            }
        });
    };

    sc.jumpPage = function(resultnum){
        document.location = pageLinks[resultnum];
    }

    sc.jumpKeyword = function(resultnum){
        document.location = keywordLinks[resultnum];
    }

    sc.nextPage = function(){
        if (nextLink != false) document.location = nextLink;
    }

    sc.prevPage = function(){
        if (prevLink != false) document.location = prevLink;

    }

    sc.suggestedPage = function(){
        if (suggestedLink != false) document.location = suggestedLink;
    }

    sc.imagePage = function(){
        if (document.location.origin.indexOf('&tbm=isch') < 0) document.location = document.location + '&tbm=isch';
        else document.location = document.location.replace('&tbm=isch', '');
    }

    sc.inputFocus = function(flg){
        setTimeout(function(){
            var target = inputElement;
            if (flg == 1) {
                target.value = "";
            } else if (flg == 2) {
                target.value = firstInputValue;
            } else if (flg == 3) {
                target.value = target.value.substr(0,Math.max(target.value.indexOf(" "), target.value.indexOf("　"))+1);
            } else {
                target.value = target.value;
            }
            target.focus();
        },0);
    }

    shortcuts.bind();
});
