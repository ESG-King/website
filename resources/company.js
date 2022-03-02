"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const query = new URLSearchParams(window.location.search);
  const companyName = query.get("id");
  let linearChartTitle;

  readExcel("resources/company_data/Competitors.xlsx").then(res => {
    const titleWrapper = document.getElementById("title");
    const statsTitleWrapper = document.getElementById("stats-title");
    const data = res["Competitors"].find(item => item.fileName === companyName);
    titleWrapper.textContent = `${data.name} Climate Dashboard`;
    statsTitleWrapper.textContent = `${data.name} Climate Summary`;

    // set linear chart
    linearChartTitle = `${data.name} Historical ESG Score`;
  });

  readExcel(`resources/company_data/${companyName}.xlsx`).then(res => {
    const topRightStatsWrapper = document.getElementById("top-right-stats");
    const articlesWrapper = document.getElementById("articles");
    const midTableStatsWrapper = document.querySelector(
      "#mid-table-stats > tbody"
    );

    let topCornerHtmlString = "";
    let articlesHtmlString = "";
    let midTableStatsHtmlString = "";

    for (let stat of res["Top Right Corner Stats"]) {
      topCornerHtmlString += `
        <div class = "col">
          <div class ="container text-center">
              <div class = "text-white">
                  <h1>${stat.score}</h1>
                  <p>${stat.title}</p>
              </div>
          </div>
        </div>`;
    }

    for (let article of res["News Articles"]) {
      articlesHtmlString += `
        <li class="list-group-item"><a target="_blank" href=${article.linkAddress}>${article.headline}</a></li>`;
    }

    for (let stat of res["Middle Table Stats"]) {
      // console.log(stat)
      midTableStatsHtmlString += stat.title
        ? `
          <tr>
            <th scope="row" class="th-title">+ &nbsp; ${stat.title}</i></th>
            <td>${stat[2021]}</td>
            <td>${stat[2020]}</td>
            <td>${stat[2019]}</td>
          </tr>
        `
        : "";
    }

  //   <tr>
  //   <th scope="row" class="th-title">+ &nbsp; ${stat.title}</i></th>
  //   <td>${stat[2021]}</td>
  //   <td>${stat[2020]}</td>
  //   <td>${stat[2019]}</td>
  //   <td>${stat[2018]}</td>
  //   <td>${stat[2017]}</td>
  //   <td>${stat[2016]}</td>
  // </tr>

    topRightStatsWrapper.innerHTML = topCornerHtmlString;
    articlesWrapper.innerHTML = articlesHtmlString;
    midTableStatsWrapper.innerHTML = midTableStatsHtmlString;

    // pie chart
    renderPieChart(res["Left Pie Chart"]);

    // // linear chart
    // renderLinearChart("line-chart", res["Graph_Data"], linearChartTitle);

    // bar chart
    renderBarChartCompanies();

    // double bar
    renderDoubleBarChartCompanies()
  });
});

