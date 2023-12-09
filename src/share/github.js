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
    add_followers:function(acct){
        return new Promise((resolve, reject) => {
            this._wraper.get("_followers").then(({content,sha}) => {
                try{
                    var followers = JSON.parse(content).followers
                    if(followers.includes(acct)){
                        console.log("already followed by "+acct)
                        resolve()
                    }
                    else{
                        followers.push(acct)
                        this._wraper.set("_followers",sha,JSON.stringify({followers:followers}),"Followed by "+acct).then(response => {
                            resolve(acct)
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
    rm_followers:function(acct){
        return new Promise((resolve, reject) => {
            this._wraper.get("_followers").then(({content,sha}) => {
                try{
                    var followers = JSON.parse(content).followers
                    if(!followers.includes(acct)){
                        console.log("not followed by "+acct)
                        resolve()
                    }
                    else{
                        followers.splice(followers.indexOf(acct), 1)
                        this._wraper.set("_followers",sha,JSON.stringify({followers:followers}),"Unfollowed by "+acct).then(response => {
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