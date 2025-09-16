import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function CommunitySection(): ReactNode {
  return (
    <section className={clsx('padding-vert--xl', styles.communitySection)}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">Using Our Guides</Heading>
          <p className="hero__subtitle">
            Our documentation covers everything from basic setup to advanced
            configurations. Follow step-by-step instructions tested in real
            environments.
          </p>
        </div>

        <div className="row">
          <div className="col col--6">
            <div className={clsx('card', styles.communityCard)}>
              <div className="card__header">
                <Heading as="h3">Need Help?</Heading>
              </div>
              <div className="card__body">
                <p>
                  Join our active Discord community! Get help from experienced
                  users, share your projects, and stay updated with the latest
                  guides.
                </p>
                <Link
                  className="button button--primary"
                  href="https://discord.gg/ibracorp">
                  Join Discord Community
                </Link>
              </div>
            </div>
          </div>

          <div className="col col--6">
            <div className={clsx('card', styles.communityCard)}>
              <div className="card__header">
                <Heading as="h3">Support Us</Heading>
              </div>
              <div className="card__body">
                <p>
                  Help keep IBRACORP running! Your donations support hosting,
                  development, and creating more awesome content for the
                  community.
                </p>
                <Link
                  className="button button--secondary"
                  href="https://paypal.me/ibracorp">
                  Donate via PayPal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
