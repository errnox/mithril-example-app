// Helpers

var h = {};
h.fadesIn = function(element, isInitialized, context) {
  if (!isInitialized) {
    $(element).hide();
    $(element).fadeIn();
  }
};


//-------------------------------------------------------------------------
// App

//this application only has one component: todo
var todo = {};

//for simplicity, we use this component to namespace the model classes

//the Todo class has two properties
todo.Todo = function(data) {
  this.description = m.prop(data.description);
  this.done = m.prop(false);
};

//the TodoList class is a list of Todo's
todo.TodoList = Array;

//the view-model tracks a running list of todos,
//stores a description for new todos before they are created
//and takes care of the logic surrounding when adding is permitted
//and clearing the input after adding a todo to the list
todo.vm = (function() {
  var vm = {}
  vm.init = function() {
    //a running list of todos
    vm.list = new todo.TodoList();

    //a slot to store the name of a new todo before it is created
    vm.description = m.prop("");

    //adds a todo to the list, and clears the description field for user convenience
    vm.add = function(e) {
      if (vm.description()) {
        vm.list.push(new todo.Todo({description: vm.description()}));
        vm.description("");
      }
    };

    vm.colorValue = m.prop(['blue', '#0000FF']);

    vm.isEditable = m.prop(false);

    vm.redrawCount = 0;

    vm.selectableCountries = m.prop([
      {key: 'United States', value: 'USA'},
      {key: 'Canada', value: 'CA'},
      {key: 'Great Britain', value: 'GB'},
      {key: 'New Zealand', value: 'NZ'},
      {key: 'Australia', value: 'AU'},
      {key: 'Japan', value: 'JP'},
      {key: 'China', value: 'CH'},

      {key: 'United States', value: 'USA'},
      {key: 'Canada', value: 'CA'},
      {key: 'Great Britain', value: 'GB'},
      {key: 'New Zealand', value: 'NZ'},
      {key: 'Australia', value: 'AU'},
      {key: 'Japan', value: 'JP'},
      {key: 'China', value: 'CH'},

      {key: 'United States And Maybe Some Other Countries', value: 'USA'},

      {key: 'United States', value: 'USA'},
      {key: 'Canada', value: 'CA'},
      {key: 'Great Britain', value: 'GB'},
      {key: 'New Zealand', value: 'NZ'},
      {key: 'Australia', value: 'AU'},
      {key: 'Japan', value: 'JP'},
      {key: 'China', value: 'CH'},
    ]);
    vm.preSelectedCountry = m.prop(2);
    vm.selectedCountry =
      m.prop(vm.selectableCountries()[vm.preSelectedCountry()].value);

    vm.selectableRoles = m.prop([
      {key: 'MGR', value: 'Manager'},
      {key: 'HR', value: 'Human Resources'},
      {key: 'ENG', value: 'Engineer'},
      {key: 'LAB', value: 'Laboratory'},
    ]);
    vm.preSelectedRole = m.prop(1);
    vm.selectedRole =
      m.prop(vm.selectableRoles()[vm.preSelectedRole()].value);


    vm.preSelectedSeconds = m.prop(3);
    vm.selectedSeconds = m.prop(null);

    vm.editableText = m.prop('This text is editable.');

    vm.fullWidth = m.prop(m.route.param('width') == 'full') ||
      m.prop(false);

    vm.numberOfStars = m.prop(5);
    vm.starsProgress = m.prop(3);

    // vm.handleGlobalKeypresses = function() {
    //   console.log(e.keyCode);  // DEBUG
    // };
    //
    // $(document).on('keypress', function(e) {
    //   console.log(e.target);  // DEBUG
    //   if (e.target == document.body) {
    // 	if (e.key == 'j') {
    //       $(document).scrollTop($(document).scrollTop() + 200);
    // 	}
    // 	if (e.key == 'k') {
    //       $(document).scrollTop($(document).scrollTop() - 200);
    // 	}
    //   } else {
    // 	m.redraw.strategy('none');
    //   }
    // });
  }
  return vm
}())

//the controller defines what part of the model is relevant for the current page
//in our case, there's only one view-model that handles everything
todo.controller = function() {
  todo.vm.init()
}

//here's the view
todo.view = function() {
  return m("html", {config: countRedraws}, [
    m("body", [
      m.component(headerComponent, {title: 'Home', links: [
        m('a[href="/dashboard/Anna"].link--underlined', {config: m.route}, 'Anna'),
        m('a[href="/dashboard/Anna"].link--underlined', {config: m.route}, 'Steve'),
        m('a[href="/dashboard/Anna"].link--underlined', {config: m.route}, 'Marley'),
      ]}),
      m('.container-fluid.bgDarker.panel-body', [
        m('.container', [
          m('.row', [
            m('.col.col-md-9', [
              m('p', 'Hello there!'),
            ]),
            m('.col.col-md-3', [
	      m('input[type="text"].form-control', {placeholder: 'Search'}),
            ]),
          ]),
        ]),
      ]),
      m('.panel-body'),

      m('.container', [
        m('.row', [
          m('.col',
            {'class': todo.vm.fullWidth() ? 'col-md-12' :
             'col-md-4 col-md-offset-4'}, [
               m('.pull-right', [
		 m('label.chbox', [
                   m('input[type="checkbox"]',
                     {onclick: m.withAttr('checked', todo.vm.fullWidth),
                      checked: todo.vm.fullWidth()}),
                   ' Full width',
		 ])
		 ,
               ]),

               m('ul.list-inline', [
		 m('li', [m('a[href="/dashboard/John"].link--underlined',
                            {config: m.route}, 'John')]),
		 m('li', [m('a[href="/dashboard/Pete"].link--plain',
                            {config: m.route}, 'Pete')]),
		 m('li', [m('a[href="/dashboard/Andrew/?n=30"].link-muted',
                            {config: m.route}, 'Andrew')]),
               ]),

               m('hr'),
               m('div.well.well-sm', [
		 m('span', 'Redraws: '),
		 m('strong', todo.vm.redrawCount),
               ]),

               m('hr'),
               m.component(slideDownComponent,
                           {hidden: false,
                            description: 'Slide Down',
                            content: m('span', 'Here is some info.')}),

               m.component(slideDownComponent,
                           {hidden: true,
                            description: 'Other Slide',
                            content: m('span', 'Here is ', [
                              m('strong', 'some more'),
                            ],  ' info.')}),

               m('hr'),
               m('strong', 'Value: '),
               m('code', todo.vm.colorValue()[1]),
               m('span', ' '),
               m('strong', 'Name: '),
               m('span', {style: {color: todo.vm.colorValue()[1]}},
		 todo.vm.colorValue()[0]),
               m('.panel-body'),
               m.component(selectorComponent,
                           {items: [
                             ['red', '#FF0000'],
                             ['green', '#00FF00'],
                             ['blue', '#0000FF'],
                             ['yellow', '#FFFF00'],
                             ['cyan', '#00FFFF'],
                           ],
                            selected: 2,
                            variable: todo.vm.colorValue}),

               m('hr'),

               m('span', 'Editable: '),
               m('strong', todo.vm.isEditable()),
               m('.panel-body'),
               m('input[type="text"].form-control',
		 {value: 'This text input field is ' +
		  (todo.vm.isEditable() ? '' : 'not ') + 'editable.',
		  disabled: !todo.vm.isEditable()}),
               m('.panel-body'),
               m.component(checkboxComponent,
                           {label: 'Editable',
                            checked: todo.vm.isEditable}),

               m('hr'),
               m('span', [
                 'Country: ',
                 m('strong', todo.vm.selectedCountry()),
               ]),
               m('.panel-body'),
               m.component(inlineSelector, {
                 items: todo.vm.selectableCountries,
                 selected: todo.vm.preSelectedCountry(),
                 variable: todo.vm.selectedCountry,
                 titles: true}),

               m('hr'),
               m('span', [
		 'Role: ',
		 m('strong', todo.vm.selectedRole()),
               ]),
               m('.panel-body'),
               m.component(selectGroup, {
		 items: todo.vm.selectableRoles,
		 selected: todo.vm.preSelectedRole(),
		 justified: true,
		 variable: todo.vm.selectedRole,
		 titles: true}),

               m('hr'),
	       m('span', [
		 'Seconds: ',
		 m('strong', todo.vm.selectedSeconds() == null ?
		   'Please select first.' : todo.vm.selectedSeconds()),
	       ]),
	       m('.panel-body'),
	       m.component(scaleSelector, {
		 start: m.prop(20),
		 step: m.prop(11),
		 stop: m.prop(133),
		 suffix: m.prop('s'),
		 selected: todo.vm.preSelectedSeconds,
		 variable: todo.vm.selectedSeconds,
	       }),
	       m('.panel-body'),

	       m('button.btn.btn-default', {
		 onclick: function() {
		   todo.vm.preSelectedSeconds(1);
		 }
	       }, 'Select the second second value'),

	       m('.panel-body'),
	       m('input[type="text"].form-control', {
		 oninput: m.withAttr('value', todo.vm.preSelectedSeconds),
		 value: todo.vm.preSelectedSeconds(),
		 placeholder: 'Seconds',
	       }),

               m('hr'),
	       m.component(floatingBoxComponent, {
		 trigger: m('button.btn.btn-link.js-trigger', 'Edit'),
		 body: m('div', [
		   m('h4', 'Edit Something'),
		   m('p', 'This is some text.'),
		   m('button.btn.btn-block.btn-default.js-dismiss',
		     'Cancel'),
		 ])
	       }),

	       m('hr'),
	       m.component(floatingBoxComponent, {
		 trigger: m('button.btn.btn-link', [
		   todo.vm.editableText(),
		   m('span', ' '),
		   m('span.fa.fa-fw.fa-pencil.text-primary'),
		 ]),
		 body: m('div.form-inline', [
		   m('input.form-control', {
		     oninput: m.withAttr('value', todo.vm.editableText),
		     value: todo.vm.editableText()}),
		   m('button.btn.btn-default.js-dismiss', 'Done'),
		 ])
	       }),

	       m('hr'),
	       m.component(floatingBoxComponent, {
		 trigger: m('button.btn.btn-link.js-trigger',
			    'Do something'),
		 body: m('div', [
		   m('p', 'Do something'),
		   m('button.btn.btn-block.btn-link.js-dismiss', 'Cancel'),
		 ])
	       }),


               m('hr'),
	       m.component(floatingBoxComponent, {
		 trigger: m('button.btn.btn-link.js-trigger', 'Menu'),
		 body: m('.row', [
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss', 'Edit')
		   ]),
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss', 'Save')
		   ]),
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss', 'Info')
		   ]),
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss', 'Share')
		   ]),
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss', 'Send')
		   ]),
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss', 'Add')
		   ]),
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss', 'More')
		   ]),
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss', 'Close')
		   ]),
		   m('.col.col-xs-4', [
		     m('button.btn.btn-block.btn-link.js-dismiss','Cancel')
		   ]),
		 ])
	       }),

               m('hr'),
	       m.component(sideModalComponent, {
		 trigger: m('button.btn.btn-link', 'Show the modal'),
		 body: m('div', [
		   m('h2', 'Sample Modal'),
		   m('p', 'This is an modal.'),
		   m('button.btn.btn-default.js-dismiss', 'Got it!')
		 ]),
		 hidden: m.prop(true),
	       }),
	       m('.panel-body'),
	       m.component(sideModalComponent, {
		 trigger: m('button.btn.btn-default',
			    'Show another modal'),
		 body: m('div', [
		   m('.jumbotron', [
		     m('h2', 'Another Modal'),
		     m('p', 'Here it is!'),
		     m('p', 'Want a list? Here you go:'),
		     m('ul', [
		       m('li', 'Apple'),
		       m('li', 'Banana'),
		       m('li', 'Strawberry'),
		       m('li', 'Pear'),
		       m('li', 'Melon'),
		     ]),
		   ]),
                   m('center', [
                     m('button.btn.btn-lg.btn-primary.js-dismiss',
                       'Got that!')
                   ])
		 ]),
		 hidden: m.prop(true),
	       }),

               m('hr'),
	       m.component(starsComponent, {
		 n: todo.vm.numberOfStars,
		 position: todo.vm.starsProgress,
	       }),
	       m('.panel-body'),
	       m.component(scaleSelector, {
		 start: m.prop(0),
		 step: m.prop(1),
		 stop: m.prop(todo.vm.numberOfStars()),
		 selected: todo.vm.starsProgress,
		 variable: todo.vm.numberOfStars,
	       }),

               m('hr'),
	       m('.squareMenu', [
		 m('a[href="#"].squareMenuButton', 'Edit'),
		 m('a[href="#"].squareMenuButton', 'Info'),
		 m('a[href="#"].squareMenuButton', 'Delete'),

		 m('a[href="#"].squareMenuButton', 'Left'),
		 m('a[href="#"].squareMenuButton', 'Center'),
		 m('a[href="#"].squareMenuButton', 'Right'),

		 m('a[href="#"].squareMenuButton', 'Billing'),
		 m('a[href="#"].squareMenuButton', 'Contacts'),
		 m('a[href="#"].squareMenuButton', 'About'),
	       ]),

               m('hr'),
               // m('button.btn.btn-default', 'Button'),
               // m('span', ' '),
               // m('button.btn.btn-primary', 'Button'),
               // m('span', ' '),
               // m('button.btn.btn-secondary', 'Button'),
               // m('hr'),
               // m('button.btn.btn-success', 'Button'),
               // m('span', ' '),
               // m('button.btn.btn-warning', 'Button'),
               // m('span', ' '),
               // m('button.btn.btn-danger', 'Button'),
               // m('hr'),
               // m('button.btn.btn-link', 'Button'),
               // m('hr'),

               // m('.btn-group', [
               //   m('button.btn.btn-default', 'Button'),
               //   m('button.btn.btn-default', 'Button'),
               //   m('button.btn.btn-default', 'Button'),
               // ]),
               // m('hr'),

               // m('.panel.panel-default', [
               //   m('.panel-heading', [
               //  m('strong', 'Default Panel'),
               //   ]),
               //   m('.panel-body', [
               //  m('p', 'This is a panel.'),
               //   ]),
               // ]),
               // m('hr'),


	       m('hr'),
	       m('.form-group', [
		 m('.inlineLabels', [
                   m('label', 'First Name'),
                   m('input[type="text"].form-control', {
                     placeholder: 'John'
                   }),
		 ]),
		 m('.panel-body'),
		 m('.inlineLabels', [
                   m('label', 'Last Name'),
                   m('input[type="text"].form-control', {
                     placeholder: 'Doe'
                   }),
		 ]),
		 m('.panel-body'),
		 m('.inlineLabels', [
                   m('label', 'Age'),
                   m('input[type="text"].form-control'),
		 ]),
		 m('.panel-body'),
		 m('.inlineLabels', [
                   m('label', 'Email'),
                   m('input[type="text"].form-control'),
		 ]),
		 m('.panel-body'),
		 m('.inlineLabels', [
                   m('label', 'Color'),
                   m('input[type="text"].form-control'),
		 ]),
	       ]),

	       m('hr'),
               m('.input-group.input-group--separated', [
                 m("input[tpe=text].form-control",
                   {oninput: m.withAttr("value", todo.vm.description),
                    value: todo.vm.description()}),
                 m('.input-group-btn', [
                   m("button.btn.btn-default",
                     {onclick: todo.vm.add}, "Add"),
                 ]),
               ]),

	       m('hr'),
               m('form', {onsubmit: todo.vm.add}, [
		 m('.input-group', [
                   m("input[tpe=text].form-control",
                     {oninput: m.withAttr("value", todo.vm.description),
                      value: todo.vm.description()}),
                   m('.input-group-btn', [
                     m("button.btn.btn-default.btnWide",
                       {onclick: todo.vm.add}, "Add"),
                   ]),
		 ]),
               ]),

               m(".list-group", [
		 todo.vm.list.map(function(task, index) {
                   return m(".list-group-item", [
                     m("input[type=checkbox]",
                       {onclick: m.withAttr("checked", task.done),
			checked: task.done()}),
                     m('span', '    '),
                     m("span",
                       {style: {textDecoration: task.done() ?
				"line-through" : "none"}},
                       task.description()),
                   ])
		 })
               ]),
               todo.vm.list.length > 0 ?
		 m('row', [
                   m('.col.col-md-12', [
                     m('center', [
                       m('small.text-muted', [
			 m('em', 'Todos: ' + todo.vm.list.length),
                       ]),
                     ]),
                   ]),
		 ]) : null,
             ]),
        ]),
      ]),
    ])
  ]);
};

//initialize the application
// m.mount(document, {controller: todo.controller, view: todo.view});


//-------------------------------------------------------------------------

var headerComponent = {
  view: function(ctrl, args) {
    return m('.container', {config: h.fadesIn}, [
      m('.row', [
        m('.col.col-md-12.text-muted', [
          m('.panel-body'),
          m('span', [
            m('a[href="/"].link--underlined', {config: m.route}, [
              m('strong', 'Website'),
            ]),
            m('span.text-muted', ' | '),
          ], args.title),
	  m('small.text-muted', '   -   ' + m.route()),
          m('.pull-right', [
            m('ul.list-inline', [
              args.links ? args.links.map(function(link) {
                return m('li', [
                  link,
                ]);
              }) : null,
            ]),
          ]),
          m('hr'),
        ]),
      ]),
    ])
  }
};


//-------------------------------------------------------------------------

var dashboard = {
  controller: function() {
    var ctrl = this;
    ctrl.id = m.route.param('userID');
    ctrl.n = m.prop(parseInt(m.route.param('n')));
    ctrl.numbers = m.prop([]);
    for (var i = 0; i < ctrl.n(); i++) {
      ctrl.numbers().push(i + 1);
    }
  },
  view: function(ctrl) {
    return m('div', [
      m.component(headerComponent, {title: 'Dashboard', links: [
        m('a[href="/"].link--underlined', {config: m.route}, 'Homepage'),
      ]}),
      m('.container', [
        m('.row', [
          m('.col.col-md-12', [
            m('.panel-body'),
            m("a[href='/']", {config: m.route}, m.trust('&lsaquo; Home')),
            m(".panel-body"),
            m("div", ctrl.id),
          ]),
        ]),
	m('.row', [
	  m('.col.col-md-12', [
	    m('ul.list-inline', [
              ctrl.numbers().map(function(item, idx) {
		return m('li', item);
              }),
	    ]),
	  ]),
	])
      ]),
    ]);
  }
};


//-------------------------------------------------------------------------

var slideDownComponent = {
  controller: function(args) {
    var that = this;
    that.hidden = m.prop(args.hidden);
    that.description = m.prop(args.description || '');
    that.content = m.prop(args.content || '');
    that.toggleHidden = function(e) {
      e.preventDefault();
      that.hidden(!that.hidden());
    }
  },
  view: function(ctrl) {
    return m('.list-group', [
      m('a.list-group-item.bgDarker',
        {onclick: ctrl.toggleHidden,
         href: '#'},
        ctrl.description(), [
          m('.pull-right.text-muted', '+'),
        ]),
      ctrl.hidden() ? null : m('.list-group-item', ctrl.content()),
    ])
  },
};


//-------------------------------------------------------------------------

var selectorComponent = {
  controller: function(args) {
    var that = this;
    that.items = m.prop(args.items ||  []);
    that.selectedItem = m.prop(that.items()[args.selected]);
    that.selected = m.prop(args.selected);
    that.variable = args.variable;
    that.hidden = m.prop(true);
    that.select = function(idx) {
      that.variable(that.items()[idx]);
      that.selectedItem(that.items()[idx]);
      that.selected(idx);
      that.hidden(true);
    };
    that.toggle = function() {
      that.hidden(!that.hidden());
    };
    that.hide = function() {
      that.hidden(true);
    };
  },
  view: function(ctrl) {
    return m('.dropdown', [
      m('button.btn.btn-default.btnWide.dropdown-toggle',
        {'data-toggle': 'dropdown', onclick: ctrl.toggle},
        ctrl.selectedItem()[0] + ' ', [
          m('span.caret'),
        ]),
      m('.backdrop--clear', {
	onclick: ctrl.hide,
	'class': ctrl.hidden() ? 'hidden' : 'show'
      }),
      m('ul.dropdown-menu', {'class': ctrl.hidden() ? 'hidden' : 'show'}, [
        ctrl.items().map(function(item, idx) {
          return m('li', [
            idx != ctrl.selected() ?
              m('a', {href: '#', onclick: function(e) {
                e.preventDefault(); ctrl.select(idx);}}, item[0]) : null
          ]);
        })
      ]),
    ]);
  },
};


//-------------------------------------------------------------------------

var checkboxComponent = {
  controller: function(args) {
    var that = this;
    that.checked = args.checked;
    that.label = m.prop(args.label);
    that.toggle = function() {
      that.checked(!that.checked());
    }
  },
  view: function(ctrl) {
    return m('button.btn.btn--blank', {onclick: ctrl.toggle,}, [
      ctrl.checked() ?
        m('.span.fa.fa-fw.fa-check.text-muted') :
        m('.span.fa.fa-fw.fa-square-o.text-muted')
    ], ' ' + ctrl.label());
  }
};


//-------------------------------------------------------------------------

var countRedraws = function(elm, isInit, ctx) {
  if (!isInit) {
    ctx.count = 0;
  }
  todo.vm.redrawCount = ctx.count++;
};


//-------------------------------------------------------------------------

var inlineSelector = {
  controller: function(args) {
    var ctrl = this;
    ctrl.selected = m.prop(args.selected);
    ctrl.select = function(idx) {
      ctrl.selected(idx);
      args.variable(args.items()[ctrl.selected()].value);
    };
  },
  view: function(ctrl, args) {
    return m('.row', [
      args.items().map(function(item, idx) {
        return m('button.btn.inlineSelectorbutton',
                 {onclick: function(e) {
                   e.preventDefault(); ctrl.select(idx);
                 },
                  'class': ctrl.selected() == idx ?
                  'btn-primary disabled' : 'btn-default',
                  'title': args.titles ? item.key : '',
                 }, [
                   ctrl.selected() == idx ?
                     m('span.fa.fa-fw.fa-check.fa-inverse') : null,
                   item.key
                 ]);
      })
    ]);
  },
}


//-------------------------------------------------------------------------

var selectGroup = {
  controller: function(args) {
    var ctrl = this;
    ctrl.selected = m.prop(args.selected);
    ctrl.select = function(idx) {
      ctrl.selected(idx);
      args.variable(args.items()[ctrl.selected()].value);
    };
  },
  view: function(ctrl, args) {
    return m('.btn-group',
             {'class': args.justified ? 'btn-group-justified': null}, [
               args.items().map(function(item, idx) {
                 var btn = m('button.btn',
                             {onclick: function(e) {
                               e.preventDefault(); ctrl.select(idx);
                             },
                              'class': ctrl.selected() == idx ?
                              'btn-primary disabled' : 'btn-default',
                              'title': args.titles ? item.key : '',
                             } , item.key);
                 if (args.justified) {
                   return m('.btn-group', [btn]);
                 } else {
                   return btn;
                 }
		 return btn;
               })
             ]);
  },
}


//-------------------------------------------------------------------------

var scaleSelector = {
  controller: function(args) {
    var ctrl = this;
    ctrl.items = m.prop([]);
    ctrl.prefix = args.prefix || m.prop('');
    ctrl.suffix = args.suffix || m.prop('');
    for (var i = args.start(); i <= args.stop(); i += args.step()) {
      ctrl.items().push(i);
    };
    ctrl.select = function(idx) {
      args.selected(idx);
      args.variable(ctrl.items()[args.selected()]);
    };
  },
  view: function(ctrl, args) {
    return m('.btn-group', [
      ctrl.items().map(function(item, idx) {
        return m('button.btn',
                 {'class': idx == args.selected() ?
                  'btn-primary disabled' : 'btn-default',
                  onclick: function() {
                    ctrl.select(idx);
                  }}, ctrl.prefix() + item + ctrl.suffix());
      }),
    ]);
  }
};


//-------------------------------------------------------------------------

// var textInputComponent = {
//   controller: function(args) {
//     var ctrl = this;
//     ctrl.value = m.prop();
//     if (args.value() != ctrl.value()) {
//       console.log(ctrl.value());  // DEBUG
//       ctrl.value(args.value());
//     }
//   },
//   view: function(ctrl, args) {
//     return m('input[type="text"].form-control', {
//       onchange: m.withAttr('value', ctrl.value),
//       value: args.value(),
//     });
//   },
// }


//-------------------------------------------------------------------------

var sideModalComponent = {
  controller: function(args) {
    var ctrl = this;
    ctrl.isHidden = args.hidden || m.prop(true);
    ctrl.show = function(e) {
      e.preventDefault();
      ctrl.isHidden(false);
    };
    ctrl.hide = function(e) {
      e.preventDefault();
      ctrl.isHidden(true);
    };
    ctrl.dismiss = function(e) {
      if ($(e.target).hasClass('js-dismiss')) {
      	ctrl.hide(e);
      }
    };
  },
  view: function(ctrl, args) {
    return m('span', [
      m('span', {onclick: ctrl.show}, [
	args.trigger
      ]),
      ctrl.isHidden() ? null :  m('.sideModal', [
        m('.sideModal-backdrop', {onclick: ctrl.hide}),
        m('.sideModal-body', {onclick: ctrl.dismiss}, [
          m('h3', [
            m('a[href="#"].link--plain.pull-right', {onclick: ctrl.hide},
	      m.trust('&times;')),
          ]),
          m('.panel-body'),
          args.body,
        ]),
      ]),
    ]);
  }
};


//-------------------------------------------------------------------------

var floatingBoxComponent = {
  controller: function(args) {
    var ctrl = this;
    ctrl.hidden = m.prop(true);
    ctrl.hide = function() {
      ctrl.hidden(true);
    };
    ctrl.show = function(e) {
      e.preventDefault();
      ctrl.hidden(false);
    };
    ctrl.dismiss = function(e) {
      if ($(e.target).hasClass('js-dismiss')) {
	ctrl.hide(e);
      }
    };
  },
  view: function(ctrl, args) {
    return m('div', [
      m('.backdrop--clear', {
	onclick: ctrl.hide,
	'class': ctrl.hidden() ? 'hidden' : 'show'
      }),
      m('span', {onclick: ctrl.show}, [
	args.trigger
      ]),
      ctrl.hidden() ? null : m('div.floatingBox.fadeIn', {
	onclick: ctrl.dismiss
      }, [
	args.body
      ])
    ]);
  },
};


//-------------------------------------------------------------------------

var starsComponent = {
  controller: function(args) {
    var ctrl = this;
    ctrl.stars = [];
    for (var i = 0; i < args.n(); i++) {
      ctrl.stars.push(null);
    }
  },
  view: function(ctrl, args) {
    return m('div', [
      ctrl.stars.map(function(elm, idx) {
	return idx < args.position() ?
	  m('span.fa.fa-star.u-text--primary') :
	  m('span.fa.fa-star.u-text--faded')
      })
    ]);
  },
}



//-------------------------------------------------------------------------

//setup routes to start w/ the `#` symbol
m.route.mode = "hash";

//define a route
m.route(document.body, "/dashboard/johndoe", {
  "/dashboard/:userID": dashboard,
  "/": todo
});

var persist = function(elm, isInit, ctx) {
  ctx.retain = true;
}

// m.route('/dashboard/abc');


//-------------------------------------------------------------------------

// Sticky Element

$(window).scroll(function() {
  var stickyElement = $('.js-stickyBottom');
  if (stickyElement.position()) {
    if ($(window).scrollTop() > stickyElement.position().top + stickyElement.height()) {
      stickyElement.addClass('stickyBottom');
    } else {
      stickyElement.removeClass('stickyBottom');
    }
  }
});
