module.exports = async function (req, res, next) {
    console.log("🧠 Middleware exécuté !");
    req.options.headers = {
      ...req.options.headers,
      'X-Test-Widad': 'OK'
    };
    next();
  };
  