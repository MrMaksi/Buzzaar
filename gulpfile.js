var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    browserSync = require('browser-sync'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlhint = require("gulp-htmlhint"),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber');


//compiling sass files
gulp.task('scss', function() {
    gulp.src('scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '>1%',], {cascade: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream: true}));
});

//concat js
gulp.task('js', function() {
    return gulp.src([
        'src/js/*.js',
        // 'src/**/*.js',
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'));
});
//minify css
gulp.task('css-libs', ['sass'], function() {
    return gulp.src([
        'src/css/**/*.css',
    ])
        .pipe(cssnano(''))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/css'));
});

// check html for error
gulp.task('htmlhint', function() {
    gulp.src("*.html")
        .pipe(htmlhint({
            "tag-pair": true,
            "style-disabled": true,
            "img-alt-require": true,
            "tagname-lowercase": true,
            "src-not-empty": true,
            "id-unique": true,
            "spec-char-escape": true
        }))
        .pipe(htmlhint.reporter())
});

//Синхронизация обновления в браузере
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        port: 8080,
        open: true,
        notify: false
    });
});

//сжатие картинок
gulp.task('img', function() {
    return gulp.src('/img/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            interlaced: true,
            progresive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('images'));
});

//Запуск сервера
gulp.task('watch', ['browser-sync', 'htmlhint'], function() {
    gulp.watch('./scss/**/*.scss', ['scss']);
    gulp.watch('./*.html');
    gulp.watch('./js/**/*.js');
    // gulp.watch('images/*', ['img']);
});

gulp.task('html', function () {
    browserSync.reload();
});

//Чистка папки dist
gulp.task('clean', function() {
    return del.sync('dist');
});

//Чистка кэша
gulp.task('clear', function() {
    return cache.clearAll('');
});


//билд всего в папку dist
gulp.task('build', ['clean', 'clear', 'img', 'sass', 'css-libs', 'js'], function() {

    var buildFonts = gulp.src(['src/fonts/**/*',])
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src(['src/js/**/*',])
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src(['src/*.html',])
        .pipe(gulp.dest('dist/'));

    var buildImg = gulp.src(['src/images/**/*',])
        .pipe(gulp.dest('dist/images'));

    var buildCss = gulp.src(['src/css/**/*.css',])
        .pipe(gulp.dest('dist/css'));
});
