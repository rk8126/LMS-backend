export namespace CommonUtils {
  /**
   *  This function returns normalised text that just removes special characters
   * @param text
   * @returns  text like "hello world!" -> "hello world"
   */
  export function normalizeTextWithoutCharacters(text: string): string {
    return text
      .replace(/[^\w\s]|_/g, ' ') // Remove special characters except space
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
}
