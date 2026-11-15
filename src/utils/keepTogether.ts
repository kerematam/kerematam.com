/**
 * Decides where a short line of text may wrap, by turning some spaces into
 * non-breaking ones:
 *
 * - A bracketed aside stays with the word before it, so a line never breaks
 *   inside "iyzico (a PayU company)".
 * - The first word after a comma stays with the next word, so a line never
 *   ends on a lone "previously".
 */
export function keepTogether(text: string): string {
  return text
    .replace(/\S+ \([^)]*\)/g, part => part.replaceAll(" ", " "))
    .replace(/(, \S+) (?=\S)/g, "$1 ");
}
