---
title: "Wekan"
sidebar_position: 8
description: "Open-source kanban board application for project management and task organization with card-based workflow management."
tags: [misc-tools, kanban, project-management, collaboration, productivity, ibracorp]
---

# Wekan

Open-source kanban board application for project management and task organization with card-based workflow management.

:::info Kanban Board Application
**Video**
[IBRACORP Video Tutorial - Coming Soon]

**Useful Links**
- [Wekan Website](https://wekan.github.io/)
- [GitHub Repository](https://github.com/wekan/wekan)
- [Documentation](https://github.com/wekan/wekan/wiki)

**Related Videos**
- Project Management
- Team Collaboration
- Workflow Organization
:::

:::warning Disclaimer
Thank you for choosing to collaborate with IBRACORP 🙏

Please read our disclaimer https://docs.ibracorp.io/disclaimer
:::

## Credits

| Role | Contributor |
|------|------------|
| Writer / Producer | Sycotix |
| Video Recording and Voice | Sycotix |
| Contributor | North |
| Testing / Proofreading | Hawks, DiscDuck |

## Feature List

**Complete Project Management Solution**

- **Kanban Boards** - Visual task management with card-based workflow
- **Multiple Boards** - Organize different projects separately
- **Card Management** - Create, edit, move, and archive cards
- **List Organization** - Customizable columns for workflow stages
- **Team Collaboration** - Multi-user support with permissions
- **Card Comments** - Discussion and collaboration on tasks
- **Due Dates** - Set deadlines and track progress
- **Attachments** - Add files and documents to cards
- **Labels and Tags** - Categorize and filter cards
- **Card Checklists** - Break down tasks into subtasks
- **Activity Timeline** - Track all changes and activities
- **Export Features** - Backup boards and data
- **Mobile Responsive** - Access from any device
- **Self-Hosted** - Complete control over your data

## Prerequisites

### Database Requirements

**MongoDB Setup**

⚠️ **Important**: Use MongoDB 4.4.x for compatibility

```yaml
# MongoDB 4.4 (recommended version)
mongodb:
  image: mongo:4.4.7
  container_name: wekan-mongodb
  restart: unless-stopped
  command: mongod --oplogSize 128
  environment:
    - MONGO_INITDB_ROOT_USERNAME=wekanuser
    - MONGO_INITDB_ROOT_PASSWORD=your-secure-password
  volumes:
    - ./mongodb/data:/data/db
    - ./mongodb/dump:/dump
  networks:
    - wekan
```

### Unraid Preparation

**Create Unraid Share**

1. **Navigate**: Shares in Unraid webUI
2. **Add Share**: Create new share named "wekan"
3. **Configure**: Set appropriate permissions and cache settings

## Installation

### Unraid Installation

**Community Applications Method**

1. **Install MongoDB**: 
   - Search "MongoDB" in Community Apps
   - Install from "Taddeusz' Repository / Network:Other"
   - **Version**: Select MongoDB 4.4.7 specifically
   - **Port**: 27017 (verify availability)

2. **Install Wekan**:
   - Search "Wekan" in Community Apps
   - Install from "Kru-X's Repository / Productivity"

3. **Wekan Configuration**:
   ```
   Container Name: wekan
   ROOT_URL: http://192.168.1.100:5555
   PORT: 5555
   MONGO_URL: mongodb://192.168.1.100:27017/wekan
   unRAID Share Path: /mnt/user/wekan
   ```

### Docker Compose

**Complete Stack**

```yaml
version: '3.8'

services:
  wekan:
    image: quay.io/wekan/wekan:latest
    container_name: wekan
    restart: unless-stopped
    environment:
      # Application Settings
      - ROOT_URL=https://wekan.yourdomain.com
      - PORT=8080
      - TZ=America/New_York
      
      # Database Connection
      - MONGO_URL=mongodb://wekanuser:your-secure-password@mongodb:27017/wekan?authSource=admin
      
      # Email Configuration (optional)
      - MAIL_URL=smtp://username:password@smtp.gmail.com:587
      - MAIL_FROM=wekan@yourdomain.com
      
      # Security Settings
      - WITH_API=true
      - RICHER_CARD_COMMENT_EDITOR=true
      - CARD_OPENED_WEBHOOK_ENABLED=false
      - BIGEVENTS_PATTERN=NONE
      - BROWSER_POLICY_ENABLED=true
      
    ports:
      - "5555:8080"
    depends_on:
      - mongodb
    volumes:
      - ./wekan/files:/data
    networks:
      - wekan

  mongodb:
    image: mongo:4.4.7
    container_name: wekan-mongodb
    restart: unless-stopped
    command: mongod --oplogSize 128
    environment:
      - MONGO_INITDB_ROOT_USERNAME=wekanuser
      - MONGO_INITDB_ROOT_PASSWORD=your-secure-password
      - MONGO_INITDB_DATABASE=wekan
    volumes:
      - ./mongodb/data:/data/db
      - ./mongodb/dump:/dump
    networks:
      - wekan

networks:
  wekan:
    driver: bridge

volumes:
  mongodb_data:
  wekan_data:
```

### Environment Configuration

**Create .env File**

```bash
# Database Configuration
MONGO_USERNAME=wekanuser
MONGO_PASSWORD=your-secure-password
WEKAN_ROOT_URL=https://wekan.yourdomain.com

# Email Settings
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=wekan@yourdomain.com

# Security
WEKAN_SECRET=your-secret-key-here
```

## Initial Setup

### First Launch

**Create Admin Account**

1. **Access Wekan**: Navigate to `http://server-ip:5555`
2. **Register Account**: Click "Register" to create first account
3. **Admin Account**: First registered user becomes administrator
4. **Verify Setup**: Confirm Wekan loads properly

### Admin Configuration

**Security Settings**

1. **Access Admin Panel**: Click user avatar → Admin Panel
2. **Disable Registration**: Turn off self-registration
3. **Configure Settings**:
   ```
   Registration Policy: Admin Only
   Email Verification: Enabled (if SMTP configured)
   Default Board Permission: Private
   ```

### Database Verification

**Check MongoDB Connection**

```bash
# Connect to MongoDB container
docker exec -it wekan-mongodb mongo

# Switch to Wekan database
use wekan

# Check collections
show collections

# Exit MongoDB shell
exit
```

## Board Management

### Create Boards

**New Board Setup**

1. **Create Board**: Click "Create Board" button
2. **Board Configuration**:
   ```
   Title: Project Name
   Description: Project description
   Color: Choose board color
   Permission: Private/Public
   ```
3. **Initial Lists**: Create workflow columns (To Do, In Progress, Done)

### Board Templates

**Common Board Layouts**

```
Software Development:
- Backlog
- To Do
- In Development
- Testing
- Code Review
- Done

Marketing Campaign:
- Ideas
- Planning
- In Progress
- Review
- Approved
- Published

Personal Tasks:
- Today
- This Week
- This Month
- Someday
- Completed
```

### List Management

**Workflow Organization**

```
List Actions:
- Add List: Create new workflow stage
- Rename List: Change list title
- Move List: Reorder workflow stages
- Archive List: Hide completed stages
- List Settings: Configure list properties
```

## Card Management

### Create and Edit Cards

**Card Operations**

```
Basic Card Info:
- Title: Task description
- Description: Detailed information
- Due Date: Deadline for completion
- Members: Assign team members
- Labels: Categorize tasks

Advanced Features:
- Checklists: Break down into subtasks
- Attachments: Add files and documents
- Comments: Team collaboration
- Activity: Track all changes
```

### Card Workflows

**Task Progression**

1. **Create Card**: Add new task to appropriate list
2. **Add Details**: Fill in description, due date, assignees
3. **Progress Tracking**: Move card through workflow stages
4. **Collaboration**: Use comments for team communication
5. **Completion**: Move to done list and archive if needed

### Labels and Categories

**Organization System**

```
Priority Labels:
- High Priority (Red)
- Medium Priority (Yellow)
- Low Priority (Green)

Type Labels:
- Bug (Red)
- Feature (Blue)
- Enhancement (Purple)
- Documentation (Gray)

Status Labels:
- Blocked (Black)
- Urgent (Orange)
- Review Needed (Pink)
```

## User Management

### Add Team Members

**User Administration**

1. **Admin Panel**: Access user management
2. **Invite Users**: Send invitation emails
3. **User Roles**:
   ```
   Admin: Full system access
   Normal User: Board access only
   Comment Only: Read and comment only
   ```

### Board Permissions

**Access Control**

```
Board Visibility:
- Private: Invite only
- Public: Anyone with link can view
- Team: Specific team access

User Permissions:
- Admin: Full board control
- Normal: Create and edit cards
- Comment Only: View and comment
- No Comments: View only
```

## Advanced Features

### Email Notifications

**SMTP Configuration**

```yaml
environment:
  - MAIL_URL=smtps://username:password@smtp.gmail.com:465
  - MAIL_FROM=notifications@yourdomain.com
  - DEFAULT_FROM_EMAIL=wekan@yourdomain.com
```

### Webhook Integration

**External Integrations**

```yaml
environment:
  - WEBHOOKS_ATTRIBUTES=cardId,listId,boardId,comment
  - CARD_OPENED_WEBHOOK_ENABLED=true
  - WEBHOOK_URL=https://your-webhook-endpoint.com
```

### API Access

**Enable API**

```yaml
environment:
  - WITH_API=true
  - API_TOKEN_EXPIRATION=never
```

**API Usage Example**

```bash
# Get boards
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://wekan.yourdomain.com/api/boards

# Create card
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"New Task","description":"Task description"}' \
     https://wekan.yourdomain.com/api/boards/BOARD_ID/lists/LIST_ID/cards
```

## Backup and Maintenance

### Backup Strategy

**Database Backup**

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/wekan"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
docker exec wekan-mongodb mongodump --out /dump/wekan_$DATE

# Copy backup to host
docker cp wekan-mongodb:/dump/wekan_$DATE $BACKUP_DIR/

# Compress backup
tar -czf $BACKUP_DIR/wekan_backup_$DATE.tar.gz -C $BACKUP_DIR wekan_$DATE

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "wekan_backup_*.tar.gz" -mtime +30 -delete
```

### Restore Procedure

**Database Restore**

```bash
# Extract backup
tar -xzf wekan_backup_YYYYMMDD_HHMMSS.tar.gz

# Copy to container
docker cp wekan_YYYYMMDD_HHMMSS wekan-mongodb:/dump/

# Restore database
docker exec wekan-mongodb mongorestore --drop /dump/wekan_YYYYMMDD_HHMMSS
```

### Updates

**Update Wekan**

```bash
# Pull latest images
docker-compose pull

# Recreate containers
docker-compose up -d

# Check logs
docker-compose logs -f wekan
```

## Troubleshooting

### Common Issues

**MongoDB Connection Problems**

```bash
# Check MongoDB logs
docker logs wekan-mongodb

# Verify connectivity
docker exec wekan-mongodb mongo --eval "db.adminCommand('ismaster')"

# Test from Wekan container
docker exec wekan nc -zv mongodb 27017
```

**Wekan Not Loading**

1. **Check Logs**: `docker logs wekan`
2. **Verify ROOT_URL**: Ensure correct URL configuration
3. **Database Access**: Confirm MongoDB connectivity
4. **Port Conflicts**: Check if port 5555 is available

**Performance Issues**

```
Optimization:
- Increase MongoDB oplogSize
- Add more memory to containers
- Use SSD storage for database
- Regular database maintenance
```

### Database Maintenance

**MongoDB Optimization**

```bash
# Compact database
docker exec wekan-mongodb mongo wekan --eval "db.runCommand({compact: 'boards'})"

# Repair database
docker exec wekan-mongodb mongo wekan --eval "db.repairDatabase()"

# Check database stats
docker exec wekan-mongodb mongo wekan --eval "db.stats()"
```

## Best Practices

### Organization Strategy

**Effective Board Management**

```
Board Structure:
- One board per project/team
- Clear naming conventions
- Consistent list workflows
- Regular archive cleanup

Card Guidelines:
- Descriptive titles
- Detailed descriptions
- Appropriate labels
- Regular updates
```

### Team Collaboration

**Workflow Optimization**

```
Communication:
- Use card comments for discussions
- @mention team members
- Regular board reviews
- Clear task assignments

Process:
- Define workflow stages
- Set due dates consistently
- Use checklists for complex tasks
- Archive completed work
```

## Special Thanks

- **Wekan Development Team** for creating this excellent kanban solution
- **Lauri Ojansivu** for leading Wekan development
- **Community Contributors** for ongoing improvements
- To our fantastic Discord community and our Admins **DiscDuck** and **Hawks** for their input and testing

Please support the developers and creators involved in this work to help show them some love. ❤️

## Final Words

We hope you enjoyed this guide. It was conceptualized, written, and implemented by our Admin **Sycotix**.

## Support Us

Our work sometimes takes months to research and develop.

If you want to help support us please consider:

- Liking and Subscribing to our [Youtube channel](https://youtube.com/@ibracorp)
- Joining our [Discord server](https://discord.gg/VWAG7rZ)
- Becoming a paid member on our [IBRACORP website](https://ibracorp.io)
- Donating via [Paypal](https://paypal.me/ibracorp)

**Thank you for being part of our community!**
