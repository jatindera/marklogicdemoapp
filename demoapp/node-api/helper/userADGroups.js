require('dotenv').config();
parseString = require("xml2js").parseString;
stripPrefix = require("xml2js").processors.stripPrefix;

function userADGroups(assertionXML) {
    var userAdGroupArray = [];
    parseString(assertionXML, { tagNameProcessors: [stripPrefix] }, function (err, assertionJSON) {
        var attributes = assertionJSON.Assertion.AttributeStatement[0].Attribute;
        attributes.forEach((element) => {
            if (element['$']['Name'] === process.env.CLAIMS_GROUP) {
                userAdGroupArray.push(element['AttributeValue']);
            }
        });
    });
return userAdGroupArray;
    
}

module.exports = userADGroups