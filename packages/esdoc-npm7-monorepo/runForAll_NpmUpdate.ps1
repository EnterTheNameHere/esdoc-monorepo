# Run in order of package use

$originalLocation = Get-Location

npm update

Set-Location "$originalLocation\common\color-logger"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\common\ice-cap"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-core"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-exclude-source-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-external-nodejs-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-external-webapi-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-importpath-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-inject-gtm-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-inject-script-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-inject-style-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-jsx-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-publish-markdown-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-typescript-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-lint-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-unexported-identifier-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-undocumented-identifier-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-type-inference-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-integrate-test-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-integrate-manual-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-external-ecmascript-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-ecmascript-proposal-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-coverage-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-brand-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-accessor-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-publish-html-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-standard-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-react-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\packages\esdoc-flow-type-plugin"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation\esdoc"
Write-Host "Updating $(Get-Location)"
npm update

Set-Location "$originalLocation"
npm update
