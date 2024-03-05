# Test task setup

## Get Started

### Clone the repository
```shell
git clone --branch master git@github.com:toliankir/test_task04032024.git
cd test_task04032024
```

### Initialize worktree by execute following commands
```shell
git worktree add backend backend-master
git worktree add frontend frontend-master
```

### Open VSCode Workspace
```shell
code "test-task.code-workspace"
```

### Add new orphan branch

```shell
NEW_BRANCH=...
git worktree add --detach "./${NEW_BRANCH}"
cd "./${NEW_BRANCH}"
git checkout --orphan "${NEW_BRANCH}"
git reset --hard
git commit --allow-empty -m "Initial Commit"
git push origin "${NEW_BRANCH}"
```