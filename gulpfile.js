const gulp = require('gulp')
const del = require('del')
const path = require('path')

gulp.task('clean', () => {
  return del([
    path.join(__dirname, 'main.js'),
    path.join(__dirname, 'main.js.map'),
    path.join(__dirname, 'test.js'),
    path.join(__dirname, 'test.js.map'),
    path.join(__dirname, 'src', '**', '*.js'),
    path.join(__dirname, 'src', '**', '*.js.map'),
  ])
})

gulp.task('clearlogs', () => {
  return del([
    path.join(__dirname, 'logs', '**', '*.log')
  ])
})
