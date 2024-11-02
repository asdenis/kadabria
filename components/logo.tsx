"use client"

import Image from "next/image"

export default function NavLogoImage() {
  
    return (
        <>
          <div className="flex items-center justify-center center">
            <Image
              className="w-full object-contain h-full rounded-sm"
              alt="KadabrIA Logo"
              src='/logos/kadabria_glow_logo2.png'
              width={200}
              height={200}
            />
          </div>
        </>
      )
    
}