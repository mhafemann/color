/**
 * This module provides functionality to enable or disable colored output in the console.
 * It supports various color codes and background colors, as well as modifiers like bold, dim, etc.
 *
 * @module colors
 */

const p = process || {},
  argv = p.argv || [],
  env = p.env || {};

/**
 * Determines if color support is enabled based on environment variables and command-line arguments.
 */
const isColorSupported =
  !(!!env.NO_COLOR || argv.includes("--no-color")) &&
  (!!env.FORCE_COLOR ||
    argv.includes("--color") ||
    p.platform === "win32" ||
    ((p.stdout || {}).isTTY && env.TERM !== "dumb") ||
    !!env.CI);

/**
 * Creates a formatter function that applies ANSI escape codes for formatting text.
 *
 * @param {string | any[]} open - The opening ANSI escape code or array of codes.
 * @param {string} close - The closing ANSI escape code.
 * @param {any} [replace=open] - Optional replacement string to apply instead of the close code.
 * @returns {(input: string) => string} A function that formats the input text with the specified colors.
 */
const formatter =
  (
    open: string | any[],
    close: string,
    replace = open
  ): ((input: string) => string) =>
  (input: string): string => {
    let string = "" + input,
      index = string.indexOf(close, open.length);
    return ~index
      ? open + replaceClose(string, close, replace, index) + close
      : open + string + close;
  };

/**
 * Helper function to replace closing ANSI escape codes with a replacement string.
 *
 * @param {string} string - The input string containing the ANSI escape codes.
 * @param {any} close - The closing ANSI escape code.
 * @param {any} replace - The replacement string or array of replacements.
 * @param {number} index - The starting index of the closing ANSI escape code in the input string.
 * @returns {string} The modified string with replaced closing ANSI escape codes.
 */
const replaceClose = (
  string: string,
  close: any,
  replace: any,
  index: number
): string => {
  let result = "",
    cursor = 0;
  do {
    result += string.substring(cursor, index) + replace;
    cursor = index + close.length;
    index = string.indexOf(close, cursor);
  } while (~index);
  return result + string.substring(cursor);
};

/**
 * Creates an object containing functions for formatting text with various colors and modifiers.
 *
 * @param {boolean} [enabled=true] - Whether color output should be enabled.
 * @returns {ColorFunctions} An object with functions for formatting text.
 */
const createColors = (enabled: boolean = isColorSupported): ColorFunctions => {
  const f = enabled ? formatter : () => String;
  return {
    isColorSupported: enabled,
    reset: f("\x1b[0m", "\x1b[0m"),
    bold: f("\x1b[1m", "\x1b[22m", "\x1b[22m\x1b[1m"),
    dim: f("\x1b[2m", "\x1b[22m", "\x1b[22m\x1b[2m"),
    italic: f("\x1b[3m", "\x1b[23m"),
    underline: f("\x1b[4m", "\x1b[24m"),
    inverse: f("\x1b[7m", "\x1b[27m"),
    hidden: f("\x1b[8m", "\x1b[28m"),
    strikethrough: f("\x1b[9m", "\x1b[29m"),
    black: f("\x1b[30m", "\x1b[39m"),
    red: f("\x1b[31m", "\x1b[39m"),
    green: f("\x1b[32m", "\x1b[39m"),
    yellow: f("\x1b[33m", "\x1b[39m"),
    blue: f("\x1b[34m", "\x1b[39m"),
    magenta: f("\x1b[35m", "\x1b[39m"),
    cyan: f("\x1b[36m", "\x1b[39m"),
    white: f("\x1b[37m", "\x1b[39m"),
    gray: f("\x1b[90m", "\x1b[39m"),
    bgBlack: f("\x1b[40m", "\x1b[49m"),
    bgRed: f("\x1b[41m", "\x1b[49m"),
    bgGreen: f("\x1b[42m", "\x1b[49m"),
    bgYellow: f("\x1b[43m", "\x1b[49m"),
    bgBlue: f("\x1b[44m", "\x1b[49m"),
    bgMagenta: f("\x1b[45m", "\x1b[49m"),
    bgCyan: f("\x1b[46m", "\x1b[49m"),
    bgWhite: f("\x1b[47m", "\x1b[49m"),
    blackBright: f("\x1b[90m", "\x1b[39m"),
    redBright: f("\x1b[91m", "\x1b[39m"),
    greenBright: f("\x1b[92m", "\x1b[39m"),
    yellowBright: f("\x1b[93m", "\x1b[39m"),
    blueBright: f("\x1b[94m", "\x1b[39m"),
    magentaBright: f("\x1b[95m", "\x1b[39m"),
    cyanBright: f("\x1b[96m", "\x1b[39m"),
    whiteBright: f("\x1b[97m", "\x1b[39m"),
    bgBlackBright: f("\x1b[100m", "\x1b[49m"),
    bgRedBright: f("\x1b[101m", "\x1b[49m"),
    bgGreenBright: f("\x1b[102m", "\x1b[49m"),
    bgYellowBright: f("\x1b[103m", "\x1b[49m"),
    bgBlueBright: f("\x1b[104m", "\x1b[49m"),
    bgMagentaBright: f("\x1b[105m", "\x1b[49m"),
    bgCyanBright: f("\x1b[106m", "\x1b[49m"),
    bgWhiteBright: f("\x1b[107m", "\x1b[49m"),
  };
};

/**
 * A type alias for the object returned by `createColors`.
 */
type ColorFunctions = {
  isColorSupported: boolean;
  reset: (input: string) => string;
  bold: (input: string) => string;
  dim: (input: string) => string;
  italic: (input: string) => string;
  underline: (input: string) => string;
  inverse: (input: string) => string;
  hidden: (input: string) => string;
  strikethrough: (input: string) => string;
  black: (input: string) => string;
  red: (input: string) => string;
  green: (input: string) => string;
  yellow: (input: string) => string;
  blue: (input: string) => string;
  magenta: (input: string) => string;
  cyan: (input: string) => string;
  white: (input: string) => string;
  gray: (input: string) => string;
  bgBlack: (input: string) => string;
  bgRed: (input: string) => string;
  bgGreen: (input: string) => string;
  bgYellow: (input: string) => string;
  bgBlue: (input: string) => string;
  bgMagenta: (input: string) => string;
  bgCyan: (input: string) => string;
  bgWhite: (input: string) => string;
  blackBright: (input: string) => string;
  redBright: (input: string) => string;
  greenBright: (input: string) => string;
  yellowBright: (input: string) => string;
  blueBright: (input: string) => string;
  magentaBright: (input: string) => string;
  cyanBright: (input: string) => string;
  whiteBright: (input: string) => string;
  bgBlackBright: (input: string) => string;
  bgRedBright: (input: string) => string;
  bgGreenBright: (input: string) => string;
  bgYellowBright: (input: string) => string;
  bgBlueBright: (input: string) => string;
  bgMagentaBright: (input: string) => string;
  bgCyanBright: (input: string) => string;
  bgWhiteBright: (input: string) => string;
};

export const {
  reset,
  bold,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  blackBright,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bgBlackBright,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
} = createColors();
