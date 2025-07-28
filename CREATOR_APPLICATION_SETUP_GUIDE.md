# Creator Application Airtable Integration Guide

This guide explains how to set up Airtable integration for the "Become a Creator" application form in your Next.js project.

---

## 1. Create a New Airtable Base and Table

1. Go to [Airtable](https://airtable.com) and create a new base (e.g., "Creator Applications").
2. Rename the default table to `Creator-Applications`.
3. Add the following fields:

| Field Name        | Field Type         | Description                                 |
|------------------|--------------------|---------------------------------------------|
| Name             | Single line text   | Creator's full name                         |
| Email            | Email              | Creator's email address                     |
| CountryOrigin    | Single line text   | Country of origin                           |
| BasedIn          | Single line text   | Where the creator is currently based        |
| Bio              | Long text          | Creator's bio                               |
| ImageCount       | Number             | Number of images submitted                  |
| Images           | Long text          | Base64 or URLs of images (delimited string) |
| ApplicationDate  | Date               | Date of application                         |
| Status           | Single select      | Application status (e.g., Pending Review)   |

---

## 2. Generate a Personal Access Token for Airtable

1. Go to [Airtable Developer Hub](https://airtable.com/developers/web/api/introduction)
2. Click "Create token"
3. Name it (e.g., "Creator Application API")
4. Select scopes:
   - `data.records:read`
   - `data.records:write`
5. Select your new base
6. Click "Create token" and copy the token (starts with `pat`)

---

## 3. Get Your Base ID

1. Open your base in Airtable
2. Click "Help" > "API documentation"
3. Find your Base ID (starts with `app`)

---

## 4. Configure Environment Variables

Add the following to your `.env.local`:

```env
# Creator Application Airtable Configuration
AIRTABLE_CREATOR_BASE_ID=your_creator_base_id_here
AIRTABLE_CREATOR_API_KEY=your_creator_personal_access_token_here
AIRTABLE_CREATOR_TABLE_NAME=Creator-Applications
```

Replace the placeholders with your actual values.

---

## 5. API Route

The API route is located at:
```
src/app/api/creator-application/route.ts
```
- Accepts POST requests with form data and images
- Stores all fields in Airtable
- Images are stored as base64 strings (or you can adapt to use URLs/cloud storage)

---

## 6. Frontend Integration

- The form should submit data as a `multipart/form-data` POST request to `/api/creator-application`.
- All fields and images will be processed and sent to Airtable.
- On success, you can show a confirmation message to the user.

---

## 7. Customization & Best Practices

- You can add more fields to the table and update the API route accordingly.
- For production, consider uploading images to a cloud storage provider and storing URLs in Airtable instead of base64.
- Add validation and error handling on both frontend and backend.
- Never expose your Airtable API key in client-side code.

---

## 8. Troubleshooting

- Ensure all environment variables are set and correct.
- Check Airtable API permissions and base/table names.
- Review server logs for errors if submissions fail.

---

**Last Updated:** January 2025
