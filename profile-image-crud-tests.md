# Profile Image CRUD Tests

## Issue Summary
- **Problem**: `profileImageUrl` is a TEXT field (not media component)
- **Root Cause**: Controller was trying to populate `profileImage` as media, causing 500 errors
- **Solution**: Use `profileImageUrl` as a simple text field to store Cloudinary URLs

## Schema Configuration
```json
{
  "profileImageUrl": {
    "type": "text"
  }
}
```

## Test Cases

### 1. CREATE Profile with Image URL

**Endpoint**: `POST /api/player-profiles`

**Request Body**:
```json
{
  "data": {
    "displayName": "Test User",
    "role": "Batsman",
    "age": 25,
    "profileImageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    "skillLevel": "Intermediate",
    "location": "Test City",
    "bio": "Testing profile image"
  }
}
```

**PowerShell Test**:
```powershell
$body = @{
  data = @{
    displayName = "Test User"
    role = "Batsman"
    age = 25
    profileImageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    skillLevel = "Intermediate"
    location = "Test City"
    bio = "Testing profile image"
  }
} | ConvertTo-Json

$headers = @{
  "Content-Type" = "application/json"
  "Authorization" = "Bearer YOUR_JWT_TOKEN"
}

Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles" -Method POST -Body $body -Headers $headers
```

**Expected Response**:
```json
{
  "data": {
    "id": 1,
    "displayName": "Test User",
    "profileImageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    ...
  },
  "meta": {
    "message": "Player profile created successfully"
  }
}
```

---

### 2. READ Profile with Image

**Endpoint**: `GET /api/player-profiles/:id`

**PowerShell Test**:
```powershell
Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/7" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

**Expected Response**:
```json
{
  "data": {
    "id": 7,
    "displayName": "anil",
    "profileImageUrl": "https://res.cloudinary.com/dgfqim3jy/image/upload/v1762794923/large_scaled_1000087642_174ec10c80.jpg",
    ...
  }
}
```

**Verify**:
- `profileImageUrl` is a STRING (not an object)
- URL is a valid Cloudinary URL
- No duplicate domain prefix

---

### 3. UPDATE Profile Image (Change URL)

**Endpoint**: `PUT /api/player-profiles/:id`

**Request Body**:
```json
{
  "data": {
    "profileImageUrl": "https://res.cloudinary.com/demo/image/upload/new-image.jpg"
  }
}
```

**PowerShell Test**:
```powershell
$updateBody = @{
  data = @{
    profileImageUrl = "https://res.cloudinary.com/demo/image/upload/new-image.jpg"
  }
} | ConvertTo-Json

$headers = @{
  "Content-Type" = "application/json"
  "Authorization" = "Bearer YOUR_JWT_TOKEN"
}

Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/7" -Method PUT -Body $updateBody -Headers $headers
```

**Expected Response**:
```json
{
  "data": {
    "id": 7,
    "profileImageUrl": "https://res.cloudinary.com/demo/image/upload/new-image.jpg",
    ...
  },
  "meta": {
    "message": "Player profile updated successfully"
  }
}
```

---

### 4. DELETE Profile Image (Set to NULL)

**Endpoint**: `PUT /api/player-profiles/:id`

**Request Body**:
```json
{
  "data": {
    "profileImageUrl": null
  }
}
```

**PowerShell Test**:
```powershell
$deleteImageBody = @{
  data = @{
    profileImageUrl = $null
  }
} | ConvertTo-Json

$headers = @{
  "Content-Type" = "application/json"
  "Authorization" = "Bearer YOUR_JWT_TOKEN"
}

Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/7" -Method PUT -Body $deleteImageBody -Headers $headers
```

**Expected Response**:
```json
{
  "data": {
    "id": 7,
    "profileImageUrl": null,
    ...
  },
  "meta": {
    "message": "Player profile updated successfully"
  }
}
```

**Verify**:
- No 500 error
- `profileImageUrl` is `null`
- Profile still exists and is accessible

---

### 5. DELETE Profile Image (Set to Empty String)

**Endpoint**: `PUT /api/player-profiles/:id`

**Request Body**:
```json
{
  "data": {
    "profileImageUrl": ""
  }
}
```

**PowerShell Test**:
```powershell
$deleteImageBody = @{
  data = @{
    profileImageUrl = ""
  }
} | ConvertTo-Json

$headers = @{
  "Content-Type" = "application/json"
  "Authorization" = "Bearer YOUR_JWT_TOKEN"
}

Invoke-WebRequest -Uri "https://cricket-1-zawr.onrender.com/api/player-profiles/7" -Method PUT -Body $deleteImageBody -Headers $headers
```

**Expected Response**:
```json
{
  "data": {
    "id": 7,
    "profileImageUrl": null,
    ...
  },
  "meta": {
    "message": "Player profile updated successfully"
  }
}
```

---

## Common Issues and Solutions

### Issue 1: 500 Error When Deleting Image
**Cause**: Old code trying to populate `profileImage` as media field
**Solution**: Updated controller to use `profileImageUrl` as text field

### Issue 2: Duplicate Domain in URL
**Cause**: `transformMediaUrls` prepending base URL to Cloudinary URLs
**Solution**: Check if URL is absolute before prepending base URL

### Issue 3: profileImageUrl Returns Object Instead of String
**Cause**: Schema has media field, controller transforms it to object
**Solution**: Change schema to text field, return string directly

---

## Current Status (After Fix)

✅ **Schema**: `profileImageUrl` is TEXT field  
✅ **Controller**: Returns `profileImageUrl` as string  
✅ **Transform**: No media transformation applied  
✅ **Create**: Works with Cloudinary URL string  
✅ **Read**: Returns string URL  
✅ **Update**: Can change URL  
✅ **Delete**: Can set to null without error  

---

## Testing Checklist

- [ ] Create profile with image URL
- [ ] Read profile and verify image URL is string
- [ ] Update profile image URL
- [ ] Delete profile image (set to null)
- [ ] Delete profile image (set to empty string)
- [ ] Verify no 500 errors
- [ ] Verify no duplicate domain in URLs
- [ ] Test on localhost
- [ ] Test on Render production

---

## Image Upload Flow (Client Side)

1. **User selects image** from device
2. **Client uploads to Cloudinary** directly or via Strapi upload endpoint
3. **Cloudinary returns URL**: `https://res.cloudinary.com/xxx/image/upload/v123/image.jpg`
4. **Client sends URL** in `profileImageUrl` field to create/update profile
5. **Server stores URL** as text in database
6. **Client displays image** using the URL

---

## Notes

- `profileImageUrl` is stored as plain text (Cloudinary URL)
- No media component or file upload in profile schema
- Image upload happens separately (client → Cloudinary)
- Profile only stores the resulting URL
- Deleting image means setting `profileImageUrl` to null or empty string
- Actual image deletion from Cloudinary must be handled separately if needed
