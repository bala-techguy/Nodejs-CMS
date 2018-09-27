$(document).ready(function(){
  $('.delete-client').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/clients/'+id,
      success: function(response){
        alert('Deleting the selected client record');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
