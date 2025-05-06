import Image from "next/image";
import Head from 'next/head';
// import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Tasks from "./components/Tasks";
export default function Home() {
  return (
    <div className="bg-[#191D26] font-inter text-white min-h-screen">
    <Head>
      <title>Tasker | Learn with Sumit</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Sora:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    {/* <Navbar /> */}
    <Hero />
      <Tasks />
    <Footer />
  </div>
  );
}
