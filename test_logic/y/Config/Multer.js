var path      = require("path");
var multer = require('multer');
var dir = path.join(__dirname, '../', './Assets/upload/');
module.exports = {
    "dir": dir,
    "upload": multer({dest: dir}),
    "secret": "REPLACE THIS WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
}
 