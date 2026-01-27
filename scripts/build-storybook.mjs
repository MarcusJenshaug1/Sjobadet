import { spawn } from 'node:child_process'

const shouldSkip = process.env.SKIP_STORYBOOK === '1'
if (shouldSkip) {
  console.log('[build-storybook] Skipping Storybook build (SKIP_STORYBOOK=1).')
  process.exit(0)
}

const child = spawn('npx', ['storybook', 'build', '-o', 'public/storybook'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    STORYBOOK_DISABLE_STATIC_DIRS: 'true',
  },
})

child.on('exit', (code) => {
  process.exit(code ?? 1)
})
