Todos = new Meteor.Collection("todos");
if (Meteor.isClient) {
  Template.todos.helpers({
    'todo': function() {
      return Todos.find();
    }
  });
  Template.addTodos.events({
    "submit form": function(event) {
      event.preventDefault();
      console.log("inside submit");
      console.log(event);
      var todoName = $('[name="todoName"]').val();
      console.log("todoName " + todoName);
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date()
      });
      $('[name="todoName"]').val('');

    }
  });
  Template.todos.events({
    "click .delete-item": function(event) {
      event.preventDefault();
      var documentId = this._id;
      Todos.remove({
        _id: documentId
      });

    }
  });

  Template.todoCount.helpers({
    'totalTodos': function() {
      return Todos.find().count();
    },
    'completedTodos': function() {
      return Todos.find({
        completed: true
      }).count();

    }
  });

  Template.todoItem.events({
    "keyup [name='todoItem']": function(event) {
      event.preventDefault();
      if (event.which == 13 || event.which == 27) {
        $(event.target).blur();

      } else {
        var todoItem = $(event.target).val();
        var documentId = this._id;
        Todos.update({
          _id: documentId
        }, {
          $set: {
            name: todoItem
          }
        });
      }

    },
    "change [type=checkbox]": function(event) {
      var documentId = this._id;
      var isCompleted = this.completed;
      if (isCompleted) {
        Todos.update({
          _id: documentId
        }, {
          $set: {
            completed: false
          }
        });
        console.log("task marked incomplete");
      } else {
        Todos.update({
          _id: documentId
        }, {
          $set: {
            completed: true
          }
        });
        console.log("task marked completed");
      }
    }
  });

  Template.todoItem.helpers({
    'checked': function() {
      // body...
      var isChecked = this.completed;
      if (isChecked) {
        return "checked";
      } else {
        return "";
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
