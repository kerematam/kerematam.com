/**
 * Shiki transformer that keeps code comments readable.
 *
 * The two code themes draw comments too faintly to pass WCAG AA (4.5:1):
 * min-light at 1.8:1 on white, night-owl at 3.9:1 on its dark background.
 * This swaps those two colours for ones that pass, and leaves every other
 * token alone.
 */
const REPLACEMENTS = [
  [/#C2C3C5/gi, "#6A737D"], // min-light comment on #ffffff: 1.8 -> 4.8
  [/#637777/gi, "#7F9494"], // night-owl comment on #011627: 3.9 -> 5.7
];

export const transformerReadableComments = () => ({
  span(node) {
    const style = node.properties?.style;
    if (typeof style !== "string") return;
    node.properties.style = REPLACEMENTS.reduce(
      (result, [from, to]) => result.replace(from, to),
      style
    );
  },
});
