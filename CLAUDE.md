# Full Court Control Pro - Claude Development Notes

## 🇹🇷 **CRITICAL LANGUAGE REQUIREMENT**

**PRIMARY LANGUAGE: TURKISH (Türkçe)**

- ✅ **First Launch**: Application MUST be in Turkish from day 1
- 🌍 **Future**: Multi-language support planned but Turkish is priority
- 📝 **All UI Elements**: Buttons, labels, messages, hints, notifications, etc. must be in Turkish
- 🚫 **No English**: Avoid English text in user-facing elements
- 📋 **Forms**: Error messages, validation text, placeholders in Turkish
- 🎯 **Target Users**: Turkish construction industry professionals

**This requirement is STRICTLY enforced and must be maintained in all development phases.**

---

## Project Structure

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn-ui
- **Dependencies**: React Query, React Hook Form, Zod, @dnd-kit, Supabase
- **Testing**: Jest + React Testing Library (90%+ coverage)
- **Theme**: Construction-themed with whimsical touches

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run test         # Run tests
npm run test:watch   # Watch mode testing
npm run lint         # ESLint check
```

## Demo Routes

- `/` - Ana sayfa (Demo seçici)
- `/dashboard` - Temel kontrol paneli
- `/advanced-demo` - Gelişmiş demo (tüm özellikler)
- `/projects` - Projeler
- `/templates` - Şablonlar
- `/auth/signin` - Giriş akışı

## Agent Communication

- `.agent/handoff.md` - Ana el değiştirme dokümantasyonu
- `.agent/ux-decisions.md` - UX kararları
- `.agent/ui-specifications.md` - UI spesifikasyonları  
- `.agent/component-library.md` - Bileşen kütüphanesi
- `.agent/api-contracts.md` - API sözleşmeleri

## Playwright Browser Configuration

**Browser Window Settings:**
- Browser MUST be maximized on every launch
- Default maximize size: 1920x1080 (desktop standard)
- Use `mcp__playwright__browser_resize(1920, 1080)` after each navigation
- Configuration file: `.claude/playwright-config.js`

**Usage Pattern:**
```javascript
// Always follow this pattern for Playwright browser usage:
await mcp__playwright__browser_navigate("http://localhost:3000")
await mcp__playwright__browser_resize(1920, 1080)  // Maximize immediately
```

## Notes for Future Development

- All user-facing text must remain in Turkish
- Error messages and notifications in Turkish
- Multi-language support can be added later via i18n
- Construction industry terminology should be authentic Turkish