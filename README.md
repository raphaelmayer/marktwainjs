# marktwain.js
(for lack of a better name)

Analyse strings and get various stats like word count, word frequency and more.

---

#### analyseText(string, options)
 * @param {string} string text to analyse
 * @param {Options} options optional options
 * @returns {Analysis} Analysis object containing various stats about the supplied text
 * @throws {Error} If no string is provided.
 
 
#### @typedef {Object} Options
 * @property {boolean} ignoreNumbers filter out numbers (default: false)
 * @property {boolean} ignoreCommonWords ignore common words (default: false)
 * @property {number} minLength minimum characters per word (default: 0)
 * @property {string} language used for common words (default: ENGLISH)


#### @typedef {Object} Analysis
 * @property {Array<Word>} words list of word objects
 * @property {number} total_word_count the total number of words
 * @property {number} unique_word_count the number of unique words
 * @property {number} average_word_length average number of characters per word
 * @property {number} character_count number of characters excluding whitespace
 * @property {number} sentence_count the number of sentences
 * @property {number} average_sentence_length average number of words per sentence
 

#### @typedef {Object} Word
 * @property {string} word the word itself in lowercase
 * @property {number} count number of occurences
 * @property {number} percentage occurence percentage
