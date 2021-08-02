# Run in order of package use

$originalLocation = Get-Location

Set-Location "$originalLocation\common\color-logger"
Write-Host "Building $(Get-Location)"
npm run build

Set-Location "$originalLocation\common\ice-cap"
Write-Host "Building $(Get-Location)"
npm run build

Set-Location "$originalLocation\packages\esdoc-core"
Write-Host "Building $(Get-Location)"
npm run build

Set-Location "$originalLocation\packages\esdoc-publish-html-plugin"
Write-Host "Building $(Get-Location)"
npm run build

Set-Location "$originalLocation\esdoc"
Write-Host "Building $(Get-Location)"\nnpm update
npm run build

Set-Location "$originalLocation"
npm update
