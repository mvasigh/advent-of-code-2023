const input = (await Deno.readTextFile("day-01/input.txt")).trim();

function reverse(str: string) {
  return str.split("").reverse().join("");
}

export function part1() {
  return input
    .split("\n")
    .map((t) => t.replaceAll(/[a-zA-Z]/g, ""))
    .map((t) => Number(t[0] + t[t.length - 1]))
    .reduce((a, b) => a + b);
}

export function part2() {
  const digits = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const fwd_re = new RegExp(`(${digits.join("|")}|[0-9])`);
  const rev_re = new RegExp(
    `(${digits.map((t) => reverse(t)).join("|")}|[0-9])`
  );

  return input
    .split("\n")
    .map((t) => {
      const fwd = t.match(fwd_re)![0];
      const rev = reverse(t).match(rev_re)![0];
      const first = fwd.length > 1 ? 1 + digits.indexOf(fwd) : fwd;
      const last = rev.length > 1 ? 1 + digits.indexOf(reverse(rev)) : rev;

      return Number(first.toString() + last.toString());
    })
    .reduce((a, b) => a + b);
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
