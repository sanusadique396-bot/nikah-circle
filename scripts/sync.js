import { execSync } from 'child_process';
import path from 'path';

const gitPath = path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Git', 'cmd');
process.env.PATH = `${gitPath};${process.env.PATH}`;

function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
  } catch (error) {
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    throw error;
  }
}

try {
  console.log('🔄 Checking git status...');
  const status = run('git status --porcelain');

  if (!status.trim()) {
    console.log('✅ No local changes to commit.');
  } else {
    console.log('📦 Staging changes...');
    run('git add -A');

    const msg = process.argv.slice(2).join(' ') || `update: ${new Date().toISOString()}`;
    console.log(`📝 Committing with message: "${msg}"...`);
    run(`git commit -m "${msg}"`);
  }

  console.log('🚀 Pushing to GitHub (origin main)...');
  const pushOutput = run('git push origin main');
  console.log(pushOutput);
  console.log('🎉 Successfully pushed to GitHub!');
  console.log('⚡ GitHub Actions deployment triggered automatically.');
} catch (err) {
  console.error('❌ Sync failed:', err.message);
  process.exit(1);
}
