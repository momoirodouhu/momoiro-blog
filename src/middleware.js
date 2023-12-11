import { NextResponse } from 'next/server'

export function middleware(req) {
    //console.log(req.method +": "+ req.nextUrl.pathname)
    if(req.headers.get("accept").includes("application/activity+json")){
        return NextResponse.rewrite(new URL('/api/activitypub', req.url))
    }
}