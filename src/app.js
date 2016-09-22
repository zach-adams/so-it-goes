/**
 * “All this happened, more or less.”
 * ~ Kurt Vonnegut, Slaughterhouse-Five
 * -----------------------------------------------
 *
 * Main Script
 *
 */

(function () {

	"use strict";

	var S = require('string');

	var keyPhrase = 'So it goes.';

	var keywords = require('./keywords')();
	var nodeExcludes = require('./node_excludes')();
	var abbreviations = require('./abbreviations')();
	var sentenceEndingExcludes = require('./sentence_excludes')();
	var commonPhrases = require('./common_phrases')();
	var urlExcludes = require('./url_excludes')();
	sentenceEndingExcludes.push(keyPhrase);

	var processedNodes = [];

	var keywordRegex = new RegExp("\\b(?:"+ keywords +")\\b", "im");

	var inlineTags = ['strong', 'em', 'i', 'b', 'big', 'i', 'small', 'tt', 'abbr', 'acronym'];

	function processNodes(nodes) {

		var nodesIndex = nodes.length;

		while (nodesIndex--) {

			processNode(nodes[nodesIndex]);

		}

	}

	function processNode(node) {

		switch(node.nodeType) {
			case 1:
			case 9:
			case 11:

				if(nodeExcludes.indexOf(node.nodeName.toLowerCase()) !== -1) {

					break;

				}

				if(keywordRegex.test(node.textContent) && inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1) {

					for(var i = 0; i < processedNodes.length; i++) {
						if(processedNodes[i].isSameNode(node) || node.parentNode.contains(processedNodes[i])) { return; }
					}

					processedNodes.push(node);

					processInlineTextNode(node);

					break;

				}

				if(!node.hasChildNodes()) {
					break;
				}

				processNodes(node.childNodes);

				break;
			case 3:

				if(keywordRegex.test(node.textContent)) {

					for(var i = 0; i < processedNodes.length; i++) {
						if(processedNodes[i].isSameNode(node) || node.parentNode.contains(processedNodes[i])) { return; }
					}

					processedNodes.push(node);

					replaceKeywordInTextNode(node);

				}

				break;
		}

	}

	function processInlineTextNode(node) {

		var parentNodeText = node.parentNode.innerHTML;

		var nodeSentences = parseSentencesFromString(parentNodeText);

		/**
		 * Fixes bug where the key phrase isn't recognized
		 */
		for(var i = 0; i < nodeSentences.length; i++) {
			if(nodeSentences[i].trim() === keyPhrase) {
				nodeSentences.splice(i-1, 2);
			}
		}

		var keywordSentences = findKeywordInSentences(nodeSentences);

		var replacedText = addKeywordToSentences(keywordSentences, parentNodeText);

		stopObserver();
		node.parentNode.innerHTML = replacedText;
		startObserver();

	}

	function replaceKeywordInTextNode(node) {

		var nodeText = node.textContent;

		var nodeSentences = parseSentencesFromString(nodeText);

		var keywordSentences = findKeywordInSentences(nodeSentences);

		var replacedText = addKeywordToSentences(keywordSentences, nodeText);

		stopObserver();
		node.textContent = replacedText;
		startObserver();

	}

	/**
	 * Split each sentence and add it to an array
	 * http://stackoverflow.com/a/31430385
	 */
	function parseSentencesFromString(text) {

		var sentences = text.replace(/(\.+|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/m, "$1$2|").split("|");

		for(var i = 0; i < sentences.length; i++) {

			var sentence = sentences[i].trim().toLowerCase();

			/**
			 * If our sentence is empty or ends in something we're excluding remove it from the array
			 */
			if(sentence === '' || sentence.split(" ").length === 1 || endsWith(sentence, sentenceEndingExcludes)) {

				sentences.splice(i, 1);

				continue;

			}

			if(sentence.length > 2 && sentence.substr(sentence.length - 3, 1) === ' ') {

				sentences.splice(i, 1);

				continue;

			}

			if(hasCommonPhrase(sentence)) {

				sentences.splice(i, 1);

				continue;

			}

			/**
			 * If our sentence ends in an abbreviation we'll assume it's been wrongly interpreted
			 * and splice it back with the next sentence
			 */
			if(endsWith(sentence, abbreviations)) {

				if(typeof sentences[ i + 1 ] == 'undefined') {
					continue;
				}

				sentences[i] = sentences[i] + ' ' + sentences[ i + 1 ];
				i++;

			}

		}

		return sentences;

	}

	function hasCommonPhrase(text) {

		for(var i = 0; i < commonPhrases.length; i++) {
			if(text.indexOf(commonPhrases[i]) !== -1) {
				return true;
			}
		}

		return false;

	}

	function findKeywordInSentences(sentences) {

		var keywordSentences = [];

		for(var i = 0; i < sentences.length; i++) {

			if(!keywordRegex.test(sentences[i])) {
				continue;
			}

			keywordSentences.push(sentences[i]);

		}

		return keywordSentences;

	}

	function addKeywordToSentences(sentences, text) {

		/**
		 * For every sentence with a keyword clean it up a bit then replace it with the copy with the replacement
		 */
		for(var i = 0; i < sentences.length; i++) {

			var replacedText = addKeywordToSentence(sentences[i]);

			text = text.replace(new RegExp(sentences[i], 'im'), replacedText);

		}

		return text;

	}

	function addKeywordToSentence(sentence) {

		// Make copy to format, strip all whitespace on the right
		var newSentence = sentence.replace(/~+$/, '');

		// If it doesn't end in any punctuation add a period
		if(!endsWith(newSentence.trim(), ["!","?","."])) {
			newSentence = newSentence + '.';
		}

		return newSentence + ' ' + keyPhrase;

	}

	/**
	 * Checks if a string ends in a "suffix".
	 * Accepts both a string and an array for the suffix.
	 */
	function endsWith(str, suffix) {

		if(!suffix instanceof Array) {
			suffix = [suffix];
		}

		for(var i = 0; i < suffix.length; i++) {

			if(str.indexOf(suffix[i], str.length - suffix[i].length) !== -1) {
				return true;
			}

		}

		return false;

	}

	var observer = new MutationObserver(function(mutations) {

		mutations.forEach(function(mutation) {
			if(mutation.addedNodes.length > 0) {

				processNode(mutation.target);

			}
		});

	});

	var config = { subtree: true, childList: true, characterData: true };

	function stopObserver() {
		observer.disconnect();
	}
	function startObserver() {
		observer.observe(document.body, config);
	}

	function urlExcluded(url) {
		for(var i = 0; i < urlExcludes.length; i++) {
			if(urlExcludes[i].test(url)) { return true; }
		}
		return false;
	}

	if(!urlExcluded(window.location.href)) {

		startObserver();

		processNodes(document.body.childNodes);

	}

}());