type FuncType = (size?: number, ext?: string) => string;

const characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Makes a random filename with the given size and extension values
 * @param size Size of the created name in characters. Defaults to 10.
 * @param ext File extension (optional).
 * @returns The randomly created filename.
 */

export const makeFilename: FuncType = (size = 10, ext) => {
  let name = "";

  for (let i = 0; i < size; i += 1) {
    const position = Math.floor(Math.random() * 1000000) % characters.length;

    name += characters.charAt(position);
  }

  return `${name}${ext ? `.${ext}` : ""}`;
};
