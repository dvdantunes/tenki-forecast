import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children, title = 'Tenki Forecast - Get local weather on your country' }) => (
  <div>
    <Head>
      <title>{ title }</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
    </Head>

    <Header />

    <section id='main-content'>
        { children }
    </section>

    <Footer />
  </div>
)

export default Layout
