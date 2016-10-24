$(document).ready(function(){


// DELETE TIMELINE
$('.delete-timeline').click(function(e) {
  e.preventDefault();
  var timelineId = $(this).attr('data-timeline');
  var url = $(this).attr('href');
  //console.log('timeline id: ' + timelineId);

  $.ajax({
    url: url,
    method: 'DELETE'
  }).done(function() {
    //console.log("$(this).attr('data-timeline'): " + timeline);
    window.location.href = '/timeline/all';
  });
});


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



//CHANGE STATUS
$(function() {
  $('.statusradio').click(function(e) {
    e.preventDefault();
    console.log('this parent: ' + $(this).parent().parent().attr('action'));
    var url = $(this).parent().parent().attr('action');
    var stepid = $(this).attr('name').substring(7);
    var formData = {stepid: stepid, status: $(this).attr('value')};

    $.ajax({
      url: url,
      method: 'PUT',
      data: formData
    }).done(function(resultData) {
      window.location.href = '/timeline/all';
    }); //end of done
  }); //end of ajax
});







//MOVE STEP UP IN TIMELINE (change order of steps)
$(".reorder-up").click(function(){
  console.log('firing');
  var $current = $(this).closest('li');
  var $previous = $current.prev('li');
  var index = $current.index();
  console.log($current);
  console.log($previous);
  console.log('index: ' + index);
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



// DELETE STEP

$('.delete-btn').click(function(e) {
  e.preventDefault();
  var url = $(this).attr('href');
  var timeline = $(this).attr('data-timeline');

  $.ajax({
    url: url,
    method: 'DELETE'
  }).done(function() {
    console.log("$(this).attr('data-timeline'): " + timeline);
    window.location.href = '/timeline/' + timeline;
  });
});





// test stuff - THIS CHANGES COLORS OF THINGS IN SHARE VIEW BASED ON STATUS
// $("#5").addClass("huzzah");

// var statusView = function() {
//   console.log('firing');
//   var target = $(".stepui");
//   if (target.hasClass("1")) {
//     target.addClass("huzzah1").removeClass('huzzah2').removeClass('huzzah3');
//   }
//   else if (target.hasClass("2")) {
//     target.addClass("huzzah2").removeClass('huzzah1').removeClass('huzzah3');
//   }  
//   else if (target.hasClass("3")) {
//     target.removeClass('huzzah2').removeClass('huzzah1').addClass("huzzah3");
//   }
// }


var statusView = function() {
  $('.1').addClass('toDo').append('<div class="stepuiText">To Do</div>');
  $('.2').addClass('inProgress').append('<div class="stepuiText">In<br>Progress</div>');
  $('.3').addClass('complete').append('<div class="stepuiText">Complete</div>');
}



statusView();


// EDIT TIMELINE INFO (NAME/DESCRIPTION)
$(function() {
  $('.edit-form-info').submit(function(e) {
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



// STEPS TOGGLE FUNCTION

    $('.expandButton').click(function(){
        //var thisid = $(this).attr('id');
        var thisid = $(this).attr('data-timeline');
        //console.log('stepContainer: ' + stepContainerId);
        console.log('thisid - expand: ' + thisid);
        $('#updateContainer' + thisid).toggle("blind", 500);
        $('#expand' + thisid).hide();
        $('#retract' + thisid).removeClass('hideRetract');
        $('#retract' + thisid).show();
    });

    $('.retractButton').click(function(){
        var thisid = $(this).attr('data-timeline');
        console.log('thisid - retract: ' + thisid);
        $('#updateContainer' + thisid).toggle("blind", 500);
        $('#retract' + thisid).hide();
        $('#expand' + thisid).show();
    });



// LOGIN STUFF

// if (!currentUser) {
//   $('.loggedIn header').hide();
// }





});
