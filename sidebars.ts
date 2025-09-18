import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // IBRACORP Documentation Sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Gaming Servers',
      items: ['gaming/minecraft-server'],
    },
    {
      type: 'category',
      label: 'Media Servers & Management',
      items: ['media/plex-setup', 'media/unmanic'],
    },
    {
      type: 'category',
      label: 'Networking',
      items: ['networking/cloudflare-tunnel', 'networking/vpn-setup'],
    },
    {
      type: 'category',
      label: 'Reverse Proxies',
      items: ['reverse-proxies/nginx-proxy-manager'],
    },
    {
      type: 'category',
      label: 'Security',
      items: ['security/authelia'],
    },
    {
      type: 'category',
      label: 'Tools & Utilities',
      items: [
        'tools/docker-compose',
        'tools/file-browser',
        'tools/homarr',
        'tools/theme-park',
      ],
    },
  ],
};

export default sidebars;
