/**
 * A list of common abbreviations which may falsely end a sentence prematurely.
 */

module.exports = function () {

	var commonContractions = [
		'jan.',
		'feb.',
		'mar.',
		'apr.',
		'may',
		'jun.',
		'jul.',
		'aug.',
		'sep.',
		'sept.',
		'oct.',
		'nov.',
		'dec.',
		'ak.',
		'al.',
		'az.',
		'ar.',
		'ca.',
		'ct.',
		'de.',
		'fl.',
		'ga.',
		'hi.',
		'id.',
		'il.',
		'in.',
		'ia.',
		'ks.',
		'ky.',
		'la.',
		'me.',
		'md.',
		'ma.',
		'mi.',
		'mn.',
		'ms.',
		'mo.',
		'mt.',
		'ne.',
		'nv.',
		'nh.',
		'nj.',
		'nm.',
		'ny.',
		'nc.',
		'nd.',
		'oh.',
		'ok.',
		'or.',
		'pa.',
		'ri.',
		'sc.',
		'sd.',
		'tn.',
		'tx.',
		'ut.',
		'vt.',
		'va.',
		'wa.',
		'wv.',
		'wi.',
		'wy.',
		'lt.'
	];

	for(var i = 0; i < commonContractions.length; i++) {
		commonContractions[i] = ' ' + commonContractions[i];
	}

	return commonContractions;

};