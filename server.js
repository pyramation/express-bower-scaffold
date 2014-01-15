var express = require('express')
, app = express()
, server = require('http').createServer(app);


var hbs = require('hbs');
var _ = require('underscore');
// hbs.registerPartials(__dirname + '/partials');

var publicFolders = [
    'lib',
    'components',
    'css',
    'assets'
];

app.configure(function(){

    app.set('view engine', 'html');
    app.engine('html', hbs.__express);
    app.set('views', __dirname + '/');
    app.set('view options', { layout: false });

    _.each(publicFolders, function (folder) {
        app.use('/'+folder, express.static(__dirname + '/'+folder));
    });
});

server.listen(8000);

var scripts = process.env.production ? ['app.js'] : [
    'components/jquery/jquery.js',
    'components/bootstrap/dist/js/bootstrap.js'
];

var css = {
    default: [

        // 'http://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700',
        // 'http://fonts.googleapis.com/css?family=Roboto+Slab:400,700,300,100',
        // 'http://fonts.googleapis.com/css?family=Gravitas+One',
        // 'http://fonts.googleapis.com/css?family=Abril+Fatface',
        "components/bootstrap/dist/css/bootstrap.css",
        "components/bootstrap/dist/css/bootstrap-theme.css",
        "css/app.css"

    ]
}

var fs = require('fs');
var walk = exports.walkSync = function (dir, done) {
    if (!done) done = function(){};

    var results = [];
    if (!fs.existsSync(dir)) return results;
    var list = fs.readdirSync(dir);
    var i = 0;
    (function next() {
        var file = list[i++];
        if (!file)
            return done(null, results);

        if (file == 'node_modules' || file == 'dist')
            return done(null, results);
        

        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            walk(file, function (err, res) {
                results = results.concat(res);
                next();
            });
        } else {
            results.push(file);
            next();
        }
    }());
    return results;
};

var htmlFiles = walk('pages');
var pages = {};
_.each(htmlFiles, function (html) {
    var path = html.replace(/pages/, '')
    .replace(/.html$/, '')
    .replace(/^\//g, '')
    .replace(/\//g, '-')
    ;
    var content = fs.readFileSync(html).toString();
    pages[path] = {
        html: content,
        scripts: scripts,
        css: css.default
    };
});

_.each(_.keys(pages), function (key) {
    console.log(key);
    app.get('/'+key, function (req, res) {
        res.render('index.html', pages[key]);
    });
});

app.get('*', function (req, res) {
    res.render('index.html', pages['home']);
});

console.log('server running on port 8000');
