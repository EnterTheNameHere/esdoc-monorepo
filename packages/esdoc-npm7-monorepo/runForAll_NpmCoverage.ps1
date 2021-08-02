# Run in order of package use

$originalLocation = Get-Location

Set-Location "$originalLocation\common\color-logger"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\common\ice-cap"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-core"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-exclude-source-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-external-nodejs-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-external-webapi-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-importpath-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-inject-gtm-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-inject-script-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-inject-style-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-jsx-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-publish-markdown-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-typescript-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-lint-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-unexported-identifier-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-undocumented-identifier-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-type-inference-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-integrate-test-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-integrate-manual-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-external-ecmascript-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-ecmascript-proposal-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-coverage-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-brand-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-accessor-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-publish-html-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-standard-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-react-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\packages\esdoc-flow-type-plugin"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation\esdoc"
Write-Host "Covering $(Get-Location)"
npm run coverage

Set-Location "$originalLocation"
