
// kovertera typescript till javascript
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
gulp.task("default", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});


const {src, dest, parallel, series, watch}= require ('gulp');

//importera paket för concat css och js 
const concat = require('gulp-concat');

//minifera js kod
const terser = require('gulp-terser');

//live server
const browserSync = require('browser-sync').create();

//konvetera sass 
const sass = require('gulp-sass')(require('sass'));
// sourscemaps 
const sourcemaps = require('gulp-sourcemaps');


// sökvägar till html/css och js filer 
const files ={
  htmlPath : "src/**/*.html",
  jsPath :"src/js/*.js",
  sassPath :"src/sass/*.scss",
  }
  
  //html task, kopiera filer 
  function copyHTML(){
      //kopiera filer till dist
      return src(files.htmlPath)
      .pipe(dest('dist'));
  }
  
  
  //js task kopiera js fil, samla dem i en fil och minifera koden
  function jsTask(){
      return src(files.jsPath)
      .pipe(concat('main.js'))
      .pipe(terser())
      .pipe(dest('dist/js'));
  }
  
  
  //Task sass
  function sassTask() {
      return src(files.sassPath)
          .pipe(sourcemaps.init())
          .pipe(sass().on("error", sass.logError))
          .pipe(dest('dist/css'))
          .pipe(browserSync.stream());
  }

  //watch-task 
function watchTask(){
  browserSync.init({
     server: "./dist"
  });

watch ([files.htmlPath, files.jsPath, files.sassPath], parallel(copyHTML,jsTask,sassTask)).on('change', browserSync.reload);
}


exports.default = series(  
parallel(copyHTML,jsTask,sassTask ), 
watchTask
)