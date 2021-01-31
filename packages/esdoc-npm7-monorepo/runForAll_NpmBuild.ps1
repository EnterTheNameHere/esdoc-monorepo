# Run in order of package use

$originalLocation = Get-Location

cd "$originalLocation\common\color-logger"
Write-Host "Building $(Get-Location)"
npm run build

cd "$originalLocation\common\ice-cap"
Write-Host "Building $(Get-Location)"
npm run build

cd "$originalLocation\packages\esdoc-core"
Write-Host "Building $(Get-Location)"
npm run build

cd "$originalLocation\packages\esdoc-publish-html-plugin"
Write-Host "Building $(Get-Location)"
npm run build

cd "$originalLocation\esdoc"
Write-Host "Building $(Get-Location)"\nnpm update
npm run build

cd "$originalLocation"
npm update
