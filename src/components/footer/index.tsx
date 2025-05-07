'use client'
import "./footer.styles.css"

import { ChevronDoubleUpIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"

export default function Footer() {
    const router = useRouter()
    return (
        <div className="Footer-Styles flex flex-col">
            <button 
                title="Back To HomePage" 
                className="justify-items-center scroll-smooth" onClick={() => router.push("/")}>
                <ChevronDoubleUpIcon className=
                    "Back-to-HomePage size-11 text-sky-500 sm:size-16 cursor-pointer hover:bg-gray-600 p-1 rounded-md" 
                />
            </button>

            <div className=
                "Footer-Botton-Styles ml-auto mr-auto text-2xl text-center sm:text-lg"
                > BACK TO HOMEPAGE
            </div>

            <div className=
                "License-Caption-Styles text-sm text-center sm:text-sm/10">
                © 2025 miniTiket Projek Studio. All rights reserved.
            </div>
        </div>
    )
}