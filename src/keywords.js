/**
 * A list of our keywords that trigger the key phrase
 */

module.exports = function () {

	var keywords = [
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
		"slaying",
		"passed away",
		"fatally shot"
	];

	return keywords.join('|');
};