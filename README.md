# AHMADRAZA IT SOLUTIONS — Free Online Store

A responsive, static online-store starter designed for free GitHub Pages hosting. It uses plain HTML, CSS, and JavaScript—no paid dependencies, build tools, database, or server required.

## Included features

- Premium responsive storefront
- Product catalog with category filters and search
- Interactive cart: add, remove, change quantities, live OMR subtotal
- WhatsApp order handoff with pre-filled order details
- Customizable product names, descriptions, categories, and sample prices
- No payment collection and no external JavaScript libraries

## Before publishing: set your WhatsApp number

1. Open `config.js`.
2. Change `whatsappNumber: ""` to your WhatsApp number in international format using digits only (no `+`, spaces, brackets, or hyphens).
   - Format example: `968XXXXXXXX` (placeholder only; replace it with your actual number).
   - Do not use someone else's number.
3. Save the file.

The WhatsApp checkout button will show a setup message until a number is configured.

## Customize the sample inventory

Open `store.js` and edit the `products` array near the top. Change each product's:
- `name`
- `category` (`Computing`, `Accessories`, `Audio`, or `Mobile`, or add your own category and filter)
- `price` (number in OMR)
- `tag`
- `description`

The included products and prices are examples only, not verified stock or supplier quotes. Confirm actual products, prices, warranty, and delivery terms before taking orders.

## Publish with GitHub Pages (free)

You need a GitHub account. GitHub Pages can host this static site publicly for free on a public repository under eligible GitHub Free usage. GitHub's interface can change slightly.

1. Sign in or create an account at https://github.com.
2. Click **New repository**.
3. Name it `ahmadraza-it-solutions`.
4. Choose **Public** (the simplest option for free GitHub Pages) and create the repository.
5. On the new repository page, choose **Add file → Upload files**.
6. Upload all contents of this folder: `index.html`, `styles.css`, `config.js`, `store.js`, and the `assets` folder. Upload the files themselves to the repository root, not a nested project folder.
7. Click **Commit changes**.
8. Open **Settings → Pages**.
9. Under **Build and deployment**, select **Deploy from a branch**.
10. Select branch **main** and folder **/(root)**, then click **Save**.
11. Wait a few minutes, refresh the Pages settings page, and open the published URL shown there. For a repository named `ahmadraza-it-solutions`, it is usually `https://YOUR-GITHUB-USERNAME.github.io/ahmadraza-it-solutions/`.

GitHub Pages publishes a public website. Anything placed in this repository—including your WhatsApp contact number—is visible to visitors. Never put passwords, API keys, private customer data, or payment secrets in these files.

## Test before sharing

- Check that all categories and search work.
- Add several products to the bag and adjust quantities.
- Set your actual WhatsApp number and test the order link on a phone with WhatsApp.
- Confirm the sample products/prices and contact information are accurate.
- Test on a narrow mobile screen.

## Important limitations

- This is a static catalog and WhatsApp order handoff, not a full e-commerce backend.
- It does not track inventory, send order confirmations automatically, calculate shipping, collect payments, or protect/administer orders.
- Customers review and send the pre-filled WhatsApp message themselves. Orders are not recorded by this site.
- WhatsApp and internet access are required for the WhatsApp order handoff.
- GitHub Pages is hosting, not a custom domain or payment provider. A custom domain is optional and usually costs money.
- The store is set to OMR and uses three decimal places. Prices are sample placeholders; replace them with your actual prices.

## Files

- `index.html` — page structure
- `styles.css` — responsive design
- `config.js` — store name, currency, and WhatsApp contact setting
- `store.js` — demo inventory, catalog, cart, search, and WhatsApp order builder
- `assets/favicon.svg` — simple AR favicon
