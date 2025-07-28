# 🎯 Final Airtable Configuration Summary

## ✅ **COMPLETE: All 4 Airtable Systems Configured**

Each Airtable integration now has its own dedicated environment variables with proper API keys, base IDs, and table names.

## 📊 **Environment Variables by System:**

### **1. Waitlist System**
```env
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_actual_personal_access_token_here
AIRTABLE_BASE_ID=your_waitlist_base_id_here
AIRTABLE_TABLE_NAME=Waitlist
```
- **Purpose:** Collect email signups for shop waitlist
- **API Endpoint:** `/api/waitlist/airtable`

### **2. Feedback System**
```env
AIRTABLE_FEEDBACK_BASE_ID=your_feedback_base_id_here
AIRTABLE_FEEDBACK_API_KEY=your_feedback_personal_access_token_here
AIRTABLE_FEEDBACK_TABLE_NAME=Feedback
```
- **Purpose:** Collect user feedback and bug reports
- **API Endpoint:** `/api/feedback`

### **3. Creator Booking System**
```env
AIRTABLE_BOOKING_BASE_ID=your_booking_base_id_here
AIRTABLE_BOOKING_API_KEY=your_booking_personal_access_token_here
AIRTABLE_BOOKING_TABLE_NAME=Creator Bookings
```
- **Purpose:** Handle creator booking requests
- **API Endpoint:** `/api/booking/airtable`

### **4. Creator Applications System (NEW)**
```env
AIRTABLE_CREATOR_BASE_ID=your_creator_applications_base_id_here
AIRTABLE_CREATOR_API_TOKEN=your_creator_applications_api_token_here
```
- **Purpose:** "Become a Creator" form with separate fields + image attachments
- **API Endpoint:** `/api/airtable-creator`
- **Table Name:** "Creator Applications" (hardcoded in API)

## 🖼️ **Image Hosting (for Creator Applications)**
```env
# Option 1: ImgBB (Free)
IMGBB_API_KEY=your_imgbb_api_key_here

# Option 2: Cloudinary (Professional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🔧 **Setup Instructions for Each System:**

### **Step 1: Create Airtable Bases**
You can either:
- **Option A:** Create 4 separate bases (one for each system)
- **Option B:** Use 1 base with 4 different tables
- **Option C:** Mix and match as needed

### **Step 2: Create Personal Access Tokens**
For each system, create a Personal Access Token with:
- **Scopes:** `data.records:read` + `data.records:write`
- **Base Access:** Grant access to the specific base
- **Permissions:** "Create records" + "Read records"

### **Step 3: Get Base IDs**
From [Airtable API Documentation](https://airtable.com/developers/web/api/introduction):
- Select each base to get its Base ID (starts with `app`)

### **Step 4: Update Environment Variables**
Replace all placeholder values in `.env.local` with your actual:
- Personal Access Tokens
- Base IDs
- Table Names (if different from defaults)

## 📋 **Table Structures:**

### **Waitlist Table:**
- Email (Single line text) - Primary
- Signup Date (Date & time)
- Country (Single line text) - Optional
- Discipline (Single line text) - Optional
- Source (Single line text)
- Status (Single select) - Optional

### **Feedback Table:**
- Name (Single line text)
- Email (Email)
- Subject (Single line text)
- FeedbackType (Single line text)
- Comments (Long text)

### **Creator Bookings Table:**
- Client Name (Single line text) - Primary
- Email (Email)
- Project Type (Single select)
- Description (Long text)
- Booking Date (Date & time)
- Status (Single select)
- Source (Single line text)
- Phone, Company, Budget Range, Timeline, etc. (Optional fields)

### **Creator Applications Table:**
- Name (Single line text)
- Email (Email)
- Country of Origin (Single line text)
- Currently Based In (Single line text)
- Bio (Long text)
- Portfolio Images (Attachment) - Up to 12 images
- Submission Date (Date & time)
- Status (Single select)
- Notes (Long text) - Optional

## 🎯 **Key Benefits:**

✅ **Independent Systems** - Each can be configured separately  
✅ **Flexible Setup** - Use same or different bases as needed  
✅ **Proper Security** - Each system has its own token with specific permissions  
✅ **Easy Maintenance** - Clear separation of concerns  
✅ **Scalable** - Add more systems without affecting existing ones  

## 🚀 **Testing Checklist:**

### **For Each System:**
1. ✅ Create Airtable base and table
2. ✅ Set up table structure with required fields
3. ✅ Create Personal Access Token with proper permissions
4. ✅ Get Base ID from Airtable API docs
5. ✅ Update environment variables in `.env.local`
6. ✅ Test form submission through your app
7. ✅ Verify data appears correctly in Airtable
8. ✅ Check image attachments (for Creator Applications)

## 📝 **Example Configuration:**

```env
# Waitlist
AIRTABLE_PERSONAL_ACCESS_TOKEN=patABC123.1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
AIRTABLE_BASE_ID=app1234567890ABCD
AIRTABLE_TABLE_NAME=Waitlist

# Feedback
AIRTABLE_FEEDBACK_BASE_ID=app5678901234EFGH
AIRTABLE_FEEDBACK_API_KEY=patDEF456.abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
AIRTABLE_FEEDBACK_TABLE_NAME=Feedback

# Bookings
AIRTABLE_BOOKING_BASE_ID=app9012345678IJKL
AIRTABLE_BOOKING_API_KEY=patGHI789.1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
AIRTABLE_BOOKING_TABLE_NAME=Creator Bookings

# Creator Applications
AIRTABLE_CREATOR_BASE_ID=app3456789012MNOP
AIRTABLE_CREATOR_API_TOKEN=patJKL012.abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ

# Image Hosting
IMGBB_API_KEY=1234567890abcdef
```

## ✅ **All Systems Ready!**

Your Zadulis app now has **4 complete and independent Airtable integrations**:

🎯 **Waitlist** - Email collection for shop  
📝 **Feedback** - User feedback and bug reports  
📅 **Bookings** - Creator booking requests  
🎨 **Creator Applications** - Become a creator form with separate fields + images  

Each system is properly configured with its own API key, base ID, and table structure!