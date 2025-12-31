import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UseClaudeCode from './components/UseClaudeCode';
import PricingTabs from './components/PricingTabs';
import UseCases from './components/UseCases';
import SlackIntegration from './components/SlackIntegration';
import Testimonials from './components/Testimonials';
import CliTools from './components/CliTools';
import Faq from './components/Faq';
import TechnicalRundown from './components/TechnicalRundown';
import CtaNewsletter from './components/CtaNewsletter';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <UseClaudeCode />
      <PricingTabs />
      <UseCases />
      <SlackIntegration />
      <Testimonials />
      <CliTools />
      <Faq />
      <TechnicalRundown />
      <CtaNewsletter />
      <Footer />
    </main>
  );
}
