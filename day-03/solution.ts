const input = (await Deno.readTextFile("day-03/input.txt")).trim();

interface Part {
  index: number;
  row: number;
  id: string;
}

interface Symbol {
  ch: string;
  row: number;
  col: number;
}

const PART_RE = /[0-9]+/;
const SYMBOL_RE = /[^0-9.]/;

function sliceWindow<T>(arr: Array<T>, _start: number, _end: number) {
  const start = Math.max(_start, 0);
  const end = Math.min(_end + 1, arr.length);

  return arr.slice(start, end).map((el, i) => ({ i: start + i, el }));
}

function parseParts(linesArr: string[]) {
  return linesArr.flatMap((line, row) =>
    Array.from(line.matchAll(new RegExp(PART_RE, "g"))).map((match) => ({
      row,
      id: match[0],
      index: match.index!,
    }))
  );
}

function findSymbols(linesArr: string[], part: Part, re = SYMBOL_RE) {
  return sliceWindow(linesArr, part.row - 1, part.row + 1).flatMap(
    ({ el: line, i: row }) =>
      sliceWindow(line.split(""), part.index - 1, part.index + part.id.length)
        .map(({ el, i: col }) => ({
          ch: el,
          row,
          col,
        }))
        .filter(({ ch }) => re.test(ch))
  );
}

export function part1() {
  const lines = input.split("\n");

  return parseParts(lines)
    .filter((part) => findSymbols(lines, part).length)
    .reduce((sum, part) => sum + Number(part.id), 0);
}

export function part2() {
  const lines = input.split("\n");

  return Object.values(
    parseParts(lines).reduce<Record<string, Part[]>>((gearDict, part) => {
      for (const { row, col } of findSymbols(lines, part, /\*/)) {
        const coords = `${row},${col}`;
        if (!gearDict[coords]) gearDict[coords] = [];
        gearDict[coords].push(part);
      }

      return gearDict;
    }, {})
  )
    .filter((g) => g.length === 2)
    .map((g) => Number(g[0].id) * Number(g[1].id))
    .reduce((a, b) => a + b);
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
