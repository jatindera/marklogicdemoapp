var appRoles = require('../config/appRolesConfig');

function assignRoles(userADGroups) {
    appRoles = appRoles.roles;
    var level = [];
    var userLevel = 0;
    console.log(userADGroups);
    userADGroups[0].forEach(userRole => {
        // console.log(userRole);
        // console.log("=============");    
        appRoles.forEach(adRole => {
            // console.log(adRole.key);
            if (userRole === adRole.key) {
                level.push(adRole.level);
            }
        })
    });
    if (level.length > 0) {
        userLevel = Math.min(...level);
    }
    else {
        userLevel = -1;
    }
    return userLevel;
}


module.exports = assignRoles