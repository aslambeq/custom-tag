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

const getLastCommitTag = async () => {
  const lastCommit = await getLastCommit()
  const lastCommitTag = await execCommand(`git tag --contains ${lastCommit}`)

  return lastCommitTag
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
    const lastCommitTag = await getLastCommitTag()
    if (Boolean(lastCommitTag))
      throw new Error(`recent commit already tagged\n${lastCommitTag}`)
    const latestTag = await getLatestTagInCurrentBranch()
    if (!latestTag) throw new Error('no tags found in current branch')
    const [branchVersion, hotfix] = latestTag.split('+')
    const newTag = `${branchVersion}+${Number(hotfix || 0) + 1}`

    spawnSync('git', ['tag', newTag])
    console.log(`old: ${latestTag}\nnew: ${newTag}`)
  } catch (err) {
    console.log('\x1b[31m')
    console.log('tag-hotfix error:')
    console.error(err.message)
  }
}

tagHotfix()
