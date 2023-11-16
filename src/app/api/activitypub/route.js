import { NextResponse } from 'next/server';
import blog_meta from "@/share/github"

export function GET(request) {
    console.log(request.nextUrl.pathname)
    if(request.nextUrl.pathname == "/activitypub"){
        const activitypub_url = "https://"+process.env.HOST_NAME+"/activitypub"
        console.log("ap main")
        return NextResponse.json({
            "@context": [
                "https://www.w3.org/ns/activitystreams",
                "https://w3id.org/security/v1"
            ],
            "followers": activitypub_url + "/followers",
            "following": activitypub_url + "/following",
            "icon": {
                "mediaType": "image/png",
                "type": "Image",
                "url": process.env.HOST_NAME+"/momoiro_avatar.png"
            },
            "id": activitypub_url,
            "inbox": activitypub_url + "/inbox",
            "name": "桃色Archive",
            "outbox": activitypub_url + "/outbox",
            "preferredUsername": "momoiro_archive",
            "publicKey": {
                "id": activitypub_url + "#main-key",
                "owner": activitypub_url + "",
                "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxzFKvmZ5FFwM0ax1fAlH\nZVDYiws8WeecqtHxSyAaIBJFu4sdMc5xYsrmT5X+DBHlhDpu7d5ciGdYy+gvCW8/\n1CaBwdFQjgIW7BBTHXy+cCRxgVTTwq4ofqvovjwR5mCgCO84zzlHSCty02rewNpG\n+yAqMlmCBHmYtqe1tCEjmGJeC+XB4DfD/LFPuAcsDkqmyVbMcV7O9mPcxQSbiAdt\nxIUKTpBS11O0tziY+VgmtGW2BPAiMiiV3L5/5szwhSPUSReAephD5kMPPoPFNw6g\nltmVRu4IGzVPwd5YhMt25pPkkDpJFbkZwFvO6ikLV9PTXmzefX4XWe9FEBKPZdoB\nOQIDAQAB\n-----END PUBLIC KEY-----\n",
                "type": "Key"
            },
            "summary": "桃色ArchiveのActivityPub連合機能です",
            "type": "Person",
            "url": activitypub_url
        })
    }
    if(request.nextUrl.pathname == "/activitypub/followers"){
        return blog_meta.get_followers().then(followers => {
            console.log(followers)
            return NextResponse.json({ data: followers })
        }).catch(error => {
            return NextResponse.json({ message: "Failed to get followers"}, { status: 500 })
        })
    }
    else{ return NextResponse.json({ message: "Bad Request"}, { status: 400 }) }
}