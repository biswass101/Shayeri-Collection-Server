# Create System Admin Script

## Overview
The `createAdmin` script is an interactive command-line tool for creating a system administrator user in the Sayeri Collection database. This is typically run once during initial setup.

## Location
- Script file: [src/scripts/createAdmin.ts](src/scripts/createAdmin.ts)

## Usage

### Command
```bash
npm run create:admin
```

### Interactive Prompts
The script will ask for the following information:

1. **Admin Email** - A valid email address (must not already exist in the database)
2. **Admin Name** - The full name of the admin user
3. **Password** - A strong password meeting the requirements below
4. **Confirm Password** - Re-enter the password to confirm

### Password Requirements
Passwords must contain:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

**Example**: `Admin@123`, `Secure#2025`, `MyPass1!`

## Features

✅ **Email Validation** - Ensures valid email format  
✅ **Duplicate Check** - Prevents creating admin if email already exists  
✅ **Password Strength** - Enforces strong password requirements  
✅ **Password Hashing** - Securely hashes password using bcrypt  
✅ **Interactive Input** - User-friendly command-line prompts  
✅ **Confirmation** - Requires password confirmation  
✅ **Success Feedback** - Shows created admin details  

## Example Execution

```
$ npm run create:admin

========================================
   System Admin Creation Script
========================================

Enter admin email: admin@sayeri.com
Enter admin name: Admin User
Enter admin password: Admin@123
Confirm password: Admin@123

⏳ Creating admin user...

========================================
✅ Admin user created successfully!
========================================
ID: 1
Email: admin@sayeri.com
Name: Admin User
Role: admin
========================================
```

## Notes

- The admin user is created with the `admin` role, granting full access to user management endpoints
- Passwords are hashed using bcrypt with 10 salt rounds
- The script requires a valid database connection (DATABASE_URL must be set in `.env`)
- This script should be run before starting the server application
- Each admin user needs a unique email address

## Troubleshooting

**"User with this email already exists"**
- The email is already registered in the database
- Use a different email address

**"Invalid email format"**
- Check the email address format (e.g., user@domain.com)
- Ensure there are no spaces or special characters in the email

**"Password must be at least 8 characters..."**
- Password doesn't meet strength requirements
- Use at least 8 characters including uppercase, lowercase, number, and special character

**Database connection error**
- Ensure `.env` file contains valid `DATABASE_URL`
- Verify database is running and accessible
- Run migrations: `npm run prisma:migrate`

## Related Commands

```bash
npm run dev              # Start development server
npm run build            # Compile TypeScript
npm run prisma:studio   # Open Prisma Studio to view/manage data
npm run prisma:migrate  # Run database migrations
```
