$(document).ready(function () {
  console.log("ready!");


  //onclick action to see saved articles
  $("#button-save-article").on("click", function (e) {
    e.preventDefault();

    $("#articles").html("<p>Loading articles...<p>");
    //gets the saved articles
    axios({
      url: "/api/articles",
      method: "GET"
    })
      .then(function (respArticles) {
        console.log('resArticles', respArticles);
        //removes the html text
        $("#articles").html(" ");
        respArticles.data.forEach(element => {

          $("#articles").append(`
            <div class="panel panel-default" >
                    <div class="panel-body" style="background-color:#A9A9A9">
                      <div class="col-md-4">
                       <img src=${element.img} alt="" height=${200} width=${250}>  
                      </div> 
                      <div class="col-md-8" >
                        <div class="row" id="saved-articles-title"><b>HeadLine:</b> ${element.title} </div> 
                        <br>
                        <div class="row"> 
                            <span>                          
                              <button class="btn btn-primary add-note-btn" data-articleId=${element._id} 
                              data-toggle="modal" data-target="#add-notes-modal">Add Note</button>
                              
                              <button class="btn btn-danger saved-note-btn" data-articleId="${element._id}"
                                data-toggle="modal" data-target="#saved-notes-modal"
                                data-headline="${element.title}">Saved Notes</button>                
                          </span>
                        </div> 
                        <br>
                        <div class="row" id="saved-articles-link"><a href=${element.link}><b>Link:</b>${element.link}</a></div>
                        
                      </div> 
                    </div>                  
            </div>
          `);
        });
      })
      .catch(function (err) {
        console.error(err);
      });
  });

  //onclick function to scrape more articles
  $("#button-scrape-newArticle").on("click", function (e) {
    e.preventDefault();
    $("#articles").html("<p>Scraping new articles...<p>");
    //gets the saved articles
    axios({
      url: "/api/scrapeData",
      method: "GET"
    })
      .then(function (scrapedArticles) {

        console.log('Scrape Articles', scrapedArticles);
        //removes the html text
        axios({
          url: "/api/articles",
          method: "GET"
        })
          .then(function (newArticles) {
            console.log('newArticles', newArticles);
            //removes the html text
            $("#articles").html(" ");
            newArticles.data.forEach(element => {

            $("#articles").append(`
              <div class="panel panel-default" >
                      <div class="panel-body" style="background-color:#A9A9A9">
                        <div class="col-md-4">
                         <img src=${element.img} alt="" height=${200} width=${250}>  
                        </div> 
                        <div class="col-md-8" >
                          <div class="row" id="saved-articles-title"><b>HeadLine:</b> ${element.title} </div> 
                          <br>
                          <div class="row"> 
                              <span>                          
                                <button class="btn btn-primary add-note-btn" data-articleId=${element._id} 
                                data-toggle="modal" data-target="#add-notes-modal">Add Note</button>
                                
                                <button class="btn btn-danger saved-note-btn" data-articleId="${element._id}"
                                  data-toggle="modal" data-target="#saved-notes-modal"
                                  data-headline="${element.title}">Saved Notes</button>                
                            </span>
                          </div> 
                          <br>
                          <div class="row" id="saved-articles-link"><a href=${element.link}><b>Link:</b>${element.link}</a></div>
                          
                        </div> 
                      </div>                  
              </div>
            `);
            });
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  });

  //onclick for Add Note button
  $(document).on("click", ".add-note-btn", function (e) {
    e.preventDefault();

    // set data-articleId value of submit button to the id the article being commented on
    $("#submit-note").attr("data-articleId", $(this).attr('data-articleId'));
  });

  //onclick for the submit button in modal
  $(document).on("click", "#submit-note", function (e) {
    e.preventDefault();

    var id = $(this).attr("data-articleId");
    console.log("Article id ", id);

    //Updates notes to the database
    $.ajax({
      url: "/api/articles/" + id,
      method: "POST",
      data: {
        title: $("#note-title").val().trim(),
        body: $("#note-body").val().trim()
      }
    })
      .then(function (resp) {
        // clear the text fields
        $("#note-title").val('');
        $("#note-body").val('');
      })
      .catch(function (err) {
        console.error(err);
      });
  });

  //onclick for Saved Notes button
  $(document).on('click', '.saved-note-btn', function (e) {
    e.preventDefault();
    // set btn's article id to a variable
    var articleId = $(this).attr('data-articleId');

    // get the title of the modal
    $('#notes-modal-title').text($(this).attr('data-headline'));

    // empty the comments section to be repopulated by the ajax request
    $('#modal-notes-body').empty();

    // get the article's comments from the database
    $.ajax({
      url: "/api/articles/" + articleId,
      method: "GET"
    })
      .then(function (respArticle) {
        console.log("respArticle with id ", respArticle);
        var data = respArticle.note;
        console.log("data", data);
        console.log("data length", data.length);
        
        data.forEach(element => {
          console.log(element);
          $('#modal-notes-body').append(`
                <div class="note-div" data-notetId="${element._id}" id="note-div-${element._id}">
                   <h4>${element.title}</h4>
                   <p>${element.body}</p>
                   <button class="btn btn-primary delete-note-btn"
                      data-noteId="${element._id}" style="flex:end">Delete Note</button>
                </div>
             `);
        });
      })
      .catch(function (err) {
        console.error(err);
      });
    ;

  });

  // delete a note
  $(document).on('click', '.delete-note-btn', function (e) {
    e.preventDefault();
    var noteId = $(this).attr('data-noteId');

    // delete the comment in the database
    $.ajax({
      url: "/api/notes/" + noteId,
      method: "DELETE"
    })
      .then(function (data) {
        // remove the comment's div from the page
        $(`#note-div-${noteId}`).remove();
      })
      .catch(function (err) {
        console.error(err);
      });
    ;

  });

});


