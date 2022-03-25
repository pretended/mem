import {db, storage,} from "@/firebase/index";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {updateDoc, arrayUnion, doc} from "firebase/firestore";

const ACTIONS = {
    IMAGE: 'sent'
}
export async function sendImageToStorage(userUId, groupID, image) {
    const timestamp =  new Date().getTime().toString()
    const urlRef= 'group/' + groupID + '/images/image_' + timestamp + '.jpg'
    const imageRef = ref(storage, urlRef)

    const snapshot = await uploadString(imageRef, image, 'data_url')
    const data = {
        metadata : snapshot.metadata,
        ref: snapshot.ref,
        url: await getDownloadURL(snapshot.ref)
    };
    await updateDoc(doc(db, 'group', groupID), {
        statistics: arrayUnion({
            timestamp: timestamp,
            url : data.url,
            type: 'image',
            user: userUId,
            action: ACTIONS.IMAGE
        })
    })

}
