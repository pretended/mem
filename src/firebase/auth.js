import {GoogleAuthProvider, signInWithCredential , getAuth, signInWithRedirect, signInWithPopup, getRedirectResult} from "firebase/auth";
import {setDoc, doc, } from "firebase/firestore";
import {auth, db} from './index'
import {Tools} from "@/firebase/Tools";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {isPlatform} from "@ionic/vue";
export class Auth {
    async nativeMobileDeviceGoogleAuth() {
        const googleAuthSignIn = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleAuthSignIn.authentication.idToken);
        return await signInWithCredential(auth, credential);
    }
    async safariGoogleAuthRedirect() {
        const googleProvider = new GoogleAuthProvider();
        await signInWithRedirect(auth, googleProvider);
        return getRedirectResult(auth).then((user) => {
            console.log(user)
            return user;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        })
    }
    async safariGoogleAuthPopUp() {
        const googleProvider = new GoogleAuthProvider();
        return await signInWithPopup(auth, googleProvider);
    }
    async googleAuth () {
        let res;
        if (isPlatform('mobileweb')) {
            res = await this.safariGoogleAuthRedirect()
        } else {
            res = await this.nativeMobileDeviceGoogleAuth()
        }
        await this.registerNewUser(res.user)
        console.log(res)
        return res.user;
    }
    async phoneNumberAuth(phoneNumber) {
        phoneNumber;
        // todo
        return;
    }
    async registerNewUser(user) {
        const randomUsername = await this.generateRandomUsername(user.displayName)
        const defaultURL = 'https://picsum.photos/200'
        const photoURL = await new Tools().uploadImgURL(defaultURL, user.uid)
        const objUser = {
            displayName:user.displayName,
            displayName_lowerCaseName: user.displayName.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            email: user.email,
            emailVerified: user.emailVerified,
            creationTime:user.metadata.creationTime,
            photoURL: photoURL,
            uid: user.uid,
            username: randomUsername,
            friends: [],
            allowFriendRequests: true
        }
        await setDoc(doc(db, 'users', user.uid), objUser)
        let obj = {}
        obj[randomUsername] = user.uid
        await setDoc(doc(db, 'usernames', randomUsername), obj)
    }
    async generateRandomUsername(displayName) {
        const tool = new Tools()
        let username;
        if (displayName.includes(' ')) {
            username = displayName.split(' ')[0].toLowerCase().trim()
        } else {
            username = displayName.toLowerCase().trim();
        }
        let usernameHere = username
        let numb = 10
        while (!await tool.isUsernameAvailable(usernameHere)) {
            usernameHere = username + Math.floor(Math.random() * numb).toString()
            numb = numb * 10
        }
        return usernameHere;
    }
}
export async function  getCurrentUser() {
    const savedUser = getAuth().currentUser
    if (savedUser) {
        const user = await new Tools().getCurrentUserFromFirestore(savedUser.uid)
        if (!user) {
            await new Auth().registerNewUser(savedUser);
            return await new Tools().getCurrentUserFromFirestore(savedUser.uid)
        } else {
            return user
        }
    }
}
export async function  createNewGroup(data) {
    await setDoc(doc(db, 'group', data.uid), data)
}

