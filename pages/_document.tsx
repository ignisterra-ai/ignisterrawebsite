import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="晟垚智能科技 (Ignis Terra) delivers warm, practical AI solutions that collaborate with humans rather than replace them. Our proven AI systems adapt to your business needs to solve real challenges." />
        <meta name="keywords" content="AI Solutions, Human-AI Collaboration, Enterprise Intelligence, Corporate AI Genesis, Customized AI, Business Decision Support, Knowledge Management, AI Ecosystem, 晟垚智能科技, Ignis Terra, Warm Intelligence" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ignisterra.ai/" />
        <meta property="og:title" content="晟垚智能科技 | Ignis Terra AI Solution" />
        <meta property="og:description" content="晟垚智能科技 (Ignis Terra) delivers warm, practical AI solutions that collaborate with humans rather than replace them. Our proven AI systems adapt to your business needs to solve real challenges." />
        <meta property="og:image" content="https://ignisterra.ai/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ignisterra.ai/" />
        <meta property="twitter:title" content="晟垚智能科技 | Ignis Terra AI Solution" />
        <meta property="twitter:description" content="晟垚智能科技 (Ignis Terra) delivers warm, practical AI solutions that collaborate with humans rather than replace them. Our proven AI systems adapt to your business needs to solve real challenges." />
        <meta property="twitter:image" content="https://ignisterra.ai/og-image.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 