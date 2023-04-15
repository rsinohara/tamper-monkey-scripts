// ==UserScript==
// @name          Speed Curve chart highlighter
// @namespace     https://github.com/rsinohara/tamper-monkey-scripts
// @author        Renato Sinohara
// @description   Allows you to highlight a chart in Speed Curve by hovering or clicking on the chart title.
// @run-at        document-idle
// @grant         none
// @match       *://*app.speedcurve.com/*
// @version       1.0
// ==/UserScript==


const getIndexFromHeaderElement = (headerElement) =>
  Array.prototype.indexOf.call(
    headerElement.parentElement.children,
    headerElement
  );
const findSerieFromHeader = (headerElement) => {
  const valueIndex = getIndexFromHeaderElement(headerElement);
  return headerElement.parentElement.parentElement.querySelectorAll(
    ".highcharts-series-" + valueIndex
  );
};
const detectHighlights = (seriesContainer) => {
  if (
    seriesContainer.querySelectorAll(".highlight, .permanent-highlight")
      .length === 0
  ) {
    seriesContainer.classList.remove("has-highlight");
  } else {
    seriesContainer.classList.add("has-highlight");
  }
};

function addListeners() {

  const styles = '.highcharts-series' +
    '{opacity: 1;}' +
    '.highcharts-root.has-highlight .highcharts-series:not(.highlight, .permanent-highlight),' +
    '.highcharts-root.has-highlight .highcharts-series:not(.highlight, .permanent-highlight)' +
    '{ opacity: 0.1; }' +
    '.stat.permanent-highlight'
  '{   text-decoration: underline  }';


  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);


  document.querySelectorAll(".stat").forEach((headerElement) => {

    const headerSeries = findSerieFromHeader(headerElement);
    const seriesContainer = headerSeries[0].parentElement.parentElement;

    headerElement.addEventListener("mouseenter", () => {
      headerSeries.forEach((c) => c.classList.add("highlight"));
      seriesContainer.classList.add("has-highlight");
    });

    headerElement.addEventListener("mouseleave", () => {
      headerSeries.forEach((c) => c.classList.remove("highlight"));
      detectHighlights(seriesContainer);
    });

    headerElement.addEventListener("click", () => {
      headerElement.classList.toggle("permanent-highlight");
      headerSeries.forEach((c) => c.classList.toggle("permanent-highlight"));
      detectHighlights(seriesContainer);
    });
  });
}

let attemptsRemaining = 5;

function tryAddingListeners() {

  if (document.querySelectorAll(".stat").length) {
    addListeners();
  }
  else if (attemptsRemaining-- > 0) {
    setTimeout(tryAddingListeners, 1500);
  }
}
tryAddingListeners();