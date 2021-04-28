//contoh pemakaian KMP("bambang","ba")
//akan mengembalikan [0,3] yang menyatakan index huruf pertama ditemukannya "ba"

const KMP = (str, pattern, isCaseSensitive = false) => {
    if (!isCaseSensitive) {
        str = str.toLowerCase();
        pattern = pattern.toLowerCase();
    }

    const helper = generateHelper(pattern);
    const n = str.length;

    let j = 0;
    let res = [];
    for (let i = 0; i < n; i++) {
        if (str[i] == pattern[j]) {
            j++;
            if (j >= pattern.length) {
                res.push(i - (pattern.length - 1));
                j = 0;
            }
        } else {
            j = helper[j];
            if (str[i] !== pattern[j]) {
                j = 0;
            }
        }
    }

    return res;
};

const generateHelper = pattern => {
    const n = pattern.length;
    let helper = new Array(n);

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
