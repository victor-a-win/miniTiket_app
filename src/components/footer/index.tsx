'use client'
import "./footer.styles.css"

import { ChevronDoubleUpIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"

export default function Footer() {
    const router = useRouter()
    return (
        <div className="Footer-Styles flex flex-col bg-black">
            <button 
                title="Back To HomePage" 
                className="justify-items-center scroll-smooth" onClick={() => router.push("/")}>
                <ChevronDoubleUpIcon className="Back-to-HomePage size-11 text-sky-500 sm:size-16 cursor-pointer hover:bg-gray-600 p-1 rounded-md" />
            </button>

            <div className=
                "ml-auto mr-auto text-lg text-orange-400 text-center font-bold sm:text-3xl/8"
                > BACK TO HOMEPAGE
            </div>

            <div className="bg-black text-sm text-white text-center sm:text-lg/10">
                © 2025 miniTiket Projek Studio. All rights reserved.
            </div>
        </div>
    )
}