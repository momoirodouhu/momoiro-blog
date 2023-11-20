import { NextResponse } from 'next/server';
import blog_meta from "@/share/github"
import activitypub from '@/share/activitypub';

export function GET(request) {
    console.log("GET:" + request.nextUrl.pathname)
    if (request.nextUrl.pathname == "/activitypub") {
        const activitypub_url = "https://" + process.env.HOST_NAME + "/activitypub"
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
                "url": process.env.HOST_NAME + "/momoiro_avatar.png"
            },
            "id": activitypub_url,
            "inbox": activitypub_url + "/inbox",
            "name": "桃色Archive",
            "outbox": activitypub_url + "/outbox",
            "preferredUsername": "momoiro_archive",
            "publicKey": {
                "id": activitypub_url + "#main-key",
                "owner": activitypub_url + "",
                "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqR4cDpk3mAgrTQUXK3UU\nYhcKDFeHT+nf350N7apBcJ//+2mg14hP6DIv/fec1TaMpZknvcNJ0nX429R+eg1/\nydd39kaj0S6GF0NI+FxgODr9r/RBIsAKK5thjtJvb8dBawTGEiGhv+mLKnVvDYQn\n16Swiyv0FZWS/mEmRAuoSEGhxxv5CT8r4dyjLuUCbZkbncezsZMt+pED9i2lk3z6\nrUmQ55pB3Ws5kX6iTVnekFtG5uch2bXVkzsmvHMK+KtpvOmO3NG+wnyVesxMk0xY\ntW486Sfsdi9gGy8SCwfe1Qu8socSrNBUnZfGsFcw1/gmluGawZ+540E8AU1i2qPd\nlQIDAQAB\n-----END PUBLIC KEY-----\n",
                "type": "Key"
            },
            "summary": "桃色ArchiveのActivityPub連合機能です",
            "type": "Person",
            "url": activitypub_url
        })
    }
    if (request.nextUrl.pathname == "/activitypub/test") {
        console.log("test")
        return activitypub.accept_follow()
    }
    else { return NextResponse.json({ message: "Bad Request" }, { status: 400 }) }
}
export function POST(request) {
    console.log("POST:" + request.nextUrl.pathname)
    if (request.nextUrl.pathname == "/activitypub/inbox") {
        return request.json().then(activity => {
            console.log(activity)
            if (activity.type == "Follow") {
                console.log("follow activity posted")
                return activitypub.url_to_acct(activity.actor).then(acct => {
                    return blog_meta.add_followers(acct).then(response => {
                        return activitypub.accept_follow(activity).then(response => {
                            console.log("Follow request by "+acct+" success")
                            console.log(response)
                            return NextResponse.json({ message: "ok" }, { status: 200 })
                        }).catch(error => {console.warn(error)})
                    }).catch(error => {console.warn(error)})
                }).catch(error => {console.warn(error)})
            }
            else if(activity.type == "Undo" && activity.object.type == "Follow") {
                console.log("undo follow activity posted")
                return activitypub.url_to_acct(activity.actor).then(acct => {
                    return blog_meta.rm_followers(acct).then(response => {
                        console.log("Unfollow request by "+acct+" success")
                        return NextResponse.json({ message: "ok" }, { status: 200 })
                    }).catch(error => {console.warn(error)})
                }).catch(error => {console.warn(error)})
            }
            else { return NextResponse.json({ message: "Now only follow and undo follow activities are supported" }, { status: 400 }) }
        })
    }
    else { return NextResponse.json({ message: "Bad Request" }, { status: 400 }) }
}