// ==UserScript==
// @version     0.0.1
// @name        LDR Show B Comments
// @namespace   http://basyura.org
// @include     http://reader.livedoor.com/reader/*
// @author      basyura
// ==/UserScript==

(function (w) {
   
const JSON_API_URL  = "http://b.hatena.ne.jp/entry/json/";
const TORIGGER_KEY  = "m";
       
function showComments(link) {
    var opt = {
        method: 'GET',
        url: JSON_API_URL + link,
        onload: function(res){
			var text = res.responseText;
			if(text == "(null)") {
				w.message("no comment");
				return;
			}
			var bm = eval(text);
			var bookmarks = bm.bookmarks;
			var length    = bookmarks.length;
			var buf = [];
			var width  = w.innerWidth  * 0.8;
			var height = w.innerHeight * 0.6;
			buf.push("<div style='width:" + width + "px;align:center'>");
			buf.push("<div style='background-color:#4872ff;color:#ffffff;padding:5px;' align='left'>");
			buf.push("&nbsp;" + bm.title + " (" + bm.count +  ")");
			buf.push("</div>");
			buf.push("<div style='height:" + height + "px;overflow-y:auto;background-color:#f0f0f0;border:3px solid #4872ff;font-size:10pt;' align='center'>");
			buf.push("<div style='width:95%;padding:3px;' align='left'>");
			for(var i = 0 ; i < length ; i++) {
				var b = bookmarks[i];
				if(b.comment == "") {
					continue;
				}
				buf.push("<img src='http://www.hatena.ne.jp/users/ba/" + b.user + "/profile_s.gif'>");
				buf.push("&nbsp;");
				buf.push("<span style='color:blue;'>" + b.user + "</span>");
				buf.push("&nbsp;" + b.comment + "&nbsp;" + b.timestamp);
				buf.push("<hr style='color:#c9f6ff;'>");
			}
			buf.push("</div>");
			var comment = document.getElementById("hatena_bookmark_comment");
			if(comment == null) {
				comment = document.createElement("div");
				comment.setAttribute("id"    , "hatena_bookmark_comment");
				comment.setAttribute("style" , "position:absolute;width:100%;");
				comment.setAttribute("align" , "center");
				document.body.appendChild(comment);
			}
			buf.push("</div>");
			buf.push("</div>");
			comment.innerHTML = buf.join("");
			comment.focus();
		},
		onerror: function(res){
		},
	}
    window.setTimeout(GM_xmlhttpRequest, 0, opt);
}

w.register_hook('after_init', function() {
    w.Keybind.add(TORIGGER_KEY, function() {
        var comment = document.getElementById("hatena_bookmark_comment");
        if(comment != undefined) {
            document.body.removeChild(comment);
        }
        else {
            showComments(w.get_active_item(true).link);
        }
    });
});
})(this.unsafeWindow || this);
