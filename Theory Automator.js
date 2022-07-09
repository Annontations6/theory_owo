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
  timer = theory.createCurrency("s", "s");
  
  timer.value = BigNumber.ZERO
  
  // a1
    {
        let getDesc = (level) => "a_1=" + getA1Factor(c1.level) + "\\sqrt{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(3))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
  // a2
    {
        let getDesc = (level) => "a_2=" + getA2Factor(c2.level) + "\\sqrt{" + level + "}";
        let getInfo = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(1000, Math.log2(5))));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount));
    }
  
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e9);
    theory.createBuyAllUpgrade(1, currency, 1e15);
       //c1
      {
        c1 = theory.createPermanentUpgrade(2, currency, new ExponentialCost(1e4, Math.log2(10)));
        c1.getDescription = (amount) => "$\\uparrow$ $a_1$ factor by 1";
        c1.getInfo = (amount) => "$\\uparrow$ $a_1$ factor by 1";
    }
    //c2
      {
        c2 = theory.createPermanentUpgrade(3, currency, new ExponentialCost(1e7, Math.log2(10)));
        c2.getDescription = (amount) => "$\\uparrow$ $a_2$ factor by 1";
        c2.getInfo = (amount) => "$\\uparrow$ $a_2$ factor by 1";
    }
    theory.createAutoBuyerUpgrade(4, currency, 1e35);
  
    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(2, 2));
  
    /////////////////
    //// Achievements
    let achievement_category_1 = theory.createAchievementCategory(0, "Timer");
    achievement1 = theory.createAchievement(0, achievement_category_1, "You Played!", "I Think now.", () => timer.value > 1);
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    timer.value += BigNumber.from(0.1)
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