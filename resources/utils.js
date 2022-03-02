function listToMatrix(list, elementsPerSubArray) {
  var matrix = [],
    i,
    k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }
    matrix[k].push(list[i]);
  }

  return matrix;
}

function BinaryToString(binary) {
  let error;

  try {
    return decodeURIComponent(escape(binary));
  } catch (_error) {
    error = _error;
    if (error instanceof URIError) {
      return binary;
    } else {
      throw error;
    }
  }
}

function ArrayBufferToString(buffer) {
  return BinaryToString(
    new Uint8Array(buffer).reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, "")
  );
}

async function readExcel(file) {
  try {
    let output = {};
    await fetch(file)
      .then(res => res.arrayBuffer())
      .then(ab => {
        const dataStr = ArrayBufferToString(ab);
        const workbook = XLSX.read(dataStr, {
          type: "binary",
          cellText: true,
          raw: true,
          cellDates: true
        });

        for (let i = 0; i < workbook.SheetNames.length; i++) {
          const currentWorksheet = workbook.Sheets[workbook.SheetNames[i]];
          output[workbook.SheetNames[i]] = XLSX.utils.sheet_to_json(
            currentWorksheet,
            { raw: false, dateNF: "yyyy-mm-dd" }
          );
        }
      });
    return output;
  } catch (error) {
    console.log(error);
  }
}

function renderPieChart(data) {
  
  
  var chart = Highcharts.chart(
    "pie",
    {
      chart: {
        spacing: [40, 0, 40, 0],
        backgroundColor: "#37474F",
        borderWidth: "0px"
      },
      title: {
        floating: true,
        // text: data[0].title,
        text: 'SASB 78%',
        style: {
          color: "white",
          fontFamily: "Microsoft JhengHei"
        }
      },
      tooltip: {
        pointFormat: "<b>{point.percentage:.0f}%</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: "pointer",
          dataLabels: {
            enabled: false,
            format: "<b>{point.name}</b>: {point.percentage:.0f} %",
            style: {
              color:
                (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                "white"
            }
          },
          point: {
            events: {
              mouseOver: function (e) {
                chart.setTitle({
                  text: e.target.name + "\t" + e.target.y + " %"
                });
              }
            }
          }
        }
      },
      series: [
        {
          type: "pie",
          innerSize: "80%",
          data: [
            {
              y: Number(data[0].score),
              url: "http://bbs.hcharts.cn",
              color: "#73a9db",
              // color: "#37474F",
              selected: true
            },

            {
              y: 100 - Number(data[0].score),
              color: "#4B515D",
              url: "http://www.hcharts.cn",
              borderWidth: "0px"
            }
          ]
        }
      ]
    },
    function (c) {
      console.log(c, c.setTitle);
      var centerY = c.series[0].center[1],
        titleHeight = parseInt(c.title.styles.fontSize);
      c.setTitle({
        y: centerY + titleHeight / 2,
        text: data[0].score
      });
    }
  );
}

function renderLinearChart(container, data, title = "") {
  const scores = data.map(item => Number(item.ESG_Score));
  const dates = data.map(item => item.Date);
  const firstDate = dates[0].split("/").reverse();

  Highcharts.chart(container, {
    chart: {
      backgroundColor: "#252528"
    },
    title: {
      text: title,
      style: {
        color: "#fff"
      }
    },
    legend: {
      itemStyle: {
        color: "#fff",
        fontWeight: "bold"
      }
    },
    yAxis: {
      title: {
        text: ""
      },
      labels: {
        style: {
          color: "#fff"
        }
      }
    },
    xAxis: {
      accessibility: {
        rangeDescription: "Range: 2016 to 2021"
      },
      labels: {
        style: {
          color: "#fff"
        }
      },
      type: "datetime",
      dateTimeLabelFormats: {
        week: "%e of %b"
      }
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    series: [
      {
        name: "ESG score",
        data: scores,
        pointStart: Date.UTC(
          Number(`20${firstDate[0]}`),
          firstDate[1],
          firstDate[2]
        ),
        pointInterval: 24 * 3600 * 1000 * 7
      }
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom"
            }
          }
        }
      ]
    }
  });
}

function renderLinearChartCompanies(container, data, competitorNames) {
  const series = data.reduce((acc, item) => {
    const firstDate = item[0].Date.split("/").reverse();
    const modifiedObj = {
      name: competitorNames.find(
        competitor => competitor.fileName === item[0].name
      ).name,
      data: item.map(el => Number(el.ESG_Score)),
      pointStart: Date.UTC(
        Number(`20${firstDate[0]}`),
        firstDate[1],
        firstDate[2]
      ),
      pointInterval: 24 * 3600 * 1000 * 7
    };

    return [...acc, modifiedObj];
  }, []);

  Highcharts.chart(container, {
    chart: {
      backgroundColor: "#252528"
    },
    title: {
      text: "TCFD Metrics",
      style: {
        color: "#fff"
      }
    },
    legend: {
      itemStyle: {
        color: "#fff",
        fontWeight: "bold"
      }
    },
    yAxis: {
      title: {
        text: ""
      },
      labels: {
        style: {
          color: "#fff"
        }
      }
    },
    xAxis: {
      accessibility: {
        rangeDescription: "Range: 2016 to 2021"
      },
      labels: {
        style: {
          color: "#fff"
        }
      },
      type: "datetime",
      dateTimeLabelFormats: {
        week: "%e of %b"
      }
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    series,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom"
            }
          }
        }
      ]
    }
  });
}

function renderBarChartCompanies() {
  cities = {
    'Climate Oversight A':50,
    'Climate Oversight B':39,
    'Climate Strategy A':28,
    'Climate Strategy B':25,
    'Climate Strategy C':25,
    'Climate Risk A':60,
    'Climate Risk B':54,
    'Climate Risk C':49,
    'Climate Targets A':51,
    'Climate Targets B':20,
    'Climate Targets C':34
  }


var options = {
    chart: {
        type: 'column',                       //指定图表的类型，默认是折线图（line）
        backgroundColor:'#252528',

    },
    title: {
        text:'Company TCFD Readiness',
        style: {
            color:'white',
        }
    },
    xAxis: {
        categories: Object.keys(cities),
        style: {
          color: "#fff",
          style: {
            color: "#fff"
          }
        }
           // x 轴分类
    },
    yAxis: {
        title: {
            text: 'Company TCFD Disclosure Readiness',
            style: {
                color:'white',
            }                // y 轴标题
        }
    },
    chartOptions: {
      legend: {
        layout: "horizontal",
        align: "center",
        verticalAlign: "bottom"
      }},

    series: [{                              // 数据列
        name: 'TCFD Metrics',                        // 数据列名
        data: Object.values(cities),
        style: {
          color: "#fff"
        }                     // 数据
    }],
};
// 图表初始化函数
var chart = Highcharts.chart("bar-chart", options);
}


function renderDoubleBarChartCompanies() {
  Highcharts.chart('container', {
  chart: {
    type: 'column',
    backgroundColor:'#252528'
  },
  title: {
    text: 'TCFD Metrics Indicator-by-Indicator Comparison',
    style: {
      color:'white',
  }     
  },
  // subtitle: {
  //   text: 'Source: NASDAQ ESG',
  //   style: {
  //     color:'white',
  // } 
  // },
  xAxis: {
    categories: [
      'Climate Oversight A',
      'Climate Oversight B',
      'Climate Strategy A',
      'Climate Strategy B',
      'Climate Strategy C',
      'Climate Risk A',
      'Climate Risk B',
      'Climate Risk C',
      'Climate Targets A',
      'Climate Targets B',
      'Climate Targets C',
      // 'Dec'
    ],
    crosshair: true
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Score',
      style: {
        color:'white',
    } 
    }
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  },
  series: [{
    name: 'Company',
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6]

  }, {
    name: 'Peer Average',
    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6]

  // }, {
  //   name: 'London',
  //   data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

  // }, {
  //   name: 'Berlin',
  //   data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

  }]
});
}