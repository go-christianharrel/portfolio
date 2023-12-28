const countryInput = document.querySelector("#country_input");
const searchButton = document.querySelector("#search_button");
const countryDetails = document.querySelector("#country_details");
const otherCountries = document.querySelector("#other_countries");

countryInput.addEventListener("input", () => {
  searchButton.disabled = countryInput.value.trim() === "";
});

async function searchCountry() {
  const countryInputValue = countryInput.value.trim();

  if (!countryInputValue) return;

  try {
    const countryResponse = await fetch(
      `https://restcountries.com/v3.1/name/${countryInputValue}`
    );
    const countryData = await countryResponse.json();

    if (!countryData.length) throw new Error("Country doesn't Exist");

    const country = countryData[0];
    const region = country.region;

    countryDetails.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} Flag">
      <h2>${country.name.common}</h2>
      <p>Capital: ${country.capital}</p>
      <p>Population: ${country.population.toLocaleString()}</p>
      <p>Area: ${country.area.toLocaleString()} sq km</p>
      <p>Region: ${country.region}</p>
      <p>Official Languages: ${Object.values(country.languages).join(", ")}</p>
    `;

    const regionResponse = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    const regionData = await regionResponse.json();

    otherCountries.innerHTML = `<h2>Other Countries in the Same Region</h2>`;
    const flagRow = document.createElement("div");
    flagRow.classList.add("flag-row");

    regionData.forEach((country) => {
      const countryCard = document.createElement("div");
      countryCard.classList.add("flag-card");
      countryCard.innerHTML = `
        <img src="${country.flags.png}" alt="${country.name.common} Flag">
        <p>${country.name.common}</p>
      `;
      flagRow.appendChild(countryCard);
    });

    otherCountries.appendChild(flagRow);
  } catch (error) {
    countryDetails.innerHTML = `<p class="error-message">${error.message}</p>`;
    otherCountries.innerHTML = "";
  }
}
