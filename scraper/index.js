const cheerio = require("cheerio");
const axios = require("axios");
const util = require("./parseHTML.js")
const aws = require("./aws")

var testHandler = (exports.handler = async function (event, context) {
  const ratios = await getStockDetails(event);
  await aws.saveToS3(ratios);
});

function getStockDetails(stockId) {
  return axios
    .get(`https://www.screener.in/company/${stockId}/consolidated/`)
    .then((response) => {
      const html = cheerio.load(response.data);

      const rawRatios = [];
      html("li", "#top-ratios").each((i, el) => {
        const stringValues = html(el)
          .text()
          .split("\n")
          .filter((x) => x.trim() !== "");
        const key = stringValues.slice(0, 1).join("").trim();
        const value = stringValues.slice(1, stringValues.length);
        rawRatios.push(value);
      });

      ratios = { stockId: stockId };
      const getMarketCap = () => util.parse(rawRatios[0][1].trim());
      const getPe = () => util.parse(rawRatios[3][0].trim());
      const getDividend = () => util.parse(rawRatios[5][0].trim());
      const getFaceValue = () => util.parse(rawRatios[8][1].trim());
      ratios["MarketCap"] = { unit : "Cr", value : getMarketCap() };
      ratios["PE"] = { unit : "", value : getPe() };
      ratios["Dividend"] = { unit : "%", value : getDividend() }
      ratios["FaceValue"] = { unit : "", value : getFaceValue() }
      ratios["OPM"] = getOPM(html);
      ratios["NPM"] = getNPM(html);
      ratios["Debt"]= {
        "Revenue": getRevenue(html),
        "Borrowings": getBorrowing(html),
        "OtherLiabilities": getOtherLiabilities(html)
      };
        return ratios;
      });
}

function getOPM(html) {
  let OPMDetails = util.getDetails(
    html,
    "thead:first-child tr th",
    "tbody:nth-child(2) tr:nth-child(4) td",
    "#profit-loss"
  );
  OPMDetails = {...OPMDetails, unit : "%"}
  return OPMDetails;
}

function getNPM(html) {
  let NPMDetails = util.getDetails(
    html,
    "thead:first-child tr th",
    "tbody:nth-child(2) tr:nth-child(10) td",
    "#profit-loss"
  );
  NPMDetails = {...NPMDetails, unit : "Cr"}
  return NPMDetails
}

function getRevenue(html) {
  let revenue = util.getDetails(
    html,
    "thead tr th",
    "tbody tr:nth-child(2) td",
    "#balance-sheet",
    "Revenue"
  );
  revenue = {...revenue, unit : "Cr"}
  return revenue
}

function getBorrowing(html) {
  let borrowing = util.getDetails(
    html,
    "thead tr th",
    "tbody tr:nth-child(3) td",
    "#balance-sheet"
  );
  borrowing = {...borrowing, unit : "Cr"}
  return borrowing
}

function getOtherLiabilities(html) {
  let otherLiability = util.getDetails(
    html,
    "thead tr th",
    "tbody tr:nth-child(4) td",
    "#balance-sheet"
  );
  otherLiability = {...otherLiability, unit : "Cr"}
  return otherLiability
}

// testHandler("TCS");
