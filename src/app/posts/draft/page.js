"use client"
import parse from 'html-react-parser'
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from '@/components/Header';
import ProfCard from "@/components/ProfCard"
import Description from '@/components/Description';
import global_styles from "@/share/global.module.scss"
import styles from "./draft.module.scss"

const replace = (node) => {
    if (node.name === 'img') {
        node.attribs["class"] = (node.attribs["class"] ?? "") + " " + styles.imgcontent
    }
}

export default function Draft() {
    const params = useSearchParams();
    if (!params.get("draft_key")){redirect(params.has("id") ? "/posts/" + params.get("id") : "/")}
    console.log(params.toString())
    var isFirstUseEffect = true
    useEffect(()=>{
        if (isFirstUseEffect){
            isFirstUseEffect = false;
            fetch("/api/draft?"+params.toString(),{ cache: 'no-store' }).then(response =>{
                if (response.status!=200){
                    response.text().then(error_text => render((<p>error:{error_text}</p>),document.getElementById("main")))
                }else{
                    response.json().then(post => {
                        console.log(post)
                        const mainDom = (
                            <>
                                <div className={global_styles.info}>
                                    <Description post={post}></Description>
                                    <ProfCard />
                                </div>
                                <div id="content" className={styles.content}>
                                    <div className={styles.draftwern}>ドラフトページ！！ まだ公開できてないで！</div>
                                    {parse(post.content,{ replace })}
                                </div>
                            </>
                        )
                        const root = createRoot(document.getElementById("main"));
                        root.render(mainDom)
                }
            )}}).catch()
        }
    })
    return (
        <div>
            <Header />
            <div id="main" className={global_styles.main}></div>
        </div>
    );
}