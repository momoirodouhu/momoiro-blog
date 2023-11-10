import { NextResponse } from 'next/server';

export function GET(request) {
    console.log(request.nextUrl.pathname)
    if (request.nextUrl.pathname == "/.well-known/webfinger"
        && request.nextUrl.searchParams.get("resource") == "acct:momoiro_archive@blog.momoiro.me") {
            // /.well-known/webfinger?resource=acct:momoiro_archive@blog.momoiro.me
        return NextResponse.json({
            "subject": "acct:momoiro_archive@blog.momoiro.me",
            "links": [
                {
                    "rel": "self",
                    "type": "application/activity+json",
                    "href": "https://blog.momoiro.me/activitypub"
                }
            ]
        })
    }
    return NextResponse.json({ message: "Bad Request"}, { status: 400 })
}