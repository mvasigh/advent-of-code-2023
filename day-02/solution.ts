const input = (await Deno.readTextFile("day-02/input.txt")).trim();

const GAME_RE = /Game (?<id>[0-9]+): (?<subsets>.+)/;
const SUBSET_RE = /(?<count>[0-9]+) (?<color>\w+)/g;

function parseGame(gameLog: string) {
  const { id, subsets } = GAME_RE.exec(gameLog)?.groups!;

  return {
    id: Number(id!),
    subsets: subsets.split(";").map((s) =>
      [...s.matchAll(SUBSET_RE)].reduce(
        (dict, { groups }) => ({
          ...dict,
          [groups?.color!]: Number(groups?.count!),
        }),
        {
          red: 0,
          green: 0,
          blue: 0,
        }
      )
    ),
  };
}

export function part1() {
  const max: Record<string, number> = {
    red: 12,
    green: 13,
    blue: 14,
  };

  return input
    .split("\n")
    .map(parseGame)
    .filter((g) =>
      g.subsets.every((s) =>
        Object.entries(s).every(([color, count]) => max[color] >= count)
      )
    )
    .reduce((sum, game) => (sum += game.id), 0);
}

export function part2() {
  return input
    .split("\n")
    .map(parseGame)
    .reduce((sum, game) => {
      const min = game.subsets.reduce((a, b) => ({
        red: Math.max(a.red, b.red),
        green: Math.max(a.green, b.green),
        blue: Math.max(a.blue, b.blue),
      }));

      return sum + min.red * min.green * min.blue;
    }, 0);
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
