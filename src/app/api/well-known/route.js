import { NextResponse } from 'next/server';

export function GET(request) {
    console.log(request.nextUrl.pathname)
    if (request.nextUrl.pathname == "/.well-known/webfinger"
        && request.nextUrl.searchParams.get("resource") == "acct:momoiro_archive@"+process.env.HOST_NAME) {
            // /.well-known/webfinger?resource=acct:momoiro_archive@blog.momoiro.me
        return NextResponse.json({
            "subject": "acct:momoiro_archive@"+process.env.HOST_NAME,
            "links": [
                {
                    "rel": "self",
                    "type": "application/activity+json",
                    "href": "https://"+process.env.HOST_NAME+"/activitypub"
                }
            ]
        })
    }
    return NextResponse.json({ message: "Bad Request" ,
        error_description:"Webfinger request is only acct:momoiro_archive@"+process.env.HOST_NAME}, { status: 400 })
}