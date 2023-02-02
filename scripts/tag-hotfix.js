const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { spawnSync } = require('child_process')

const execCommand = async (cmd) => {
  const { stdout, stderr } = await exec(cmd)

  if (stderr) throw stderr
  return stdout.trim()
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
    const newHotfix = String(Number(hotfix?.trim() || 0) + 1)

    const newTag = `${branchVersion.trim()}+${newHotfix}`

    spawnSync('git', ['tag', newTag])
    process.stdout.write(
      'old: ' + latestTag + '\x1b[32m' + '\n' + 'new: ' + newTag + '\x1b[0m' + '\n\n'
    )
  } catch (err) {
    process.stdout.write(
      '\x1b[31m' + 'tag-hotfix error:\n' + err.message + '\x1b[0m' + '\n'
    )
    process.exit(1)
  }
}

tagHotfix()
