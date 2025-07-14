# API Documentation for White Label Communication Platform

## Overview
This document contains API documentation for integrating authentication systems with our white label communication platform, specifically for Titan Host and Boomea services.

## White Label Communication Provider
- **Provider**: [White Label Communications](https://www.whitelabelcomm.com/)
- **Portal**: portal.dailit.com
- **Business Model**: We are a reseller of white-label communication services

## Authentication APIs

### 1. Titan Host API Documentation

#### Base Information
- **Documentation Source**: [docs.titan.host](https://docs.titan.host/)
- **GitHub API Docs**: [Titanoboa API Documentation](https://github.com/commsor/titanoboa/wiki/API-Documentation)

#### Authentication Endpoints

##### Login Authentication
```http
POST /create-auth-token
Content-Type: application/json | application/transit+json | application/transit+msgpack
```

**Request Attributes:**
- `name` (string): Username
- `password` (string): Password

**Response:**
- Returns JWT token in encrypted cookie
- User name in response body

##### Get Current User
```http
GET /user
Content-Type: application/json | application/transit+json | application/transit+msgpack
```

**Response:**
- Returns name of logged-in user

##### Logout
```http
POST /user/logout
Content-Type: application/json | application/transit+json | application/transit+msgpack
```

**Response:**
- Logs out currently logged-in user

#### SSO Configuration (SAML-Based)

##### Supported SSO Types
1. **SP-initiated SSO**: Access via login page redirect
2. **IdP-initiated SSO**: Direct portal access after authentication

##### Tested Identity Providers
- ADFS
- Azure AD
- G-Suite
- Okta
- OneLogin

##### SAML Configuration Fields
| Field | Description |
|-------|-------------|
| Single Sign-On URL | URL for OAuth responses |
| Audience URI (SP Entity ID) | Service Provider entity ID |
| Name ID Format | Name identifier format |
| Attribute Statements | User attributes (role, name, etc.) |

#### OAuth Configuration (TitanHQ)

##### OAuth Connection Settings
```http
POST /oauth/connections
```

**Provider Types:**
- Microsoft Office 365
- Microsoft ADFS
- OpenID Connect

**Configuration Fields:**
| Setting | Description |
|---------|-------------|
| Provider Type | OAuth provider type |
| Redirect URIs | Authorization callback URLs |
| Connection Name | Display name for connection |
| Client ID | OAuth application ID |
| Client Secret | OAuth application secret |
| Authorization URL | User authorization endpoint |
| Access Token URL | Token exchange endpoint |
| User Detail URL | User information endpoint |

**Default Microsoft OAuth URLs:**
- Authorization: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
- Token: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
- User Details: `https://graph.microsoft.com/v1.0/me`

### 2. Boomea API Documentation

#### Base Information
- **Documentation Source**: [docs.boomea.com](https://docs.boomea.com/)
- **Alternative Documentation**: [docs.boems.co](https://docs.boems.co/)

#### Key Features
- Task Management
- Plan Management
- Allocation & Group Management
- Settings Management
- Passport Management
- Dashboard Analytics

#### Okta Integration (From Boomerang/Boomea ecosystem)

##### Supported Features
- **IdP Initiated Auth Flow**: SSO using OpenID Connect (OIDC)
- **Just in Time Provisioning**: Automatic user creation
- **Client ID/Secret Authentication**

##### Configuration Requirements
1. **Client ID**: OAuth application identifier
2. **Client Secret**: OAuth application secret  
3. **Issuer URL**: Identity provider domain
4. **Subdomain**: Application-specific subdomain

##### Implementation Steps
1. Configure OAuth application in identity provider
2. Obtain Client ID and Client Secret
3. Configure issuer URL and subdomain
4. Send configuration to support team
5. Test SSO flow

#### Authentication Flow
1. **Initiation**: User clicks SSO login
2. **Redirect**: Application redirects to IdP
3. **Authentication**: User authenticates with IdP
4. **Callback**: IdP returns to application with token
5. **Validation**: Application validates token and creates session

## Integration Strategy for Dail it Platform

### Recommended Implementation
1. **Primary Method**: OAuth 2.0 with OIDC
2. **Fallback Method**: SAML SSO
3. **User Management**: Just-in-time provisioning
4. **Session Management**: JWT tokens with secure cookies

### Portal Integration Flow
1. User logs in via Dail it website
2. Authentication processed through API
3. Successful login redirects to portal.dailit.com
4. Portal receives authenticated session
5. User gains access to communication platform

### Security Considerations
- Use HTTPS for all authentication endpoints
- Implement CSRF protection
- Secure cookie configuration
- Token expiration and refresh mechanisms
- Rate limiting on authentication attempts

### Error Handling
- Invalid credentials
- Account lockout
- Password reset functionality
- Forgot password workflow
- Session timeout handling

## Implementation Notes

### Required Features for Login System
1. **Login Form**: Username/password input
2. **SSO Options**: Integration with identity providers
3. **Password Reset**: Forgot password functionality
4. **Remember Me**: Optional persistent sessions
5. **Error Messages**: Clear user feedback
6. **Loading States**: Visual feedback during authentication
7. **Redirect Handling**: Post-login portal access

### API Endpoints to Implement
```javascript
// Login
POST /api/auth/login
// SSO Initiate  
GET /api/auth/sso/initiate
// Password Reset
POST /api/auth/password-reset
// Forgot Password
POST /api/auth/forgot-password
// Session Validation
GET /api/auth/validate
// Logout
POST /api/auth/logout
```

### Frontend Integration
- Form validation
- API error handling
- Loading states
- Responsive design
- Accessibility compliance
- Multi-language support

## Additional Resources
- [Titan Host SSO Configuration Guide](https://docs.versa-networks.com/Titan/Titan_Portal/Getting_Started_with_Titan_Portal/Configure_Single_Sign-On_for_Titan_Portal)
- [TitanHQ OAuth Settings](https://docs.titanhq.com/en/27444-configuring-oauth-connection-settings.html)
- [Boomerang Okta Integration](https://docs.getboomerang.ai/integrations-/7ioRqntGpnxCaSmVq4EyPS/boomerang-okta-integration/t5a5VPwxtNXqa2PkhPsMbt) 