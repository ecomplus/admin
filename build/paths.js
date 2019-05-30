'use strict'

// use Node.js path module for compatibility
const { resolve, join } = require('path')

// input directories and files
const src = resolve(process.cwd(), 'src')
const pub = resolve(process.cwd(), 'public')
const script = join(src, 'js', 'index.js')
const styles = join(src, 'scss', 'styles.scss')
const template = join(src, 'views', 'index.ejs')

// outpur directory
const output = resolve(
  process.cwd(),
  process.env.NODE_ENV === 'production' ? 'dist' : 'test'
)

// app icons
const icons = resolve(pub, 'icons')
const icon96 = join(icons, '96px.png')
const icon128 = join(icons, '128px.png')
const icon192 = join(icons, '192px.png')
const icon384 = join(icons, '384px.png')
const icon512 = join(icons, '512px.png')

// service worker base file
const sw = join(__dirname, 'sw.js')

// exports project folders
module.exports = {
  src,
  script,
  styles,
  template,
  pub,
  output,
  icons,
  icon96,
  icon128,
  icon192,
  icon384,
  icon512,
  sw
}
