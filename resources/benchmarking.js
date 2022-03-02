"use strict";

readExcel("resources/company_data/Benchmarking_Platform.xlsx").then(
  async res => {
    const response = await readExcel("resources/company_data/Competitors.xlsx");
    const competitorNames = response["Competitors"];

    const competitorListWrapper = document.getElementById("competitor-list");
    let competitorsHtmlString = "";
    const data = Object.values(res);
    console.log(res);

    for (let i = 0; i < data.length; i++) {
      const firstLine = data[i][0];
      competitorsHtmlString += `
            <a class="card" href="/company.html?id=${firstLine.name}">
              <div class="card-header">
                <div>TCFD Readiness</div>
                <div>${firstLine.score}</div>
              </div>
              <div class="card-body">
                <figure class="container block" id=line-chart-${i + 1}></figure>
              </div>
            </a>
          `;
    }
    competitorListWrapper.innerHTML = competitorsHtmlString;

    for (let i = 0; i < data.length; i++) {
      const company = competitorNames.find(
        competitor => competitor.fileName === data[i][0].name
      );
      renderLinearChart(`line-chart-${i + 1}`, data[i], company.name);
    }

    // bottom linear-chart
    renderLinearChartCompanies(
      "line-chart-all-companies",
      Object.values(data),
      competitorNames
    );
  }
);
