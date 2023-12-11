import { NextResponse } from 'next/server'

export function middleware(request) {
    //console.log(request.method +": "+ request.nextUrl.pathname)
    if(request.headers.get("accept")?.includes("application/activity+json") ||
    request.nextUrl.pathname.startsWith("/activitypub")){
        return NextResponse.rewrite(new URL('/api/activitypub', request.url))
    }
}