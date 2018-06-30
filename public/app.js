// GRAB ARTICLES AS JSON
$.getJSON("/articles", function(info) {
    // FOR LOOP TO DISPLAY INFO ON PAGE 
    for (var i = 0; i < info.length; i++) {
      $("#articles").append("<p data-id='" + info[i]._id + "'>" + info[i].title + "<br />" + info[i].link + "</p>");
    }
  });
  
  
  // CLICK EVENT FOR WHEN USER CLICKS ON <P> TAG
  $(document).on("click", "p", function() {
    // EMPTY OUT COMMENTS
    $("#comments").empty();
    // SAVE P TAG ID
    var infoId = $(this).attr("info-id");
  
    // AJAX CALL FOR ARTICLE
    $.ajax({
      method: "GET",
      url: "/articles/" + infoId
    })
      // ADD COMMENT INFO TO PAGE
      .then(function(info) {
        console.log(info);
        // ARTICLE TITLE
        $("#comments").append("<h2>" + info.title + "</h2>");
        // INPUT FOR NEW TITLE
        $("#comments").append("<input id='titleinput' name='title' >");
        // TEXT AREA TO ADD NEW COMMENT
        $("#comments").append("<textarea id='commentinput' name='body'></textarea>");
        // BUTTON TO SUBMIT NEW COMMENT WITH SAVED ID OF ARTICLE
        $("#comments").append("<button data-id='" + info._id + "' id='savecomment'>Save Comment</button>");
  
        // IF A COMMENT EXISTS IN THE ARTICLE
        if (info.comment) {
          // PUT TITLE OF COMMENT IN THE TITLE INPUT
          $("#titleinput").val(info.comment.title);
          // PUT BODY OF COMMENT IN TEXT AREA
          $("#commentinput").val(info.comment.body);
        }
      });
  });
  
  // WHEN "SAVE COMMENT" IS CLICKED
  $(document).on("click", "#savecomment", function() {
    // GET ID ASSOCIATED WITH ARTICLE
    var thisId = $(this).attr("info-id");
  
    // POST REQUEST TO CHANGE COMMENTS
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      info: {
        // VALUE FROM TITLE INPUT
        title: $("#titleinput").val(),
        // VALUE FROM COMMENT TEXT AREA
        body: $("#commentinput").val()
      }
    })
      // With that done
      .then(function(info) {
        // Log the response
        console.log(info);
        // Empty the notes section
        $("#comments").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#commentinput").val("");
  });