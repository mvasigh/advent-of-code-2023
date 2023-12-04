const input = (await Deno.readTextFile("day-04/input.txt")).trim();

const CARD_RE = /Card\s+(?<id>[0-9]+): (?<winning>.+) \| (?<drawn>.+)/;

function range(start: number, count: number) {
  return Array.apply(0, Array(Math.max(count, 0))).map(
    (_, index) => index + start
  );
}

function extractNums(str: string) {
  return Array.from(str.matchAll(/\d+/g)).map((m) => Number(m[0]));
}

function parseCard(card: string) {
  const { id, winning, drawn } = card.match(CARD_RE)?.groups!;
  return {
    id: Number(id),
    winning: new Set(extractNums(winning)),
    drawn: extractNums(drawn),
  };
}

export function part1() {
  return input
    .split("\n")
    .map(parseCard)
    .reduce(
      (sum, card) =>
        sum +
        card.drawn
          .filter((num) => card.winning.has(num))
          .reduce((score) => (score ? score * 2 : 1), 0),
      0
    );
}

export function part2() {
  const cardDict = Object.fromEntries(
    input.split("\n").map((card, i) => [i + 1, parseCard(card)])
  );
  const cache: Record<string, (typeof cardDict)[string][]> = {};

  function calcWinnings(id: number) {
    if (!cardDict[id]) return [];
    if (!cache[id]) {
      const card = cardDict[id];
      const matches = card.drawn.filter((num) => card.winning.has(num));
      cache[id] = range(id + 1, matches.length)
        .map((n) => cardDict[n])
        .filter((v) => !!v);
    }

    return cache[id];
  }

  const cards = Object.values(cardDict);
  let i = 0;
  while (i < cards.length) {
    cards.push(...calcWinnings(cards[i].id));
    i++;
  }

  return i;
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
