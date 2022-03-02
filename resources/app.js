"use strict";

readExcel("resources/company_data/Competitors.xlsx").then(res => {
  const select = document.getElementById("inputGroupSelect01");
  let competitorsHtmlString = "";
  console.log(res["Competitors"]);

  for (let competitor of res["Competitors"]) {
    competitorsHtmlString += `
      <option value=${competitor.fileName}>${competitor.name}</option>
    `;
  }

  if (select) {
    select.innerHTML = `<option selected>Choose...</option>${competitorsHtmlString}`;
  }
});

const handleSearch = () => {
  const select = document.getElementById("inputGroupSelect01");
  window.location.href = `/company.html?id=${select.value}`;
};

const searchBtn = document.getElementById("search-btn");

searchBtn?.addEventListener("click", handleSearch.bind(this));
searchBtn?.removeEventListener("click", handleSearch.bind(this));
