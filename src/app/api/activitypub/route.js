import { NextResponse } from 'next/server';
import blog_meta from "@/share/github"
import activitypub from '@/share/activitypub';
import crypto from 'crypto';

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
                "publicKeyPem": crypto.createPublicKey(process.env.ACTOR_KEY.split(String.raw`\n`).join('\n')).export({ type: "spki", format: "pem" }),
                "type": "Key"
            },
            "summary": "桃色ArchiveのActivityPub連合機能です",
            "type": "Person",
            "url": activitypub_url
        })
    }
    if (request.nextUrl.pathname == "/activitypub/test") {
        console.log("test")
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
                activitypub.url_to_acct(activity.actor).then(acct => {
                    blog_meta.add_followers(acct).then(response => {
                        activitypub.accept_follow(activity).then(() => {
                            console.log("Follow request by "+acct+" success")
                        }).catch(error => {console.warn(error)})
                    }).catch(error => {console.warn(error)})
                }).catch(error => {console.warn(error)})
                return NextResponse.json({ message: "ok" }, { status: 200 })
            }
            else if(activity.type == "Undo" && activity.object.type == "Follow") {
                console.log("undo follow activity posted")
                activitypub.url_to_acct(activity.actor).then(acct => {
                    blog_meta.rm_followers(acct).then(response => {
                        console.log("Unfollow request by "+acct+" success")
                    }).catch(error => {console.warn(error)})
                }).catch(error => {console.warn(error)})
                return NextResponse.json({ message: "ok" }, { status: 200 })
            }
            else { return NextResponse.json({ message: "Now only follow and undo follow activities are supported" }, { status: 400 }) }
        })
    }
    else { return NextResponse.json({ message: "Bad Request" }, { status: 400 }) }
}