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
                    resolve(Buffer.from(response.data.content, "base64").toString("utf-8"))
                }).catch(error => {
                    console.warn("failed to get from " + path + " on github")
                    console.log(error)
                    reject(error)
                })
            })
        },
        set: function (path,content,message){
            return new Promise((resolve, reject) => {
                octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner: 'momoirodouhu',
                    repo: 'blog-meta',
                    path: path,
                    message: message,
                    content: Buffer.from(content, "utf-8").toString("base64"),
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                }).then(response => {
                    console("updated file: " + path + " on github")
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
            this._wraper.get("_followers").then(response => {
                resolve(response)
            }).catch(error=>{reject(error)})
        })
    },
    set_followers:function(acct){
        return new Promise((resolve, reject) => {
            this._wraper.get("_followers").then(response => {
                resolve(response)
            }).catch(error=>{reject(error)})
        })
    }
}