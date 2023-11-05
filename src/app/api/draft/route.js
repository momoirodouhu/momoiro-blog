import { NextResponse } from 'next/server';
import microcms from "@/share/microcms";

export function GET(request) {
    const params = request.nextUrl.searchParams;
    if((!params.get("id")) || (!params.get("draft_key"))){
        return NextResponse.json({ message: "Bad Request"}, { status: 400 })
    }
    console.log("draft proxy : " + params)
    return microcms.get({endpoint: "posts",contentId:params.get("id"),queries: { draftKey: params.get("draft_key") }})
        .then(response => {
            return NextResponse.json(response)
        }).catch(error =>{return NextResponse.json({ message: "Inter ServerError",error_description:error }, { status: 500 })})
}