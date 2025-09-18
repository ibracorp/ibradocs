#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Interactive documentation generator for IBRACORP docs
 * Creates new documentation files based on the template
 */
class DocGenerator {
  constructor() {
    this.templatePath = './static/templates/template.md';
    this.docsDir = './docs';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Categories from https://docs.ibracorp.io/ibracorp/all-guides-in-order/documentation
    this.categories = {
      'gaming': {
        name: 'Gaming Servers',
        description: 'Game server hosting and management'
      },
      'media-servers': {
        name: 'Media Servers and Management',
        description: 'Plex, Jellyfin, *arr stack, and media management'
      },
      'misc-tools': {
        name: 'Miscellaneous Tools',
        description: 'Utilities, productivity tools, and general applications'
      },
      'networking': {
        name: 'Networking',
        description: 'Network configuration, VPNs, and connectivity'
      },
      'reverse-proxies': {
        name: 'Reverse Proxies',
        description: 'Traefik, NGINX, and reverse proxy configurations'
      },
      'security': {
        name: 'Security',
        description: 'Authentication, authorization, and security tools'
      },
      'servers': {
        name: 'Servers',
        description: 'Server setup, virtualization, and infrastructure'
      }
    };
  }

  // Helper to get user input
  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  // Display category options
  displayCategories() {
    console.log('\n📁 Available Categories:');
    console.log('========================');

    Object.entries(this.categories).forEach(([key, category], index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   ${category.description}`);
      console.log('');
    });
  }

  // Validate category selection
  validateCategorySelection(input) {
    const num = parseInt(input);
    const categoryKeys = Object.keys(this.categories);

    if (num >= 1 && num <= categoryKeys.length) {
      return categoryKeys[num - 1];
    }

    // Check if they entered the category key directly
    if (categoryKeys.includes(input.toLowerCase())) {
      return input.toLowerCase();
    }

    return null;
  }

  // Create filename from title
  createFilename(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Ensure category directory exists
  ensureCategoryDir(category) {
    const categoryPath = path.join(this.docsDir, category);

    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });

      // Create _category_.json if it doesn't exist
      const categoryJsonPath = path.join(categoryPath, '_category_.json');
      if (!fs.existsSync(categoryJsonPath)) {
        const categoryData = {
          label: this.categories[category].name,
          position: this.getCategoryPosition(category),
          collapsible: true,
          collapsed: false
        };

        fs.writeFileSync(categoryJsonPath, JSON.stringify(categoryData, null, 2), 'utf8');
        console.log(`✅ Created category configuration: ${category}/_category_.json`);
      }
    }

    return categoryPath;
  }

  // Get category position for ordering
  getCategoryPosition(category) {
    const positions = {
      'security': 1,
      'reverse-proxies': 2,
      'networking': 3,
      'media-servers': 4,
      'gaming': 5,
      'misc-tools': 6,
      'servers': 7
    };
    return positions[category] || 99;
  }

  // Generate the documentation file
  async generateDoc() {
    console.log('🚀 IBRACORP Documentation Generator');
    console.log('===================================\n');

    try {
      // Get title
      const title = await this.question('📝 Enter the application/service title: ');
      if (!title.trim()) {
        console.log('❌ Title cannot be empty!');
        this.rl.close();
        return;
      }

      // Get description
      const description = await this.question('📄 Enter a one-sentence description: ');
      if (!description.trim()) {
        console.log('❌ Description cannot be empty!');
        this.rl.close();
        return;
      }

      // Display and get category
      this.displayCategories();
      const categoryInput = await this.question('🗂️  Select category (number or name): ');
      const category = this.validateCategorySelection(categoryInput);

      if (!category) {
        console.log('❌ Invalid category selection!');
        return;
      }

      // Get optional fields
      const officialDocs = await this.question('🔗 Official documentation URL (optional): ');
      const mainWebsite = await this.question('🌐 Main website URL (optional): ');
      const repoName = await this.question('📦 Repository name (for Unraid template): ');

      // Read template
      if (!fs.existsSync(this.templatePath)) {
        console.log('❌ Template file not found!');
        return;
      }

      let templateContent = fs.readFileSync(this.templatePath, 'utf8');

      // Replace placeholders
      templateContent = templateContent
        .replace(/APP TITLE/g, title)
        .replace(/APPNAME/g, title)
        .replace(/ENTER ONE SENTENCE DESCRIPTION HERE/g, description)
        .replace(/\[category, ibracorp\]/g, `["${category}", "ibracorp"]`)
        .replace(/ADD_OFFICIAL_DOCS_URL_HERE/g, officialDocs || '#')
        .replace(/ADD_MAIN_WEBSITE_URL_HERE/g, mainWebsite || '#')
        .replace(/REPO's Repository/g, repoName ? `${repoName}'s Repository` : "REPO's Repository");

      // Create filename and path
      const filename = this.createFilename(title);
      const categoryPath = this.ensureCategoryDir(category);
      const filepath = path.join(categoryPath, `${filename}.md`);

      // Check if file already exists
      if (fs.existsSync(filepath)) {
        const overwrite = await this.question(`⚠️  File ${filename}.md already exists. Overwrite? (y/N): `);
        if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
          console.log('📋 Operation cancelled.');
          return;
        }
      }

      // Write file
      fs.writeFileSync(filepath, templateContent, 'utf8');

      console.log('\n🎉 Documentation file created successfully!');
      console.log('==========================================');
      console.log(`📁 Category: ${this.categories[category].name}`);
      console.log(`📄 File: ${path.relative('.', filepath)}`);
      console.log(`🔗 URL: /docs/${category}/${filename}`);
      console.log('\n💡 Next steps:');
      console.log('- Edit the file to add your content');
      console.log('- Remove placeholder text and sections');
      console.log('- Add screenshots and code examples');
      console.log('- Remove the internal warning box before publishing');

    } catch (error) {
      console.log('❌ Error:', error.message);
    } finally {
      this.rl.close();
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new DocGenerator();
  generator.generateDoc().catch(console.error);
}

module.exports = DocGenerator;