//contoh pemakaian KMP("bambang","ba")
//akan mengembalikan [0,3] yang menyatakan index huruf pertama ditemukannya "ba"

const KMP = (str, pattern, isCaseSensitive = false) => {
    if (!isCaseSensitive) {
        str = str.toLowerCase();
        pattern = pattern.toLowerCase();
    }

    const helper = generateHelper(pattern);
    const n = str.length;
    const res = [];

    let i = 0;
    let j = 0;
    while (i < n) {
        if (str[i] == pattern[j]) {
            j++;
        } else {
            if (j != 0) {
                j = helper[j - 1];
                continue;
            }
        }

        if (j == pattern.length) {
            res.push(i - j + 1);
            j = helper[j - 1];
        }

        i++;
    }

    return res;
};

const generateHelper = pattern => {
    const n = pattern.length;
    const helper = new Array(n);

    let i = 1;
    let j = 0;
    helper[0] = 0;

    while (i < n) {
        if (pattern[i] == pattern[j]) {
            helper[i] = ++j;
        } else {
            if (j - 1 >= 0) {
                j = helper[j - 1];
                continue;
            } else {
                helper[i] = 0;
            }
        }
        i++;
    }

    return helper;
};

export default KMP;
