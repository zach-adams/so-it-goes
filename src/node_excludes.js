/**
 * A list of Nodes we want to ignore
 */

module.exports = function () {

	var excludes = ['html', 'body', 'head', 'style', 'title', 'link', 'meta', 'script', 'object', 'iframe', 'cite'];

	return excludes;

};