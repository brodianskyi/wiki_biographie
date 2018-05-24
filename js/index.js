jQuery(function () {
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
            var text = $(blurb).find("p");
            $("#article").html(text);
            for (var j = 0; j < text.length; j++) {
                split_in_string = text[j].innerText.split(/\n/);
                console.log("----",split_in_string);
            }

        };

        $.ajax({
            type: "GET",
            url: url_get_all_sections,
            async: false,
            dataType: "json",
            success: function (data) {
                /*//Get heading console.log(data[1][0]);
                  //Get description console.log(data[2][0]);
                  //Get link console.log(data[3][0]);
                     $("#output").html("");
                     for (var i = 0; i < data[1].length; i++) {
                       $("#output").prepend("<li><a href= " +data[3][i]+ ">" + data[1][i] + "</a><p>" + data[2][i] + "</p></li>");
                     } */
                //console.log(data);
                var markup = data.parse.sections;
                // console.log(markup);
                //for (var i = 0; i < markup.length; i++) {
                for (var i = 0; i < 1; i++) {
                    // console.log(markup[i].line);
                    // console.log(markup[i], "i=", i);
                    $.ajax({
                        type: "GET",
                        url: "http://de.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=" + i + 1 + "&page=" + searchTerm + "&callback=?",
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