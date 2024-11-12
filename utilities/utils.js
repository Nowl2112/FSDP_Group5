
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// Function to parse Surefire XML reports
const parseSurefireReports = (baseDir,fileName, callback) => {
    const reportsDir = path.join(baseDir, 'target/surefire-reports');
    const filePath = path.join(reportsDir, `${fileName}.xml`);
    console.log(filePath)
    if (!fs.existsSync(filePath)) {
        return callback(new Error('File not found'));
    }

    const xml = fs.readFileSync(filePath, 'utf-8');

    xml2js.parseString(xml, (err, result) => {
        if (err) {
            return callback(err);
        }

        const testsuite = result.testsuite;
        // console.log(testsuite)
        const suiteResult = {
            name: testsuite.$.name,
            tests: testsuite.$.tests,
            failures: testsuite.$.failures,
            errors: testsuite.$.errors,
            skipped: testsuite.$.skipped,
            testcases: []
        };

        testsuite.testcase.forEach(testcase => {
            const testResult = {
                name: testcase.$.name,
                status: 'passed',
                time:  testcase.$.time
            };

            if (testcase.failure) {
                testResult.status = 'failed';
                testResult.message = testcase.failure[0]._;
            }

            if (testcase.error) {
                testResult.status = 'error';
                testResult.message = testcase.error[0]._;
            }

            suiteResult.testcases.push(testResult);
        });

        callback(null, suiteResult);
    });
};

module.exports = 
{
    parseSurefireReports,
}



