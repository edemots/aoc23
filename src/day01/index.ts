import { cleanInput } from "./input";

const digitMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

export const part1 = () =>
  cleanInput(`${__dirname}/input.txt`)
    .map((line) => {
      const matches = line.match(/\d{1}/g);
      if (matches) {
        if (matches.length === 1) {
          return +(matches[0] + matches[0]);
        }
        return +((matches.shift() ?? "0") + (matches.pop() ?? "0"));
      }
      return 0;
    })
    .reduce((acc, curr) => curr + acc, 0);

export const part2 = () =>
  cleanInput(`${__dirname}/input.txt`)
    .map((line) => {
      const matches = Array.from(line.matchAll(
        /\d{1}|(?=(one))|(?=(two))|(?=(three))|(?=(four))|(?=(five))|(?=(six))|(?=(seven))|(?=(eight))|(?=(nine))/g
      )).flatMap(matches => matches.filter(Boolean))?.map(digit => Object.hasOwn(digitMap, digit) ? digitMap[digit as keyof typeof digitMap].toString() : digit);
      
      if (matches) {
        if (matches.length === 1) {
          return +(matches[0] + matches[0]);
        }
        return +((matches.shift() ?? "0") + (matches.pop() ?? "0"));
      }
      return 0;
    })
    .reduce((acc, curr) => curr + acc, 0);
