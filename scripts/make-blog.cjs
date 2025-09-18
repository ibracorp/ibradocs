#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Interactive blog post generator for IBRACORP blog
 * Creates new blog posts based on the blog template
 */
class BlogGenerator {
  constructor() {
    this.templatePath = './static/templates/blog-template.md';
    this.blogDir = './blog';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Available authors from authors.yml
    this.authors = {
      sycotix: 'Sycotix (Admin, Writer & Producer)',
      north: 'North (Contributor & Developer)',
      hawks: 'Hawks (Admin & Testing Lead)',
      discduck: 'DiscDuck (Admin & Documentation Lead)',
    };

    // Available tags from tags.yml
    this.availableTags = [
      'ibracorp',
      'gaming',
      'media',
      'networking',
      'security',
      'reverse-proxy',
      'docker',
      'unraid',
      'self-hosted',
      'homelab',
    ];
  }

  // Helper to get user input
  async question(prompt) {
    return new Promise(resolve => {
      this.rl.question(prompt, resolve);
    });
  }

  // Display author options
  displayAuthors() {
    console.log('\n👤 Available Authors:');
    console.log('====================');

    Object.entries(this.authors).forEach(([key, name], index) => {
      console.log(`${index + 1}. ${name} (${key})`);
    });
    console.log('');
  }

  // Display tag options
  displayTags() {
    console.log('\n🏷️  Available Tags:');
    console.log('==================');

    this.availableTags.forEach((tag, index) => {
      console.log(`${index + 1}. ${tag}`);
    });
    console.log('');
  }

  // Validate author selection
  validateAuthorSelection(input) {
    const num = parseInt(input);
    const authorKeys = Object.keys(this.authors);

    if (num >= 1 && num <= authorKeys.length) {
      return authorKeys[num - 1];
    }

    // Check if they entered the author key directly
    if (authorKeys.includes(input.toLowerCase())) {
      return input.toLowerCase();
    }

    return null;
  }

  // Parse and validate tag selection
  parseTagSelection(input) {
    if (!input.trim()) return ['ibracorp']; // Default tag

    const tags = input.split(',').map(tag => tag.trim());
    const validTags = [];

    tags.forEach(tag => {
      const num = parseInt(tag);

      // If it's a number, convert to tag name
      if (num >= 1 && num <= this.availableTags.length) {
        validTags.push(this.availableTags[num - 1]);
      }
      // If it's a direct tag name
      else if (this.availableTags.includes(tag.toLowerCase())) {
        validTags.push(tag.toLowerCase());
      }
    });

    // Always include ibracorp tag if not present
    if (!validTags.includes('ibracorp')) {
      validTags.unshift('ibracorp');
    }

    return validTags.length > 0 ? validTags : ['ibracorp'];
  }

  // Create slug from title
  createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Get current date in YYYY-MM-DD format
  getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  // Create blog post directory
  createBlogDirectory(date, slug) {
    const dirName = `${date}-${slug}`;
    const blogPath = path.join(this.blogDir, dirName);

    if (!fs.existsSync(blogPath)) {
      fs.mkdirSync(blogPath, { recursive: true });

      // Create img subdirectory for images
      const imgPath = path.join(blogPath, 'img');
      fs.mkdirSync(imgPath, { recursive: true });

      console.log(`✅ Created blog directory: ${dirName}/`);
      console.log(`✅ Created image directory: ${dirName}/img/`);
    }

    return blogPath;
  }

  // Generate the blog post file
  async generateBlog() {
    console.log('📝 IBRACORP Blog Post Generator');
    console.log('==============================\n');

    try {
      // Get title
      const title = await this.question('📰 Enter the blog post title: ');
      if (!title.trim()) {
        console.log('❌ Title cannot be empty!');
        this.rl.close();
        return;
      }

      // Get description
      const description = await this.question(
        '📄 Enter a one-sentence description: '
      );
      if (!description.trim()) {
        console.log('❌ Description cannot be empty!');
        this.rl.close();
        return;
      }

      // Display and get author
      this.displayAuthors();
      const authorInput = await this.question(
        '👤 Select author (number or username): '
      );
      const author = this.validateAuthorSelection(authorInput);

      if (!author) {
        console.log('❌ Invalid author selection!');
        return;
      }

      // Display and get tags
      this.displayTags();
      const tagsInput = await this.question(
        '🏷️  Select tags (numbers or names, comma-separated, default: ibracorp): '
      );
      const tags = this.parseTagSelection(tagsInput);

      // Get optional date (default to today)
      const dateInput = await this.question(
        `📅 Publication date (YYYY-MM-DD, default: ${this.getCurrentDate()}): `
      );
      const date = dateInput.trim() || this.getCurrentDate();

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.log('❌ Invalid date format! Use YYYY-MM-DD');
        return;
      }

      // Get optional image filename
      const imageInput = await this.question(
        '🖼️  Featured image filename (optional, will be placed in img/ directory): '
      );

      // Read template
      if (!fs.existsSync(this.templatePath)) {
        console.log('❌ Blog template file not found!');
        return;
      }

      let templateContent = fs.readFileSync(this.templatePath, 'utf8');

      // Create slug and paths
      const slug = this.createSlug(title);
      const blogPath = this.createBlogDirectory(date, slug);
      const filepath = path.join(blogPath, 'index.md');

      // Replace placeholders
      templateContent = templateContent
        .replace(/BLOG_POST_SLUG/g, slug)
        .replace(/BLOG POST TITLE/g, title)
        .replace(/BLOG_POST_TITLE/g, title)
        .replace(/\[sycotix\]/g, `[${author}]`)
        .replace(/\[ibracorp, TAG1, TAG2, TAG3\]/g, `[${tags.join(', ')}]`)
        .replace(/YYYY-MM-DD/g, date)
        .replace(/ONE SENTENCE DESCRIPTION OF THE BLOG POST/g, description);

      // Handle image replacement
      if (imageInput.trim()) {
        templateContent = templateContent.replace(
          /image: \.\/img\/BLOG_POST_IMAGE\.png/g,
          `image: ./img/${imageInput.trim()}`
        );
        templateContent = templateContent.replace(
          /BLOG_POST_IMAGE\.png/g,
          imageInput.trim()
        );
      } else {
        // Remove image line if no image specified
        templateContent = templateContent.replace(
          /image: \.\/img\/BLOG_POST_IMAGE\.png\n/g,
          ''
        );
      }

      // Check if file already exists
      if (fs.existsSync(filepath)) {
        const overwrite = await this.question(
          `⚠️  Blog post already exists. Overwrite? (y/N): `
        );
        if (
          overwrite.toLowerCase() !== 'y' &&
          overwrite.toLowerCase() !== 'yes'
        ) {
          console.log('📋 Operation cancelled.');
          return;
        }
      }

      // Write file
      fs.writeFileSync(filepath, templateContent, 'utf8');

      console.log('\n🎉 Blog post created successfully!');
      console.log('==================================');
      console.log(`📁 Directory: ${path.relative('.', blogPath)}`);
      console.log(`📄 File: ${path.relative('.', filepath)}`);
      console.log(`🔗 URL: /blog/${slug}`);
      console.log(`📅 Date: ${date}`);
      console.log(`👤 Author: ${this.authors[author]}`);
      console.log(`🏷️  Tags: ${tags.join(', ')}`);

      if (imageInput.trim()) {
        console.log(
          `🖼️  Image directory: ${path.relative('.', path.join(blogPath, 'img'))}`
        );
        console.log(`   Place your featured image: ${imageInput.trim()}`);
      }

      console.log('\n💡 Next steps:');
      console.log('- Edit the file to add your blog content');
      console.log('- Replace placeholder sections with actual content');
      console.log('- Add images to the img/ directory if needed');
      console.log('- Remove the internal warning box before publishing');
      console.log('- Preview your post with: yarn start');
    } catch (error) {
      console.log('❌ Error:', error.message);
    } finally {
      this.rl.close();
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new BlogGenerator();
  generator.generateBlog().catch(console.error);
}

module.exports = BlogGenerator;
