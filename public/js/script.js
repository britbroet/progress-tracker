$(document).ready(function(){

//EDIT STEP IN TIMELINE
$(function() {
  $('.edit-form').submit(function(e) {
    e.preventDefault();
    var url = $(this).attr('action');
    var formData = $(this).serialize();
    console.log('formData: ' + formData);
    console.log('url: ' + url);
    console.log('this: ' + $(this));

    $.ajax({
      url: url,
      method: 'PUT',
      data: formData
    }).done(function(resultData) {
      //console.log($(this).);
      alert("step updated");
      window.location.href = '/';
    }); //end of done
  }); //end of ajax
});

// //DELETE STEP FROM TIMELINE (using button for testing)
//   $('.delete-btn').click(function(e) {
//     e.preventDefault();
//     var url = $(this).attr('href');

//     $.ajax({
//       url: url,
//       method: 'DELETE'
//     }).done(function() {
//       window.location.href = '/';
//     });
//   });
// });


//CHANGE STATUS
$(function() {
  $('.statusradio').click(function(e) {
    e.preventDefault();
    console.log('this parent: ' + $(this).parent().parent().parent().attr('action'));
    var url = $(this).parent().parent().parent().attr('action');
    var stepid = $(this).attr('name').substring(7);
    var formData = {stepid: stepid, status: $(this).attr('value')};
    console.log('stepid: ' + stepid);



    //$(this).serialize();



    console.log('formData: ' + formData);
    //console.log('url: ' + url);
    console.log('this: ' + $(this));
    console.log('test: ' + $(this)[0][0]);

    $.ajax({
      url: url,
      method: 'PUT',
      data: formData
    }).done(function(resultData) {
      //console.log($(this).);
      alert("step updated");
      //window.location.href = '/';
    }); //end of done
  }); //end of ajax
});







//MOVE STEP UP IN TIMELINE (change order of steps)
$(".reorder-up").click(function(){
  var $current = $(this).closest('li');
  var $previous = $current.prev('li');
  var index = $current.index();
  if($previous.length !== 0){
      $current.insertBefore($previous);
      var newIndex = index - 1;
      console.log(index - 1);
      console.log($current);
      console.log('new index: ' + newIndex);
      //return (index - 1);

      var url = $(this).attr('href');

      $.ajax({
        url: url,
        method: 'PUT',
        data: 'steppos=' + newIndex
      }).done(function(resultData) {
        alert("position updated");
        //window.location.href = '/';
      });
  }
  return false;
  });

//MOVE STEP DOWN (change order/position of steps)

$(".reorder-down").click(function(){
  var $current = $(this).closest('li')
  var $next = $current.next('li');
  var index = $current.index();
  if($next.length !== 0){
    $current.insertAfter($next);
    var newIndex = index + 1;
    //console.log(index + 1);
    //return (index + 1);
      var url = $(this).attr('href');

      $.ajax({
        url: url,
        method: 'PUT',
        data: 'steppos=' + newIndex
      }).done(function(resultData) {
        alert("position updated");
        //window.reload();
      });
  }
  return false;
});




});
