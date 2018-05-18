$(document).ready(function() {
    $('.js-load-posts').on('click', function() {
        // load the posts into the div with an ID of #posts

        // get all blog data
        $.get('/api/blog').done(function(data) {
            // use blog data to append a blog post for each item in the data
            $.each(data, function(key, post) {
                $('#posts').append('<div data-id="' + post.id + '" class="post"><h2>' + post.title + '</h2><h4>' + post.author + '</h4><hr></div>')
            });  
            // after all blog posts have been added, attah an event for each of them
            $('.post').on('click', function() {
                // get the id for the post that was just clicked
                var id = $(this).data('id');
                console.log(id);
                // get the data for that specific blog post
                $.get('/api/blog/' + id).done(function(data) {
                    // display blog post data
                    // title
                    $('.modal-title').html(data.title);
                    // author
                    $('.js-author').html(data.first_name + ' ' + data.last_name);
                    // date
                    $('.js-date').html(data.date);
                    // content
                    $('.js-content').html(data.content);
                    // show the modal
                    $('.modal').modal();
                })
            })
        })       
    })

    $('.js-new-post-form').on('submit', function(e) {
        e.preventDefault();
        var formData = $(this).serialize();
        console.log(formData);
        $('.js-new-post-form').find('.btn').attr('disabled', 'disabled').addClass('disabled');
        $.post({
            url: '/api/new',
            data: formData,
        })
        .always(function() {
           $('.js-new-post-form .btn').removeAttr('disabled').removeClass('disabled');
        })
        .fail(function() {
            alert('Failed to Submit form. Please try again')
        })
        .done(function() {
            // visual feedback
            alert('Thanks!');
            window.location = '/';
            // $('.js-new-post-form').clear();
        })
        // send the formData to the server with $.ajax here


    })
})
