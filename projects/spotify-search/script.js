(function () {
    var next = null;
    var searchterm;
    var type;
    var timeoutId;
    var moreButton = $("#more");
    var resultsContainer = $("#results");
    //console.log(location);
    //a ecrire a la fin du html ?scroll=infinite
    var infiniteScroll = location.search.indexOf("scroll=infinite") > -1;

    console.log("infiniteScroll", infiniteScroll);
    $("#search").on("click", function () {
        var html = "";
        resultsContainer.empty();
        next = null;
        clearTimeout(timeoutId);
        searchterm = $("input[name=searchterm]").val();
        type = $("select[name=type]").val();
        $.ajax({
            method: "GET",
            url: "https://spicedify.herokuapp.com/spotify",
            data: {
                query: searchterm,
                type: type,
            },
            success: function (response) {
                var data = response.artists || response.albums;
                if (data.items.length <= 0) {
                    html =
                        html +
                        "<div>" +
                        'No results found for: "' +
                        searchterm +
                        '"' +
                        "</div>";
                    resultsContainer.append(html);
                } else {
                    html =
                        html +
                        "<div>" +
                        'Results for: "' +
                        searchterm +
                        '"' +
                        "</div>";
                    resultsContainer.append(html);
                    handleResponse(response);
                }
            },
        });
    });

    moreButton.on("click", function () {
        // console.log("tas clicker");
        more();
    });
    function handleResponse(response) {
        var html = "";
        //console.log(response);
        /* we can use the logical OR, to achive the same effect
        as with the if / else above */
        var data = response.artists || response.albums;

        for (var item of data.items) {
            var name = item.name;
            var url = item.external_urls.spotify;

            // pick your own default image // ternary operator
            var image =
                item.images.length > 0 ? item.images[0].url : "default.png";
            // use url to make each result clickable
            // also use image
            var img = "<img src=" + image + ">";
            var nom = "<p>" + name + "</p>";
            html = html + "<div><a href=" + url + '">' + img + nom + "</div>";
        }
        resultsContainer.append(html);

        // handling pagination
        // spotify will give us the actual spotify api URL,
        // we need to replace it with the url to our proxy.
        if (data.next) {
            if (infiniteScroll) {
                checkScrollPosition();
            } else {
                // show load more button
                moreButton.show(); // changes the `display` property to block
            }
            next = data.next.replace(
                "api.spotify.com/v1/search",
                "spicedify.herokuapp.com/spotify"
            );
        } else {
            next = null;
            clearTimeout(timeoutId);
            moreButton.hide(); // changes the `display` property to none
        }
    }
    function checkScrollPosition() {
        // Make sure to never have multiple timeouts
        // pending for checkScrollPosition.
        //a ecrire a la fin du html ?scroll=infinite
        clearTimeout(timeoutId);

        // user is at least 200px close to the end of the page
        console.log(
            $(document).scrollTop(),
            $(window).height(),
            $(document).height()
        );
        if (
            $(document).scrollTop() + $(window).height() >
            $(document).height() - 200
        ) {
            console.log("close to the bottom of the page");
            more();
        } else {
            timeoutId = setTimeout(checkScrollPosition, 100);
        }
    }

    function more() {
        $.ajax({
            method: "GET",
            url: next,
            data: {
                query: searchterm,
                type: type,
            },
            success: handleResponse,
        });
    }
})();
