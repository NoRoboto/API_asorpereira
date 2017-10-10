const config = require('./config/config'),
      restify = require('restify'),
      db = require('./models/db'),
      Logger = require('bunyan');

var User = require('./models/user');

// logger
var log = new Logger({
  name       : 'loggerName',
  level      : process.env.LOG_LEVEL || 'info',
  stream     : process.stdout,
  serializers: Logger.stdSerializers
 });

//console.log(restify.plugins);
server = restify.createServer({
  name: config.name,
  version: config.version,
  log: log,
  formatters : {
    'application/json' : function (req, res, body, cb) {
      res.setHeader('Cache-Control', 'must-revalidate');

      // Does the client *explicitly* accepts application/json?
      var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);

      // Send as plain text
      if (sendPlainText) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }

      // Send as JSON
      if (!sendPlainText) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      return cb(null, JSON.stringify(body));
    }
  }
});


//useful plugins
server.use(restify.plugins.pre.sanitizePath());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.use(function(req,res, next) {
  req.log.info({method: req.method, url:req.url, body:req.body}, 'start');
  next();
});

// Default error handler. Personalize according to your needs.
server.on('uncaughtException', function (req, res, route, err) {
  console.log('******* Begin Error *******');
  console.log(route);
  console.log('*******');
  console.log(err.stack);
  console.log('******* End Error *******');
  if (!res.headersSent) {
    return res.send(500, { ok : false });
  }
  res.write("\n");
  res.end();
});

//server.on('after', restify.plugins.auditLogger({ log: log}));

server.listen(config.port, function(){
// establish connection to mongodb
  db.on('error', err => {
    console.error(err);
    process.exit(1);
  });

  db.once('open', () => {
    // routes
    const  userRoutes = require('./routes/users');
    userRoutes.applyRoutes(server, '/user');
    console.log('%s listening at %s', server.name, server.url);
    //console.log(`Server is listening on port ${config.port}`);
  });

});
