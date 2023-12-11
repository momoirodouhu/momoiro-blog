import { Octokit } from "octokit"

const octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY,
});

const { data: { login }, } = await octokit.rest.users.getAuthenticated();
console.log("github user: %s", login);

export default {
    _wraper: {
        get: function (path) {
            return new Promise((resolve, reject) => {
                octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                    owner: 'momoirodouhu',
                    repo: 'blog-meta',
                    path: path,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                }).then(response => {
                    resolve({content:Buffer.from(response.data.content, "base64").toString("utf-8"),sha:response.data.sha})
                }).catch(error => {
                    console.warn("failed to get from " + path + " on github")
                    console.log(error)
                    reject(error)
                })
            })
        },
        set: function (path,sha,content,message){
            return new Promise((resolve, reject) => {
                octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner: 'momoirodouhu',
                    repo: 'blog-meta',
                    path: path,
                    message: message,
                    content: Buffer.from(content, "utf-8").toString("base64"),
                    sha:sha,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                }).then(response => {
                    console.log("updated file: " + path + " on github")
                    resolve(response)
                }).catch(error => {
                    console.warn("failed to update " + path + " on github")
                    console.log(error)
                    reject(error)
                })
            })
        },
    },
    get_followers:function() {
        return new Promise((resolve, reject) => {
            this._wraper.get("_followers").then(({content}) => {
                try{
                    resolve(JSON.parse(content).followers)
                }catch (error) {
                    console.warn(error)
                    console.log(content)
                    reject(error)
                }
            }).catch(error=>{reject(error)})
        })
    },
    add_followers:function(actor_url){
        return new Promise((resolve, reject) => {
            this._wraper.get("_followers").then(({content,sha}) => {
                try{
                    var followers = JSON.parse(content).followers
                    if(followers.includes(actor_url)){
                        console.log("already followed by "+actor_url)
                        resolve()
                    }
                    else{
                        console.log("adding follower: "+actor_url)
                        followers.push(actor_url)
                        this._wraper.set("_followers",sha,JSON.stringify({followers:followers}),"Followed by "+actor_url).then(response => {
                            resolve(actor_url)
                        }).catch(error=>{
                            console.warn(error)
                            reject(error)
                        })
                    }
                }catch (error) {
                    console.warn(error)
                    console.log(content)
                    reject(error)
                }
            }).catch(error=>{reject(error)})
        })
    },
    rm_followers:function(actor_url){
        return new Promise((resolve, reject) => {
            this._wraper.get("_followers").then(({content,sha}) => {
                try{
                    var followers = JSON.parse(content).followers
                    if(!followers.includes(actor_url)){
                        console.log("not followed by "+actor_url)
                        resolve()
                    }
                    else{
                        console.log("removing follower: "+actor_url)
                        followers.splice(followers.indexOf(actor_url), 1)
                        this._wraper.set("_followers",sha,JSON.stringify({followers:followers}),"Unfollowed by "+actor_url).then(response => {
                            resolve()
                        }).catch(error=>{
                            console.warn(error)
                            reject(error)
                        })
                    }
                }catch (error) {
                    console.warn(error)
                    console.log(content)
                    reject(error)
                }
            }).catch(error=>{reject(error)})
        })
    }
}