(function () {
    'use strict';

    const DAYS_IN_YEAR = 365.25,
          MONTHS_IN_YEAR = 12;

    let outputId = 'output',
        ageId = 'age',
        buttonId = 'button',
        successfulTestCount = 0,
        percentsAaCeos = [
            6, 4, 5,
            6, 6, 6,
            5, 6, 6,
            7, 6, 6,
            7, 6, 5,
            5
        ],
        aaDemographics = [
            { year: 1970, total: 203210158, aa: 22539362},
            { year: 1980, total: 226545805, aa: 26495025},
            { year: 1990, total: 248709873, aa: 29986060},
            { year: 2000, total: 281421906, aa: 34658190},
            { year: 2010, total: 308745538, aa: 38929319},
        ];

    // Pure functions

    function getSum(values) {
        return values.reduce((value, sum) => value + sum);
    }

    function getMean(values) {
        return getSum(values) / values.length;
    }

    function getAaPercentsFromDemographics(demographics) {
        return demographics.map(demographic => Math.round((demographic.aa / demographic.total) * 100));
    }

    function getDebt(age, underrepresentationPercent) {
        return age * DAYS_IN_YEAR * (underrepresentationPercent / 100);
    }

    function getYearsFromDays(days) {
        return days / DAYS_IN_YEAR;
    }

    function getYearsFromDaysRemainder(days) {
        return getYearsFromDays(days) - Math.floor(getYearsFromDays(days));
    }

    function getMonthsFromYears(years) {
        return years * MONTHS_IN_YEAR;
    }

    function getMonthsFromYearsRemainder(years) {
        return getMonthsFromYears(years) - Math.floor(getMonthsFromYears(years));
    }

    function getDaysFromMonths(months) {
        return months * (DAYS_IN_YEAR / MONTHS_IN_YEAR);
    }

    function getDaysFromMonthsRemainder(months) {
        return getDaysFromMonths(months) - Math.floor(getDaysFromMonths(months));
    }

    function getYearsMonthsDaysFromDays(days) {
        return {
            years: Math.floor(getYearsFromDays(days)),
            months: Math.floor(getMonthsFromYears(getYearsFromDaysRemainder(days))),
            days: getDaysFromMonths(getMonthsFromYearsRemainder(getYearsFromDaysRemainder(days)))
        }
    }

    function getYmdStringFromDays(days) {
        let ymd = getYearsMonthsDaysFromDays(days);

        return `${ymd.years} years, ${ymd.months} months, ${ymd.days.toFixed(2)} days`;
    }


    // Impure functions

    function getAge() {
        return document.getElementById(ageId).value;
    }

    function getPercentsAaDemographics() {
        return getAaPercentsFromDemographics(aaDemographics);
    }

    function getMeanAaDemographics() {
        return getMean(getPercentsAaDemographics());
    }

    function getMeanAaCeos() {
        return getMean(percentsAaCeos);
    }

    function getUnderrepresentation() {
        return getMeanAaDemographics() - getMeanAaCeos();
    }

    function getCalculatedDebt() {
        return getDebt(getAge(), getUnderrepresentation());
    }

    function getCalculatedDebtYmdString() {
        return getYmdStringFromDays(getCalculatedDebt())
    }

    // Print functions

    function println(content) {
        document.getElementById(outputId).innerHTML += `<li>${content}</li>`;
    }

    function printPercentCeos() {
        println(`Average percentage of AA CEOs: ${getMeanAaCeos()}%`);
    }

    function printPercentsFromAaDemographics() {
        println('AA percentages per year:');
        getPercentsAaDemographics().forEach(percent => println(`${percent}%`));
        println('=======================');
    }

    function printPercentPopulation() {
        println(`Average percentage of AA population: ${getMeanAaDemographics()}%`);
    }

    function printUnderrepresentation() {
        println(`Underrepresentation (avearage population - average CEO): ${getUnderrepresentation()}%`)
    }

    function printDebt() {
        println(`My Debt: ${getCalculatedDebt().toFixed(2)} days (${getCalculatedDebtYmdString()})`);
    }

    // DOM manipulation

    function attachHandlers() {
        document.getElementById(buttonId).addEventListener('click', handleButtonClick);
        document.getElementById(ageId).addEventListener('keyup', handleAgeFieldKeyup)
    }

    function clearOutput() {
        document.getElementById(outputId).innerHTML = '';
    }

    // Event handlers

    function handleButtonClick() {
        update();
    }

    function handleAgeFieldKeyup(event) {
        if (event.keyCode === 13) {
            update();
        }
    }

    // Assertion functions

    function assertEquals(valueToTest, valueExpected) {
        if (valueToTest !== valueExpected) {
            log(`Test failed: expected ${valueExpected}, got ${valueToTest}`);
            return false;
        }

        successfulTestCount += 1;
        return true;
    }

    function assertArrayEquals(valueToTest, valueExpected) {
        if (valueToTest.length !== valueExpected.length) {
            log(`Test failed: expected ${valueExpected}, got ${valueToTest}`);
            return false;
        }

        for (let i = 0; i < valueToTest.length; i += 1) {
            if (valueToTest[i] !== valueExpected[i]) {
                log(`Test failed: expected ${valueExpected}, got ${valueToTest}`);
                return false;
            }
        }

        successfulTestCount += 1;
        return true;
    }

    // Unit tests

    function getSum_should_sum_numbers() {
        let numbers = [1, 5, 8, 3];

        return assertEquals(getSum(numbers), 17);
    }

    function getMean_should_average_numbers() {
        let numbers = [10, 20, 30, 40];

        return assertEquals(getMean(numbers), 25);
    }

    function getAaPercentsFromDemographics_should_return_percents() {
        let testDemographics = [
            { total: 200, aa: 100},
            { total: 50, aa: 25},
            { total: 100, aa: 75},
            { total: 50, aa: 5}
        ];

        return assertArrayEquals(getAaPercentsFromDemographics(testDemographics), [50, 50, 75, 10])
    }

    function getDebt_should_return_debt_in_years() {
        let age = 100,
            underrepresentationPercent = 10;

        return assertEquals(getDebt(age, underrepresentationPercent), 3652.5);
    }

    function getYearsFromDays_should_get_years_for_given_days() {
        return assertEquals(getYearsFromDays(365.25 * 3), 3);
    }

    function getYearsFromDaysRemainder_should_get_years_remainder_for_given_days() {
        // 4.5 years of days should yield a remainder of 0.5 years
        return assertEquals(getYearsFromDaysRemainder(365.25 * 4 + (365.25 / 2)), 0.5);
    }

    function getMonthsFromYearsRemainder_should_get_months_remainder_for_given_years() {
        // 8.3 months of years (8.3 * 1/12) should yield a remainder of 0.3 months
        // assigning fixed values in order to mitigate float calc ambiguity
        return assertEquals(getMonthsFromYearsRemainder(8.3 / 12).toFixed(10), 0.3.toFixed(10));
    }

    function getDaysFromMonthsRemainder_should_get_days_remainder_for_given_months() {
        // 25.25 days of months (25.25 * 1/30.4375) should yield a remainder of 0.25 days
        // assigning fixed values in order to mitigate float calc ambiguity
        return assertEquals(getDaysFromMonthsRemainder(25.25 / 30.4375).toFixed(10), 0.25.toFixed(10));
    }

    function getYearsMonthsDaysFromDays_should_get_days_months_and_years_for_given_days() {
        let days = (365.25 * 3) + (30.4375 * 4) + 12;
        // assigning fixed values in order to mitigate float calc ambiguity
        return assertEquals(getYearsMonthsDaysFromDays(days).days.toFixed(5), 12.0.toFixed(5)) &&
               assertEquals(getYearsMonthsDaysFromDays(days).months.toFixed(5), 4.0.toFixed(5)) &&
               assertEquals(getYearsMonthsDaysFromDays(days).years.toFixed(5), 3.0.toFixed(5));
    }

    // Misc functions

    function shimConsoleLog() {
        if (!window.console) {
            window.console = { log: println };
        }
    }

    function log(message) {
        window.console.log(message);
    }

    // Control functions

    function runUnitTests() {
        successfulTestCount = 0;
        let allTestsSuccessful = getSum_should_sum_numbers() &&
                                 getMean_should_average_numbers() &&
                                 getAaPercentsFromDemographics_should_return_percents() &&
                                 getDebt_should_return_debt_in_years() &&
                                 getYearsFromDays_should_get_years_for_given_days() &&
                                 getYearsFromDaysRemainder_should_get_years_remainder_for_given_days() &&
                                 getMonthsFromYearsRemainder_should_get_months_remainder_for_given_years() &&
                                 getDaysFromMonthsRemainder_should_get_days_remainder_for_given_months() &&
                                 getYearsMonthsDaysFromDays_should_get_days_months_and_years_for_given_days();

        if (allTestsSuccessful) {
            log(`${successfulTestCount} tests passed`)
        } else {
            println('A unit test has failed, app disabled')
        }

        return allTestsSuccessful;
    }

    function update() {
        clearOutput();
        // printPercentsFromAaDemographics();
        printPercentPopulation();
        printPercentCeos();
        printUnderrepresentation();
        printDebt();
    }

    function initialize() {
        shimConsoleLog();
        if (runUnitTests()) {
            attachHandlers();
            update();
        }
    }

    // Main

    initialize();
})();