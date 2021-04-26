import { TUGAS } from './const';

export const getKeyword = str => {
    str = str.toLowerCase();
    if (str.includes(TUGAS.KUIS.toLowerCase())) {
        return TUGAS.KUIS;
    } else if (str.includes(TUGAS.UJIAN.toLowerCase)) {
        return TUGAS.UJIAN;
    } else if (str.includes(TUGAS.TUCIL.toLowerCase)) {
        return TUGAS.TUCIL;
    } else if (str.includes(TUGAS.TUBES.toLowerCase)) {
        return TUGAS.TUBES;
    } else if (str.includes(TUGAS.PRAKTIKUM.toLowerCase)) {
        return TUGAS.PRAKTIKUM;
    } else if (str.includes(TUGAS.PR.toLowerCase)) {
        return TUGAS.PR;
    } else {
        return false;
    }
};

export const getDate = str => {
    let separator = '[-/ .]';
    let YYYY = '(?<year>[0-9][0-9][0-9][0-9])';
    let MM = '(?<month>[0-1][0-9])';
    let DD = '(?<date>[0-3][0-9])';
    let pattern1 = `${YYYY}${separator}${MM}${separator}${DD}`; //untuk pattern yyyy-mm-dd
    let pattern2 = `${DD}${separator}${MM}${separator}${YYYY}`; //untuk pattern dd-mm-yyyy

    let res = str.match(pattern1) || str.match(pattern2);
    if (res) {
        //kalau bentuknya udah yyyy-mm-dd atau dd-mm-yyyy
        let { year, month, date } = res.groups;
        return new Date(`${date}-${month}-${year}`);
    }
    return null;
};

export const getKodeMatkul = str => {
    let pattern = '[A-Z][A-Z][0-9][0-9][0-9][0-9]';
    let res = str.match(pattern);
    if (res) {
        return str;
    }
    return null;
};

export const getID = str => {
    //id 1 digit
    let pattern = '[Ii][Dd][ -:][0-9]';
    let res = str.match(pattern);
    if (res) {
        return str;
    }
    return null;
};