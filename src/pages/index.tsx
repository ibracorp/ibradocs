import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import StatusSection from '@site/src/components/StatusSection';
import CommunitySection from '@site/src/components/CommunitySection';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Welcome to {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg margin-right--md"
            to="/intro">
            Get Started 🚀
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            href="https://discord.gg/ibracorp">
            Join Discord 💬
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="IBRADOCS - Your comprehensive guide to self-hosting, gaming servers, media management, and homelab infrastructure. Created by IBRACORP.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <StatusSection />
        <CommunitySection />
      </main>
    </Layout>
  );
}
