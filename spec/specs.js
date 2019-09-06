const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const jasmine = new Jasmine();
var reporter = new JasmineConsoleReporter({
        colors: 1,
        cleanStack: 3,
        verbosity: 4,
        listStyle: 'indent',
        activity: false
});
jasmine.addReporter(reporter);
jasmine.showColors(true);
//jasmine.loadConfigFile('spec/unit/hospital.spec.js');

jasmine.loadConfigFile('spec/support/jasmine.json');



// jasmine.onComplete(function(passed) {
//         if(passed) {
//             console.log('All specs have passed');
//         }
//         else {
//             console.log('At least one spec has failed');
//         }
//     });
//    jasmine.execute(['hospital.specs.js'], 'Hospital registration test');

jasmine.execute();

