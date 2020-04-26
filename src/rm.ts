import execa from 'execa';
import path from 'path';
import pkgDir from 'pkg-dir';

export default async function rm(args: string[] = []) {
  let command = 'rm';
  if (process.platform === 'win32') {
    const shxPath =
      (await pkgDir(require.resolve('shx/lib/shx'))) ||
      path.resolve(__dirname, '../node_modules/shx');
    args = [path.resolve(shxPath, 'lib', `${command}.js`), ...args];
    command = 'node';
  }
  const ps = execa(command, args, { stdio: 'inherit' });
  try {
    return await ps;
  } catch (err) {
    if (err.exitCode) return process.exit(err.exitCode);
    throw err;
  }
}

if (require.main === module) {
  rm(process.argv.slice(2, process.argv.length)).catch(console.error);
}
