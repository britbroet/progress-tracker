$(document).ready(function(){

$(function() {
  $('.edit-form').submit(function(e) {
    e.preventDefault();
    var url = $(this).attr('action');
    var data = $(this).serialize();

    $.ajax({
      url: url,
      method: 'PUT',
      data: data
    }).done(function(data) {
      //console.log($(this).);
      alert("step updated");
      window.location.href = '/';
    });
  });

  $('.delete-btn').click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');

    $.ajax({
      url: url,
      method: 'DELETE'
    }).done(function() {
      window.location.href = '/';
    });
  });
});


// move up/down function

$(".reorder-up").click(function(){
  var $current = $(this).closest('li');
  var $previous = $current.prev('li');
  var index = $current.index();
  if($previous.length !== 0){
      $current.insertBefore($previous);
      console.log(index - 1);
      return (index - 1);
  }
  return false;
  });

$(".reorder-down").click(function(){
  var $current = $(this).closest('li')
  var $next = $current.next('li');
  var index = $current.index();
  if($next.length !== 0){
    $current.insertAfter($next);
    console.log(index + 1);
    return (index + 1);
  }
  return false;
});




});
