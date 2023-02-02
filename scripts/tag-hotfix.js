const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { spawnSync } = require('child_process')

const fetchRemoteTags = async () => {
  const { stdout, stderr } = await exec('git fetch --tags --all')

  if (stderr) throw stderr
  return stdout
}

const getLatestTagInCurrentBranch = async () => {
  const { stdout, stderr } = await exec('git describe --abbrev=0 --tags')

  if (stderr) throw stderr
  return stdout
}

const tagHotfix = async () => {
  try {
    await fetchRemoteTags()
    // TODO check if latest commit contains tag
    const latestTag = await getLatestTagInCurrentBranch()

    if (!latestTag) throw 'тэг не найден'
    const [branchVersion, hotfix] = latestTag.split('+')
    const newTag = `${branchVersion}+${(Number(hotfix || 0) + 1)}`

    spawnSync('git', ['tag', newTag])
    console.log(latestTag + '->' + newTag);
    // console.log(`${latestTag} -> ${newTag}`);
  } catch (err) {
    console.error('tag-hotfix error \n', err.message);
  }

}

tagHotfix()
