// ==UserScript==
// @version     0.0.2
// @name        LDR Show B Comments
// @namespace   http://basyura.org
// @include     http://reader.livedoor.com/reader/*
// @author      basyura
// ==/UserScript==

(function (w) {
   
const JSON_API_URL  = "http://b.hatena.ne.jp/entry/json/";
const TORIGGER_KEY  = "m";
const CONTENTS_WIDTH_RATE    = 0.8;
const CONTENTS_HEIGHT_RATE   = 0.6;
const CONTENTS_SCROLL_HEIGHT = 40;
       
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
			var bookmarks = bm.bookmarks.reverse();
			var length    = bookmarks.length;
			var buf = [];
			buf.push("<div style='width:" + getContentsWidth() + "px;align:center'>");
			buf.push("<div style='background-color:#4872ff;color:#ffffff;padding:5px;' align='left'>");
			buf.push("&nbsp;" + bm.title + " (" + bm.count +  ")");
			buf.push("</div>");
			buf.push("<div id='hatena_bookmark_comment_contents' style='");
            buf.push("height:" + getContentsHeight() + "px;");
            buf.push("overflow-y:auto;");
            buf.push("background-color:#f0f0f0;");
            buf.push("border:3px solid #4872ff;");
            buf.push("font-size:10pt;");
            buf.push("' align='center'>");
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
           var contents  = document.evaluate(
                   ".//div[@id='hatena_bookmark_comment_contents']",
                   comment ,
                   null ,
                   XPathResult.FIRST_ORDERED_NODE_TYPE ,
                   null).singleNodeValue;

            if(contents.scrollHeight <= contents.scrollTop + getContentsHeight()) {
                document.body.removeChild(comment);
            }
            contents.scrollTop += CONTENTS_SCROLL_HEIGHT;
        }
        else {
            showComments(w.get_active_item(true).link);
        }
    });
});
function getContentsHeight() {
   return Math.floor(w.innerHeight * CONTENTS_HEIGHT_RATE);
}
function getContentsWidth() {
   return Math.floor(w.innerWidth  * CONTENTS_WIDTH_RATE);
}
})(this.unsafeWindow || this);
