import { parseISO, differenceInDays } from 'date-fns';
import microcms from '@/share/microcms';

export default async function sitemap(){
    const rootUrl = "https://blog.momoiro.me"
    var posts = await microcms.getAllContents({endpoint: "posts"})
    posts = posts.map((post) => {return post.id})
    return [
        {
            url:rootUrl + "/",
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url:rootUrl + "/About",
            lastModified:"2023-10-28T11:17:24.021+09:00",
            changeFrequency: 'yearly',
            priority: 0.5,
        }
    ].concat(posts.map((id,updatedAt)=>{
        const daysDifference = differenceInDays(new Date, parseISO(updatedAt));
        return{
            url:rootUrl + "/posts/" + id,
            lastModified:updatedAt,
            changeFrequency:daysDifference >= 2 ? "daily" : "monthly",
            priority: 1,
        }
    }))
}