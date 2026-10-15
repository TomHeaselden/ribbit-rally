// electron-builder "afterPack" hook.
// Gives the macOS app an ad-hoc code signature. Without a paid Apple Developer certificate the app
// can't be properly signed, and an app with no signature at all is reported as "damaged" on
// Apple Silicon (M1/M2/M3/M4) Macs. An ad-hoc signature lets it open after the usual
// "unidentified developer" prompt instead.
const { execFileSync } = require('child_process')
const path = require('path')

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') return
  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`)
  console.log(`  • ad-hoc signing ${appPath}`)
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], { stdio: 'inherit' })
  execFileSync('codesign', ['--verify', '--deep', '--strict', appPath], { stdio: 'inherit' })
}
