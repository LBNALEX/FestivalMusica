//const { series, parallel } = require('gulp');
/*function css( done ){
    console.log('Hola mundo en Gulp');

    done();
}

function javascript( done ){
    console.log('Compilando JS');
    done();
}

exports.css = css;
exports.javascript = javascript;
exports.tareas = series(css,javascript);

//exports.default = series(css,javascript); //cuando es default no necesito poner el nombre del export, solo gulp.
exports.default = parallel(css,javascript);

//parallel es similar a series, pero todas las tareas inician al mismo tiempo.*/

const { series,src,dest,watch,parallel } = require('gulp');
const sass = require('gulp-dart-sass');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');

//Utilidades CSS
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

//Utilidades JS
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');


const paths ={
    imagenes: 'src/img/**/*',
    scss: 'src/scss/**/*.scss',
    js:'src/js/**/*.js'
}

//Funcion que compila SASS
function css(  ){
   
    return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(),cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./build/css'))
}



function javascript(){
    return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('./build/js'))
}

function imagenes(){
    return src(paths.imagenes) //leer todas las imagenes
    .pipe( imagemin())
    .pipe( dest('./build/img'))
   // .pipe(notify({message: 'Imagen Minificada'}));
}

function versionWebp(){
    return src(paths.imagenes)
            .pipe(webp())
            .pipe(dest('./build/img'))
            //.pipe(notify({message: 'Version WebP lista'}));
}

function watchArchivos(){
    watch(paths.scss,css); // * = la carpeta actual  - **/* todos los archivos con esa ext.
    watch(paths.js,javascript);
}

exports.css = css;
exports.imagenes = imagenes;
exports.watchArchivos = watchArchivos;

exports.default = series(css,imagenes,javascript,versionWebp,watchArchivos);

//para detener una funcion como watch es con ctrl C