import * as fs from "fs/promises";
import * as path from "path";
import { promisify } from "util";
import { exec as exec_ } from "child_process";

import { SupportedBoard } from "../config/boards";
import { makeFilename } from "../util/makeFilename";

interface IParams {
  board_fqbn: SupportedBoard;
  code: string;
  filename: string;
}

interface IPaths {
  folder: IFolderPaths;
  filename: IFilenamePaths;
}

interface IFolderPaths {
  source: string;
  build: string;
  cache: string;
}

interface IFilenamePaths {
  source: string;
  compiled: string;
}

const exec = promisify(exec_);

export class CompileCodeService {
  public static async execute(params: IParams) {
    const { board_fqbn, code } = params;

    const filename = makeFilename(10);
    const paths = CompileCodeService.getCompilationPaths(board_fqbn, filename);

    await fs.mkdir(paths.folder.source, { recursive: true });
    await fs.writeFile(paths.filename.source, code);

    const buildCommand = CompileCodeService.makeBuildComand(board_fqbn, paths);
    const { stdout: compiler_message } = await exec(`${buildCommand}`);

    const build_file = await fs.readFile(paths.filename.compiled);

    await fs.rm(paths.folder.source, { recursive: true, force: true });

    return { board_fqbn, compiler_message, build_file };
  }

  private static makeBuildComand = (
    boardFqbn: SupportedBoard,
    paths: IPaths
  ) => {
    const args = [
      "arduino-cli compile",
      `--fqbn ${boardFqbn}`,
      `--build-path ${paths.folder.build}`,
      `--build-cache-path ${paths.folder.cache}`,
      paths.folder.source,
    ];

    return args.join(" ");
  };

  private static getTempFolder = (...args: string[]) =>
    path.resolve(process.cwd(), "tmp", ...args);

  private static getCompilationPaths = (
    boardFqbn: SupportedBoard,
    filename: string
  ): IPaths => {
    const sourceFolder = CompileCodeService.getTempFolder("compiled", filename);
    const buildFolder = path.resolve(sourceFolder, "build");
    const cacheFolder = CompileCodeService.getTempFolder(
      "cache",
      boardFqbn.replace(/:/g, "_")
    );

    const sourceFilename = path.resolve(sourceFolder, `${filename}.ino`);
    const compiledFilename = path.resolve(buildFolder, `${filename}.ino.hex`);

    return {
      folder: {
        source: sourceFolder,
        build: buildFolder,
        cache: cacheFolder,
      },
      filename: {
        source: sourceFilename,
        compiled: compiledFilename,
      },
    };
  };
}
