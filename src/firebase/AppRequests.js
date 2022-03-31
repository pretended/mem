import {collection, where, query, getDocs, getDoc, doc, setDoc, arrayUnion, arrayRemove, orderBy, startAt, endAt, deleteDoc} from "firebase/firestore";
import {db} from "@/firebase/index";

export async function getUserInfo(uid) {
    return (await getDoc(doc(db, 'users', uid))).data()
}
export async function isUserFollowingOtherUser(fromUser, toUser) {
    // uids being passed
    const docum = doc(db, 'users', fromUser);
    const snap = await getDoc(docum);
    if (snap.exists()) {
        return snap.data().friends.includes(toUser);
    } else {
        return false;
    }
}
export async function getMultipleUsersInfo(uids) {
    const promises = uids.map(uid => getUserInfo(uid))
    return await Promise.all(promises)
}
export async function getGroups(uid) {
    const collectRef = collection(db, "group");
    const q = query(collectRef, where("users", "array-contains", uid));
    const querySnapshot = await getDocs(q);
    let res = []
    querySnapshot.forEach((doc) => {
        res.push(doc.data())
    });
    return res;
}

export async function followUser(myUid, userUidToFollow) {
    // follows a user
    const meIDRef = doc(db, 'users', myUid);
    await setDoc(meIDRef, {
        friends: arrayUnion( userUidToFollow)
    }, {merge: true});

}
export async function unfollowUser(myUid, userUidToUnfollow) {
    // follows a user
    const meIDRef = doc(db, 'users', myUid);
    await setDoc(meIDRef, {
        friends: arrayRemove(userUidToUnfollow)
    }, {merge: true});
}
export async function getGroupByUID(uid) {
    return (await getDoc(doc(db,'group', uid))).data()
}
export async function addMembersToGroup(groupUID, uids) {
    await setDoc(doc(db, 'group', groupUID), {
        users: arrayUnion( ...uids)
    }, {merge: true})
}
export async function querySearchForUsernameOrDisplayName(text) {
    if (text) {
        text = text.toLowerCase().trim()
        const usersRef = collection(db, "users");
        const usernameQuery = query(usersRef, orderBy("username"), startAt(text),endAt(text + '~') )
        const nameQuery = query(usersRef, orderBy("displayName_lowerCase"), startAt(text),endAt(text + '~') )
        const usernameSnapshot = await getDocs(usernameQuery);
        const nameSnapshot = await getDocs(nameQuery);
        let res = []
        usernameSnapshot.forEach((user) => {
            res.push(user.data())
        })
        nameSnapshot.forEach((user) => {
            res.push(user.data())
        })
        return removeDuplicateObjectsFromArray(res);
    } else {
        return []
    }
}
function removeDuplicateObjectsFromArray(arr) {
    return arr.filter((v,i,a)=>a.findIndex(t=>(t.uid===v.uid))===i)
}
export async function leaveGroup(groupUid, userUid) {
    await setDoc(doc(db, 'group', groupUid), {
        users: arrayRemove(userUid)
    }, {merge: true})
    await setDoc(doc(db, 'users', userUid), {
        groups: arrayRemove(groupUid)
    }, {merge: true})
}
export async function updateUserData(uid, data) {
    console.log(data)
    if (data.username !== data.oldUsername) {
        await deleteDoc(doc(db, 'usernames', data.oldUsername))
        const obj = {}
        obj[data.username] = uid;
        await setDoc(doc(db, 'usernames', data.username), obj )
    }
    await setDoc(doc(db, 'users', uid), {displayName: data.displayName, username: data.username}, {merge: true} )

}
