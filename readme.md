# React TodoMVC 
A search feature is added on to the TODO application. To search, simply type anything you want in the `input` search bar and click Submit. When Submit is clicked, the application filters out todos that contains the words you type and returns the filtered todos under the url path `"#/search"`. 

## To implement the search feature:

- The `searchTodo` state is set to the `input` search bar value during `onChange` in `handleSearchChange` function.
- When Submit is clicked, the `nowShowing` state is set to `app.SEARCH_TODOS` in the `Router()`.
- When `nowShowing` state is `app.SEARCH_TODOS` the `searchTodo` state is used in the `includes` function inside the switch statement. The `includes` function is called on each `todo`.


## To ensure the search results remain the same when search `input` value changes until Submit is clicked:

- When Submit is clicked, the `previousSearch` state is set to the same value as `searchTodo` state.
- When the `input` search value changes, rendering is not affected. This is because when the `input` search value changes, the `input`'s search bar `onKeyDown` event happens. During the `onKeyDown` event, `handleSearchKeyDown` function sets the `nowShowing` state to `app.PREVIOUS_SEARCH_TODOS`. When `nowShowing` state is `app.PREVIOUS_SEARCH_TODOS` the `previouSearch` state is used in the `includes` function inside the switch statement. Since the `previousSearch` state was equal to `searchTodo` state, rendering shows the same results from the first time Submit is clicked even though the current `searchTodo` state changes when `input` value changes.


## To change the URL to `"#/search"` when searching:
- When Submit is clicked, `a` tag's `href` attribute is equal to `"#/search"`.
- When URL path is `"#/search"`, `nowShowing` state is set to `app.SEARCH_TODOS` in the `Router()`.

## Code for search feature:
```diff
+ app.SEARCH_TODOS = 'searching';
+ app.PREVIOUS_SEARCH_TODOS = "previous_search";

var TodoApp = React.createClass({
    getInitialState: function () {
        return {
            nowShowing: app.ALL_TODOS,
            editing: null,
            newTodo: '',
+           searchTodo: '', 
+           previousSearch: ''
        };
    },
    componentDidMount: function () {
        var setState = this.setState;
        var router = Router({
            '/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
            '/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
            '/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS}),
+           '/search': setState.bind(this, {nowShowing: app.SEARCH_TODOS}) 
        });
        router.init('/');
    },
+   handleSearchChange: function(event) {
+       this.setState({
+           searchTodo: event.target.value
+       })
+   },
+   handleSearchKeyDown: function(event) {	
+       if (window.location.href == 'http://localhost:8000/#/search') {
+           this.setState({
+               nowShowing: app.PREVIOUS_SEARCH_TODOS
+           })
+       }
+   },
+   handleSubmit: function () {
+       this.setState({
+           previousSearch: this.state.searchTodo
+       })
+   },
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
+           case app.PREVIOUS_SEARCH_TODOS:
+               return todo.title.includes(this.state.previousSearch);
+           case app.SEARCH_TODOS:
+               return todo.title.includes(this.state.searchTodo);
            default:
                return true;
            }
        }, this);

        return (
            <div>
+                <div style={{display: 'flex'}}> 
+                    <input className="searchbar" placeholder="Search" type="text" 
+                    style={{width: '100%',
+                            'borderRadius': '0px',
+                           'border': 'none',
+                           'boxShadow': 'inset 0 -2px 1px rgb(0 0 0 / 3%)',
+                           'fontSize': '24px',
+                           'position': 'relative',
+                           'margin-left': '56.5px'}}
+                    onChange={this.handleSearchChange} 
+                    value={this.state.searchTodo} 
+                    onKeyDown={this.handleSearchKeyDown}
+                    />
+                       <li style={{'list-style-type': 'none'}}>
+                            {this.state.searchTodo.length > 0 ?
+                            <a
+                                href= '#/search'
+                                onClick={this.handleSubmit} 
+                                style={{
+                                    backgroundColor: '#b83f45',
+                                    color: '#fff', 
+                                    height: '50px', 
+                                    width: '75px',
+                                    fontSize: '20px',
+                                    display: 'flex',
+                                    'justify-content': 'center',
+                                    'align-items': 'center',
+                                    'text-decoration': 'none'}}
+                            > 
+                               Submit 
+                            </a> :
+                           <div style={{
+                                backgroundColor: '#b83f45',
+                               color: '#fff', 
+                               height: '50px', 
+                               width: '75px',
+                               fontSize: '20px',
+                               display: 'flex',
+                               'justify-content': 'center',
+                               'align-items': 'center'}}
+                           > 
+                               Submit
+                           </div>
+                           }
+                       </li> 
+				</div>
            </div>
        )
    }
})
```
# Installation
Run `npm i`.

# Run App Locally
To run the app locally, run `python -m SimpleHTTPServer`.

# Improvements
- When page with URL path `"#/search"` is refreshed, the URL should be redirected to homepage `"#/"`.
- When search is submitted, append the search value to the URL path. 
- When page with URL path `"#/search/search_value"` is refreshed, the search results are re-rendered.

