'use client'
import Image, { ImageProps } from 'next/image'
import React, { useState } from 'react'

const ImageApi = (props?: ImageProps) => {
    const [imgSrc, setImgSrc] = useState(props?.src ? `${props.src}` : "/images/notfound.png");
    // const [imgSrc, setImgSrc] = useState(props?.src ? `${process.env.NEXT_PUBLIC_BASE_URL}${props.src}` : "/sdkf");

    const handleError = () => {
        setImgSrc('/images/notfound.png');
    };
    const pro = { ...props }
    delete pro.src
    delete pro.alt
    delete pro.onError
    return (
        imgSrc != undefined &&
        <Image
            src={imgSrc || '/images/notfound.png'}
            alt={props?.alt || "notfound"}
            onError={handleError}
            {...pro}
        />
    );
}

export default ImageApi