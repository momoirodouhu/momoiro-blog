import crypto from 'crypto';
import { headers } from '../../next.config';

export default {
    url_to_acct(url) {
        return new Promise((resolve, reject) => {
            console.log("url to acct: " + url)
            this.get_actor(url).then(actor => {
                const name = actor.preferredUsername || actor.name
                if (name == null) {
                    reject("no acct name found")
                }
                else {
                    const hostname = new URL(url).hostname
                    resolve(actor.preferredUsername + "@" + hostname)
                }
            }).catch(error => { reject(error) })
        })
    },
    acct_to_url(acct) {
        return new Promise((resolve, reject) => {
            console.log("acct to url: " + acct)
            try {
                const hostname = acct.split("@")[1]
                fetch("https://" + hostname + "/.well-known/webfinger?resource=acct:" + acct , {cache: "no-store",} ).then(response => {
                    response.json().then(json => {
                        resolve(json.links.filter(link => link.type == "application/activity+json")[0].href)
                    }).catch(error => { reject(error) })
                }).catch(error => { reject(error) })
            } catch (error) {
                reject(error)
            }
        })
    },
    get_actor(actor) {
        return new Promise((resolve, reject) => {
            console.log("getting actor obj: " + actor)
            const actor_reqest = (actor_url) => {
                this.sign_get_headers(actor_url).then(headers => {
                    fetch(actor_url, { headers: headers , cache: "no-store", }).then(response => {
                        response.json().then(json => {
                            resolve(json)
                        }).catch(error => { reject(error) })
                    }).catch(error => { reject(error) })
                })
            }
            if (/^https:\/\/[\w\(\)\.\-\/]+$/.test(actor)) {
                //urlの時
                actor_reqest(actor)
            }
            else if (/@?[\w\(\)\.\-]+@[\w\(\)\.\-]+/.test(actor)) {
                //acctの時
                this.acct_to_url(actor).then(url => { actor_reqest(url) }).catch(error => { reject(error) })
            } else {
                reject("invalid argument")
            }
        })
    },
    sign_post_headers(body, url) {
        return new Promise((resolve, reject) => {
            const strTime = new Date().toUTCString()
            const pem = process.env.ACTOR_KEY.replace(/\\n/g, '\n')
            const digestHeader = `SHA-256=${crypto.createHash('sha256').update(body).digest('base64')}`;
            const signingString = [
                `(request-target): post ${new URL(url).pathname}`,
                `host: ${new URL(url).hostname}`,
                `date: ${strTime}`,
                `digest: ${digestHeader}`,
            ].join("\n")
            const signature = crypto.sign('sha256', Buffer.from(signingString), pem ).toString('base64');
            const headers = {
                Host: new URL(url).hostname,
                Date: strTime,
                Digest: digestHeader,
                Signature:`keyId="https://${ process.env.HOST_NAME }/activitypub#main-key",algorithm="rsa-sha256",headers="(request-target) host date digest",signature="${signature}"`,
                "Accept": 'application/activity+json',
                'Content-Type': 'application/activity+json',
            }
            resolve(headers)
        })
    },
    sign_get_headers(url) {
        return new Promise((resolve, reject) => {
            const strTime = new Date().toUTCString()
            const pem = process.env.ACTOR_KEY.replace(/\\n/g, '\n')
            const signingString = [
                `(request-target): post ${new URL(url).pathname}`,
                `host: ${new URL(url).hostname}`,
                `date: ${strTime}`,
            ].join("\n")
            const signature = crypto.sign('sha256', Buffer.from(signingString), pem ).toString('base64');
            const headers = {
                Host: new URL(url).hostname,
                Date: strTime,
                Signature:`keyId="https://${ process.env.HOST_NAME }/activitypub#main-key",algorithm="rsa-sha256",headers="(request-target) host date digest",signature="${signature}"`,
                "Accept": "application/activity+json"
            }
            resolve(headers)
        })
    },
    post_to_inbox(actor, object) {
        return new Promise((resolve, reject) => {
            this.get_actor(actor).then(({ inbox }) => {
                this.sign_post_headers(JSON.stringify(object), inbox).then(headers => {
                    fetch(inbox, { method: "POST", body: JSON.stringify(object), headers ,cache: "no-store",}).then(response => {
                        if (response.ok) {
                            console.log("success posting to index: " + inbox)
                            resolve()
                        } else {
                            console.log("posting failed status: " + response.status)
                            console.log(response)
                            reject("posting failed status: " + response.status)
                        }
                    }).catch(error => { reject(error) })
                }).catch(error => { reject(error) })
            }).catch(error => { reject(error) })
        })
    },
    accept_follow(follow_activity) {
        const body = {
            '@context': 'https://www.w3.org/ns/activitystreams',
            id: `https://` + process.env.HOST_NAME + `/activitypub/activity/` + crypto.randomUUID(),
            type: 'Accept',
            actor: `https://` + process.env.HOST_NAME + `/activitypub`,
            object: structuredClone(follow_activity),
        }
        console.log("posting accept follow: " + follow_activity.actor)
        return this.post_to_inbox(follow_activity.actor, body)
    }
}
