# User Manual - Microsite CMS

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Managing Pages](#managing-pages)
4. [Working with Media](#working-with-media)
5. [Publishing Workflow](#publishing-workflow)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Introduction

Welcome to the Microsite CMS! This content management system is designed specifically for managing health sector landing pages. It allows you to create and edit pages using a simple drag-and-drop interface without requiring technical knowledge.

### User Roles

- **Super Admin**: Can create tenants, invite users, and has full system access
- **Editor**: Can create, edit, and publish pages and upload media
- **Viewer**: Can view pages but cannot make changes

## Getting Started

### Logging In

1. Navigate to your site's admin URL
2. Click "Sign In"
3. Enter your email and password
4. Click "Sign In"

### Dashboard Overview

After logging in, you'll see:
- **Pages List**: All pages for your site
- **Media Library**: Uploaded images and documents
- **Page Editor**: Where you create and edit content

## Managing Pages

### Creating a New Page

1. Click "Create New Page"
2. Fill in the page details:
   - **Slug**: URL-friendly identifier (e.g., "about-us")
   - **Title**: Page title (appears in browser tab)
   - **Description**: Brief description of the page
   - **Locale**: Language/region (es-CO, es-DO, or en)

3. Click "Create"

### Editing Page Content

The page editor uses a block-based system where you can:

1. **Add Blocks**: Click "+ Add Block" to insert content sections
2. **Available Blocks**:
   - **Hero**: Large header section with title and subtitle
   - **Text**: Paragraph content with Markdown formatting
   - **Image**: Upload and display images
   - **Grid**: Display items in a grid layout (e.g., services)
   - **CTA**: Call-to-action buttons
   - **Contact**: Contact information sections

3. **Edit Block Content**:
   - Click on any block to edit its content
   - Use the toolbar for text formatting
   - Drag blocks to reorder them

4. **Remove Blocks**: Click the delete icon on any block to remove it

### Page Metadata (SEO)

For better search engine visibility, fill in:
- **Meta Title**: Title shown in search results
- **Meta Description**: Description shown in search results
- **Meta Keywords**: Relevant keywords (comma-separated)
- **OG Image**: Image shown when shared on social media

### Saving Your Work

- Click "Save Draft" to save your changes without publishing
- Your work is automatically saved as a draft

## Working with Media

### Uploading Images

1. Click "Upload Media" or "Add Image" in the page editor
2. Select an image file from your computer
3. Supported formats: PNG, JPEG, JPG, WebP, SVG
4. Maximum file size: 10MB

The system automatically:
- Creates a thumbnail version
- Converts images to WebP format for better performance
- Scans files for viruses (if enabled)

### Using Uploaded Media

1. In the page editor, add an Image block
2. Click "Select Image"
3. Choose from your uploaded media
4. Adjust image settings (size, alignment, alt text)

### Media Library

- View all uploaded media
- Filter by type (Images/Documents)
- Delete unused media (if you have permission)
- Download original files

## Publishing Workflow

### Understanding Page States

1. **Draft**: Your working copy, not visible to the public
2. **Staging**: Preview version, accessible via a special link
3. **Published**: Live version, visible to all visitors

### Publishing to Staging

1. Open the page you want to preview
2. Click "Publish to Staging"
3. Copy the preview link
4. Share with stakeholders for review
5. Make any necessary changes based on feedback

### Publishing to Production

1. Ensure your page is ready for the public
2. Click "Publish to Production"
3. Confirm the action
4. Your page is now live!

**Note**: Publishing to production replaces the current live version immediately.

### Unpublishing a Page

To remove a page from public view:
1. Open the page
2. Change status back to "Draft"
3. Save

## Best Practices

### Content Guidelines

1. **Keep it Simple**: Use clear, concise language
2. **Use Headers**: Organize content with headings
3. **Add Alt Text**: Describe images for accessibility
4. **Optimize Images**: Use appropriately sized images
5. **Test Links**: Ensure all links work before publishing

### SEO Best Practices

1. **Unique Titles**: Each page should have a unique title
2. **Meta Descriptions**: Write compelling 150-160 character descriptions
3. **Header Hierarchy**: Use H1, H2, H3 appropriately
4. **Image Alt Text**: Describe images clearly
5. **Internal Links**: Link to other relevant pages on your site

### Image Guidelines

- **File Sizes**: Keep images under 2MB when possible
- **Dimensions**: Use consistent image sizes
- **Format**: 
  - Photos: JPEG or WebP
  - Graphics: PNG or SVG
  - Icons: SVG preferred
- **Naming**: Use descriptive filenames (e.g., "doctor-consultation.jpg")

### Markdown Formatting

Text blocks support Markdown for formatting:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list 1
2. Numbered list 2

[Link text](https://example.com)
```

**Security Note**: HTML and JavaScript are not allowed for security reasons.

## Troubleshooting

### Common Issues

#### "Page not found" error
- Check that the slug is correct
- Ensure the page is published
- Verify you're on the correct domain

#### Changes not appearing
- Clear your browser cache
- Wait a few minutes for cache to refresh
- Check that you clicked "Publish to Production"

#### Image upload fails
- Check file size (max 10MB)
- Verify file format is supported
- Try a different image

#### Can't edit a page
- Verify you're logged in
- Check your user role (Viewers cannot edit)
- Contact your administrator if needed

#### Lost unsaved changes
- Always click "Save Draft" regularly
- Use the preview feature before closing the editor

### Getting Help

If you encounter issues:

1. Check this manual for solutions
2. Contact your site administrator
3. Provide details about:
   - What you were trying to do
   - What went wrong
   - Any error messages you saw

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save draft (when supported)
- **Esc**: Close modal dialogs

## Additional Resources

- [Markdown Guide](https://www.markdownguide.org/basic-syntax/)
- [Image Optimization Tips](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization)
- [SEO Best Practices](https://developers.google.com/search/docs/beginner/seo-starter-guide)

## Version History

- **v1.0.0**: Initial release
  - Basic page management
  - Media upload
  - Publishing workflow
  - Multi-language support

---

**Last Updated**: October 2025  
**Questions?** Contact your system administrator
