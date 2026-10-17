import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const questions = JSON.parse(await readFile(new URL('../db/seeds/oops-questions.json', import.meta.url), 'utf8'));
const outputs = {
  'A1-081': '', 'A1-087': '1', 'A1-089': '', 'A1-090': '0', 'A1-097': '5', 'A1-098': 'fun() fun() const',
  'A2-009': 'Derived', 'A2-017': '0 5', 'A2-024': '1 2 3', 'A2-026': '1 2 3 4', 'A2-027': '0 5',
  'A2-029': 'Inside Q', 'A2-030': "Derived's destructor Base2's destructor Base1's destructor", 'A2-032': 'c',
  'A2-035': '9', 'A2-037': 'In Derived In Derived', 'A2-041': 'C::fun()', 'A2-042': 'In Base',
  'A2-049': 'Base Constructor Derived Constructor Derived Destructor Base Destructor', 'A2-050': '5',
  'A2-052': '14 14', 'A2-053': '1 2 1 1', 'A2-054': 'Value of global x is 0 Value of local x is 10',
  'A2-056': 'hello!3', 'A2-057': '4', 'A2-058': '50$60', 'A2-059': '120', 'A2-064': '11 label x',
  'A2-065': 'Inside Switch case 1 Inside Switch case 2',
};
const errors = new Set(['A2-002', 'A2-018', 'A2-025', 'A2-031', 'A2-034', 'A2-039', 'A2-040', 'A2-051', 'A2-060', 'A2-061', 'A2-100']);
// Never execute undefined behaviour, nonterminating loops or machine-model questions.
const syntaxOnly = new Set(['A1-085', 'A2-003', 'A2-005', 'A2-019', 'A2-020', 'A2-055', 'A2-062', 'A2-063', 'A2-088']);
const directory = await mkdtemp(join(tmpdir(), 'oops-questions-'));
const run = (command, args) => spawnSync(command, args, { cwd: directory, encoding: 'utf8', timeout: 15000 });
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
let checked = 0;
try {
  for (const question of questions.filter((q) => q.code)) {
    const id = question.id.slice(4), java = id === 'A2-100';
    if (!(id in outputs) && !errors.has(id) && !syntaxOnly.has(id)) throw new Error(`Unclassified code: ${id}`);
    const path = join(directory, java ? 'Counter.java' : 'question.cpp');
    await writeFile(path, (id === 'A2-088' ? 'class X {}; class Y {};\n' : '') + question.code);
    const compile = run(java ? 'javac' : 'clang++', java ? ['--release', '17', path] : ['-std=c++17', '-pedantic-errors', ...(syntaxOnly.has(id) ? ['-fsyntax-only'] : []), path, ...(!syntaxOnly.has(id) ? ['-o', join(directory, 'program')] : [])]);
    if (compile.error || (errors.has(id) ? compile.status === 0 : compile.status !== 0)) throw new Error(`${id}: unexpected compiler result\n${compile.stderr}`);
    if (id in outputs) {
      const result = run(join(directory, 'program'), []);
      if (result.error || result.status !== (id === 'A2-064' ? 1 : 0) || normalize(result.stdout) !== outputs[id]) throw new Error(`${id}: expected ${outputs[id]}, received ${result.stdout}\n${result.stderr}`);
    }
    checked++;
  }
} finally { await rm(directory, { recursive: true, force: true }); }
console.log(`${checked} assignment code blocks checked: ${Object.keys(outputs).length} output checks, ${errors.size} expected errors, ${syntaxOnly.size} syntax-only checks.`);
