import React from "react";
import { NextSeo } from 'next-seo';

const Head = ({ title, description, image, url }) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        url: url ? `https://www.fabricandsewing.com/${url}` : "",
        title: title,
        description: description,
        images: [{
          url: image
        }]
      }}
    />
  )
}

export default Head;
