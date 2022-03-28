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
    async generateRandomAvatar(name) {
        // CHECK
        // Generate a avatar with default settings, for user "John Doe".
        //     https://ui-avatars.com/api/?name=John+Doe
        //
        // Generate a blue avatar
        // https://ui-avatars.com/api/?background=0D8ABC&color=fff
        //
        //     Generate a random background avatar.
        //     https://ui-avatars.com/api/?background=random

        const initials = name.split(' ').map(function(str) { return str ? str[0].toUpperCase() : "";}).slice(0,2).join('');
        const canvas = document.createElement('canvas');
        const radius = 30;
        const margin = 5;
        canvas.width = radius*2+margin*2;
        canvas.height = radius*2+margin*2;
        const colours = ['lightgreen', 'blue', 'green', 'brown', 'black', 'lightblue', 'greenyellow', 'khaki', 'indigo', 'red']
        // Get the drawing context
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(radius+margin,radius+margin,radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = colours[Math.floor(Math.random() * colours.length)];
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = 'center';
        ctx.fillText(initials, radius+5,radius*4/3+margin);
        return canvas.toDataURL();

    }
    async registerNewUser(user) {
        const randomUsername = await this.generateRandomUsername(user.displayName)
        const defaultURL = await this.generateRandomAvatar(user.displayName)
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

