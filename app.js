'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });

// key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();

rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {

    // 連想配列prefec^(県)からデータ取得。
    let value = prefectureDataMap.get(prefecture);
    //valueの値がFalsyの場合（県のデータを初めて処理する場合はundefinedになる=条件を満たす)
    if (!value) {
      // valueに初期値となるオブジェクトを代入(3つのプロパティを用意)
      value = {
        // 10年人口
        popu10: 0,
        // 15年人口
        popu15: 0,
        // 人口の変化率
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);

  }
});

rl.on('close', () => {
  for (const [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });

  // map関数（連想配列のMapとは別)
  // Arrayの要素それぞれを、与えられた関数を適用した内容に変換するというもの
  const rankingStrings = rankingArray.map(([key, value]) => {
    return (
      key +
      ': ' +
      value.popu10 +
      '=>' +
      value.popu15 +
      ' 変化率:' +
      value.change
    );
  });
  console.log(rankingStrings);
});