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

/** Phrases up to this many characters fit a 320px phone on one line. */
const SHORT_PHRASE = 28;

/**
 * Splits a short text into phrases, each ending at a comma or a full stop,
 * so it can wrap only between them:
 *
 *   "Software developer." "Currently at HelioCampus,"
 *   "previously at iyzico (a PayU company)," "Huawei and Airties."
 *
 * Show each phrase in a span that does not wrap. A phrase too long for a
 * small phone comes back `long`: let it wrap only on a screen too narrow to
 * hold it (the home page uses 26rem, enough for 40 characters). There it
 * breaks only after a short word such as "at", never inside a bracketed
 * aside ("previously at" / "iyzico (a PayU company),").
 */
export function phrases(text: string): { text: string; long: boolean }[] {
  return text.split(/(?<=[,.]) +/).map(phrase => {
    const long = phrase.length > SHORT_PHRASE;
    if (!long) return { text: phrase, long };
    return {
      long,
      text: phrase
        // A bracketed aside stays with the word before it.
        .replace(/\S+ \([^)]*\)/g, part => part.replaceAll(" ", " "))
        // A word of one or two letters stays with the word before it.
        .replace(/(\S) (\S{1,2})(?= |$)/g, "$1 $2"),
    };
  });
}
