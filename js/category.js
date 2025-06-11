const API_BASE = "https://www.dnd5eapi.co/api";

const getData = (url) => {
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .catch(error => {
      console.error("❌ Fetch error:", error);
      return null;
    });
};

const getCategoryFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat");
};

const formatLabel = (str) => {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const renderMenu = (data) => {
  const container = document.getElementById("menu-dropdown");
  if (data && container) {
    container.innerHTML = '';
    Object.entries(data).forEach(([key]) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="category.html?cat=${key}" class="block px-4 py-2 hover:bg-[#3f2e22] transition capitalize">
          ${key.replace(/-/g, ' ')}
        </a>
      `;
      container.appendChild(li);
    });
  }
};

const renderCategoryItems = (cat, data) => {
  const container = document.getElementById("category-items");
  if (!container) return;

  container.innerHTML = '';

  if (!data || !data.results) {
    container.innerHTML = `<p class="text-red-300">No data found for this category.</p>`;
    return;
  }

  data.results.slice(0, 9).forEach(item => {
    const card = document.createElement("article");
    card.className = `
      bg-[#d6c5a8] border-2 border-[#4a3a2c] rounded-xl 
      shadow-lg px-6 py-4 text-center 
      font-semibold text-[#3b2f1e] text-lg 
      hover:shadow-2xl hover:scale-105 transition-all duration-300 
      cursor-pointer torn-edge
    `;
    card.textContent = formatLabel(item.name);

    card.addEventListener('click', () => {
      window.location.href = `scroll.html?cat=${cat}&item=${item.index}`;
    });

    container.appendChild(card);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const category = getCategoryFromUrl();
  if (!category) {
    alert("No category specified.");
    return;
  }

  Promise.all([
    getData(API_BASE),
    getData(`${API_BASE}/${category}`)
  ])
  .then(([menuData, categoryData]) => {
    renderMenu(menuData);

    const catTitle = document.getElementById("category-title");
    if (catTitle) catTitle.textContent = formatLabel(category);

    renderCategoryItems(category, categoryData);
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });
});
