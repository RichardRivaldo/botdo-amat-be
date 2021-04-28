import { TUGAS } from './const';
import boyermoore from './boyermoore';

export const getKeyword = str => {
    str = str.toLowerCase();

    if (str.includes(TUGAS.KUIS.toLowerCase())) return TUGAS.KUIS;
    else if (str.includes(TUGAS.UJIAN.toLowerCase())) return TUGAS.UJIAN;
    else if (str.includes(TUGAS.TUCIL.toLowerCase())) return TUGAS.TUCIL;
    else if (str.includes(TUGAS.TUBES.toLowerCase())) return TUGAS.TUBES;
    else if (str.includes(TUGAS.PRAKTIKUM.toLowerCase())) return TUGAS.PRAKTIKUM;
    else if (str.includes(TUGAS.PR.toLowerCase())) return TUGAS.PR;
    else return '';
};

export const getDate = str => {
    let separator = '[-/ .]';
    let YYYY = '(?<year>[0-9][0-9][0-9][0-9])';
    let MM = '(?<month>[0-1][0-9])';
    let DD = '(?<date>[0-3][0-9])';
    let pattern1 = `${YYYY}${separator}${MM}${separator}${DD}`; //untuk pattern yyyy-mm-dd
    let pattern2 = `${DD}${separator}${MM}${separator}${YYYY}`; //untuk pattern dd-mm-yyyy

    let res = str.match(pattern1) || str.match(pattern2);

    return res && res.length ? res : false;
};

export const get2Date = str => {
    const date1 = getDate(str);
    if (date1) {
        str = str.replace(date1[0], '');
        const date2 = getDate(str);
        return date1 && date2 ? { date1: normalizeDate(date1), date2: normalizeDate(date2) } : false;
    }
    return false;
};

export const getNDate = str => {
    let n = getNumber(str);

    if (!n) return false;

    let date1 = new Date();
    date1 = new Date(date1.setUTCHours(0, 0, 0, 0));
    let date2 = new Date();

    let curDate = date1.getDate();

    if (boyermoore(str, 'hari').length) date2 = date2.setDate(curDate + n * 1);
    else if (boyermoore(str, 'minggu').length) date2 = date2.setDate(curDate + n * 7);
    else return false;

    date2 = new Date(date2);
    date2 = new Date(date2.setUTCHours(23, 59, 59, 999));

    return { date1, date2 };
};

export const normalizeDate = str => {
    str = str.groups;
    str = new Date(`${str.year}-${str.month}-${str.date}`);

    return str;
};

export const getKodeMatkul = str => {
    let pattern = /[A-Z][A-Z][0-9][0-9][0-9][0-9]/;
    let res = str.match(pattern);

    return res;
};

export const getID = str => {
    let pattern = '[I|i][D|d][ -:][0-9]+';
    let res = str.match(pattern);

    return res ? res[0].replace(/id[ -:]/, '') : null;
};

export const getNumber = str => {
    let pattern = '[0-9]';
    let res = str.match(pattern);

    return res && res.length ? res : false;
};
