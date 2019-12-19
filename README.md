# GitHub Action to Add Release Metadata to The IOTA Tangle

This GitHub Action will take the contents of your GitHub release and create an associated Transactions on the IOTA Tangle. This way the data associated with the release becomes immutable.

## Usage

Create a GitHub workflow in you repo e.g. `/.github/workflows/tangle-release.tml`

```yaml
on:
  push:
    tags:
      - 'v*' # Push events to matching v*

name: Create Immutable Release

jobs:
  build:
    name: Create Immutable Release
    runs-on: ubuntu-latest
    steps:
      - name: Tangle Release
        id: tangle_release
        uses: obany/gh-tangle-release@v0.1.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          IOTA_SEED: ${{ secrets.IOTA_SEED }}
          IOTA_NODE: ${{ secrets.IOTA_NODE }} # Optional, defaults to https://nodes.iota.cafe:443
          IOTA_ADDRESS_INDEX: ${{ secrets.IOTA_ADDRESS_INDEX }} # Optional, defaults to 0
          IOTA_DEPTH: ${{ secrets.IOTA_DEPTH }} # Optional, defaults to 3
          IOTA_MWM: ${{ secrets.IOTA_MWM }} # Optional, defaults to 14
          IOTA_TAG: ${{ secrets.IOTA_TAG }} # Optional, defaults to GITHUB9RELEASE
          IOTA_EXPLORE_URL: ${{ secrets.IOTA_EXPLORE_URL }} # Optional, defaults to https://utils.iota.org/transaction/:hash
        with:
          tag_name: ${{ github.ref }}

```
