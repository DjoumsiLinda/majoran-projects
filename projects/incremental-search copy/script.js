(function (countries) {
    var inputField = $("#container input");
    var resultsContainer = $("#container #results");
    var results = [];
    var resultsLenght = 0;

    console.log(inputField, resultsContainer);

    // 1. input +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Summary: get list of countries that match the user input.

    // TODO: If there is no match, show "no results"
    inputField.on("input", function () {
        // clearing the results container from the old results
        // vanilla JS: resultsContainer.innerHTML = "";
        resultsContainer.empty();
        results = [];

        var value = inputField.val(); // vanilla JS: .value

        console.log("value of search field:", value);

        var countResults = 0;

        for (var country of countries) {
            // "Germany".indexOf("Ge") -> 0
            // "Germany".indexOf("many") -> 3
            // "Germany".indexOf("usa") -> -1 (no match)
            // "Germany".indexOf("Ga") -> -1 (no match)

            // console.log(country, country.indexOf(value) === 0);

            if (
                country.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
                countResults <= 3
            ) {
                results.push(country);
                countResults++;
            }
        }

        console.log("matching countries", results);
        resultsLenght = results.length - 1;
        if (results.length > 0) {
            for (var result of results) {
                resultsContainer.append("<p>" + result + "</p>");
            }
        } else {
            //if the user types gibberish, render a "no results" message onscreen
            resultsContainer.append("<p>no results </p>");
        }

        //if the input field is empty, no countries should be shown
        if (value === "") {
            resultsContainer.empty();
        }
    });

    // 2. mouseover +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Summary: highlight the country the user is hovering

    // This will actually NOT add any event listeners at all,
    // because inititally our results container is empty.
    // Our countries (p) are inserted dynamically by JS.
    /*$("#results p").on("mouseover", function () {
        console.log("mouseover on ", this);
    });*/

    // event delegation will help us to get events on dynamically added elements
    // https://learn.jquery.com/events/event-delegation/
    resultsContainer.on("mouseover", "p", function () {
        // console.log("mouseover on ", results.length);
        $("#results .highlight").removeClass("highlight"); //and we'll want to remove highlight from all the other countries.
        $(this).addClass("highlight");
    });

    // 3. mousedown +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    resultsContainer.on("mousedown", "p", function () {
        inputField.val(this.innerHTML);
        resultsContainer.empty();
    });

    // 4. keydown +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var indexD = 0;
    var swapD;
    var swapU;
    var resultE;
    var indexU = resultsLenght;
    $(document).on("keydown", function (evt) {
        // console.log("Lenght: ", results);

        if (evt.key === "ArrowDown") {
            // console.log("keydown on ", evt.key, $("#results p").eq(0));
            //IF no country has the highlight class, add highlight to the first country
            if (indexD === resultsLenght + 1) {
                indexD = 0;
            }
            if (swapU === true) {
                indexD = indexU + 2;
                swapU = false;
            }
            swapD = true;
            /*console.log(
                $("#results p").eq(0),
                $("#results p").eq(0).next().text(),
                $("#results p").eq(1).prev().text()
            );*/
            if (swapD === true) {
                //console.log("-------------", swapD, indexD);
                $("#results .highlight").removeClass("highlight");
                $("#results p").eq(indexD).addClass("highlight");
                resultE = indexD;
                indexD++;
                swapD = false;
            }
        } else if (evt.key === "ArrowUp") {
            //IF no country has the highlight class, add the highlight class to the last country
            swapU = false;
            if (indexU === -1) {
                indexU = resultsLenght;
            }
            if (swapD === false) {
                indexU = indexD - 2;
                swapD = true;
            }
            if (swapU === false && indexU >= 0) {
                //console.log("+++", swapU, indexU);
                $("#results .highlight").removeClass("highlight");
                $("#results p").eq(indexU).addClass("highlight");
                resultE = indexU;
                indexU--;
                swapU = true;
            }
        } else if (evt.key === "Enter") {
            //console.log("enter", resultE);
            inputField.val($("#results p").eq(resultE).text());
            resultsContainer.empty();
        }
    });

    // 5. blur +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Summary: hide the list of suggestions
    $("input").blur(function () {
        //console.log("ttt");
        resultsContainer.css({
            visibility: "hidden",
        });
    });
    // 6. focus +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Summary: show the list of suggestions again
    $("input").focus(function () {
        resultsContainer.css({
            visibility: "visible",
        });
    });
})([
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Côte D'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic People's Republic of Korea",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People’s Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Republic of Korea",
    "Republic of Moldova",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Tajikistan",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United Republic of Tanzania",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Viet Nam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
]);
