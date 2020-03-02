const fs = require("fs");
const analyseText = require("./marktwain.js");

run_tests();

function run_tests() {
	fs.readFile("./1601.txt", (err, text) => {
        if (err) return console.log(err);
        text = text.toString();

        // tests
        test(analyseText(text), expected, "'analyseText no params'");
        test(analyseText(text, param2), expected2, "'analyseText, numbers flag'");
        test(analyseText(text, param3), expected3, "'analyseText, common words filter'");
        test(analyseText(text, param4), expected4, "'analyseText, min length'");
    })
}

function test(result, expected, description) {
    let hasErrors = 0;
    process.stdout.write(`\ntesting ${description} `);
    Object.keys(expected).forEach(key => {
        const ok = result[key] === expected[key];
        if (!ok) {
            ++hasErrors;
            hasErrors === 1 && console.log();
            console.log(`    ${key} ${ok} | Is ${result[key]} should be ${expected[key]}.`);
        }
    });
    if (!hasErrors) {
        process.stdout.write("true");
        return true;
    }
    return false;
}

const expected = { 
    total_word_count: 11597,
    unique_word_count: 3257,
    average_word_length: 4.575752349745624,
    character_count: 66202,
    sentence_count: 498,
    average_sentence_length: 23.28714859437751
}
const param2 = { ignoreNumbers: true }
const expected2 = {
    total_word_count: 11485,
    unique_word_count: 3207,
    average_word_length: 4.586504135829343,
    character_count: 65813,
    sentence_count: 498,
    average_sentence_length: 23.062248995983936 
};
const param3 = { ignoreCommonWords: true }
const expected3 = { 
    total_word_count: 6763,
    unique_word_count: 3158,
    average_word_length: 5.89782640839864,
    character_count: 66202,
    sentence_count: 498,
    average_sentence_length: 13.580321285140561 
}
const param4 = { minLength: 3 }
const expected4 = { 
    total_word_count: 8997,
    unique_word_count: 3174,
    average_word_length: 5.368233855729688,
    character_count: 66202,
    sentence_count: 498,
    average_sentence_length: 18.066265060240966 
}