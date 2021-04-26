//contoh pemakaian boyermoore("I love dog and hot dogs","dog")
//akan mengembalikan [7, 19] yang menyatakan index huruf pertama ditemukannya "dog"

const boyermoore = (str, target, isCaseSensitive = false) => {
    if (!isCaseSensitive) {
        str = str.toLowerCase();
        target = target.toLowerCase();
    }

    const BMT = generateBadMatchTable(target);
    const countTarget = target.length;
    const countStr = str.length;

    if (countTarget > countStr) return null;

    let i = countTarget - 1;
    let j;

    let res = [];

    while (i < countStr) {
        j = 0;
        while (target[countTarget - j - 1] == str[i - j]) {
            j++;
            //if found
            if (j == countTarget) {
                // res.push({ res: target, idx: i - j + 1 });
                res.push(i - j + 1);
            }
        }
        i += BMT[str[i - j]] || countTarget;
    }

    return res;
};

const generateBadMatchTable = pattern => {
    const n = pattern.length;
    let res = {};
    for (let i = 0; i < n; i++) {
        res[pattern[i]] = max(1, n - i - 1);
    }
    return res;
};

const max = (a, b) => (a > b ? a : b);

export default boyermoore;
