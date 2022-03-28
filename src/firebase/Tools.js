import {
    collection,
    doc,
    getDoc,
} from 'firebase/firestore'
import {db, storage} from "@/firebase/index";
import {getDownloadURL, ref , uploadString} from "firebase/storage";
import moment from "moment";
export class Tools {
    async isUsernameAvailable(username) {
        if (username) {
            username = username.toLowerCase().trim()
            const exists = (await getDoc(doc(collection(db, "usernames"), username))).exists()
            return !exists
        }
        return false;
    }
     async uploadImgURL(image, uid) {
        const imgRef = await ref(storage, 'users/' + uid + '/photoURL.jpg')
         const snapshot = await uploadString(imgRef, image, 'data_url')
         return await getDownloadURL(snapshot.ref);
    }
    async getCurrentUserFromFirestore(uid) {
        const user = (await getDoc(doc(db, 'users', uid)))
        if(user.exists()) return user.data();
        else return null;
    }
     validateNewGroupForm(form) {
        const groupName = form.name;
        const revealDate = form.revealDate;
        if (!groupName) throw new Error('Please add a name to the group!')
         let valid = false;
        try {
            valid = this.isAValidDate(revealDate)
        } catch (e) {
            throw new Error('Not a valid date!')
        }
         return valid;
    }
    isAValidDate(date) {
        return moment(date).isValid();
    }
}
