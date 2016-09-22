/**
 * A list of things that might mess up our sentences and therefore will exclude
 */

module.exports = function () {

	var sentenceEndingExcludes = [
		'..'
	];

	return sentenceEndingExcludes;

};