## Add YouTube video to V-Z80 PLUS PDP

Embed the VIKUSHA V-Z80 Plus YouTube video on the V-Z80 PLUS product page, positioned right under the "Similar items" section and above the existing marketing image strip — matching the reference layout (full-width, centered, 16:9).

### Change

**File:** `src/storefront/pdp.jsx`

After the `{similar.length > 0 && (...)}` "Similar items" section (around line 170), insert a new section that only renders when `product.id === 'vz-80-plus'`:

- Centered container, max-width 900px (matches the marketing image strip width below it)
- Responsive 16:9 aspect ratio using `aspectRatio: '16 / 9'`
- Rounded corners (12px) and a soft shadow for polish
- `<iframe>` pointing to `https://www.youtube.com/embed/2MaWT7_jjeg`
- Standard YouTube embed permissions (`allow`, `referrerPolicy`, `allowFullScreen`)

### Resulting order on the V-Z80 PLUS page

1. Gallery + buy box
2. Specifications
3. Similar items
4. **YouTube video (new)**
5. Marketing feature image strip (1–12)
6. Footer
