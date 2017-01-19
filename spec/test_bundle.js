// require('./helpers/titleize_spec');
var testsContext = require.context('.', true, /_spec$/);
testsContext.keys().forEach(testsContext);
