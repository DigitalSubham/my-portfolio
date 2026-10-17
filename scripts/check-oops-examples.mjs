import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { examples } from '../src/content/oops/lessons.mjs';

const directory = await mkdtemp(join(tmpdir(), 'oops-examples-'));
const run = (command, args) => spawnSync(command, args, { cwd: directory, encoding: 'utf8', timeout: 10000 });
let failures = 0;
try {
  for (const example of examples) {
    const { language, source, output, error, id } = example;
    const filename = join(directory, language === 'java' ? 'Main.java' : `${id}.${({ c: 'c', cpp: 'cpp', python: 'py', javascript: 'js' })[language]}`);
    await writeFile(filename, source);
    let result;
    if (language === 'c' || language === 'cpp') {
      result = run(language === 'c' ? 'clang' : 'clang++', [`-std=${language === 'c' ? 'c17' : 'c++17'}`, '-pedantic-errors', filename, '-o', join(directory, id)]);
      if (result.status === 0 && !error) result = run(join(directory, id), []);
    } else if (language === 'java') {
      result = run('javac', ['--release', '17', filename]);
      if (result.status === 0 && !error) result = run('java', ['-cp', directory, 'Main']);
    } else result = run(language === 'python' ? 'python3' : 'node', [filename]);
    const passed = error ? result.status !== 0 && !result.error : result.status === 0 && result.stdout.trim() === output.trim();
    if (!passed) { failures++; console.error(id, language, { expected: output, actual: result.stdout, error: result.stderr || result.error }); }
  }
} finally { await rm(directory, { recursive: true, force: true }); }
console.log(`${examples.length - failures}/${examples.length} worked examples verified.`);
if (failures) process.exitCode = 1;
