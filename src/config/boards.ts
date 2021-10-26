export const supportedBoards = <const>["arduino:avr:uno", "arduino:avr:nano"];

export type SupportedBoard = typeof supportedBoards[number];
