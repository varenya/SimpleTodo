Router.configure({
  layoutTemplate: 'main'
})

Router.route("/", {
  name: 'home',
  template: 'home'
});

Router.route("/lists/:_id", {
  name: 'listPage',
  template: 'listPage',
  data: function() {
    var currentList = this.params._id;
    return Lists.findOne({
      _id: currentList
    });
    //console.log("This is a list page");
  }
});

Router.route("/login");
Router.route("/register");



Todos = new Meteor.Collection("todos");
Lists = new Meteor.Collection("lists");
if (Meteor.isClient) {
  Template.todos.helpers({
    'todo': function() {
      //return Todos.find();
      var currentList = this._id;
      var currentUser = Meteor.userId();
      return Todos.find({
        createdBy: currentUser,
        listId: currentList
      }, {
        sort: {
          createdAt: -1
        }
      });
    }
  });
  Template.addTodos.events({
    "submit form": function(event) {
      event.preventDefault();
      console.log("inside submit");
      console.log(event);
      var todoName = $('[name="todoName"]').val();
      var currentUser = Meteor.userId();
      var currentList = this._id;
      console.log("todoName " + todoName);
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date(),
        createdBy: currentUser,
        listId: currentList
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
      var currentList = this._id;
      return Todos.find({
        listId: currentList
      }).count();
    },
    'completedTodos': function() {
      var currentList = this._id;
      return Todos.find({
        listId: currentList,
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
  Template.addLists.events({
    "submit form": function(event) {
      event.preventDefault();
      var listName = $('[name=listName]').val();
      var currentUser = Meteor.userId();
      Lists.insert({
        name: listName,
        createdBy: currentUser
      }, function(errors, results) {
        // body...
        Router.go('listPage', {
          _id: results
        });
      });
      $('[name=listName]').val('');
    }
  });
  Template.lists.helpers({
    'lists': function() {
      var currentUser = Meteor.userId();
      return Lists.find({
        createdBy: currentUser
      }, {
        sort: {
          name: 1
        }
      })
    }
  });
  Template.register.events({
    "submit form": function(event) {
      event.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();

      Accounts.createUser({
        email: email,
        password: password

      }, function(error) {
        if (error) {
          console.log(error.reason);
        } else {
          Router.go('home');
        }
      });
    }
  });

  Template.navigation.events({
    "click .logout": function(event) {
      event.preventDefault();
      Meteor.logout();
      Router.go('login');
    }
  });

  Template.login.events({
    "submit form": function(event) {
      event.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error) {

        if (error) {
          console.log("Reason.." + error.reason);
        } else {
          Router.go('home');
        }
      });
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
