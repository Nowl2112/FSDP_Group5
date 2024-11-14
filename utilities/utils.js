const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Function to parse Surefire XML reports
const parseSurefireReports = (baseDir, fileName, callback) => {
    const reportsDir = path.join(baseDir, 'target/surefire-reports');
    const filePath = path.join(reportsDir, `${fileName}.xml`);
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        return callback(new Error('File not found'));
    }

    const xml = fs.readFileSync(filePath, 'utf-8');

    xml2js.parseString(xml, (err, result) => {
        if (err) {
            return callback(err);
        }

        const testsuite = result.testsuite;
        const suiteResult = {
            name: testsuite.$.name,
            tests: testsuite.$.tests,
            failures: testsuite.$.failures,
            errors: testsuite.$.errors,
            skipped: testsuite.$.skipped,
            testcases: []
        };

        testsuite.testcase.forEach(testcase => {
            const nameStr = testcase.$.name;
            const regex = /(.*?)(\(\w+\))(.*)/;
            const matches = nameStr.match(regex);

            let testcaseName = nameStr;  // Default to the full name if regex doesn't match
            let browserType = "Unknown"; // Default browser type in case no match is found

            if (matches) {
                testcaseName = matches[1];
                
                // Determine browser type based on the third match
                if (matches[3] === "[1]") {
                    browserType = "Google";
                } else if (matches[3] === "[2]") {
                    browserType = "FireFox";
                } else if (matches[3] === "[3]") {
                    browserType = "Edge";
                }
            } else {
                console.warn(`Unexpected format for testcase name: ${nameStr}`);
            }

            const testResult = {
                name: testcaseName,
                browserType: browserType,
                status: 'passed',
                time: testcase.$.time
            };
            if (testcase.failure) {
                const match = testcase.failure[0]._.match(/expected: <(.+)> but was: <(.+)>/);
                testResult.status = 'failed';
                testResult.summary = match[0];
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

module.exports = {
    parseSurefireReports,
};
