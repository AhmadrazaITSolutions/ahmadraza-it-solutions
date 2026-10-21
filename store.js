(function () {
  "use strict";
  const cfg = window.STORE_CONFIG || {};
  const currency = cfg.currency || "OMR";
  const money = n => new Intl.NumberFormat(cfg.locale || "en-OM", {
    style: "currency", currency, minimumFractionDigits: 3, maximumFractionDigits: 3
  }).format(n);

  // DEMO INVENTORY: edit names, prices, categories, descriptions and art as needed.
  // Prices below are sample OMR amounts, not verified live inventory or supplier prices.
  const products = [
    {id:1,name:"Performance Laptop",category:"Computing",price:189.000,tag:"BESTSELLER",bg:"#e6e3dd",art:"laptop",description:"A sleek everyday workstation."},
    {id:2,name:"Wireless Headphones",category:"Audio",price:22.900,tag:"POPULAR",bg:"#e7e5e2",art:"headphones",description:"Immersive audio, everyday comfort."},
    {id:3,name:"Smartphone",category:"Mobile",price:129.900,tag:"NEW",bg:"#e2e8e2",art:"phone",description:"Modern design, smart performance."},
    {id:4,name:"Wireless Mouse",category:"Accessories",price:8.900,tag:"ESSENTIAL",bg:"#e8e5df",art:"mouse",description:"Precision for your daily workflow."},
    {id:5,name:"Mechanical Keyboard",category:"Accessories",price:19.900,tag:"FAVORITE",bg:"#e4e4e6",art:"keyboard",description:"A satisfying feel with every key."},
    {id:6,name:"Smart Watch",category:"Mobile",price:29.900,tag:"TRENDING",bg:"#e6e9e4",art:"watch",description:"Your everyday companion, at a glance."}
  ];
  const cart = {};
  let activeCategory = "All";
  let toastTimer;
  const $ = id => document.getElementById(id);
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function art(p) {
    const svgStart = '<svg viewBox="0 0 240 180" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">';
    const drawings = {
      laptop:'<ellipse cx="120" cy="143" rx="78" ry="10" fill="#d2d0ca"/><rect x="48" y="22" width="144" height="101" rx="5" fill="#777975"/><rect x="53" y="27" width="134" height="91" rx="2" fill="#24292a"/><rect x="58" y="32" width="124" height="81" fill="#bac8bf"/><path d="M58 89Q92 38 121 76T182 57V113H58Z" fill="#657c6d"/><path d="M58 101Q104 72 129 88T182 83V113H58Z" fill="#3c5146"/><path d="M34 125H206L192 137H48Z" fill="#b7b8b4"/><path d="M34 125H206L198 130H42Z" fill="#d4d4d0"/><rect x="101" y="126" width="38" height="3" rx="1" fill="#858680"/>',
      headphones:'<ellipse cx="120" cy="145" rx="72" ry="8" fill="#d2d0ca"/><path d="M57 101V80C57 28 183 28 183 80V101" stroke="#343638" stroke-width="17" stroke-linecap="round"/><rect x="44" y="86" width="39" height="57" rx="14" fill="#27292b"/><rect x="157" y="86" width="39" height="57" rx="14" fill="#27292b"/><rect x="52" y="95" width="22" height="39" rx="9" fill="#515454"/><rect x="166" y="95" width="22" height="39" rx="9" fill="#515454"/>',
      phone:'<ellipse cx="120" cy="155" rx="39" ry="6" fill="#d0d1ca"/><rect x="77" y="10" width="87" height="160" rx="14" fill="#353a37"/><rect x="81" y="14" width="79" height="152" rx="11" fill="#a9baad"/><path d="M81 99Q104 38 122 73T160 49V166H81Z" fill="#718c79"/><path d="M81 126Q117 90 133 111T160 89V166H81Z" fill="#354f3f"/><rect x="105" y="19" width="30" height="5" rx="3" fill="#292c2a"/>',
      mouse:'<ellipse cx="120" cy="139" rx="66" ry="12" fill="#d2d0ca"/><path d="M120 29C78 29 66 60 67 95C68 126 87 141 120 141C153 141 172 126 173 95C174 60 162 29 120 29Z" fill="#b9b9b3"/><path d="M120 30V76" stroke="#777873" stroke-width="2"/><path d="M120 30C86 30 72 53 69 78H120Z" fill="#d0d0ca"/><rect x="116" y="43" width="8" height="18" rx="4" fill="#777873"/>',
      keyboard:'<path d="M31 57Q31 49 39 49H201Q209 49 209 57V119Q209 127 201 127H39Q31 127 31 119Z" fill="#a4a6a7"/><rect x="37" y="55" width="166" height="65" rx="3" fill="#35383a"/>'+Array.from({length:4},(_,r)=>Array.from({length:13},(_,c)=>'<rect x="'+(41+c*12.3)+'" y="'+(60+r*13)+'" width="9.3" height="9" rx="1.4" fill="'+((r+c)%5===0?'#b7c9ba':'#b4b6b5')+'"/>').join("")).join("")+'<rect x="75" y="112" width="90" height="4" rx="1" fill="#d4d4d1"/>',
      watch:'<ellipse cx="120" cy="144" rx="54" ry="9" fill="#d0d1ca"/><rect x="103" y="23" width="34" height="40" rx="13" fill="#515954"/><rect x="103" y="117" width="34" height="37" rx="13" fill="#515954"/><rect x="78" y="46" width="84" height="80" rx="23" fill="#363a37"/><rect x="84" y="52" width="72" height="68" rx="18" fill="#b7c9ba"/><rect x="89" y="57" width="62" height="58" rx="15" fill="#e0e8df"/><circle cx="120" cy="81" r="13" stroke="#57715e" stroke-width="4"/><path d="M98 104H142" stroke="#57715e" stroke-width="3" stroke-linecap="round"/>'
    };
    return svgStart+(drawings[p.art]||drawings.phone)+"</svg>";
  }

  function filteredProducts() {
    const query = $("product-search").value.trim().toLowerCase();
    return products.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
      [p.name,p.category,p.description].some(s => s.toLowerCase().includes(query)));
  }

  function renderProducts() {
    const shown = filteredProducts();
    $("product-grid").innerHTML = shown.map(p => `
      <article class="product-card">
        <div class="product-art" style="background:${p.bg}">${art(p)}<span class="product-tag">${escapeHTML(p.tag)}</span></div>
        <div class="product-info">
          <div class="product-category">${escapeHTML(p.category)}</div>
          <div class="product-name">${escapeHTML(p.name)}</div>
          <div class="product-description">${escapeHTML(p.description)}</div>
          <div class="product-price">${money(p.price)}</div>
          <button class="add-button" data-add="${p.id}">Add to bag +</button>
        </div>
      </article>`).join("");
    $("product-count").textContent = shown.length + (shown.length === 1 ? " product" : " products");
    $("empty-state").hidden = shown.length !== 0;
    document.querySelectorAll("[data-category]").forEach(b => {
      const selected = b.dataset.category === activeCategory;
      b.classList.toggle("active", selected);
      b.setAttribute("aria-pressed", String(selected));
    });
  }

  function totalItems() { return Object.values(cart).reduce((sum,n) => sum+n,0); }
  function subtotal() { return products.reduce((sum,p) => sum + p.price*(cart[p.id]||0),0); }

  function renderCart() {
    $("cart-count").textContent = totalItems();
    $("drawer-count").textContent = "("+totalItems()+")";
    const chosen = products.filter(p => cart[p.id]);
    if (!chosen.length) {
      $("cart-items").innerHTML = `<div class="cart-empty"><div class="empty-symbol">◇</div><strong>Your bag is empty</strong><p>Looks like you haven't found your favorite tech yet.</p><button class="button button-dark" id="continue-shopping">Explore products</button></div>`;
      $("cart-summary").innerHTML = "";
      return;
    }
    $("cart-items").innerHTML = chosen.map(p => `
      <div class="cart-line">
        <div class="cart-thumb" style="background:${p.bg}">${art(p)}</div>
        <div class="cart-product"><strong>${escapeHTML(p.name)}</strong><div class="cart-product-price">${money(p.price)}</div>
          <div class="quantity-controls">
            <button data-qty="-1" data-id="${p.id}" aria-label="Decrease ${escapeHTML(p.name)} quantity">−</button>
            <span>${cart[p.id]}</span>
            <button data-qty="1" data-id="${p.id}" aria-label="Increase ${escapeHTML(p.name)} quantity">+</button>
            <button class="remove-button" data-remove="${p.id}">Remove</button>
          </div>
        </div>
        <div class="line-total">${money(p.price*cart[p.id])}</div>
      </div>`).join("");
    $("cart-summary").innerHTML = `
      <div class="cart-summary"><div class="subtotal"><span>Subtotal</span><span>${money(subtotal())}</span></div>
      <p class="shipping-note">Shipping and any additional charges are confirmed with you on WhatsApp. Prices shown are sample OMR prices; please confirm availability before ordering.</p>
      <button class="checkout-button" id="whatsapp-checkout">Order via WhatsApp <span aria-hidden="true">↗</span></button>
      <p class="checkout-note">No online payment is collected by this website. Your order opens as a WhatsApp message for you to review and send.</p></div>`;
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function openCart() {
    $("cart-overlay").hidden = false;
    document.body.style.overflow = "hidden";
    $("close-cart").focus();
  }
  function closeCart() {
    $("cart-overlay").hidden = true;
    document.body.style.overflow = "";
    $("open-cart").focus();
  }

  function orderOnWhatsApp() {
    const number = String(cfg.whatsappNumber || "").replace(/\D/g, "");
    if (!number) {
      showToast("Store setup needed: add your WhatsApp number in config.js first.");
      return;
    }
    const lines = products.filter(p => cart[p.id]).map(p =>
      `• ${p.name} × ${cart[p.id]} — ${money(p.price*cart[p.id])}`);
    const message = [
      `Hello ${cfg.storeName || "AHMADRAZA IT SOLUTIONS"}, I'd like to place an order:`,
      "",
      ...lines,
      "",
      `Subtotal: ${money(subtotal())}`,
      "",
      "Please confirm availability, delivery cost and final total."
    ].join("\n");
    const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.add) {
      const id = Number(button.dataset.add);
      cart[id] = (cart[id] || 0) + 1;
      renderCart();
      showToast(products.find(p => p.id === id).name + " added to your bag");
    } else if (button.dataset.category) {
      activeCategory = button.dataset.category;
      renderProducts();
    } else if (button.dataset.qty) {
      const id = Number(button.dataset.id);
      cart[id] = (cart[id] || 0) + Number(button.dataset.qty);
      if (cart[id] <= 0) delete cart[id];
      renderCart();
    } else if (button.dataset.remove) {
      delete cart[Number(button.dataset.remove)];
      renderCart();
      showToast("Item removed from your bag");
    } else if (button.id === "open-cart") {
      openCart();
    } else if (button.id === "close-cart") {
      closeCart();
    } else if (button.id === "continue-shopping") {
      closeCart();
      $("products").scrollIntoView({behavior:"smooth"});
    } else if (button.id === "whatsapp-checkout") {
      orderOnWhatsApp();
    }
  });

  $("cart-overlay").addEventListener("click", e => {
    if (e.target === $("cart-overlay")) closeCart();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("cart-overlay").hidden) closeCart();
  });
  $("product-search").addEventListener("input", renderProducts);
  $("year").textContent = new Date().getFullYear();
  renderProducts();
  renderCart();
})();
