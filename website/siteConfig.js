/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  // {
  //   caption: 'User1',
  //   // You will need to prepend the image path with your baseUrl
  //   // if it is not '/', like: '/test-site/img/image.jpg'.
  //   image: '/img/undraw_open_source.svg',
  //   infoLink: 'https://www.facebook.com',
  //   pinned: true,
  // },
];

const siteConfig = {
  title: 'AdJS', // Title for your website.
  tagline: 'Ads integration library',
  url: 'https://adj.dev/docs', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'AdJS',
  organizationName: 'Stephen Baldwin',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: "readme", label: "Docs" },
    { href: "https://github.com/econify/ad.js", label: "GitHub", external: true },
    // Determines search bar position among links
    { search: true }

//     * Getting started
//   * [Quick Start](README.md)
//   * [Usage](lifecycle-controls.md)
//   * [Example Code](example-code.md)

// * Plugins
// 	* [Lazy Load / Auto Render](lazy-load-plugin.md)
// 	* [Responsive Ads](responsive-plugin.md)
// 	* [Auto Refresh](refresh-plugin.md)
// 	* [Sticky Ads](sticky-plugin.md)
// 	* [Developer Tools](tools-plugin.md)

// * Networks
//   * [Default / Dev](default-network.md)
//   * [DFP / GPT](dfp-network.md)
//   * [Krux](krux-module.md)

// * Advanced Usage
//   * [Single Page App](spa.md)
//   * [Debugging](tools-plugin.md)
//   * [Writing Plugins](writing-plugins.md)
//   * [Custom Networks](custom-networks.md)
//   * [Common Errors](error.md)

  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  // headerIcon: 'img/favicon.ico',
  // footerIcon: 'img/favicon.ico',
  // favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#42b983',
    secondaryColor: '#42b983',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Your Name or Your Company Name`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  docsSideNavCollapsible: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  // repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
