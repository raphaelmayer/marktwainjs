const fs = require("fs");

module.exports = analyseText;

const ENGLISH = "ENGLISH";
const GERMAN = "GERMAN";

/**
 * @typedef {Object} Options
 * @property {boolean} ignoreNumbers filter out numbers (default: false)
 * @property {boolean} ignoreCommonWords ignore common words (default: false)
 * @property {number} minLength minimum characters per word (default: 0)
 * @property {string} language used for common words (default: ENGLISH)
 *//**
 * @typedef {Object} Word
 * @property {string} word the word itself in lowercase
 * @property {number} count number of occurences
 * @property {number} percentage occurence percentage
 *//**
 * @typedef {Object} Analysis
 * @property {Array<Word>} words list of word objects
 * @property {number} total_word_count the total number of words
 * @property {number} unique_word_count the number of unique words
 * @property {number} average_word_length average number of characters per word
 * @property {number} character_count number of characters excluding whitespace
 * @property {number} sentence_count the number of sentences
 * @property {number} average_sentence_length average number of words per sentence
 */

/**
 * Analyse a string or text for word frequency, sentence count etc.
 * @param {string} string text to analyse
 * @param {Options} opts optional options
 * @returns {Analysis} Analysis object containing various stats about the supplied text
 * @throws {Error} If no string is provided.
 */
function analyseText(string, opts = {}) {
	if (typeof string !== "string") throw Error("Provide a string.");
	// opts = opts || {};
	const lang = opts.language || ENGLISH; // language
	const igncw = opts.ignoreCommonWords ? lang : false; // ignore common words
	const ignn = !!opts.ignoreNumbers; // ignore numbers
	const minLen = opts.minLength || 0; // minimum word length

	const text = sanitize(string, ignn);

	// analyse text structure
	const sentences = text.split(". ");

	// filter and analyse words
	// wordFilter: muss mehr als '' sein, länger als minLen und falls noCommons, dann darfs nied common sein
	const wordFilter = w => !(!w || (w.length < minLen) || (igncw && isCommon(w, lang)));
	const words = text.replace(/[^A-Za-z0-9-#_ ]/gi, "").split(" ").filter(wordFilter);
	const sorted_words = sortByFrequency(words);

	return { 
		words: sorted_words, 
		total_word_count: words.length,
		unique_word_count: sorted_words.length,
		average_word_length: words.reduce((acc, w) => acc + w.length, 0) / words.length,
		character_count: text.length,
		sentence_count: sentences.length,
		average_sentence_length: words.length / sentences.length
	}
}

/**
 * Searches a text for a list of words.
 * @param {string} string text to analyse
 * @param {Array<Word>} wlist list of words to search for
 * @return {Array<Word>} list of matched words
 * @ignore
 */
function findWordsFromList(string, wlist) {
	const { words } = analyseText(string, {});
	return words.filter(w => wlist.includes(w.word));
}

/**
 * Takes a string, replaces (problematic) characters.
 * @param {string} string 
 * @param {boolean} ignn ignore numbers flag (optional, default: false)
 * @returns {string} formatted string
 * @ignore
 */
function sanitize(string, ignn) {
	// was mir bräuchten wär a regex, die alle whitespace chars 
	const regex = ignn ? /[^A-Za-z,.\-#_!? ]/gi : /[^A-Za-z0-9,.\-#_!? ]/gi; // ex/include numbers 
	const formatted = string.replace(/\s+/gi, " "); // replace whitespace
	return formatted.replace(regex, "").toLowerCase(); // remove non-alphanum chars (more or less)
}

/**
 * Takes an array of strings (ie. words) and returns an ordered list of "word objects"
 * sorted by descending occurence frequency. 
 * @param {Array<string>} array list of strings
 * @returns {Array<Word>} list of word objects { word, count, percentage }
 * @ignore
 */
function sortByFrequency(array) {
    let frequency = {};
    
    array.forEach(word => frequency[word] = 0);

    // create an array of uniques and counts occurences
    const uniques = array.filter(word => ++frequency[word] === 1);

    // creates a array of objects sorted by descending frequency
    return uniques.sort((a, b) => frequency[b] - frequency[a]).map(word => { 
	    return { 
	    	word,
	    	count: frequency[word], 
	    	percentage: frequency[word] / array.length
	    };
	});
}

/**
 * Checks if a given word is in the top 100 words of the given language (default: ENGLISH). 
 * Supported languages: german, english
 * @param {string} word to compare
 * @param {string} language language name (optional, defaults to ENGLISH)
 * @returns {boolean} true, if word is on the common words list, else false.
 * @throws {Error} If the language is not supported.
 * @ignore
 */
function isCommon(word, language) {
	const commonWords = { // 100 most common words of each language
		ENGLISH: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "will", "an", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "when", "me", "make", "can", "like", "time", "no", "just", "him", "know", "take", "person", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "most", "us"],
		GERMAN: ["der", "die", "und", "in", "den", "von", "zu", "das", "mit", "sich", "des", "auf", "für", "ist", "im", "dem", "nicht", "ein", "eine", "als", "auch", "es", "an", "werden", "aus", "er", "hat", "dass", "sie", "nach", "wird", "bei", "einer", "um", "am", "sind", "noch", "wie", "einem", "über", "einen", "so", "zum", "war", "haben", "nur", "oder", "aber", "vor", "zur", "bis", "mehr", "durch", "man", "sein", "wurde", "sei", "prozent", "hatte", "kann", "gegen", "vom", "können", "schon", "wenn", "habe", "seine", "mark", "ihre", "dann", "unter", "wir", "soll", "ich", "eines", "jahr", "zwei", "diese", "dieser", "wieder", "keine", "seiner", "worden", "will", "zwischen", "immer", "was", "sagte"]
	};
	if (language) {
		const isSupported = Object.keys(commonWords).includes(language);
		if (!isSupported) throw Error("Language not found.");
		return commonWords[language].includes(word);
	}
	return commonWords[ENGLISH].includes(word);
}