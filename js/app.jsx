/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
// import {Link, useParams, useHistory} from 'react-router-dom';
var app = app || {};
(function () {
	'use strict';
	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';

	// KRISTY'S START CODE 
	app.SEARCH_TODOS = 'searching';
	app.PREVIOUS_SEARCH_TODOS = "previous_search"
	// KRISTY'S END CODE

	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;
	var ENTER_KEY = 13;
	var BACK_KEY = 8; // KRISTY'S CODE

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				editing: null,
				newTodo: '',

				// KRISTY'S START CODE BLOCK
				searchTodo: '',
				previousSearch: ''
				// KRISTY'S END CODE BLOCK
			};
		},
		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS}),

				// KRISTY'S START CODE 
				'/search': setState.bind(this, {nowShowing: app.SEARCH_TODOS}) 
				// KRISTY'S END CODE
			});
			router.init('/');
		},
		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		// KRISTY'S START CODE BLOCK
		// Input search bar onchange function
		handleSearchChange: function(event) {
			this.setState({
				searchTodo: event.target.value
			})
		},
		handleSearchKeyDown: function(event) {
			// Continue showing the previous search results when backspacking on search bar when we are at the URL '/#search'
			if (window.location.href == 'http://localhost:8000/#/search') {
				this.setState({
					nowShowing: app.PREVIOUS_SEARCH_TODOS
				})
			}
		},
		handleSubmit: function () {
			// Only show search results if user typed something in the search bar
			// if(this.state.searchTodo.length > 0) {
			// 	this.setState({nowShowing: app.SEARCH_TODOS})
			// } 
			this.setState({
				previousSearch: this.state.searchTodo
			})
		},
		// KRISTY'S END CODE BLOCK

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}
			event.preventDefault();
			var val = this.state.newTodo.trim();
			if (val) {
				this.props.model.addTodo(val);
				this.setState({newTodo: ''});
			}
		},
		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},
		toggle: function (todoToToggle) {
			this.props.model.toggle(todoToToggle);
		},
		destroy: function (todo) {
			this.props.model.destroy(todo);
		},
		edit: function (todo) {
			this.setState({editing: todo.id});
		},
		save: function (todoToSave, text) {
			this.props.model.save(todoToSave, text);
			this.setState({editing: null});
		},
		cancel: function () {
			this.setState({editing: null});
		},
		clearCompleted: function () {
			this.props.model.clearCompleted();
		},
		render: function () {
			var footer;
			var main;
			var todos = this.props.model.todos;
			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				
				// KRISTY'S START CODE BLOCK
				case app.PREVIOUS_SEARCH_TODOS:
					return todo.title.includes(this.state.previousSearch);
				case app.SEARCH_TODOS:
					return todo.title.includes(this.state.searchTodo);
				// KRISTY'S END CODE BLOCK

				default:
					return true;
				}
			}, this);
			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);
			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);
			var completedCount = todos.length - activeTodoCount;
			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}
			if (todos.length) {
				main = (
					<section className="main">
						<input
							id="toggle-all"
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<label
							htmlFor="toggle-all"
						/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}
			return (
				<div>

					{/* KRISTY'S START CODE BLOCK*/}
					<div style={{display: 'flex'}}> 
						<input className="searchbar" placeholder="Search" type="text" 
						style={{width: '100%',
								'borderRadius': '0px',
								'border': 'none',
								'boxShadow': 'inset 0 -2px 1px rgb(0 0 0 / 3%)',
								'fontSize': '24px',
								'position': 'relative',
								'margin-left': '56.5px'}}
						onChange={this.handleSearchChange} 
						value={this.state.searchTodo} 
						onKeyDown={this.handleSearchKeyDown}
						/>
							{/* Allow for active link if there is something on a search bar, else unclickable div */}
							<li style={{'list-style-type': 'none'}}>
								{this.state.searchTodo.length > 0 ?
								<a
									href= "#/search"
									onClick={this.handleSubmit} 
									style={{
										backgroundColor: '#b83f45',
										color: '#fff', 
										height: '50px', 
										width: '75px',
										fontSize: '20px',
										display: 'flex',
										'justify-content': 'center',
										'align-items': 'center',
										'text-decoration': 'none'}}> 
								Submit 
								</a> :
								<div style={{
									backgroundColor: '#b83f45',
									color: '#fff', 
									height: '50px', 
									width: '75px',
									fontSize: '20px',
									display: 'flex',
									'justify-content': 'center',
									'align-items': 'center'}}> Submit</div>
								}
							</li> 
					</div>
					{/* KRISTY'S END CODE BLOCK*/}

					<header className="header">
						<h1>todos</h1>
						<input
							className="new-todo"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});
	var model = new app.TodoModel('react-todos');
	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}
	model.subscribe(render);
	render();
})();