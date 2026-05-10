# Layout Integrity Rules

## 🚨 CRITICAL RULES - ALWAYS FOLLOW

### 1. **Never Import Server Actions in Client Components**
   - ❌ **NEVER**: `import { createProduct } from './actions/products'` in a `"use client"` file
   - ✅ **ALWAYS**: Use API routes (`/app/api/`) or dynamic imports if absolutely necessary
   - **Why**: Static imports of server actions in client components cause webpack bundling errors that break the entire app

### 2. **Div Structure Must Be Balanced**
   - ✅ **ALWAYS**: Count opening `<div>` tags and closing `</div>` tags - they MUST match
   - ✅ **ALWAYS**: Use proper indentation to track nested divs
   - ✅ **ALWAYS**: Test with a simple script: count opening/closing divs before committing
   - **Tool**: `node -e "const fs = require('fs'); const code = fs.readFileSync('FILE.tsx', 'utf8'); const open = (code.match(/<div/g) || []).length; const close = (code.match(/<\/div>/g) || []).length; console.log('Open:', open, 'Close:', close);"`

### 3. **Conditional Rendering Must Be Complete**
   - ✅ **ALWAYS**: When using `{condition && <Component />}`, ensure ALL nested elements are properly closed
   - ✅ **ALWAYS**: Test conditional rendering by toggling the condition in the browser
   - ❌ **NEVER**: Render conditional components outside their conditional block

### 4. **Mobile Menu Drawer Structure**
   - ✅ **ALWAYS**: Use this exact structure for mobile menus:
   ```tsx
   {isMenuOpen && (
     <div className="fixed inset-0 z-50 md:hidden">
       {/* Backdrop */}
       <div onClick={() => setIsMenuOpen(false)} />
       
       {/* Menu Panel */}
       <div className="absolute top-0 right-0...">
         <div className="flex flex-col h-full">
           {/* Content */}
         </div>
       </div>
     </div>
   )}
   ```
   - ✅ **ALWAYS**: Count 3 closing `</div>` tags for the mobile menu structure
   - ✅ **ALWAYS**: Only render when `isMenuOpen` is true

### 5. **Before Making Changes That Affect Layout**
   - ✅ **ALWAYS**: Run `npm run build` to check for compilation errors
   - ✅ **ALWAYS**: Verify no linter errors with `npm run lint` or check lints
   - ✅ **ALWAYS**: Test the page renders after changes
   - ✅ **ALWAYS**: Check div structure balance after structural changes

### 6. **Server Actions Usage**
   - ✅ **ALLOWED**: Server actions in server components, API routes, and route handlers
   - ❌ **FORBIDDEN**: Server actions in client components (`"use client"`)
   - ✅ **ALTERNATIVE**: Use API routes (`/app/api/route.ts`) with `fetch()` calls from client

### 7. **Context Provider Structure**
   - ✅ **ALWAYS**: Keep context providers in layout.tsx
   - ✅ **ALWAYS**: Ensure context provider wraps all components that need it
   - ✅ **ALWAYS**: Return the provider JSX correctly with proper closing tags

### 8. **Build Verification Checklist**
   Before considering any layout change complete:
   - [ ] `npm run build` completes without errors
   - [ ] No webpack/module resolution errors in logs
   - [ ] HTML structure is valid (balanced tags)
   - [ ] Server returns HTTP 200 (not 500)
   - [ ] Page content is visible (not just grey/black screen)
   - [ ] No runtime errors in browser console

### 9. **Emergency Recovery Steps**
   If layout breaks:
   1. Check server logs for errors
   2. Verify div structure is balanced
   3. Check for server action imports in client components
   4. Clear `.next` cache: `rm -rf .next && npm run build`
   5. Restart dev server: `pkill -f "next dev" && npm run dev`

### 10. **Code Review Before Changes**
   - ✅ **ALWAYS**: Read the full file before editing structural elements
   - ✅ **ALWAYS**: Understand the component hierarchy before changes
   - ✅ **ALWAYS**: Check for existing patterns in similar components
   - ✅ **ALWAYS**: Verify imports are correct for the component type (client vs server)

## Common Pitfalls to Avoid

1. **Extra/Missing Closing Tags**: Most common cause of layout breaks
2. **Server Action Imports**: Second most common - causes webpack errors
3. **Conditional Rendering Issues**: Incomplete conditionals break structure
4. **Nested Component Structure**: Changes to nested components affect parent layout
5. **Cache Issues**: Old builds can cause false errors - always clear cache

## Quick Validation Commands

```bash
# Check div balance
node -e "const fs=require('fs'); const c=fs.readFileSync('FILE.tsx','utf8'); console.log('Open:',(c.match(/<div/g)||[]).length,'Close:',(c.match(/<\/div>/g)||[]).length)"

# Build check
npm run build

# Check for server action imports in client files
grep -r '"use client"' app/ | xargs grep -l "from.*actions"

# Clear cache and rebuild
rm -rf .next && npm run build
```

---

**Remember**: A broken layout means the entire app is unusable. Always verify structural changes work before moving on.
