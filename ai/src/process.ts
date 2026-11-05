import {spawn, ChildProcessWithoutNullStreams, SpawnOptions} from 'node:child_process';

export function isWindowsCommandShim(
  executable: string,
  platform: NodeJS.Platform = process.platform,
): boolean {
  return platform === 'win32' && /\.(?:cmd|bat)$/i.test(executable);
}

export function spawnCommand(
  executable: string,
  args: string[],
  options: SpawnOptions,
  platform: NodeJS.Platform = process.platform,
): ChildProcessWithoutNullStreams {
  return spawn(executable, args, {
    ...options,
    ...(isWindowsCommandShim(executable, platform) ? {shell: true} : {}),
  }) as ChildProcessWithoutNullStreams;
}
