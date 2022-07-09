import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "my_custom_theory_id";
var name = "My Custom Theory";
var description = "A basic theory.";
var authors = "12341234";
var version = "1.0.0";

var init = () => {
  currency = theory.createCurrency();
  
  // a1
    {
        let getDesc = (level) => "a_1=" + getA1Factor(c1.level) + "\\sqrt{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(3))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
  
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e9);
    theory.createBuyAllUpgrade(1, currency, 1e15);
       //c1
      {
        c1 = theory.createPermanentUpgrade(2, currency1, new ExponentialCost(1e4, Math.log2(10)));
        c1.getDescription = (amount) => "$\\uparrow$ $a_1$ factor by 1";
        c1.getInfo = (amount) => "$\\uparrow$ $a_1$ factor by 1";
    }
    theory.createAutoBuyerUpgrade(3, currency, 1e35);
  
    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(2, 2));
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getA1(a1.level).pow(1.025)
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = a_1^{1.025}a_2";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho^{0.2}";
var getPublicationMultiplier = (tau) => tau.pow(0.404) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.404}}{3}";
var getTau = () => currency.value.pow(0.2);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => BigNumber.from(level).sqrt() * getA1Factor(c1.level);
var getA1Factor = (level) => BigNumber.from(1 + level);

init();