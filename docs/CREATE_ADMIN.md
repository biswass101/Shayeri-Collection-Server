# Create System Admin Script

## Overview
The `createAdmin` script is a command-line tool for creating a system administrator user in the Sayeri Collection database.

## Location
- Script file: [../src/scripts/createAdmin.ts](../src/scripts/createAdmin.ts)

## Usage

### Command
```bash
npm run create:admin
```

### Interactive Prompts
The script will ask for:

1. **Email** - Admin email address
2. **Name** - Admin full name
3. **Password** - Admin password

## Example Execution

```
$ npm run create:admin

========================================
   Create System Admin
========================================

Email: admin@sayeri.com
Name: Admin User
Password: ••••••••

⏳ Creating admin...

✅ Admin created successfully!
ID: 1
Email: admin@sayeri.com
Name: Admin User
Role: admin
```

## Notes

- The admin user is created with the `admin` role
- Passwords are hashed using bcrypt with 10 salt rounds
- The script requires a valid database connection (DATABASE_URL in `.env`)
- Run before starting the server application

## Related Commands

```bash
npm run dev              # Start development server
npm run build            # Compile TypeScript
npm run prisma:studio   # Open Prisma Studio
npm run prisma:migrate  # Run database migrations
```
