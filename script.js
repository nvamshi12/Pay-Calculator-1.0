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
let removeHourlyRateText = document.querySelector(".remove-hourly-rate");
let payRateInfoText = document.querySelector(".pay-rate-info-text");
let calcBreakdownText = document.querySelector(".breakdown-calculation");
let resultDiv;
let netPayText;
let calculationResultHTML;
let applicationHeading = document.querySelector(".application-heading");

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

  const scrollDownHTML = `<p class="scroll-text" style="color: rgba(0, 0, 0, 0.82);">
  Scroll down to see your results ↓
</p>`;
  let scrollText = document.querySelector(".scroll-text");
  if (!scrollText) buttonsDiv.insertAdjacentHTML("afterend", scrollDownHTML);

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
  scrollText = document.querySelector(".scroll-text");
  if (scrollText) scrollText.remove();
  if (shiftTypeInput) {
    if (hourlyRateInput) hourlyRateInput.remove();
    let payInfoText = document.querySelector(".pay-rate-info-text");
    let toggleHourlyRateText = document.querySelector(".toggle-hourly-rate");
    if (payInfoText) {
      payInfoText.remove();
      if (toggleHourlyRateText) toggleHourlyRateText.remove();
    }
    removeHourlyRateText = document.querySelector(".remove-hourly-rate");
    if (removeHourlyRateText) removeHourlyRateText.remove();
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
  let netPay;
  if (!shiftType) {
    netPay = Math.fround(
      hourlyRateInput.value * totalShiftDurationInDecimals -
        (hourlyRateInput.value *
          totalShiftDurationInDecimals *
          taxPercentageInput.value) /
          100
    ).toFixed(2);
  }
  if (shiftType) {
    netPay = Math.fround(
      grossPay - (grossPay * taxPercentageInput.value) / 100
    ).toFixed(2);
  }
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
  removeHourlyRateText = document.querySelector(".remove-hourly-rate");

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
    removeHourlyRateText = document.querySelector(".remove-hourly-rate");
    if (removeHourlyRateText) removeHourlyRateText.remove();
    taxPercentageInput = document.querySelector(".tax--percentage");
    if (taxPercentageInput) taxPercentageInput.remove();
    excludeTaxText = document.querySelector(".exclude--tax");
    if (excludeTaxText) excludeTaxText.remove();
    includeTaxDiv.innerHTML = ` <p class="include--tax">Include Tax Rate</p>`;

    hourlyRateInput = document.querySelector(".hourly--rate");
    if (!hourlyRateInput)
      shiftEndInput.insertAdjacentHTML(
        "afterend",
        ` <input id="hourly--rate" class="hourly--rate"type="number" placeholder="Hourly Rate ($)"></input>`
      );
    hourlyRateInput = document.querySelector(".hourly--rate");
    resultDiv = document.querySelector(".result-div");
    if (resultDiv) resultDiv.remove();
    scrollText = document.querySelector(".scroll-text");
    if (scrollText) scrollText.remove();
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
    scrollText = document.querySelector(".scroll-text");
    taxPercentageInput = document.querySelector(".tax--percentage");
    if (taxPercentageInput) taxPercentageInput.remove();
    excludeTaxText = document.querySelector(".exclude--tax");
    if (excludeTaxText) excludeTaxText.remove();
    includeTaxDiv.innerHTML = ` <p class="include--tax">Include Tax Rate</p>`;
    if (scrollText) scrollText.remove();
    if (resultDiv) resultDiv.remove();
  }

  if (e.target === toggleHourlyRateText) {
    shiftTypeInput = document.querySelector(".shift-type-input");
    payRateInfoText = document.querySelector(".pay-rate-info-text");
    hourlyRateInput = document.querySelector(".hourly--rate");
    if (!hourlyRateInput) {
      shiftTypeInput.insertAdjacentHTML(
        "afterend",
        `<input id="hourly--rate" class="hourly--rate"type="number" placeholder="Hourly Rate ($)"></input>`
      );
      hourlyRateInput = document.querySelector(".hourly--rate");
      hourlyRateInput.insertAdjacentHTML(
        "afterend",
        `<p class="pay-rate-info-text">ℹ️ The default Seasonal Ticket Agent pay rate is FPTA: $${
          regularPayRateFPTA + ", "
        } VB: $${regularPayRateVB}.</p><p class="remove-hourly-rate">Remove Custom Hourly Pay Rate</p>`
      );
      removeHourlyRateText = document.querySelector(".remove-hourly-rate");
    }
    toggleHourlyRateText.remove();
    payRateInfoText.remove();
  }
  if (e.target === removeHourlyRateText) {
    hourlyRateInput = document.querySelector(".hourly--rate");
    hourlyRateInput.remove();
    removeHourlyRateText = document.querySelector(".remove-hourly-rate");
    removeHourlyRateText.remove();
    payRateInfoText = document.querySelector(".pay-rate-info-text");
    payRateInfoText.remove();
    shiftTypeInput = document.querySelector(".shift-type-input");
    shiftTypeInput.insertAdjacentHTML("afterend", toggleHourlyRateHTML);
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

  let timeAfter_5_InDecimals =
    17 - shiftEndTimeInDecimals < 0 ? Math.abs(shiftEndTimeInDecimals - 17) : 0;

  // if user enters 12:00AM as end-time 'shiftEndTimeInDecimals' will be equal to zero. So fixing it by writing the below condition.
  if (shiftEndTimeInDecimals == 0) {
    timeAfter_5_InDecimals = 24 - 17;
  }
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
          timeEligibleForOvertimeInDecimals.toFixed(1) +
          " hrs. </span></p>"
        : "<p class='breakdown-text'>🫣 No overtime pay today.</p>"
    }
    ${
      totalShiftDurationInDecimals > 8
        ? "<p class='breakdown-text'>🤯 You entered a shift duration of more than 8 hours. Results may not be accurate.</p>"
        : ""
    } 
    `;

    calcBreakdownText.insertAdjacentHTML("beforebegin", calcBreakdownHTML);
    calcBreakdownText.remove();
  });

  return;
}
