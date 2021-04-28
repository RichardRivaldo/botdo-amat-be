const boyermoore = (str, pattern, isCaseSensitive = false) => {
    if (!isCaseSensitive) {
        str = str.toLowerCase();
        pattern = pattern.toLowerCase();
    }
    if (str.length < pattern.length) return null;

    const badMatchTable = generateBadMatchTable(pattern);
    const res = [];

    let i = 0;
    while (i < str.length) {
        let j = pattern.length - 1;
        while (j >= 0 && str[i + j] == pattern[j]) j--;
        if (j == -1) res.push(i);

        i += badMatchTable[i + pattern.length - 1] ? badMatchTable[i + pattern.length - 1] : pattern.length;
    }

    return res;
};

const generateBadMatchTable = pattern => {
    const helper = {};

    for (let i = 0; i < pattern.length; i++) {
        if (i == pattern.length - 1) {
            if (!helper[pattern[i]]) helper[pattern[i]] = pattern.length;
            else continue;
        }

        helper[pattern[i]] = Math.max(1, pattern.length - i - 1);
    }

    return helper;
};

console.log(boyermoore('apa saja saya suka', 'a'));
