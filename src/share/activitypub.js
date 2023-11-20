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
                fetch("https://" + hostname + "/.well-known/webfinger?resource=acct:" + acct).then(response => {
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
            const actor_reqest = function (actor_url) {
                fetch(actor_url, { headers: { "Accept": "application/activity+json" } }).then(response => {
                    response.json().then(json => {
                        resolve(json)
                    }).catch(error => { reject(error) })
                }).catch(error => { reject(error) })
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
    sign_headers(body, inbox) {
        //minidon参考にというかほぼ同じ
        return new Promise((resolve, reject) => {
            console.log("inbox: " + inbox)
            const strTime = new Date().toUTCString()
            const pem = process.env.ACTOR_KEY
            const pemContents = pem.substring("-----BEGIN PRIVATE KEY-----".length, pem.length - "-----END PRIVATE KEY-----".length,);
            crypto.subtle.importKey(
                "pkcs8",
                Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0)),
                { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256', },
                false,
                ["sign"]
            ).then(crypt_key => {
                crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(body))).then(s => {
                    const s256 = btoa(String.fromCharCode(...new Uint8Array(s)))
                    crypto.subtle.sign(
                        'RSASSA-PKCS1-v1_5',
                        crypt_key,
                        Uint8Array.from(`(request-target): post ` + new URL(inbox).pathname + `\n` +
                            `host: ` + new URL(inbox).hostname + `\n` +
                            `date: ` + strTime + `\n` +
                            `digest: SHA-256=` + s256,
                            (c) => c.charCodeAt(0))
                    ).then(sig => {
                        const headers = {
                            Host: new URL(inbox).hostname,
                            Date: strTime,
                            Digest: `SHA-256=` + s256,
                            Signature:
                                `keyId="https://` + process.env.HOST_NAME + `/activitypub",` +
                                `algorithm="rsa-sha256",` +
                                `headers="(request-target) host date digest",` +
                                `signature=` + btoa(String.fromCharCode(...new Uint8Array(sig))) + `"`,
                            "Accept": 'application/activity+json',
                            'Content-Type': 'application/activity+json',
                        }
                        resolve(headers)
                    }).catch(error => { reject(error) })
                }).catch(error => { reject(error) })
            }).catch(error => { reject(error) })
        }).catch(error => { reject(error) })
    },
    post_to_inbox(actor, body) {
        return new Promise((resolve, reject) => {
            this.get_actor(actor).then(({ inbox }) => {
                this.sign_headers(body, inbox).then(headers => {
                    console.log(headers)
                    console.log(body)
                    fetch(inbox, { method: "POST", body: JSON.stringify(body), headers }).then(response => {
                        console.log("success posting to index: " + inbox)
                        resolve(response.json())
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
            object: follow_activity,
        }
        console.log("posting accept follow: " + follow_activity.actor)
        return this.post_to_inbox(follow_activity.actor, body)
    }
}
