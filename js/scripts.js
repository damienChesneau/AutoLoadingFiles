/**
 * @description File allows to load specifics scripts and style by page or by groups.
 * Closed code.
 * @author Damien Chesneau <contact@damienchesneau.fr>
 */
var allAskLoaded= false;
var scripts = {};
function Script(url, priority, fors) {
    this.url = url;
    this.priority = priority;
    this.for = fors;
}
function Style(url, fors) {
    this.url = url;
    this.for = fors;
}
var fileScripts = null;
scripts.loadScripts = function(forpage, method) {
    load(getScripts(forpage), method);
    function getScripts(forpage) {
        var abonements = new Array();
        var styles = new Array();
        var url = "./config/filesToLoad.xml";
        if (fileScripts == null) {
            $.ajaxSetup({cache: true});
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                async: false,
                success: function(xml) {
                    fileScripts = xml;
                }
            });
        }
        var unit = $(fileScripts).find("script[for='" + forpage + "']");
        unit.each(function() {
            var priorite = parseInt($(this).attr('priority'));
            var fors = $(this).attr('for');
            abonements.push(new Script($(this).text(), priorite, fors));
        });
        function compare(a, b) {
            if (a.priority < b.priority)
                return -1;
            if (a.priority > b.priority)
                return 1;
            return 0;
        }
        abonements = abonements.sort(compare);
        var unitStyle = $(fileScripts).find("style[for='" + forpage + "']");
        unitStyle.each(function() {
            var fors = $(this).attr('for');
            styles.push(new Style($(this).text(), fors));
        });
        loadStyle(styles);
        return abonements;
    }
    function loadStyle(styles) {
        for (var i = 0; i < styles.length; i++) {
            $("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + styles[i].url + "\">");
        }
    }

    function load(abonements, method) {
        var finish = true;
        var scriptsLoaded = new Array();
        var lenEnd = 0;
        for (var i = 0; i < abonements.length; i++) {
            scriptsLoaded[i] = abonements[i].url;
            $.ajaxSetup({async: false, cache: true});
            var url="";
            if (abonements[i].url.indexOf("http://") != -1 || abonements[i].url.indexOf("https://") != -1 ) {
            	url = abonements[i].url;          
            }else{
            	url = abonements[i].url;// diff are posible.
            }
            $.getScript(url, function(data, textStatus, jqxhr) {
                lenEnd++;
                if (jqxhr.status != 200) { // If you want's log...
//                	console.log("Error load script =" + $(this).attr('url'));
                } else {
//                	console.log("Valid load script =" + $(this).attr('url'));
                 }
            });
        }
        testIfWeCanExec();
        function testIfWeCanExec() {
            window.setTimeout(function() {
                if (lenEnd == abonements.length) {
                    if (method != null) {
                        method();
                    } else {
                    }
                } else {
                    testIfWeCanExec();
                }
            }, 0);
        }

    }
    function errorManagement(scriptToLoad) {
        for (var i = 0; i < scriptToLoad.length; i++) {
            if (scriptToLoad[i] != "ok") {
                $.getScript("./js/" + scriptToLoad[i], function(data, textStatus, jqxhr) {
                    console.log("reloaded");
                });
            }
        }
    }
};
function init() {        
    $.ajaxSetup({async: true, cache: true});
    var nom = window.location.pathname;    
    nom = nom.split("/");
    nom = nom[nom.length - 1];
    nom = nom.substr(0, nom.lastIndexOf("."));
    nom = nom.replace(new RegExp("(%20|-)", "g"), "");
    if(nom == ""){
    	nom = "index";
    }
    scripts.loadScripts(nom, function(){
    	loadStart();
    });
}

scripts.loadScripts("all", function() {
        init(); // To do your own init please update this.
});

