jQuery(function () {
    var biographySectionRegexes = [
        /^Leben$/,
        /^Biogra(ph|f)ie$/
    ];
    //When search is clicked run code
    $("#search").click(function () {
        console.log("Click on button");
        var searchTerm = $("#searchTerm").val();
        var url_get_all_sections = "http://de.wikipedia.org/w/api.php?action=parse&format=json&prop=sections&page=Jimi_Hendrix&callback=?";
        var url_extract_current_section = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Jimi_Hendrix&callback=?";
        //   var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?"
        //Wikipedia API ajax call


        function parse_text(data) {
            var pars_current = data.parse.text["*"];
            var split_in_string = "";
            // console.log("----------------", pars_current);
            var blurb = $("<div></div>").html(pars_current);
            //remove links as they will not work
            blurb.find("a").each(function () {
                $(this).replaceWith($(this).html());
            });
            //remove any references
            blurb.find("sup").remove();
            //remove  cite error
            blurb.find(".mw-ext-cite-error").remove();
            var text = $(blurb).find("p, :header");
            // remove "edit article" from headers
            text.find(".mw-editsection").remove();
            $("#article").html(text);
            for (var j = 0; j < text.length; j++) {
                split_in_string = text[j].innerText.split(/\n/);
                console.log("----",split_in_string);
            }
        }

        // return all sections that are probably relevant to us (by matching the regex)
        // does not include sub-sections of matched sections
        function filterSections(sectionArr) {
            var returnArr = [];
            var matchLevel = null;
            for (var i = 0; i < sectionArr.length; i++) {
                if (matchLevel) {
                    if (matchLevel < sectionArr[i].level) continue;
                    else matchLevel = null;
                }
                if (!matchLevel) {
                    if (biographySectionRegexes.some(regex => regex.test(sectionArr[i].line))) {
                        if (!matchLevel) matchLevel = sectionArr[i].level;
                        returnArr.push([sectionArr[i], i+1]);
                    }
                }
            }
            return returnArr;
        }

        $.ajax({
            type: "GET",
            url: url_get_all_sections,
            async: false,
            dataType: "json",
            success: function (data) {
                var biographySections = filterSections(data.parse.sections);
                console.log(biographySections);
                for (var i = 0; i < biographySections.length; i++) {
                    $.ajax({
                        type: "GET",
                        url: "http://de.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=" + biographySections[i][1] + "&page=" + searchTerm + "&callback=?",
                        async: false,
                        dataType: "json",
                        success: function (data1) {
                            parse_text(data1)
                        },
                        error: function (errorMessage) {
                            alert(errorMessage);
                        }
                    });
                }
            },
            error: function (errorMessage) {
                alert(errorMessage);
            }
        });


    });
});
