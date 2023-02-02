const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { spawnSync } = require('child_process')

const execCommand = async (cmd) => {
  const { stdout, stderr } = await exec(cmd)

  if (stderr) throw stderr
  return stdout
}

const getLastCommit = async () => {
  return execCommand('git rev-parse HEAD')
}

const checkIfCommitHasTag = async () => {
  const lastCommit = await getLastCommit()
  const lastCommitTag = await execCommand(`git tag --contains ${lastCommit}`)

  return Boolean(lastCommitTag)
}

const fetchRemoteTags = async () => {
  return execCommand('git fetch --tags --all')
}

const getLatestTagInCurrentBranch = async () => {
  return execCommand('git describe --abbrev=0 --tags')
}

const tagHotfix = async () => {
  try {
    await fetchRemoteTags()
    const lastCommit = await getLastCommit()
    console.log('🚀 ~ tagHotfix ~ lastCommit', lastCommit);
    // const latestTag = await getLatestTagInCurrentBranch()
    const x = await checkIfCommitHasTag()
    console.log('🚀 ~ x', x);
    // if (!latestTag) throw 'тэг не найден'
    // const [branchVersion, hotfix] = latestTag.split('+')
    // const newTag = `${branchVersion}+${Number(hotfix || 0) + 1}`

    // spawnSync('git', ['tag', newTag])
    // console.log(`old: ${latestTag}\nnew: ${newTag}`)
  } catch (err) {
    console.error('tag-hotfix error\n', err.message)
  }
}

tagHotfix()
// git tag --contains <commit>
