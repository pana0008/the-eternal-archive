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

const renderCards = (data, containerId) => {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  Object.entries(data).forEach(([key]) => {
    const card = document.createElement('article');
    card.className =
      'bg-[#2a1a13] border border-[#AA7D4C] rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer capitalize';

    card.innerHTML = `
      <h3 class="text-xl font-semibold mb-2 text-[#AA7D4C]">${key.replace(/_/g, ' ')}</h3>
    `;

    card.addEventListener('click', () => {
      window.location.href = `category.html?cat=${key}`;
    });

    container.appendChild(card);
  });
};

const renderMenu = (data, containerId) => {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  Object.entries(data).forEach(([key, path]) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="category.html?cat=${key}" class="block px-4 py-2 hover:bg-[#3f2e22] transition capitalize">
        ${key.replace(/-/g, ' ')}
      </a>
    `;
    container.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  const rootData = await getData(API_BASE);
  if (rootData) {
    await Promise.all([
      renderCards(rootData, "dynamic-cards"),
      renderMenu(rootData, "menu-dropdown"),
    ]);
  }
});
