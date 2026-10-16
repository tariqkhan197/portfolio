import Stage from './components/Stage';
import { Preloader, Hud, Cursor } from './components/Chrome';
import Hero from './scenes/Hero';
import About from './scenes/About';
import Work from './scenes/Work';
import Journey from './scenes/Journey';
import Skills from './scenes/Skills';
import Awards from './scenes/Awards';
import Contact from './scenes/Contact';

export default function App() {
  return (
    <>
      <Stage />
      <main>
        <Hero />
        <About />
        <Work />
        <Journey />
        <Skills />
        <Awards />
        <Contact />
      </main>
      <Hud />
      <Cursor />
      <Preloader />
    </>
  );
}
