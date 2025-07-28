# 🎯 Simplified Airtable Setup - Single Token

## ✅ **Fixed: Single Personal Access Token**

I've simplified the Airtable configuration to use **ONE Personal Access Token** for all integrations instead of separate tokens for each system.

## 🔐 **Environment Variables (Simplified)**

### **Single Airtable Token:**
```env
# ONE token for ALL Airtable integrations
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_actual_personal_access_token_here
```

### **Base IDs (Different bases, same token):**
```env
# Waitlist
AIRTABLE_BASE_ID=your_waitlist_base_id_here
AIRTABLE_TABLE_NAME=Waitlist

# Feedback  
AIRTABLE_FEEDBACK_BASE_ID=your_feedback_base_id_here
AIRTABLE_FEEDBACK_TABLE_NAME=Feedback

# Creator Bookings
AIRTABLE_BOOKING_BASE_ID=your_booking_base_id_here
AIRTABLE_BOOKING_TABLE_NAME=Creator Bookings

# Creator Applications
AIRTABLE_CREATOR_BASE_ID=your_creator_applications_base_id_here
```

## 🔧 **How to Set Up Your Single Token**

### **1. Create ONE Personal Access Token:**
1. Go to [Airtable Developer Hub](https://airtable.com/create/tokens)
2. Click "Create new token"
3. Name it: "Zadulis App - All Integrations"
4. Set scopes:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
5. **Add ALL your bases:**
   - ✅ Waitlist base
   - ✅ Feedback base  
   - ✅ Creator Bookings base
   - ✅ Creator Applications base
6. For each base, grant permissions:
   - ✅ "Create records"
   - ✅ "Read records"
7. Click "Create token"
8. Copy the token (starts with `pat`)

### **2. Update Your .env.local:**
Replace this placeholder:
```env
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_actual_personal_access_token_here
```

With your actual token:
```env
AIRTABLE_PERSONAL_ACCESS_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### **3. Add Your Base IDs:**
For each base, get the Base ID from [Airtable API docs](https://airtable.com/developers/web/api/introduction) and update:

```env
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_FEEDBACK_BASE_ID=appYYYYYYYYYYYYYY  
AIRTABLE_BOOKING_BASE_ID=appZZZZZZZZZZZZZZ
AIRTABLE_CREATOR_BASE_ID=appAAAAAAAAAAAAA
```

## 📊 **What Each System Uses:**

### **1. Waitlist System:**
- **Token:** `AIRTABLE_PERSONAL_ACCESS_TOKEN`
- **Base:** `AIRTABLE_BASE_ID`
- **Table:** `AIRTABLE_TABLE_NAME` (Waitlist)

### **2. Feedback System:**
- **Token:** `AIRTABLE_PERSONAL_ACCESS_TOKEN` (same token)
- **Base:** `AIRTABLE_FEEDBACK_BASE_ID`
- **Table:** `AIRTABLE_FEEDBACK_TABLE_NAME` (Feedback)

### **3. Creator Bookings:**
- **Token:** `AIRTABLE_PERSONAL_ACCESS_TOKEN` (same token)
- **Base:** `AIRTABLE_BOOKING_BASE_ID`
- **Table:** `AIRTABLE_BOOKING_TABLE_NAME` (Creator Bookings)

### **4. Creator Applications:**
- **Token:** `AIRTABLE_PERSONAL_ACCESS_TOKEN` (same token)
- **Base:** `AIRTABLE_CREATOR_BASE_ID`
- **Table:** "Creator Applications" (hardcoded in API)

## 🎯 **Benefits of Single Token:**

✅ **Simplified Setup** - Only one token to manage  
✅ **Easier Maintenance** - Update one token if needed  
✅ **Consistent Permissions** - Same access level across all systems  
✅ **Less Confusion** - Clear which token does what  
✅ **Better Security** - One token to secure instead of multiple  

## 🔄 **Migration from Multiple Tokens:**

If you previously had separate tokens, you can:
1. **Keep using them** - The old setup still works
2. **Switch to single token** - Update all systems to use `AIRTABLE_PERSONAL_ACCESS_TOKEN`
3. **Gradually migrate** - Move one system at a time

## ⚠️ **Important Notes:**

### **Token Permissions:**
Your single token must have access to **ALL bases** you want to use:
- Waitlist base
- Feedback base
- Creator Bookings base  
- Creator Applications base

### **Security:**
- Never commit your token to version control
- Use environment variables only
- Regenerate token if compromised
- Consider using different tokens for production vs development

## 🧪 **Testing Your Setup:**

1. **Set your token** in `.env.local`
2. **Add your base IDs** for each system
3. **Test each integration:**
   - Submit waitlist signup
   - Submit feedback form
   - Submit creator booking
   - Submit creator application
4. **Check Airtable** to verify data appears in correct bases

## 📝 **Complete Example:**

```env
# Single token for all Airtable integrations
AIRTABLE_PERSONAL_ACCESS_TOKEN=patABCDEF123456.1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ

# Base IDs (different for each system)
AIRTABLE_BASE_ID=app1234567890ABCD
AIRTABLE_FEEDBACK_BASE_ID=app5678901234EFGH
AIRTABLE_BOOKING_BASE_ID=app9012345678IJKL
AIRTABLE_CREATOR_BASE_ID=app3456789012MNOP

# Table names
AIRTABLE_TABLE_NAME=Waitlist
AIRTABLE_FEEDBACK_TABLE_NAME=Feedback
AIRTABLE_BOOKING_TABLE_NAME=Creator Bookings
```

## ✅ **Ready to Use!**

Your Airtable setup is now simplified with a single Personal Access Token managing all four integrations:

🎯 **Waitlist** - Email signups  
📝 **Feedback** - User feedback and bug reports  
📅 **Bookings** - Creator booking requests  
🎨 **Creator Applications** - Become a creator form with separate fields + images  

All using the same token with proper base-specific permissions!