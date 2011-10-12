$(document).ready(function () {
});


$(function() {
	taskContainer		= $('#tasks');
	taskInput				= taskContainer.find('.header input');
	
	authURL = "https://accounts.google.com/o/oauth2/auth?client_id=487169820789-v9cf4do2q2vcn7cu0gjvd302s0hjkdic.apps.googleusercontent.com&redirect_uri=http://www.loganallred.com/sort2011/tasks/&scope=https://www.googleapis.com/auth/tasks&response_type=token";
	
	accessToken = "accessToken=ya29.AHES6ZTX4s8KwEki8j7zHmY-gUNCDM-Ykvl1uUevcVdA14ZvoHD9";
	taskListId = "MTMwMzgzNzY1NDY3MjY5ODg2OTE6MTM3NjQzMTUwNjow";
//	listURL = "https://www.googleapis.com/tasks/v1/lists/"+taskListId+"/tasks?"+accessToken+"&callback=?";
//	createURL = "https://www.googleapis.com/tasks/v1/lists/"+taskListId+"/tasks?"+accessToken+"&callback=?";
//	editURL = "https://www.googleapis.com/tasks/v1/lists/"+taskListId+"/tasks/{taskid}?"+accessToken+"&callback=?";
//	deleteURL = "https://www.googleapis.com/tasks/v1/lists/"+taskListId+"/tasks/{taskid}?"+accessToken+"&callback=?";
	
	function getListURL() {
	  return "https://www.googleapis.com/tasks/v1/lists/"+taskListId+"/tasks?"+accessToken+"&callback=?";
  }

  function getCreateURL() {
    var url = "https://www.googleapis.com/tasks/v1/lists/"+taskListId+"/tasks?"+accessToken;
    return "proxy.php?url="+encodeURI(url);
  }
  
  function getTaskURL(taskid) {
    var url = "https://www.googleapis.com/tasks/v1/lists/"+taskListId+"/tasks/"+taskid+"?"+accessToken;
    return "proxy.php?url="+encodeURI(url);
  }

	Tasks = {
		handlers: function() {
			
			// Input handler
			taskInput.keydown(function(event) {
				if (event.keyCode == 13 && event.shiftKey == 0) {
					Tasks.insert(taskInput.val());
					taskInput.val('');
					return false;
				}
			});

      // Edit handler
      taskContainer.find('ul li input.edit').live('keydown', function(event) {
      	if (event.keyCode == 13 && event.shiftKey == 0) {
      		Tasks.save($(this));
      		taskInput.val('');
      		return false;
      	}
      });
			
			// Remove task
			taskContainer.find('ul li input.mark-as-done').live('click', function() {
				var id = $(this).data('id');
				Tasks.delete(id);
			});

      // Edit task
      taskContainer.find('ul li span.task').live('click', function() {
        var textarea = '<span><input type="text" class="edit" data-id="'+$(this).data("id")+'" value="' + $(this).html() + '"></input><span>';
        var revert = $(this).html();
        $(this).after(textarea).remove();
       
        $(textarea).find("input").change(function(event) {
        	if (event.keyCode == 13 && event.shiftKey == 0) {
        		Tasks.save(function() {
        			Tasks.loadTasks();
        		});
        		taskInput.val('');
        		return false;
        	}
        });
      });
		},
		
		saveChanges: function(obj, cancel) { 
      if (!cancel) {
         var t = $(obj).parent().siblings(0).val();
         // ...
         $.post("test2.php",{content: t},function(txt){
            alert(txt);
          });
      }
 		},
		
		insert: function(val) {
			// todo
      alert("insert"+val);
$.ajax({
  url: getCreateURL(),
  contentType: "application/json",
  data: JSON.stringify({
    title: val
  }),
  type: "POST",
  success: function(){Tasks.loadTasks()}
});

		},
		
		delete: function(id) {
			// todo
      alert("delete"+id);
$.ajax({
  url: getTaskURL(id),
  type: "DELETE",
  success: function(){Tasks.loadTasks()}
});
		},
		
		save: function(input) {
			// todo
      alert("save"+input.data("id")+input.val());
			var id = input.data("id");
			var val = input.val();
      $.ajax({
        url: getTaskURL(id),
        contentType: "application/json",
        data: {
          "title": val,
          "id": id
        },
        type: "PUT",
        success: function(){Tasks.loadTasks()}
      });
		},
		
		// Retrieve tasks from localStorage and append them to html
		loadTasks: function() {
if (window.location.hash.indexOf("access_token") >= 0) {
  accessToken = window.location.hash.replace("#","");
  window.location.hash = "";
  }
		
			taskContainer.find('ul').html('');
			var url = getListURL();
			$.getJSON(url, function(data, status, req) {
			console.log(status+req.statusCode);
			if (data && data.items) {
			  
			  $.each(data.items, function (i, item) {
			    Tasks.appendTask({
			      id: item.id,
			      message: item.title
		      });
          
			  });
			} else {
			if (data && data.error && data.error.code == 401) {
			  $("<a>Login to see your tasks</a>").attr("href", authURL).appendTo("#tasks");
			  } else {
			  alert("could not read tasks");
			  }
		  }
			  
			});
			
		},
		
		// Append to html a new task
		appendTask: function(task) {
			html = '';
			html += '<li>';
			html += ' <input type="checkbox" data-id="' + task.id + '" class="mark-as-done"></input> ';
			html += ' <span class="task" data-id="' + task.id + '">';
			html += task.message;
			html +=	 '	</span>';
			html +=	 '</li>';
			taskContainer.find('ul').append(html);
		}
	};
	
	// Start up
	Tasks.handlers();
	Tasks.loadTasks();
});