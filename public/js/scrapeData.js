$( document ).ready(function() {
  console.log( "ready!" );

 //onclick action to see saved articles
  $("#button-save-article").on("click", function(e){
    e.preventDefault();
    
    //gets the saved articles
    axios({
      url: "/api/articles",
      method: "GET"
    })
    .then(function (respArticles) {
        console.log('resArticles', respArticles);

        respArticles.data.forEach(element => {
          //console.log("Title", element.title );
          $("#saved-articles").append(`
            <div class="panel panel-default" >
                    <div class="panel-body" >
                        <div class="col-md-8" id="saved-articles-title">${element.title}</div>
                        <div class="col-md-4">
                              <span>
                            
                              <button class="btn btn-primary add-note-btn" data-articleId=${element._id} 
                              data-toggle="modal" data-target="#post-comment-modal">Add Note</button>
                              
                              <button class="btn btn-danger view-note-btn" data-articleId="${element._id}"
                                data-toggle="modal" data-target="#view-comments-modal"
                                data-headline="">View Saved Notes</button>
                         
                            </span>
                        </div>     
                    </div>
                    <div class="panel-footer" id="saved-articles-link">${element.link}</div>
            </div>
          `);
        });
      })
    .catch(function (err) {
        console.error(err);
      });
  });
  
  //onclick for Add Note button
  $(document).on('click', '.add-note-btn', function (e) {
    e.preventDefault();

    // set data-articleId value of submit button to the id the article being commented on
    $('#submit-note').attr('data-articleId', $(this).attr('data-articleId'));
  });

  //onclick for the submit button in modal
  $(document).on("click", "#submit-note", function(e){
         e.preventDefault();

    var id = $(this).attr("data-articleId");
    console.log("Article id ", id);

    //Updates notes to the database
    $.ajax({
        url: "/api/articles/" + id,
        method: "POST",
        data: {
             title: $('#note-title').val().trim(),
             body: $('#note-body').val().trim()
          }
      })
      .then(function (data) {
         // clear the text fields
         $('#note-title').val('');
         $('#note-body').val('');
       })
      .catch(function (err) {
             console.error(err);
       });
  });
  
  

 
});


