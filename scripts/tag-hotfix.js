const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process')

const getLatestTagInCurrentBranch = async () => {
  const { stdout, stderr } = await exec('git describe --abbrev=0 --tags')

  if (stderr) throw stderr
  return stdout
}

const tagHotfix = async () => {
  const latestTag = await getLatestTagInCurrentBranch()
  console.log('🚀 ~ tagHotfix ~ latestTag', latestTag);
  // const cmd = execSync('git', ['describe', '--abbrev=0', '--tags'], { shell: false })

  // cmd.stdout.on('data', (data) => {
  //   console.log('🚀 ~ cmd.stdout.on ~ data', data.toString().split('\n'));
  // })

  // cmd.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`)
  // })

  // cmd.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`)
  // })
}

tagHotfix()
// git fetch --tags --all
// git describe --abbrev=0 --tags
