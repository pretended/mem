import * as timeago from 'timeago.js';
 function getUserUsername(usersInfo, uid) {
     const user =  usersInfo.find(us => us.uid === uid)
    return user.username;
}
const statistics = {
    action: {
        sent: (statistic, group, usersInfo) => '🖼️ ' + getUserUsername(usersInfo, statistic.user) + ' has sent an ' + statistic.type + ' ' + timeago.format(statistic.timestamp),
    }
}
export default statistics;
