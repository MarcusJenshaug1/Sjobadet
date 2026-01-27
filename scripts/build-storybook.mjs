import { spawn } from 'node:child_process'

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
