# TalentScreen — Next.js Frontend Application

Ứng dụng Frontend cho hệ thống phỏng vấn và sàng lọc ứng viên thông minh **TalentScreen**, xây dựng trên nền tảng Next.js App Router kết nối trực tiếp với NestJS REST API backend.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **UI Primitives**: Base UI / shadcn
- **State & Server Cache**: [@tanstack/react-query v5](https://tanstack.com/query/latest)
- **HTTP Client**: [Axios](https://axios-http.com/) với typed interceptor và silent token refresh queue
- **Form & Validation**: React Hook Form + [Zod v4](https://zod.dev/)
- **Notifications**: Sonner

## Kiến trúc thư mục

```text
src/
├── app/                      # Next.js App Router routes
│   ├── auth/                 # Public auth pages (login, activate, forgot/reset password)
│   ├── globals.css           # Global CSS variables & Tailwind 4 theme
│   ├── layout.tsx            # Root layout bọc QueryProvider & Toaster
│   └── page.tsx              # Home / Auth status verification page
├── components/               # UI components
│   ├── ui/                   # Reusable primitive UI components
│   └── UserProfileCard.tsx   # Verified profile card component
├── config/                   # Cấu hình ứng dụng
│   └── env.ts                # Validation và normalization cho biến môi trường
├── features/                 # Modular feature boundaries
│   └── auth/                 # Feature Authentication & Authorization
│       ├── api/              # auth.api.ts & auth.keys.ts
│       ├── components/       # login-form, forgot-password-form, reset-password-form, activate-account-form
│       ├── hooks/            # use-auth.ts (React Query mutations & queries)
│       ├── schemas/          # Zod validation schemas
│       └── types/            # Typed domain models (CurrentUser, AuthorizationContext, DTOs)
├── lib/                      # Core utilities & API foundation
│   ├── api/                  # Shared API client, typed envelope unwrappers, error normalizer
│   └── auth/                 # Isolated access token boundary
├── middleware.ts             # Next.js proxy middleware (redirect authenticated users)
└── providers/                # React Context & Query Providers
```

## Cấu hình môi trường (Environment Variables)

Tạo file `.env.local` từ file mẫu `.env.example`:

```bash
cp .env.example .env.local
```

Nội dung cấu hình tối thiểu:

```env
# URL trỏ đến NestJS backend (mặc định port 3000 với prefix /api/v1)
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

> **Lưu ý bảo mật:**
> - Frontend không lưu trữ secret của NestJS, Gemini, Resend hoặc Cloudinary.
> - Refresh Token được backend quản lý hoàn toàn qua `HttpOnly` cookie với scope `/api/v1/auth`. JavaScript frontend không đọc hoặc ghi Refresh Token.

## Hướng dẫn chạy ứng dụng

### 1. Cài đặt dependencies

```bash
npm ci
```

### 2. Chạy môi trường phát triển (Development)

```bash
npm run dev
```

Ứng dụng khởi chạy tại [http://localhost:3001](http://localhost:3001) (để tránh xung đột cổng với NestJS backend chạy ở cổng 3000).

### 3. Kiểm tra mã nguồn (Lint & Typecheck)

```bash
# Kiểm tra ESLint
npm run lint

# Kiểm tra TypeScript typecheck
npx tsc --noEmit
```

### 4. Build Production

```bash
npm run build
```

## Quy tắc API Contract (Todo 00)

- Tất cả request gửi đến endpoint backend đều có tiền tố `/api/v1`.
- Backend success response có dạng `{ message: string | null, data: T | null, meta?: PaginationMeta }` và được unwrap tự động qua `unwrapResponse<T>()`.
- Backend error response có dạng `{ error: { code, message, requestId, details? } }` và được chuẩn hóa qua `getApiError()`.
- Access Token được tự động gắn vào Header `Authorization: Bearer <token>`.
- Khi Access Token hết hạn (401), request interceptor sẽ tự động đưa request vào hàng đợi và gọi `POST /api/v1/auth/refresh` bằng `HttpOnly` cookie để cấp token mới mà không làm gián đoạn trải nghiệm người dùng.
