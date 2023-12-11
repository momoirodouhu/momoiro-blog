import { NextResponse } from 'next/server';
import blog_meta from "@/share/github"
import activitypub from '@/share/activitypub';
import microcms from "@/share/microcms";
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
                "publicKeyPem": crypto.createPublicKey(process.env.ACTOR_KEY.replace(/\\n/g, '\n')).export({ type: "spki", format: "pem" }),
                "type": "Key"
            },
            "summary": "桃色ArchiveのActivityPub連合機能です",
            "type": "Person",
            "url": activitypub_url
        })
    }
    else if ((/^\/posts\/[0-9a-z\_]+$/g).test(request.nextUrl.pathname)) {
        // /posts/:id
        const id = request.nextUrl.pathname.replace("/posts/", "")
        console.log("note object id: " + id)
        return microcms.get({ endpoint: "posts", contentId: id }).then(post => {
            const activitypub_url = "https://" + process.env.HOST_NAME + "/activitypub"
            const note = {
                '@context': 'https://www.w3.org/ns/activitystreams',
                'type': 'Note',
                'id': "https://" + process.env.HOST_NAME + "/posts/" + id,
                'attributedTo': activitypub_url,
                'content': post.content,
                'published': post.updatedAt,
                'to': [
                    'https://www.w3.org/ns/activitystreams#Public',
                    activitypub_url + '/follower',
                ]
            }
            return NextResponse.json(note, { headers: { "Content-Type": "application/activity+json" }, status: 200 })
        })
    }
    else if (request.nextUrl.pathname == "/activitypub/test") {
        console.log("test")
        if (request.nextUrl.searchParams.has("url")) {
            return fetch(request.nextUrl.searchParams.get("url"), { headers: { "Accept": "application/activity+json" }, cache: "no-store", }).then(response => {
                return response.text().then(text => {
                    return new NextResponse(text)
                })
            }).catch(error => new NextResponse.json({ message: "Bad Request", detail: error }, { status: 500 }))
        } else {
            return NextResponse.json({ message: "Bad Request" }, { status: 400 })
        }
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
                    blog_meta.add_followers(activity.actor).then(response => {
                        activitypub.accept_follow(activity).then(() => {
                            console.log("Follow request by " + activity.actor + " success")
                        }).catch(error => { console.warn(error) })
                    }).catch(error => { console.warn(error) })
                return NextResponse.json({ message: "ok" }, { status: 200 })
            }
            else if (activity.type == "Undo" && activity.object.type == "Follow") {
                console.log("undo follow activity posted")
                    blog_meta.rm_followers(activity.actor).then(response => {
                        console.log("Unfollow request by " + activity.actor + " success")
                    }).catch(error => { console.warn(error) })
                return NextResponse.json({ message: "ok" }, { status: 200 })
            }
            else { return NextResponse.json({ message: "Now only follow and undo follow activities are supported" }, { status: 400 }) }
        })
    }
    else { return NextResponse.json({ message: "Bad Request" }, { status: 400 }) }
}