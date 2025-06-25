let footer = document.querySelector("footer");
let calculatorTileDiv = document.querySelector(".calculator__tile--div");
let shiftStartInput = document.querySelector(".start-time");
let shiftEndInput = document.querySelector(".end-time");
let hourlyRateInput = document.querySelector(".hourly--rate");
let includeTaxDiv = document.querySelector(".include--tax--div");

let buttonsDiv = document.querySelector(".buttons");
let resetBtn = document.querySelector(".reset-btn");
let calculateBtn = document.querySelector(".calculate-btn");
let toggleBcFerriesText = document.querySelector(".toggle-bc-ferries");
let switchTextDiv = document.querySelector(".switch-text-div");
let toggleGenericCalcText = document.querySelector(".toggle-generic-calc");
let toggleGenericCalcDiv = document.querySelector(".toggle-generic-calc--div");
let shiftTypeInput = document.querySelector(".shift-type-input");
let taxPercentageInput = document.querySelector(".tax--percentage");

const wholeBody = document.querySelector("body");
const shiftTypeHTML = `<select class="shift-type-input" >
      <option value="" disabled selected>Select Shift Type</option>
      <option value="FPTA">Foot Passenger(FPTA) 🚶🏻‍♂️🚶🏻‍♀️</option>
      <option value="VB" >Vehicle Booth(VB) 🚙 🚚</option>
    </select>`;
const toggleGenericTextHTML = `<p class="toggle-generic-calc">Switch To Generic Pay Calculator</p>`;
const bcFerriesTextHTML = `<p class="toggle-bc-ferries">Switch To BC Ferries Pay Calculator</p>`;
const regularPayRateFPTA = 27.49; // Regular pay rate for FPTA.
const regularPayRateVB = 28.39; // Regular pay rate for FPTA.
let toggleHourlyRateText = document.querySelector(".toggle-hourly-rate");
let payRateInfoText = document.querySelector(".pay-rate-info-text");
let calcBreakdownText = document.querySelector(".breakdown-calculation");
let resultDiv;
let netPayText;
let calculationResultHTML;
let applicationHeading = document.querySelector(".application-heading");

// const genericCalcHTML = `
//             <div class="calculator__tile--div">
//             <h1 style="font-weight: 900;">   Pay Calculator </h1>

//             <input id="start-time" class="start-time"type="time"></input>

//             <input id="end-time" class="end-time"type="time"></input>

//             <input id="hourly--rate" class="hourly--rate"type="number" placeholder="Hourly Rate ($)"></input>
//             <div class="include--tax--div">
//             <p class="include--tax">Include Tax Rate</p>
//             </div>
//             <div class="buttons">
//             <button class="reset-btn">
//                 Reset
//             </button>
//             <button class="calculate-btn">
//                Calculate
//             </button>
//         </div>
//         <div class="switch-text-div">
//         <p class="toggle-bc-ferries">Switch To BC Ferries Pay Calculator</p>
//         </div>
//         </div>
//      <footer>Made by 💛amshi </footer>`;

buttonsDiv.addEventListener("click", function (e) {
  // when calculate button is clicked.
  if (e.target === calculateBtn) {
    calculateBtnIsClicked();
  }
  // when reset button is clicked.
  else if (e.target === resetBtn) {
    resetBtnIsClicked();
  }
});

let totalShiftDurationInDecimals;
let minutesWorkedToDisplay;
let grossPay;
let includeTaxRateClicked = false;
let negativeHourlyRateInputted = false;
let negativeTaxRateInputted = false;
let lessThanOneTaxRateInputted = false;
let lessThanOneHourlyRateInputted = false;

// WHEN CALCULATE BUTTON IS CLICKED
function calculateBtnIsClicked() {
  shiftTypeInput = document.querySelector(".shift-type-input");
  negativeHourlyRateInputted = false;
  negativeTaxRateInputted = false;
  lessThanOneTaxRateInputted = false;
  lessThanOneHourlyRateInputted = false;

  if (resultDiv) {
    resultDiv.remove(); // if result div already exists remove it. This prevents accumulation of multiple result divs.
    console.log(`RESULT DIV REMOVED FROM CALCULATE FUNC: ${resultDiv}`);
  }
  console.log(`resultDiv after removal condition: ${resultDiv}`);

  if (!shiftStartInput.value || !shiftEndInput.value) {
    console.log("This executes when there is no input.");
    return;
  }

  // --> 1. convert the inputted times to decimals or normal numbers.

  const startHour = parseInt(shiftStartInput.value);
  const startMinutes = Number(String(shiftStartInput.value).slice(3));
  const endHour = parseInt(shiftEndInput.value);
  const endMinutes = Number(String(shiftEndInput.value).slice(3));
  const startMinutesInDecimals = startMinutes / 60;
  const endMinutesInDecimals = endMinutes / 60;
  const shiftStartTimeInDecimals = startHour + startMinutesInDecimals;
  const shiftEndTimeInDecimals = endHour + endMinutesInDecimals;

  console.log(`shiftStartTimeInDecimals is ${shiftStartTimeInDecimals}`);
  console.log(`shiftEndTimeInDecimals is ${shiftEndTimeInDecimals}`);
  console.log(`Start hour: ${startHour}, End hour: ${endHour}`);
  console.log(`Start minutes: ${startMinutes}, End minutes: ${endMinutes}`);

  // if the shift end time exceeds midnight ( past 12AM )
  totalShiftDurationInDecimals =
    endHour < startHour
      ? 24 + shiftEndTimeInDecimals - shiftStartTimeInDecimals
      : shiftEndTimeInDecimals - shiftStartTimeInDecimals;

  // if the shift duration is exactly 24 Hours.
  totalShiftDurationInDecimals === 0
    ? (totalShiftDurationInDecimals = 24)
    : (totalShiftDurationInDecimals = totalShiftDurationInDecimals);

  // Displaying minutes in human understandable format instead of decimals.
  minutesWorkedToDisplay =
    totalShiftDurationInDecimals < 10 //check if hours are singular ('3') or dual ('11')
      ? Math.round(
          totalShiftDurationInDecimals.toFixed(2).slice(1).padStart(4, "0") * 60
        )
      : Math.round(
          totalShiftDurationInDecimals.toFixed(2).slice(3).padStart(4, "0.") *
            60
        );
  console.log(
    Math.round(
      totalShiftDurationInDecimals.toFixed(2).slice(1).padStart(4, "0") * 60
    )
  );
  console.log(totalShiftDurationInDecimals);

  hourlyRateInput = document.querySelector(".hourly--rate");

  // CALCULATE PAY FOR BC FERRIES
  if (shiftTypeInput) {
    // only execute this if shift type html element is present
    if (shiftTypeInput.value === "FPTA") {
      // If the shift is 'FPTA'
      const shiftType = "Foot Passenger Ticket Agent 🚶🏻‍♂️ 🚶🏻‍♀️";
      hourlyRateInput = document.querySelector(".hourly--rate");
      if (hourlyRateInput) {
        // if custom hourly rate is provided.
        bcFerriesPayCalculation(
          shiftStartTimeInDecimals,
          shiftEndTimeInDecimals,
          totalShiftDurationInDecimals,
          hourlyRateInput.value,
          shiftType
        );
        return;
      }
      bcFerriesPayCalculation(
        shiftStartTimeInDecimals,
        shiftEndTimeInDecimals,
        totalShiftDurationInDecimals,
        regularPayRateFPTA,
        shiftType
      );
      return;
    }
    // If the shift is 'VB'
    if (shiftTypeInput.value === "VB") {
      const shiftType = "Vehicle Booth 🚙 🚚";
      hourlyRateInput = document.querySelector(".hourly--rate");
      if (hourlyRateInput) {
        // if custom hourly rate is provided.
        bcFerriesPayCalculation(
          shiftStartTimeInDecimals,
          shiftEndTimeInDecimals,
          totalShiftDurationInDecimals,
          hourlyRateInput.value,
          shiftType
        );
        return;
      }
      bcFerriesPayCalculation(
        shiftStartTimeInDecimals,
        shiftEndTimeInDecimals,
        totalShiftDurationInDecimals,
        regularPayRateVB,
        shiftType
      );
      return;
    }
  }
  // Displaying time in proper format. Little complex code here - Checks if hours worked is '1' then display only 'hr' instead of 'hrs'.
  const buildDisplayStringForHoursMinutes = `Total Shift Duration is: ${
    String(totalShiftDurationInDecimals).slice(0, 2).includes(".")
      ? String(totalShiftDurationInDecimals).slice(0, 1) == 1
        ? String(totalShiftDurationInDecimals).slice(0, 1) + "hr"
        : String(totalShiftDurationInDecimals).slice(0, 1) + "hrs"
      : String(totalShiftDurationInDecimals).slice(0, 2) == 1
      ? String(totalShiftDurationInDecimals).slice(0, 1) + "hr"
      : String(totalShiftDurationInDecimals).slice(0, 2) + "hrs"
  }, ${String(minutesWorkedToDisplay).padStart(2, 0)}mins.`;

  console.log(buildDisplayStringForHoursMinutes);

  // --> 2. calculate the pay

  if (hourlyRateInput) {
    grossPay = Math.fround(
      hourlyRateInput.value * totalShiftDurationInDecimals
    ).toFixed(2);
  }

  // if tax rate value is supplied - calculate and display net pay.
  if (taxPercentageInput && taxPercentageInput.value && includeTaxRateClicked) {
    if (resultDiv) resultDiv.remove(); // if resultDiv exists remove it.
    console.log(`THIS NET PAY BLOCK EXECUTED`);

    if (hourlyRateInput.value < 0) {
      console.log(
        "A negative hourly rate is inputted." + " " + hourlyRateInput
      );
      negativeHourlyRateInputted = true;
    }
    if (taxPercentageInput.value < 0) {
      console.log("A negative Tax rate is inputted.");
      negativeTaxRateInputted = true;
    }
    if (taxPercentageInput.value < 1 && taxPercentageInput.value > 0) {
      console.log("A Tax rate less than 1 is inputted.");
      lessThanOneTaxRateInputted = true;
    }
    if (hourlyRateInput.value < 1 && hourlyRateInput.value > 0) {
      console.log(`A hourly rate less than 1 is inputted. ${hourlyRateInput}`);
      lessThanOneHourlyRateInputted = true;
    }
    // call display net pay
    calculationResultHTML = displayNetPay(
      totalShiftDurationInDecimals,
      minutesWorkedToDisplay,
      grossPay,
      negativeHourlyRateInputted,
      lessThanOneHourlyRateInputted,
      negativeTaxRateInputted,
      lessThanOneTaxRateInputted
    );
  }
  // if tax rate value is not supplied - calculate and display gross pay.
  else if (!includeTaxRateClicked || taxPercentageInput.value === "") {
    if (hourlyRateInput) {
      if (hourlyRateInput.value < 0) {
        console.log(
          "A negative hourly rate is inputted." + " " + hourlyRateInput.value
        );
        negativeHourlyRateInputted = true;
      }
      if (hourlyRateInput.value < 1 && hourlyRateInput.value > 0) {
        console.log(
          `A hourly rate less than 1 is inputted. ${hourlyRateInput.value}`
        );
        lessThanOneHourlyRateInputted = true;
      }
    }
    // call display gross pay
    if (resultDiv) resultDiv.remove();

    console.log("gross pay display has executed");
    console.log(`THIS GROSS PAY BLOCK EXECUTED`);

    calculationResultHTML = displayGrossPay(
      totalShiftDurationInDecimals,
      minutesWorkedToDisplay,
      grossPay,
      negativeHourlyRateInputted,
      lessThanOneHourlyRateInputted
    );
  }
  if (taxPercentageInput) console.log(taxPercentageInput.value);
  // resultDiv = document.querySelector(".result-div");

  // insert the result div
  console.log(calculationResultHTML);
  // console.log(resultDiv);

  footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
  resultDiv = document.querySelector(".result-div");
  console.log(resultDiv);
}

let includeTaxText; // define global variable.
let excludeTaxText = document.querySelector(".exclude--tax");

// WHEN RESET BUTTON IS CLICKED
function resetBtnIsClicked() {
  console.log("reset button is clicked.");
  shiftStartInput.value = "";
  shiftEndInput.value = "";
  shiftTypeInput = document.querySelector(".shift-type-input");
  hourlyRateInput = document.querySelector(".hourly--rate");
  if (shiftTypeInput) {
    if (hourlyRateInput) hourlyRateInput.remove();
    let payInfoText = document.querySelector(".pay-rate-info-text");
    let toggleHourlyRateText = document.querySelector(".toggle-hourly-rate");
    if (payInfoText) {
      payInfoText.remove();
      toggleHourlyRateText.remove();
    }
    shiftTypeInput.insertAdjacentHTML(
      "afterend",
      `<p class="pay-rate-info-text">ℹ️ The default Seasonal Ticket Agent pay rate is FPTA: $27.49,  VB: $28.39.</p> <p class="toggle-hourly-rate">Enter Custom Hourly Pay Rate</p>`
    );
    shiftTypeInput.value = "";
  }

  if (hourlyRateInput) hourlyRateInput.value = "";
  excludeTaxText = document.querySelector(".exclude--tax");
  if (resultDiv) resultDiv.remove(); // if result-div exists, remove it.
  if (excludeTaxText) {
    console.log(`excludeTaxText is: ${excludeTaxText}`);
    // excludeTaxText.remove();
    includeTaxDiv.innerHTML = `<p class="include--tax">Include Tax Rate</p>`;
  }
  if (taxPercentageInput) taxPercentageInput.remove();
  console.log(`excludeTaxText is: ${excludeTaxText}`);

  includeTaxRateClicked = false; // make the exclude tax rate as default.
}

// WHEN INCLUDE / EXCLUDE TAX RATE IS CLICKED
includeTaxDiv.addEventListener("click", function (e) {
  includeTaxText = document.querySelector(".include--tax");

  // when include-tax-rate is clicked.
  if (e.target === includeTaxText) {
    includeTaxRateClicked = true;
    hourlyRateInput = document.querySelector(".hourly--rate");
    if (hourlyRateInput) {
      // when hourly rate is active on the DOM -> when generic calc is active.
      hourlyRateInput.insertAdjacentHTML(
        "afterend",
        `<input class="tax--percentage" type="number" placeholder="Tax Percentage (%)"></input>`
      );
    } else {
      // when hourly rate is removed on the DOM and 'include tax rate' is clicked -> when bc ferries calc is active.
      shiftTypeInput = document.querySelector(".shift-type-input");
      toggleHourlyRateText = document.querySelector(".toggle-hourly-rate");
      toggleHourlyRateText.insertAdjacentHTML(
        "afterend",
        `<input class="tax--percentage" type="number" placeholder="Tax Percentage (%)"></input>`
      );
    }
    includeTaxDiv.innerHTML = `<p class="exclude--tax"> Remove Tax Rate</p>`;
    taxPercentageInput = document.querySelector(".tax--percentage");
    // if (resultDiv) resultDiv.remove();
    if (!shiftStartInput.value || !shiftEndInput.value) {
      console.log("This executes when there is no input.");
      return;
    }
    shiftTypeInput = document.querySelector(".shift-type-input");
    if (!taxPercentageInput.value) return;
    shiftTypeInput = document.querySelector(".shift-type-input");
    calculationResultHTML = displayNetPay(
      totalShiftDurationInDecimals,
      minutesWorkedToDisplay,
      `${shiftTypeInput ? totalPay : grossPay}`
    );
    if (!resultDiv)
      footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
    resultDiv = document.querySelector(".result-div");
    console.log(includeTaxText);
    console.log(calculationResultHTML);
    console.log(
      `resultDiv AT THE END OF 'INLCUDE' TEXT CLICK FUNC: ${resultDiv}`
    );
  }

  excludeTaxText = document.querySelector(".exclude--tax");

  // when exclude-tax-rate is clicked.
  if (e.target === excludeTaxText) {
    includeTaxRateClicked = false;

    includeTaxDiv.innerHTML = ` <p class="include--tax">Include Tax Rate</p>`;
    taxPercentageInput.remove();
    resultDiv = document.querySelector(".result-div");

    // instead of removing the whole 'resultDiv' remove just the net pay text when exclude tax is clicked.
    netPayText = document.querySelector(".net-pay-text");
    if (netPayText) netPayText.remove();
    if (!shiftStartInput.value || !shiftEndInput.value) {
      console.log("This executes when there is no input.");
      return;
    }
    calculationResultHTML = displayGrossPay(
      totalShiftDurationInDecimals,
      minutesWorkedToDisplay,
      grossPay
    );
    if (!resultDiv) {
      footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
      console.log(`The resultDiv IS COMING FROM EXCLUDE TEXT CLICK FUNC`);
    }
    resultDiv = document.querySelector(".result-div");
    console.log(calculationResultHTML);
    console.log(
      `resultDiv AT THE END OF 'EXCLUDE' TEXT CLICK FUNC: ${resultDiv}`
    );
  }
  console.log(
    `resultDiv AT THE END OF 'PARENT FUNC OF INLCUDE/EXCLUDE' TEXT CLICK FUNC: ${resultDiv}`
  );
});

// DISPLAY GROSS PAY
function displayGrossPay(
  totalShiftDurationInDecimals,
  minutesWorkedToDisplay,
  grossPay,
  negativeHourlyRateInputted,
  lessThanOneHourlyRateInputted,
  shiftType
) {
  // if (resultDiv) resultDiv.remove(); // if result-div exists, remove it.
  console.log(
    `Gross pay display executed and resultDiv at starting is: ${resultDiv}`
  );
  return `<div class="result-div">
    <p>⏳ Hours Worked: <span class="result-text"> ${
      String(totalShiftDurationInDecimals).slice(0, 2).includes(".")
        ? String(totalShiftDurationInDecimals).slice(0, 1) == 1
          ? String(totalShiftDurationInDecimals).slice(0, 1) + "hr"
          : String(totalShiftDurationInDecimals).slice(0, 1) + "hrs"
        : String(totalShiftDurationInDecimals).slice(0, 2) == 1
        ? String(totalShiftDurationInDecimals).slice(0, 1) + "hr"
        : String(totalShiftDurationInDecimals).slice(0, 2) + "hrs"
    }, ${String(minutesWorkedToDisplay).padStart(2, 0)}mins.</span></p>
    <p>💰 Gross Pay: <span class="result-text">$${grossPay}</span></p>
    ${
      lessThanOneHourlyRateInputted
        ? "<p>( You entered a hourly rate that is less than one )</p>"
        : ""
    } 
  ${
    negativeHourlyRateInputted
      ? "<p>( You entered a negative hourly rate )</p>"
      : ""
  }
  ${
    shiftType
      ? "<p class='breakdown-calculation'>Breakdown Calculation</p>"
      : ""
  }
  </div>`;
}

// DISPLAY NET PAY
function displayNetPay(
  totalShiftDurationInDecimals,
  minutesWorkedToDisplay,
  grossPay,
  negativeHourlyRateInputted,
  lessThanOneHourlyRateInputted,
  negativeTaxRateInputted,
  lessThanOneTaxRateInputted,
  shiftType
) {
  // if (resultDiv) resultDiv.remove(); // if result-div exists, remove it.

  const netPay = Math.fround(
    hourlyRateInput.value * totalShiftDurationInDecimals -
      (hourlyRateInput.value *
        totalShiftDurationInDecimals *
        taxPercentageInput.value) /
        100
  ).toFixed(2);
  console.log(`Your net pay is ${netPay}`);
  console.log(
    `Net pay display executed and resultDiv at starting is: ${resultDiv}`
  );
  return `<div class="result-div">
  <p>⏳ Hours Worked: <span class="result-text"> ${
    String(totalShiftDurationInDecimals).slice(0, 2).includes(".")
      ? String(totalShiftDurationInDecimals).slice(0, 1) == 1
        ? String(totalShiftDurationInDecimals).slice(0, 1) + "hr"
        : String(totalShiftDurationInDecimals).slice(0, 1) + "hrs"
      : String(totalShiftDurationInDecimals).slice(0, 2) == 1
      ? String(totalShiftDurationInDecimals).slice(0, 1) + "hr"
      : String(totalShiftDurationInDecimals).slice(0, 2) + "hrs"
  }, ${String(minutesWorkedToDisplay).padStart(2, 0)}mins.</span></p>
  <p>💰 Gross Pay: <span class="result-text">$${grossPay}</span></p>
   ${
     lessThanOneHourlyRateInputted
       ? "<p>( You entered a hourly rate that is less than one )</p>"
       : ""
   } 
  ${
    negativeHourlyRateInputted
      ? "<p>( You entered a negative hourly rate )</p>"
      : ""
  }
  <p class="net-pay-text">💵 Net Pay: <span class="result-text">$${netPay}</span></p>
   ${
     lessThanOneTaxRateInputted
       ? "<p>( You entered a tax rate that is less than one )</p>"
       : ""
   } 
  ${negativeTaxRateInputted ? "<p>( You entered a negative tax rate )</p>" : ""}
   ${
     shiftType
       ? "<p class='breakdown-calculation'>Breakdown Calculation</p>"
       : ""
   }
</div>`;
}

const toggleHourlyRateHTML = `<p class="pay-rate-info-text">ℹ️ The default Seasonal Ticket Agent pay rate is FPTA: $${
  regularPayRateFPTA + ", "
} VB: $${regularPayRateVB}.</p>

<p class="toggle-hourly-rate">Enter Custom Hourly Pay Rate</p>
  `;

// WHEN USER CLICKS TO SWITCH CALCULATOR
wholeBody.addEventListener("click", function (e) {
  console.log(e.target);
  toggleGenericCalcText = document.querySelector(".toggle-generic-calc");
  toggleBcFerriesText = document.querySelector(".toggle-bc-ferries");
  toggleHourlyRateText = document.querySelector(".toggle-hourly-rate");

  // WHEN SWITCH TO 'GENERIC CALC' IS CLICKED - 'BC Ferries calc text' should become visible.
  if (e.target === toggleGenericCalcText) {
    applicationHeading = document.querySelector(".application-heading");
    applicationHeading.textContent = `Pay Calculator`;
    shiftTypeInput = document.querySelector(".shift-type-input");
    console.log("GENERIC ENTERED");
    toggleGenericCalcText = document.querySelector(".toggle-generic-calc");
    shiftTypeInput.remove();
    toggleGenericCalcText.remove();
    switchTextDiv.insertAdjacentHTML("afterbegin", bcFerriesTextHTML);
    payRateInfoText = document.querySelector(".pay-rate-info-text");
    if (payRateInfoText) payRateInfoText.remove();
    toggleHourlyRateText = document.querySelector(".toggle-hourly-rate");
    if (toggleHourlyRateText) toggleHourlyRateText.remove();
    hourlyRateInput = document.querySelector(".hourly--rate");
    if (!hourlyRateInput)
      shiftEndInput.insertAdjacentHTML(
        "afterend",
        ` <input id="hourly--rate" class="hourly--rate"type="number" placeholder="Hourly Rate ($)"></input>`
      );
    hourlyRateInput = document.querySelector(".hourly--rate");
    resultDiv = document.querySelector(".result-div");
    if (resultDiv) resultDiv.remove();
    wholeBody.style.background = `linear-gradient(to right, rgb(15, 111, 238), rgb(133, 157, 231))`;
  }
  // WHEN SWITCH TO 'BC FERRIES' IS CLICKED - 'generic calc text' should become visible.
  if (e.target === toggleBcFerriesText) {
    applicationHeading = document.querySelector(".application-heading");
    applicationHeading.textContent = `Ticket Agent Pay Calculator`;
    toggleBcFerriesText.remove();
    hourlyRateInput = document.querySelector(".hourly--rate");
    if (hourlyRateInput)
      hourlyRateInput.insertAdjacentHTML("beforebegin", shiftTypeHTML);
    shiftTypeInput = document.querySelector(".shift-type-input");
    shiftTypeInput.insertAdjacentHTML("afterend", toggleHourlyRateHTML);
    switchTextDiv.insertAdjacentHTML("afterbegin", toggleGenericTextHTML);
    hourlyRateInput.remove();
    wholeBody.style.background = `linear-gradient( to right, rgb(60, 148, 255),  rgb(120, 154, 250))`;
    // wholeBody.style.background = `linear-gradient(to left,rgb(123, 0, 255)  rgb(15, 111, 238), rgb(133, 157, 231))`;
    resultDiv = document.querySelector(".result-div");
    if (resultDiv) resultDiv.remove();
  }

  if (e.target === toggleHourlyRateText) {
    shiftTypeInput = document.querySelector(".shift-type-input");
    payRateInfoText = document.querySelector(".pay-rate-info-text");
    hourlyRateInput = document.querySelector(".hourly--rate");
    if (!hourlyRateInput)
      shiftTypeInput.insertAdjacentHTML(
        "afterend",
        `<input id="hourly--rate" class="hourly--rate"type="number" placeholder="Hourly Rate ($)"></input>`
      );
    toggleHourlyRateText.remove();
    payRateInfoText.remove();
  }
  calcBreakdownText = document.querySelector(".breakdown-calculation");

  if (e.target === calcBreakdownText) {
  }
});
console.log(buttonsDiv);

// IMPLEMENT CALCULATION FOR BC FERRIES
function bcFerriesPayCalculation(
  shiftStartTimeInDecimals,
  shiftEndTimeInDecimals,
  totalShiftDurationInDecimals,
  regularPayRate,
  shiftType
) {
  let totalPay;
  let buildDisplayStringForHoursMinutes;
  const extraPayRate = regularPayRate * 0.15;
  const timeBefore_8_InDecimals =
    8 - shiftStartTimeInDecimals < 0
      ? 0
      : Math.abs(8 - shiftStartTimeInDecimals);

  const timeAfter_5_InDecimals =
    17 - shiftEndTimeInDecimals < 0 ? Math.abs(shiftEndTimeInDecimals - 17) : 0;
  const timeAfter_8_but_Before_5_InDecimals =
    totalShiftDurationInDecimals -
    (timeBefore_8_InDecimals + timeAfter_5_InDecimals);
  const timeEligibleForExtraPayInDecimals =
    timeBefore_8_InDecimals + timeAfter_5_InDecimals;
  const extraPay =
    extraPayRate + regularPayRate * timeEligibleForExtraPayInDecimals;
  const regularPay = timeAfter_8_but_Before_5_InDecimals * regularPayRate;
  const timeEligibleForOvertimeInDecimals =
    Number(totalShiftDurationInDecimals.toFixed(2)) > 7.5
      ? totalShiftDurationInDecimals - 7.5
      : 0;
  const overtimePay =
    timeEligibleForOvertimeInDecimals * (regularPayRate * 1.5);
  totalPay = (extraPay + regularPay + overtimePay).toFixed(2);
  console.log(
    `TIME ELIGIBLE FOR EXTRA PAY:${timeEligibleForExtraPayInDecimals}`
  );
  console.log(
    `REGULAR PAY RATE IS: ${regularPayRate} EXTRA PAY RATE: ${extraPayRate} OVERTIME PAY:${overtimePay}`
  );

  console.log(
    `TIME BEFORE 8: ${timeBefore_8_InDecimals} \nTIME AFTER 5: ${timeAfter_5_InDecimals} \nTIME B/W 8-5: ${timeAfter_8_but_Before_5_InDecimals} \nTOTAL SHIFT DURATION:${totalShiftDurationInDecimals} \nOVERTIME DURATION: ${timeEligibleForOvertimeInDecimals} \nOVERTIME PAY IS: ${overtimePay}`
  );
  console.log(
    `RREGULAR PAY IS:${regularPay} \nEXTRA PAY IS:${extraPay}\n TOTAL: ${totalPay}`
  );
  // calculationResultHTML = displayGrossPay(
  //   totalShiftDurationInDecimals,
  //   minutesWorkedToDisplay,
  //   totalPay,
  //   negativeHourlyRateInputted,
  //   lessThanOneHourlyRateInputted,
  //   shiftType
  // );

  hourlyRateInput = document.querySelector(".hourly--rate");
  // if tax rate value is supplied - calculate and display net pay.
  if (taxPercentageInput && taxPercentageInput.value && includeTaxRateClicked) {
    if (resultDiv) resultDiv.remove(); // if resultDiv exists remove it.
    console.log(`THIS NET PAY BLOCK EXECUTED`);

    if (hourlyRateInput) {
      if (hourlyRateInput.value < 0) {
        console.log(
          "A negative hourly rate is inputted." + " " + hourlyRateInput
        );
        negativeHourlyRateInputted = true;
      }
      if (taxPercentageInput.value < 0) {
        console.log("A negative Tax rate is inputted.");
        negativeTaxRateInputted = true;
      }
      if (taxPercentageInput.value < 1 && taxPercentageInput.value > 0) {
        console.log("A Tax rate less than 1 is inputted.");
        lessThanOneTaxRateInputted = true;
      }
      if (hourlyRateInput.value < 1 && hourlyRateInput.value > 0) {
        console.log(
          `A hourly rate less than 1 is inputted. ${hourlyRateInput}`
        );
        lessThanOneHourlyRateInputted = true;
      }
    }
    // call display net pay
    calculationResultHTML = displayNetPay(
      totalShiftDurationInDecimals,
      minutesWorkedToDisplay,
      totalPay,
      negativeHourlyRateInputted,
      lessThanOneHourlyRateInputted,
      negativeTaxRateInputted,
      lessThanOneTaxRateInputted,
      shiftType
    );
  }
  // if tax rate value is not supplied - calculate and display gross pay.
  else if (!includeTaxRateClicked || taxPercentageInput.value === "") {
    if (hourlyRateInput) {
      if (hourlyRateInput.value < 0) {
        console.log(
          "A negative hourly rate is inputted." + " " + hourlyRateInput.value
        );
        negativeHourlyRateInputted = true;
      }
      if (hourlyRateInput.value < 1 && hourlyRateInput.value > 0) {
        console.log(
          `A hourly rate less than 1 is inputted. ${hourlyRateInput.value}`
        );
        lessThanOneHourlyRateInputted = true;
      }
    }

    if (resultDiv) resultDiv.remove();

    console.log("gross pay display has executed");
    console.log(`THIS GROSS PAY BLOCK EXECUTED`);

    // call display gross pay
    calculationResultHTML = displayGrossPay(
      totalShiftDurationInDecimals,
      minutesWorkedToDisplay,
      totalPay,
      negativeHourlyRateInputted,
      lessThanOneHourlyRateInputted,
      shiftType
    );
  }

  resultDiv = document.querySelector(".result-div");
  footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
  resultDiv = document.querySelector(".result-div");
  console.log(`CALCULATION RESULT HTML: ${calculationResultHTML}`);
  const extraPayMinutesReadable = parseInt(
    (timeAfter_5_InDecimals + timeBefore_8_InDecimals)
      .toFixed(2)
      .slice(1)
      .padStart(4, 0) * 60
  );
  const extraPayHoursReadable = Number(
    String(timeAfter_5_InDecimals + timeBefore_8_InDecimals).slice(0, 1)
  );
  calcBreakdownText = document.querySelector(".breakdown-calculation");
  calcBreakdownText.addEventListener("click", function (e) {
    const calcBreakdownHTML = `${
      timeEligibleForExtraPayInDecimals > 0
        ? "<p class='breakdown-text'>⏰ Hours you worked at an extra pay rate of +15% is: <span class='result-text'>" +
          extraPayHoursReadable +
          "hr " +
          extraPayMinutesReadable +
          "mins.</span></p>"
        : "<p class='breakdown-text'>All hours " +
          totalShiftDurationInDecimals +
          "hrs are calculated at your regular pay rate.</p>"
    }  
    ${
      timeEligibleForOvertimeInDecimals > 0
        ? "<p class='breakdown-text'>✨ Overtime Duration: <span class='result-text'>" +
          timeEligibleForOvertimeInDecimals.toFixed(2) +
          " hrs. </span></p>"
        : "<p class='breakdown-text'>🫣 No overtime pay today.</p>"
    }
    `;

    calcBreakdownText.insertAdjacentHTML("beforebegin", calcBreakdownHTML);
    calcBreakdownText.remove();
  });

  return;
}

/* <p>
  Your shift today is: <span style="font-weight:600;"> ${shiftType} </span>
</p > */

/*
// --> BUGS IN THE CODE 

// --> BUG - 1  ✅ Solved 
WHEN USER CLICKS ON CALCULATE WITHOUT INCLUDING AND WITH INCLUDING THE TAX RATE, AT FIRST IT WORKS. IT WORKS FOR EXCLUDING THE TAX RATE AS WELL.

AT THIS POINT, WHEN THE USER TOGGLED FROM THE EXCLUDE TAX RATE - INLCUDE TAX RATE BECOMES VISIBLE AND IF THE USER CLICKS ON CALCULATE OR CLICKS THE INCLUDE TAX RATE, NOW -> TWO NEW DIVS WITH GROSS PAY APPEARS UPON CLICKING TWICE/MANY TIMES.

// --> BUG -2 ✅ Solved
WHEN USER CLICKS ON 'INLCUDE TAX RATE' AND WITHOUT PROVIDING 'TAX PERCENTAGE INPUT' IMMEDIATELY CLICKS ON CALCULATE, 'UNDEFINED' IS DISPLAYED, WHAT I BELEIVE IS THIS IS COMING FROM 'wholediv.insertadjacentHTML' BECAUSE 'resultDiv' is undefined/null.

AFTER THIS, IF 'TAX PERCENTAGE INPUT' IS PROVIDED AND CALCULATE IS CLICKED 'UNDEFINED' IS STILL DISPLAYED ALONG WITH THE CALCULATED RESULT WITH 'GROSS' AND 'NET' PAY. 'UNDEFINED' SHOULD NOT BE DISPLAYED HERE.
  console.log(calculationResultHTML); --> undefined
  console.log(resultDiv); --> null
*/

// OLD IMPLEMENTATION --> VERY LONG IMPLEMENTATION
// // IMPLEMENT CALCULATION FOR BC FERRIES
// function payCalculation() {
//   // startHour,
//   // startMinutes,
//   // endHour,
//   // endMinutes,
//   // endMinutesInDecimals
//   let totalPayFPTA;
//   let buildDisplayStringForHoursMinutes;
//   const extraPayRateFPTA =
//     regularPayRateFPTA + (regularPayRateFPTA * 15) / 100;
// // WHEN THE SHIFT IS NEITHER BEFORE 8AM NOR AFTER 5PM -> regular pay rate -> 8:00AM - 5:00PM.
// // 'shiftEndTimeInDecimals' here makes the shift end time exactly below or equal to 5
// if (startHour >= 8 && shiftEndTimeInDecimals <= 17) {
//   const totalPayFPTA = (
//     totalShiftDurationInDecimals * regularPayRateFPTA
//   ).toFixed(2);
//   console.log(`Total regular FPTA  pay is: $${totalPayFPTA}`);
//   calculationResultHTML = displayGrossPay(
//     totalShiftDurationInDecimals,
//     minutesWorkedToDisplay,
//     totalPayFPTA,
//     negativeHourlyRateInputted,
//     lessThanOneHourlyRateInputted
//   );
//   resultDiv = document.querySelector(".result-div");
//   footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//   resultDiv = document.querySelector(".result-div");
//   return;
// }

// // WHEN SHIFTS START BEFORE 8AM and ENDS BEFORE 5 -> calculate extra 15% pay -> 7:59AM - 4:59PM.
// if (startHour < 8 && endHour < 17) {
//   // this condition also takes care of endHour < 8.
//   // get how many hours and minutes are pre-8.
//   // startTime - 7:05 - 10:05
//   const hoursBefore_8 =
//     startMinutes > 0 ? 8 - startHour - 1 : 8 - startHour;
//   const minutesBefore_8 = 60 - startMinutes;

//   const timeBefore_8_InDecimals = hoursBefore_8 + minutesBefore_8 / 60;
//   const payForTimeBefore_8 = timeBefore_8_InDecimals * extraPayRateFPTA;
//   // only calculate the regular pay rate for hours, if the end time is after 8.
//   if (endHour > 8) {
//     // if inputted end time is after '8:00AM'
//     const hoursAfter_8 = endHour - 8;
//     const minutesAfter_8 = endMinutes;
//     const totalHoursWorked = hoursBefore_8 + hoursAfter_8;
//     const totalMinutesWorked = minutesBefore_8 + minutesAfter_8;
//     const totalMinutesWorkedInDecimals = totalMinutesWorked / 60;
//     const totalTimeWorkedInDecimals =
//       totalHoursWorked + totalMinutesWorkedInDecimals;

//     const timeAfter_8_InDecimals = hoursAfter_8 + minutesAfter_8 / 60;
//     const payForTimeAfter_8 = timeAfter_8_InDecimals * regularPayRateFPTA;
//     totalPayFPTA = (payForTimeBefore_8 + payForTimeAfter_8).toFixed(2);

//     console.log(
//       `YOUR FPTA PAY FOR BEFORE 8 IS:${payForTimeBefore_8} AFTER 8 IS:${payForTimeAfter_8}. \nYOUR TOTAL PAY IS: $${totalPayFPTA}.\n Total HOURS worked: ${totalHoursWorked} hrs, ${totalMinutesWorked} mins. \nMINUTES WORKED FOR DISPLAY: ${minutesWorkedToDisplay}`
//     );
//     buildDisplayStringForHoursMinutes = `Total Shift Duration is: ${
//       String(totalTimeWorkedInDecimals).slice(0, 2).includes(".")
//         ? String(totalTimeWorkedInDecimals).slice(0, 1) == 1
//           ? String(totalTimeWorkedInDecimals).slice(0, 1) + "hr"
//           : String(totalTimeWorkedInDecimals).slice(0, 1) + "hrs"
//         : String(totalTimeWorkedInDecimals).slice(0, 2) == 1
//         ? String(totalTimeWorkedInDecimals).slice(0, 1) + "hr"
//         : String(totalTimeWorkedInDecimals).slice(0, 2) + "hrs"
//     }, ${String(minutesWorkedToDisplay).padStart(2, 0)}mins.`;
//     console.log(buildDisplayStringForHoursMinutes);
//     calculationResultHTML = displayGrossPay(
//       totalShiftDurationInDecimals,
//       minutesWorkedToDisplay,
//       totalPayFPTA,
//       negativeHourlyRateInputted,
//       lessThanOneHourlyRateInputted
//     );
//     console.log(calculationResultHTML);
//     resultDiv = document.querySelector(".result-div");
//     console.log(footer);
//     console.log(resultDiv);

//     footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//     resultDiv = document.querySelector(".result-div");
//     console.log(resultDiv);
//     return;
//   } else if (endHour < 8) {
//     // if inputted end time is below '8:00AM' & start time is below '8:00AM'
//     const totalTimeWorkedInDecimals =
//       shiftEndTimeInDecimals - shiftStartTimeInDecimals;
//     totalPayFPTA = (totalTimeWorkedInDecimals * extraPayRateFPTA).toFixed(
//       2
//     );
//     console.log(
//       `YOU DIDN'T WORK AFTER 8 TODAY. YOUR TOTAL PAY IS: ${totalPayFPTA}. Total HOURS worked: ${hoursBefore_8}: ${minutesBefore_8} mins \nMINUTES WORKED FOR DISPLAY: ${minutesWorkedToDisplay}`
//     );

//     buildDisplayStringForHoursMinutes = `Total Shift Duration is: ${
//       String(totalTimeWorkedInDecimals).slice(0, 2).includes(".")
//         ? String(totalTimeWorkedInDecimals).slice(0, 1) == 1
//           ? String(totalTimeWorkedInDecimals).slice(0, 1) + "hr"
//           : String(totalTimeWorkedInDecimals).slice(0, 1) + "hrs"
//         : String(totalTimeWorkedInDecimals).slice(0, 2) == 1
//         ? String(totalTimeWorkedInDecimals).slice(0, 1) + "hr"
//         : String(totalTimeWorkedInDecimals).slice(0, 2) + "hrs"
//     }, ${String(minutesWorkedToDisplay).padStart(2, 0)}mins.`;
//     console.log(buildDisplayStringForHoursMinutes);
//     calculationResultHTML = displayGrossPay(
//       totalShiftDurationInDecimals,
//       minutesWorkedToDisplay,
//       totalPayFPTA,
//       negativeHourlyRateInputted,
//       lessThanOneHourlyRateInputted
//     );
//     resultDiv = document.querySelector(".result-div");
//     footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//     resultDiv = document.querySelector(".result-div");
//     return;
//   } else if (endHour == 8) {
//     // if inputted end time is b/w 8:00AM and 8:59AM -> eg. '8:15 AM', '8:55 AM'
//     const totalMinutesWorked = minutesBefore_8 + endMinutes;
//     const totalTimeWorkedInDecimals =
//       hoursBefore_8 + totalMinutesWorked / 60;
//     // since, in this case only the minutes are after 8am and the pay rate for the minutes is regular pay rate.
//     const payForMinutesAfter_8 = (endMinutes / 60) * regularPayRateFPTA;
//     totalPayFPTA = (payForTimeBefore_8 + payForMinutesAfter_8).toFixed(2);
//     // There are 2 considerations here: 1) when totalMinutesWorked > 60mins. 2) when totalMinutesWorked <= 60mins.
//     // Plan is to take out the decimal part out and multiply it by 60 to get minutes in regualar format.
//     // const timeWorkedForDisplay
//     const minutesWorkedToDisplay =
//       totalTimeWorkedInDecimals < 10 //check if hours are singular ('3') or dual ('11')
//         ? Math.round(
//             totalTimeWorkedInDecimals.toFixed(2).slice(1).padStart(4, "0") *
//               60
//           )
//         : Math.round(
//             totalTimeWorkedInDecimals
//               .toFixed(2)
//               .slice(3)
//               .padStart(4, "0.") * 60
//           );
//     console.log(
//       `TODAY YOU STARTED BEFORE 8 AND BUT ENDED BEFORE 9:00AM. YOUR PAY IS:${totalPayFPTA}.\n TOTAL HOURS WORKED: ${hoursBefore_8} hrs, ${totalMinutesWorked} mins. The decimal tottal time is:${totalTimeWorkedInDecimals} \nUPDATED MINUTES WORKED FOR DISPLAY: ${minutesWorkedToDisplay}`
//     );
//     buildDisplayStringForHoursMinutes = `Total Shift Duration is: ${
//       String(totalTimeWorkedInDecimals).slice(0, 2).includes(".")
//         ? String(totalTimeWorkedInDecimals).slice(0, 1) == 1
//           ? String(totalTimeWorkedInDecimals).slice(0, 1) + "hr"
//           : String(totalTimeWorkedInDecimals).slice(0, 1) + "hrs"
//         : String(totalTimeWorkedInDecimals).slice(0, 2) == 1
//         ? String(totalTimeWorkedInDecimals).slice(0, 1) + "hr"
//         : String(totalTimeWorkedInDecimals).slice(0, 2) + "hrs"
//     }, ${String(minutesWorkedToDisplay).padStart(2, 0)}mins.`;
//     console.log(buildDisplayStringForHoursMinutes);
//     calculationResultHTML = displayGrossPay(
//       totalShiftDurationInDecimals,
//       minutesWorkedToDisplay,
//       totalPayFPTA,
//       negativeHourlyRateInputted,
//       lessThanOneHourlyRateInputted
//     );
//     resultDiv = document.querySelector(".result-div");
//     footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//     resultDiv = document.querySelector(".result-div");
//     return;
//   }
// }
// // WHEN SHIFTS END AFTER 5PM or STARTS AT/AFTER 5PM, BUT DOESN'T START BEFORE 8AM. -> calculate extra 15% pay -> 9:00AM - 6:05PM || 5:00PM - 8:00PM.
// if ((endHour > 17 || startHour >= 17) && startHour > 8) {
//   // calculate hours worked after 5 and start-time should not be 5pm or after 5pm.
//   if (startHour !== 17) {
//     const hoursAfter_5 = endHour - 17;
//     const hoursBefore_5 =
//       startMinutes > 0 ? 17 - startHour - 1 : 17 - startHour;
//     const minutesAfter_5 = endMinutes;
//     const minutesBefore_5 = 60 - startMinutes;
//     const totalMinutesWorked = minutesBefore_5 + minutesAfter_5;
//     const totalMinutesWorkedInDecimals = totalMinutesWorked / 60;
//     const totalHoursWorked =
//       startMinutes > 0 ? endHour - startHour - 1 : endHour - startHour;
//     const extraPayRateFPTA =
//       regularPayRateFPTA + (regularPayRateFPTA * 15) / 100;
//     const payForTimeAfter_5 =
//       (hoursAfter_5 + endMinutes / 60) * extraPayRateFPTA;
//     const payForTimeBefore_5 =
//       (hoursBefore_5 + minutesBefore_5 / 60) * regularPayRateFPTA;
//     const totalPayFPTA = (payForTimeAfter_5 + payForTimeBefore_5).toFixed(
//       2
//     );
//     console.log(
//       `YOU WORKED AFTER 5PM TODAY. YOUR PAY BEFORE 5 IS: ${payForTimeBefore_5}, PAY AFTER 5 IS: ${payForTimeAfter_5} \nTOTAL PAY: ${totalPayFPTA}`
//     );
//     calculationResultHTML = displayGrossPay(
//       totalShiftDurationInDecimals,
//       minutesWorkedToDisplay,
//       totalPayFPTA,
//       negativeHourlyRateInputted,
//       lessThanOneHourlyRateInputted
//     );
//     resultDiv = document.querySelector(".result-div");
//     footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//     resultDiv = document.querySelector(".result-div");
//     return;
//   }
//   // if user inputs shift start is after/at 5pm.
//   if (startHour === 17) {
//     const minutesAfter_5_atShiftStart = 60 - startMinutes;
//     const minutesAfter_5_atShiftEnd = endMinutes;
//     const totalMinutesWorked =
//       minutesAfter_5_atShiftStart + minutesAfter_5_atShiftEnd;
//     const totalTimeWorked =
//       shiftEndTimeInDecimals - shiftStartTimeInDecimals;
//     const totalPayFPTA = (totalTimeWorked * extraPayRateFPTA).toFixed(2);
//     calculationResultHTML = displayGrossPay(
//       totalShiftDurationInDecimals,
//       minutesWorkedToDisplay,
//       totalPayFPTA,
//       negativeHourlyRateInputted,
//       lessThanOneHourlyRateInputted
//     );
//     resultDiv = document.querySelector(".result-div");
//     footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//     resultDiv = document.querySelector(".result-div");
//     return;
//   }
// }

// // WHEN START TIME IS ABOVE/EQUAL TO '8AM' && endHour <= 17 && 'endMinutes > 0' -> 8:00AM - 5:59PM.
// if (startHour >= 8 && endHour == 17 && endMinutes > 0) {
//   // since end time is always 5, only minutes after 5 are eligible for extra pay and the rest of the time falls under regular pay rate.
//   const minutesEligibleForExtraPayInDecimals = endMinutes / 60; // all end minutes are eligible.
//   const extraPay = extraPayRateFPTA * minutesEligibleForExtraPayInDecimals;
//   const timeEligibleForRegularPayInDecimals =
//     totalShiftDurationInDecimals - minutesEligibleForExtraPayInDecimals;
//   const regularPay =
//     regularPayRateFPTA * timeEligibleForRegularPayInDecimals;
//   const totalPayFPTA = (regularPay + extraPay).toFixed(2);
//   calculationResultHTML = displayGrossPay(
//     totalShiftDurationInDecimals,
//     minutesWorkedToDisplay,
//     totalPayFPTA,
//     negativeHourlyRateInputted,
//     lessThanOneHourlyRateInputted
//   );
//   resultDiv = document.querySelector(".result-div");
//   footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//   resultDiv = document.querySelector(".result-div");
//   return;
// }
// // WHEN START TIME IS BELOW 8, BUT EXACTTLY '5:00PM' -> 7:05AM - 5:00PM.
// if (startHour < 8 && shiftEndTimeInDecimals == 17) {
//   const timeEligibleForExtraPayInDecimals = 8 - shiftStartTimeInDecimals;
//   const timeEligibleForRegularPayInDecimals = endHour - 8; // 17 - 8 gives you this time.
//   const regularPay =
//     regularPayRateFPTA * timeEligibleForRegularPayInDecimals;
//   const extraPay = extraPayRateFPTA * timeEligibleForExtraPayInDecimals;
//   const totalPayFPTA = (regularPay + extraPay).toFixed(2);
//   calculationResultHTML = displayGrossPay(
//     totalShiftDurationInDecimals,
//     minutesWorkedToDisplay,
//     totalPayFPTA,
//     negativeHourlyRateInputted,
//     lessThanOneHourlyRateInputted
//   );
//   resultDiv = document.querySelector(".result-div");
//   footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//   resultDiv = document.querySelector(".result-div");
//   return;
// }

// if (startHour <= 8 && shiftEndTimeInDecimals > 17) {
// WHEN SHIFTS START BEFORE/EQUAL TO 8 AND END AFTER 5 (BELOW 8, GREATER THAN(or equal to) 5)
// here hours before 8 get extra pay and hours after 5 get extra pay.

// if the time is before 8, it yields in positive value when subtracted, but it yields negative when the time is past 8. If the time is past 8 then make this variable zero, as it contains time before 8.
//   const timeBefore_8_InDecimals =
//     8 - shiftStartTimeInDecimals < 0
//       ? 0
//       : Math.abs(8 - shiftStartTimeInDecimals);

//   // if the time is after 5PM, maybe '13:00PM' then '17 - 13' yields positive. The result yields negative only if the time is after '5:00PM'. Capture the difference only if the result is negative, else (time is before 5PM) make it zero.
//   const timeAfter_5_InDecimals =
//     17 - shiftEndTimeInDecimals < 0
//       ? Math.abs(shiftEndTimeInDecimals - 17)
//       : 0;
//   const timeAfter_8_but_Before_5_InDecimals =
//     totalShiftDurationInDecimals -
//     (timeBefore_8_InDecimals + timeAfter_5_InDecimals);
//   const timeEligibleForExtraPayInDecimals =
//     timeBefore_8_InDecimals + timeAfter_5_InDecimals;
//   const extraPay = extraPayRateFPTA * timeEligibleForExtraPayInDecimals;
//   const regularPay = timeAfter_8_but_Before_5_InDecimals * regularPayRateFPTA;
//   const timeEligibleForOvertimeInDecimals =
//     totalShiftDurationInDecimals > 7.5
//       ? totalShiftDurationInDecimals - 7.5
//       : 0;
//   const overtimePay =
//     timeEligibleForOvertimeInDecimals * (regularPayRateFPTA * 1.5);
//   totalPayFPTA = (extraPay + regularPay + overtimePay).toFixed(2);
//   console.log(
//     `TIME BEFORE 8: ${timeBefore_8_InDecimals} \nTIME AFTER 5: ${timeAfter_5_InDecimals} \nTIME B/W 8-5: ${timeAfter_8_but_Before_5_InDecimals} \n OVERTIME PAY IS: ${overtimePay}`
//   );
//   console.log(
//     `RREGULAR PAY IS:${regularPay} \nEXTRA PAY IS:${extraPay}\n TOTAL: ${totalPayFPTA}`
//   );
//   calculationResultHTML = displayGrossPay(
//     totalShiftDurationInDecimals,
//     minutesWorkedToDisplay,
//     totalPayFPTA,
//     negativeHourlyRateInputted,
//     lessThanOneHourlyRateInputted
//   );
//   resultDiv = document.querySelector(".result-div");
//   footer.insertAdjacentHTML("beforebegin", calculationResultHTML);
//   resultDiv = document.querySelector(".result-div");
//   return;
// }
