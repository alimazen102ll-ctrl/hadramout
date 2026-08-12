let cart = [];

const addButtons = document.querySelectorAll(".add-cart");

const cartCount = document.getElementById("cartCount");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const cartButton = document.querySelector(".cart-btn");


/* =========================
   إضافة وجبة للسلة
========================= */

addButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const card = button.closest(".menu-card");

        const name = card.querySelector("h3").textContent;

        const priceText =
            card.querySelector(".price").textContent;

        const price =
            parseInt(priceText.replace(/[^\d]/g, ""));


        // إذا الوجبة موجودة، زيد الكمية
        const existingItem = cart.find(
            item => item.name === name
        );

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }


        updateCart();

        button.textContent = "تمت الإضافة ✓";

        setTimeout(() => {
            button.textContent = "إضافة للسلة";
        }, 1000);

    });

});

/* =========================
   تحديث السلة
========================= */

function updateCart() {

    // حساب عدد القطع
    let totalQuantity = 0;

    cart.forEach(item => {
        totalQuantity += item.quantity;
    });

    cartCount.textContent = totalQuantity;

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">السلة فارغة</p>';

        cartTotal.textContent = "0 د.ع";

        return;
    }


    let total = 0;


    cart.forEach((item, index) => {

        total += item.price * item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-top">

                <h3>${item.name}</h3>

                <span class="cart-item-price">
                    ${(item.price * item.quantity).toLocaleString()} د.ع
                </span>

            </div>


            <div class="quantity-controls">

                <button
                    class="quantity-btn"
                    onclick="increaseQuantity(${index})">
                    +
                </button>

                <span class="quantity">
                    ${item.quantity}
                </span>

                <button
                    class="quantity-btn"
                    onclick="decreaseQuantity(${index})">
                    −
                </button>

            </div>


            <button
                class="remove-item"
                onclick="removeItem(${index})">
                حذف
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    cartTotal.textContent =
        total.toLocaleString() + " د.ع";
}

/* =========================
   زيادة الكمية
========================= */

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();
}

/* =========================
   تقليل الكمية
========================= */

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    updateCart();
}


/* =========================
   حذف الوجبة
========================= */

function removeItem(index) {

    cart.splice(index, 1);

    updateCart();
}



/* =========================
   فتح السلة
========================= */

cartButton.addEventListener("click", () => {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.classList.add("cart-open");

});


/* =========================
   إغلاق السلة
========================= */

closeCart.addEventListener(
    "click",
    closeCartFunction
);

cartOverlay.addEventListener(
    "click",
    closeCartFunction
);


function closeCartFunction() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.classList.remove("cart-open");

}

/* =========================
   نموذج الطلب
========================= */

const orderBtn =
    document.getElementById("orderBtn");

const orderForm =
    document.getElementById("orderForm");

const closeOrderForm =
    document.getElementById("closeOrderForm");

const deliveryType =
    document.getElementById("deliveryType");

const addressGroup =
    document.getElementById("addressGroup");


/* فتح نموذج الطلب */

orderBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("السلة فارغة، أضف وجبة أولاً 🍽️");

        return;
    }

    orderForm.classList.add("active");

});


/* إغلاق النموذج */

closeOrderForm.addEventListener("click", () => {

    orderForm.classList.remove("active");

});


/* إظهار وإخفاء العنوان */

deliveryType.addEventListener("change", () => {

    if (deliveryType.value === "استلام من المطعم") {

        addressGroup.style.display = "none";

    } else {

        addressGroup.style.display = "block";

    }

});


/* =========================
   إرسال الطلب إلى واتساب
========================= */

const confirmOrder =
    document.getElementById("confirmOrder");

confirmOrder.addEventListener("click", () => {

    const name =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("customerPhone").value.trim();

    const type =
        document.getElementById("deliveryType").value;

    const address =
        document.getElementById("customerAddress").value.trim();

    const notes =
        document.getElementById("customerNotes").value.trim();


    /* التحقق من البيانات */

    if (!name) {
        alert("يرجى كتابة الاسم");
        return;
    }

    if (!phone) {
        alert("يرجى كتابة رقم الهاتف");
        return;
    }

    if (type === "توصيل" && !address) {
        alert("يرجى كتابة عنوان التوصيل");
        return;
    }


    /* إنشاء تفاصيل الطلب */

    let message = "";

    message += "🍖 *طلب جديد - مطاعم حضرموت اليمن*";
    message += "\n\n";

    message += "👤 الاسم: " + name;
    message += "\n";

    message += "📞 الهاتف: " + phone;
    message += "\n";

    message += "📦 طريقة الاستلام: " + type;
    message += "\n";


    if (type === "توصيل") {
        message += "📍 العنوان: " + address;
        message += "\n";
    }


    message += "\n";
    message += "🛒 *الطلب:*";
    message += "\n";


    let total = 0;


    cart.forEach((item) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        message +=
            "• " +
            item.name +
            " × " +
            item.quantity +
            " = " +
            itemTotal.toLocaleString() +
            " د.ع\n";

    });


    message += "\n";
    message +=
        "💰 *المجموع: " +
        total.toLocaleString() +
        " د.ع*";


    if (notes) {

        message += "\n\n";
        message += "📝 ملاحظات: " + notes;

    }


    /* رقم واتساب المطعم */

    const restaurantWhatsApp =
        "9647702914785";


    const whatsappURL =
        "https://wa.me/" +
        restaurantWhatsApp +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );

});

/* =========================
   أقسام المنيو
========================= */

const categoryButtons = document.querySelectorAll(".category-btn");
const menuCards = document.querySelectorAll(".menu-card");

categoryButtons.forEach((button) => {

    button.addEventListener("click", function () {

        const selectedCategory = this.getAttribute("data-category");

        categoryButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        menuCards.forEach((card) => {

            const cardCategory =
                card.getAttribute("data-category");

            if (
                selectedCategory === "all" ||
                cardCategory === selectedCategory
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});

/* =========================
   البحث في المنيو
========================= */

const menuSearch = document.getElementById("menuSearch");

menuSearch.addEventListener("input", function () {

    const searchText =
        this.value.trim().toLowerCase();

    menuCards.forEach((card) => {

        const name =
            card.querySelector("h3").textContent.toLowerCase();

        const description =
            card.querySelector("p").textContent.toLowerCase();

        if (
            name.includes(searchText) ||
            description.includes(searchText)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});

