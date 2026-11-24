// Records index.html as a video, frame by frame:
//
//   node videos/tags-to-speech/record.mjs
//
// The page is opened at 1920 x 1080 with ?record (no controls). For every frame the timeline is set with the page's
// own seek(ms) and a screenshot is piped to ffmpeg, so the result does not depend on how fast this machine draws.
// Needs ffmpeg on PATH and Playwright; this repository has no Playwright, so it is taken from PLAYWRIGHT_FROM, a
// folder whose node_modules has it (default: the typfolio checkout beside this repository).
// Output: videos/tags-to-speech/out/tags-to-speech.mp4, with no sound. Where voice/NN.wav files exist (NN is the
// narration line, 01 to 14), a second file, tags-to-speech-voice.mp4, has each one starting 0.3 seconds into its step.
import { spawn } from 'node:child_process';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const from = process.env.PLAYWRIGHT_FROM ?? fileURLToPath(new URL('../../../typfolio/', import.meta.url));
const { chromium } = createRequire(`${from}/package.json`)('playwright');
const fps = 30;
/** Seconds the last frame is held after the timeline ends. */
const hold = 1.5;
mkdirSync(`${here}out`, { recursive: true });
const output = `${here}out/tags-to-speech.mp4`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`${pathToFileURL(`${here}index.html`)}?record`);
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.duration);
const steps = await page.evaluate(() => window.steps);

const ffmpeg = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((resolve, reject) => ffmpeg.on('exit', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`)))));
const write = buffer => new Promise(resolve => (ffmpeg.stdin.write(buffer) ? resolve() : ffmpeg.stdin.once('drain', resolve)));

const frames = Math.round((duration / 1000) * fps);
let last;
for (let frame = 0; frame <= frames; frame += 1) {
  await page.evaluate(ms => { window.seek(ms); return new Promise(next => requestAnimationFrame(() => requestAnimationFrame(next))); }, (frame / fps) * 1000);
  last = await page.screenshot({ type: 'png' });
  await write(last);
  if (frame % 150 === 0) process.stdout.write(`${Math.round((frame / frames) * 100)}%\n`);
}
for (let extra = 0; extra < hold * fps; extra += 1) await write(last);
ffmpeg.stdin.end();
await done;
await browser.close();
process.stdout.write(`${output}\n`);

const lines = steps.map((start, index) => ({ file: `${here}voice/${String(index + 1).padStart(2, '0')}.wav`, at: start + 300 })).filter(line => existsSync(line.file));
if (lines.length > 0) {
  const voiced = `${here}out/tags-to-speech-voice.mp4`;
  const filter = `${lines.map((line, index) => `[${index + 1}:a]adelay=${line.at}:all=1[a${index}]`).join(';')};${lines.map((_, index) => `[a${index}]`).join('')}amix=inputs=${lines.length}:normalize=0,apad[mix]`;
  const mixed = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', output, ...lines.flatMap(line => ['-i', line.file]), '-filter_complex', filter,
    '-map', '0:v', '-map', '[mix]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', voiced], { stdio: 'inherit' });
  if (mixed.status !== 0) throw new Error('ffmpeg could not add the voice');
  process.stdout.write(`${voiced} (${lines.length} of ${steps.length} lines have a voice)\n`);
}
