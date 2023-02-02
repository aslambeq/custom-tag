const { spawn } = require('child_process')

const tagHotfix = () => {
  console.log('POPAL')
  const cmd = spawn('git', ['tag', '-l'], { shell: true })

  cmd.stdout.on('data', (data) => {
    console.log('🚀 ~ cmd.stdout.on ~ data', data.toString().split('\n'));
  })

  cmd.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}

tagHotfix()
