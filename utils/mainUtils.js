const path = require('path');

// Export root directory only
module.exports = path.dirname(require.main.filename);

