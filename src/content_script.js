/**
 * “All this happened, more or less.”
 * ~ Kurt Vonnegut, Slaughterhouse-Five
 */


function endsWith(str, suffix) {

    var suf = suffix;

    if(typeof suffix === 'string' || suffix instanceof String) {
        suf = [];
        suf.push(suffix);
    }

    for(var i = 0; i < suf.length; i++) {

        if(str.indexOf(suf[i], str.length - suf[i].length) !== -1) {
            return true;
        }

    }

    return false;

}

function soItGoes(searchText, replacement, searchNode) {

    if (!searchText || typeof replacement === 'undefined') {
        // Throw error here if you want...
        return;
    }
    var regex = typeof searchText === 'string' ?
                new RegExp(searchText, 'igm') : searchText,
        childNodes = (searchNode || document.body).childNodes,
        cnLength = childNodes.length,
        excludes = ['html', 'head', 'style', 'title', 'link', 'meta', 'script', 'object', 'iframe'];

    /**
     * First we'll go through every node
     */

    while (cnLength--) {

        var currentNode = childNodes[cnLength];

        /**
         * If this is an element node recall this function on that element
         */
        if (currentNode.nodeType === 1 && excludes.indexOf(currentNode.nodeName.toLowerCase()) === -1) {
            arguments.callee(searchText, replacement, currentNode);
        }

        /**
         * If this is not a text node or this text node does not have any keywords in it we'll move along
         */
        if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
            continue;
        }

        /**
         * Search through every sentence of this text node and if the sentence contains a keyword replace it along with our replacement
         */
		var senRegex = new RegExp(searchText, 'igm');
        var parent = currentNode.parentNode,
            frag = (function(){

                var html = currentNode.data;

                // Kind of a hacky work-around but we'll just remove any instance of our replacement to prevent doubles
                html = html.replace(replacement, '');

                /**
                 * Split each sentence and add it to an array
                 * http://stackoverflow.com/a/31430385
                 */
            	var sentences = html.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");

            	var reSentences = [];

                /**
                 * Checks each sentence for the keyword and adds it to an array if it contains one
                 */
            	for(var i = 0; i < sentences.length; i++) {

                    // If it doesn't contain a keyword move onto next sentence
            		if(!senRegex.test(sentences[i])) {
            			continue;
            		}

            		reSentences.push(sentences[i]);

            	}

                /**
                 * For every sentence with a keyword clean it up a bit then replace it with the copy with the replacement
                 */
            	for(var j = 0; j < reSentences.length; j++) {

                    // Make copy to format, strip all whitespace on the right
                    var newSentence = reSentences[j].replace(/~+$/, '');

                    // Make sure we don't add double if it already ends with the replacement
                    if(endsWith(newSentence.trim(), replacement)) {
                        continue;
                    }

                    // If it doesn't end in any punctuation add a period
                    if(!endsWith(newSentence.trim(), ["!","?","."])) {
                        newSentence = newSentence + '.';
                    }

                    // Replace original sentence with new sentence, so it goes
            		html = html.replace(new RegExp(reSentences[j], 'ig'), newSentence + ' ' + replacement);

            	}

                var wrap = document.createElement('div'),
                    frag = document.createDocumentFragment();

                wrap.innerHTML = html;

                while (wrap.firstChild) {
                    frag.appendChild(wrap.firstChild);
                }

                return frag;

            })();
        parent.insertBefore(frag, currentNode);
        parent.removeChild(currentNode);

    }

}

var soItGoesPhrases = [
	"dead",
	"deaths",
	"dies",
	"died",
	"hanged",
	"murdered",
	"assassinated",
	"executed",
	"killed",
    "killing",
	"drowned",
	"massacred",
	"slain",
	"slayings",
	"slaying"
];

soItGoes("\\b(?:"+ soItGoesPhrases.join('|') +")\\b", 'So it goes.');