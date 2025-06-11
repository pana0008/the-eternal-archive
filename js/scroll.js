const API_BASE = "https://www.dnd5eapi.co/api";

const getData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return null;
  }
};

const getParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    cat: params.get("cat"),
    item: params.get("item"),
  };
};

const formatLabel = (str) => {
  return str
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

document.addEventListener("DOMContentLoaded", async () => {
  const { cat, item } = getParams();

  try {
    const [menuData, scrollData] = await Promise.all([
      getData(API_BASE),
      cat && item ? getData(`${API_BASE}/${cat}/${item}`) : Promise.resolve(null),
    ]);

    // Render menu
    if (menuData) {
      const menuContainer = document.getElementById("menu-dropdown");
      if (menuContainer) {
        menuContainer.innerHTML = "";
        Object.entries(menuData).forEach(([key]) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <a href="category.html?cat=${key}" class="block px-4 py-2 hover:bg-[#3f2e22] transition capitalize">
              ${key.replace(/-/g, " ")}
            </a>
          `;
          menuContainer.appendChild(li);
        });
      }
    }

    // Render scroll details
    if (scrollData) {
      const container = document.getElementById("scroll-content");
      const bannerTitle = document.getElementById("scroll-title");
      if (bannerTitle) bannerTitle.textContent = formatLabel(scrollData.name || item);

      let html = "";
      const excludedFields = ["index", "updated_at", "url"];

      for (const [key, value] of Object.entries(scrollData)) {
        if (excludedFields.includes(key)) continue;

        if (typeof value === "string" || typeof value === "number") {
          html += `
            <div class="mb-2">
              <strong class="text-[#e0c28f]">${formatLabel(key)}:</strong>
              <span>${value}</span>
            </div>
          `;
        } else if (Array.isArray(value) && value.length && typeof value[0] === "string") {
          html += `
            <div class="mb-2">
              <strong class="text-[#e0c28f]">${formatLabel(key)}:</strong>
              <ul class="list-disc list-inside">
                ${value.map((val) => `<li>${val}</li>`).join("")}
              </ul>
            </div>
          `;
        } else if (Array.isArray(value) && typeof value[0] === "object") {
          html += `
            <div class="mb-2">
              <strong class="text-[#e0c28f]">${formatLabel(key)}:</strong>
              <ul class="list-disc list-inside">
                ${value.map((obj) => `<li>${obj.name || JSON.stringify(obj)}</li>`).join("")}
              </ul>
            </div>
          `;
        } else if (typeof value === "object" && value !== null) {
          html += `
            <div class="mb-2">
              <strong class="text-[#e0c28f]">${formatLabel(key)}:</strong>
              <span>${value.name || JSON.stringify(value)}</span>
            </div>
          `;
        }
      }

      if (container) container.innerHTML = html;
    } else {
      const container = document.getElementById("scroll-content");
      if (container)
        container.innerHTML = `<p class="text-red-300">No data found for this scroll.</p>`;
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
});
