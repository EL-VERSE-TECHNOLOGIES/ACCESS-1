import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/jpeg" href="/images/new_logo.jpg" />
        <link rel="apple-touch-icon" href="/images/new_logo.jpg" />
        <meta name="theme-color" content="#020617" />
        <meta name="description" content="EL ACCESS - Official Internship Arm of EL VERSE" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
