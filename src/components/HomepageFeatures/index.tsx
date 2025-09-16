import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  icon?: string;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Gaming Servers',
    icon: '🎮',
    description: (
      <>
        Set up and manage game servers including Minecraft, Palworld, and more.
        Complete guides for installation, configuration, and optimization.
      </>
    ),
    link: '/docs/category/gaming-servers',
  },
  {
    title: 'Media Servers & Management',
    icon: '📺',
    description: (
      <>
        Build your perfect media setup with Plex, Jellyfin, Sonarr, Radarr, and
        related automation tools for your media library.
      </>
    ),
    link: '/docs/category/media-servers--management',
  },
  {
    title: 'Networking',
    icon: '🌐',
    description: (
      <>
        Network configuration, VPNs, firewalls, and connectivity solutions.
        Learn to secure and optimize your network infrastructure.
      </>
    ),
    link: '/docs/category/networking',
  },
  {
    title: 'Reverse Proxies',
    icon: '🔄',
    description: (
      <>
        Nginx Proxy Manager, Traefik, and other reverse proxy solutions. Secure
        external access to your self-hosted services.
      </>
    ),
    link: '/docs/category/reverse-proxies',
  },
  {
    title: 'Security',
    icon: '🔒',
    description: (
      <>
        Protect your infrastructure with proper authentication, SSL
        certificates, and security best practices for self-hosted environments.
      </>
    ),
    link: '/docs/category/security',
  },
  {
    title: 'Misc. Tools',
    icon: '🛠️',
    description: (
      <>
        Additional tools and utilities for your homelab including monitoring,
        backup solutions, and productivity applications.
      </>
    ),
    link: '/docs/category/misc-tools',
  },
];

function Feature({ title, Svg, icon, description, link }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="card margin-bottom--lg">
        <div className="card__header">
          <div className="text--center">
            {icon && (
              <div className={styles.featureIcon} role="img">
                {icon}
              </div>
            )}
            {Svg && <Svg className={styles.featureSvg} role="img" />}
          </div>
          <Heading as="h3" className="text--center">
            {title}
          </Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <a href={link} className="button button--primary button--block">
            Explore {title}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
