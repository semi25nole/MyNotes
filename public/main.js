function results () {
    $("#results").empty();
    $.getJSON("/all", function(data) {
        for(var i = 0; i < data.length; i++) {
            $("#results").prepend("<p class='dataTitle' data-id=" +
                data[i]._id + ">" + data[i].title + "<button class='btn btn-small' id='deleter'>X</button>" + "</p>" + "<hr>");
        }
    });

};

results();

$(document).on("click", "#makeNew", function() {

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/submit",
        data: {
            title: $("#title").val(),
            note: $("#note").val(),
            created: Date.now()
        }
    })

        .done(function(data) {

            $("#results").prepend("<p class='dataentry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
                data._id + ">" + data.title + "</span><span class=deleter>X</span></p>");

            $("#note").val("");
            $("#title").val("");
        });

    results();

    window.location.reload(true);

});


$("#delete").on("click", function() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/clear",
        success: function(response) {
            $("#results").empty();
        }
    });
});

$(document).on("click", "#deleter", function() {
    // Save the p tag that encloses the button
    var selected = $(this).parent();
    // Make an AJAX GET request to delete the specific note
    // this uses the data-id of the p-tag, which is linked to the specific note
    $.ajax({
        type: "GET",
        url: "/delete/" + selected.attr("data-id"),

        // On successful call
        success: function(response) {
            // Remove the p-tag from the DOM
            selected.remove();
            // Clear the note and title inputs
            $("#note").val("");
            $("#title").val("");
            // Make sure the #actionbutton is submit (in case it's update)
            $("#actionButton").html("<button class='btn btn-primary' id='makeNew'>Submit</button>");
        }
    });

    results();

    window.location.reload(true);
});



$(document).on("click", ".dataTitle", function() {

    var selected = $(this);

    $.ajax({
        type: "GET",
        url: "/find/" + selected.attr("data-id"),
        success: function(data) {

            $("#note").val(data.note);
            $("#title").val(data.title);

            $("#actionButton").html("<button class='btn btn-primary' id='updater' data-id='" + data._id + "'>Update</button>");
        }
    });
});


$(document).on("click", "#updater", function() {

    var selected = $(this);

    $.ajax({
        type: "POST",
        url: "/update/" + selected.attr("data-id"),
        dataType: "json",
        data: {
            title: $("#title").val(),
            note: $("#note").val()
        },

        success: function(data) {

            $("#note").val("");
            $("#title").val("");

            $("#actionButton").html("<button class= 'btn btn-primary' id='makeNew'>Submit</button>");

            results();
        }
    });
});










